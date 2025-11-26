from __future__ import annotations

import io
import os
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

import fitz  # PyMuPDF
from fastapi import UploadFile
from PIL import Image, ImageFilter, ImageOps, ImageStat

from ..core.config import settings

A4_WIDTH_PT = 595
A4_HEIGHT_PT = 842


@dataclass
class CompressionOutput:
    file_token: str
    stored_pdf: str
    preview_urls: List[str]
    page_count: int
    expires_at: datetime


@dataclass
class PageItem:
    # 固定页面画布（保持所有页尺寸一致）上的成品图，用于直接编码
    source_image: Image.Image
    # 未铺底的内容图（已按配置处理并旋至竖向），用于回压时在固定画布内缩放贴合
    content_image: Image.Image
    canvas_w: int
    canvas_h: int
    content_type: str
    importance: float
    jpeg_bytes: bytes
    size_bytes: int


COMPRESSION_PROFILES: Dict[str, Dict[str, int | bool]] = {
    "text_dense": {
        "max_dimension": 1600,
        "jpeg_quality": 75,
        "color_reduction": True,
        "sharpen": True,
    },
    "mixed_content": {
        "max_dimension": 1400,
        "jpeg_quality": 70,
        "color_reduction": False,
        "sharpen": False,
    },
    "image_heavy": {
        "max_dimension": 1200,
        "jpeg_quality": 60,
        "color_reduction": False,
        "sharpen": False,
    },
    "complex_background": {
        "max_dimension": 1400,
        "jpeg_quality": 65,
        "color_reduction": True,
        "sharpen": True,
    },
}

# 重要度：文字密集>混合>复杂背景>图片密集
IMPORTANCE: Dict[str, float] = {
    "text_dense": 1.0,
    "mixed_content": 0.8,
    "complex_background": 0.6,
    "image_heavy": 0.5,
}

MIN_LONG_EDGE = 1000  # 像素兜底，确保可读
DEFAULT_PREVIEW_CAP = 10


class CompressionService:
    """
    智能分层压缩 + 总量控制：
    1) 内容识别 → 应用压缩配置（尺寸、质量、颜色减缩与锐化）
    2) 若总量超标 → 按页重要度自适应回压，优先保护文字页；单页预算不低于 ~60KB
    3) 预览：输出最终图像的前10页缩略图（与 PDF 中一致）
    """

    def __init__(self) -> None:
        os.makedirs(settings.storage_dir, exist_ok=True)

    async def process(
        self, uploads: List[UploadFile], target_size_mb: int
    ) -> CompressionOutput:
        token = uuid.uuid4().hex
        previews_dir = os.path.join(settings.storage_dir, "previews", token)
        files_dir = os.path.join(settings.storage_dir, "files", token)
        os.makedirs(previews_dir, exist_ok=True)
        os.makedirs(files_dir, exist_ok=True)

        # 1) 载入与栅格化（按内容与投影自动检测方向，统一矫正为竖向）
        pil_pages: List[Image.Image] = []
        total_bytes: int = 0
        for up in uploads:
            # 基础类型校验（MIME 优先，退化到扩展名）
            mime = (up.content_type or "").lower()
            name = up.filename or "file"
            ext = (name.rsplit(".", 1)[-1] if "." in name else "").lower()
            allowed = set(x.lower() for x in settings.allowed_mime_types)
            if mime not in allowed:
                if ext not in {"pdf", "jpg", "jpeg", "png"}:
                    raise ValueError(f"File '{name}' type not supported. Allowed: PDF/JPG/PNG.")
            content = await up.read()
            size_bytes = len(content)
            # 单文件大小限制
            if size_bytes > settings.max_input_file_mb * 1024 * 1024:
                raise ValueError(
                    f"File '{name}' is too large ({size_bytes // (1024*1024)}MB). "
                    f"Max per file: {settings.max_input_file_mb}MB."
                )
            total_bytes += size_bytes
            # 总大小限制
            if total_bytes > settings.max_total_input_mb * 1024 * 1024:
                raise ValueError(
                    f"Total upload size exceeds limit ({total_bytes // (1024*1024)}MB). "
                    f"Max total: {settings.max_total_input_mb}MB."
                )
            # 读取与分页
            if ext == "pdf" or up.content_type == "application/pdf":
                src = fitz.open(stream=content, filetype="pdf")
                for page_index in range(src.page_count):
                    page = src.load_page(page_index)
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                    img_bytes = pix.tobytes("png")
                    pil = Image.open(io.BytesIO(img_bytes)).convert("RGB")
                    pil_pages.append(self._ensure_portrait(pil))
                src.close()
            else:
                pil = Image.open(io.BytesIO(content))
                try:
                    pil = ImageOps.exif_transpose(pil)
                except Exception:
                    pass
                pil_pages.append(self._ensure_portrait(pil.convert("RGB")))

        page_count = len(pil_pages)
        target_bytes = target_size_mb * 1024 * 1024
        # 页数限制（基于目标总大小）
        if settings.enforce_page_limits:
            max_pages = self._max_pages_for_target(target_size_mb)
            if max_pages is not None and page_count > max_pages:
                raise ValueError(
                    f"Total pages {page_count} exceed limit {max_pages} for target {target_size_mb}MB."
                )

        # 2) 基础压缩（按内容类型 profile）
        processed_contents: List[Tuple[Image.Image, str]] = []
        for pil in pil_pages:
            ctype = self._detect_content_type(pil)
            profile = COMPRESSION_PROFILES[ctype]
            processed = self._preprocess_by_profile(
                pil,
                max_dimension=int(profile["max_dimension"]),  # type: ignore[arg-type]
                color_reduction=bool(profile["color_reduction"]),  # type: ignore[arg-type]
                sharpen=bool(profile["sharpen"]),  # type: ignore[arg-type]
            )
            processed_contents.append((processed, ctype))

        # 3) 统一 A4 画布尺寸（保持一致的页面尺寸）
        max_w = max((img.size[0] for img, _ in processed_contents), default=MIN_LONG_EDGE)
        max_h = max((img.size[1] for img, _ in processed_contents), default=MIN_LONG_EDGE)
        pages: List[PageItem] = []
        for processed, ctype in processed_contents:
            canvas = Image.new("RGB", (max_w, max_h), color=(255, 255, 255))
            pw, ph = processed.size
            offset = ((max_w - pw) // 2, (max_h - ph) // 2)
            canvas.paste(processed, offset)
            jpeg = self._to_jpeg(
                canvas,
                quality=int(COMPRESSION_PROFILES[ctype]["jpeg_quality"])  # type: ignore[index]
            )
            pages.append(
                PageItem(
                    source_image=canvas,
                    content_image=processed,
                    canvas_w=max_w,
                    canvas_h=max_h,
                    content_type=ctype,
                    importance=IMPORTANCE.get(ctype, 0.7),
                    jpeg_bytes=jpeg,
                    size_bytes=len(jpeg),
                )
            )

        # 4) 总量控制（若超标进行自适应回压）
        total = sum(p.size_bytes for p in pages)
        if total > target_bytes:
            reduction_ratio = target_bytes / total
            base_floor = 60 * 1024
            adjusted_pages: List[PageItem] = []
            for p in pages:
                individual_ratio = self._individual_ratio(reduction_ratio, p.importance)
                budget = max(base_floor, int(p.size_bytes * individual_ratio))
                adjusted_pages.append(self._recompress_to_budget(p, budget))
            pages = adjusted_pages

            total = sum(p.size_bytes for p in pages)
            if total > target_bytes:
                second_ratio = target_bytes / total
                adjusted_pages2: List[PageItem] = []
                for p in pages:
                    budget = max(base_floor, int(p.size_bytes * second_ratio))
                    adjusted_pages2.append(self._recompress_to_budget(p, budget))
                pages = adjusted_pages2

        # 5) 生成 PDF（固定 A4 竖向页面，按需旋转横图）
        stored_pdf = os.path.join(files_dir, "result.pdf")
        self._build_pdf_from_jpegs([p.jpeg_bytes for p in pages], stored_pdf)

        # 6) 生成预览（直接使用最终 JPEG）
        preview_urls: List[str] = []
        for idx, p in enumerate(pages[: DEFAULT_PREVIEW_CAP], start=1):
            out_path = os.path.join(previews_dir, f"page-{idx}.jpg")
            with open(out_path, "wb") as f:
                f.write(p.jpeg_bytes)
            preview_urls.append(f"/static/previews/{token}/page-{idx}.jpg")

        return CompressionOutput(
            file_token=token,
            stored_pdf=stored_pdf,
            preview_urls=preview_urls,
            page_count=page_count,
            expires_at=datetime.utcnow() + timedelta(hours=settings.file_ttl_hours),
        )

    # ============== 内部工具方法 ==============
    def _auto_orient(self, image: Image.Image) -> Image.Image:
        """
        通过比较 0/90/180/270 的行/列边缘方差比值，选择最可能的“文字水平”方向。
        """
        candidates = [0, 90, 180, 270]
        best_angle = 0
        best_score = -1.0
        for ang in candidates:
            im = image if ang == 0 else image.rotate(ang, expand=True)
            score = self._orientation_score(im)
            if score > best_score:
                best_score = score
                break
        return image if best_angle == 0 else image.rotate(best_angle, expand=True)

    def _orientation_score(self, image: Image.Image) -> float:
        """
        估算“文字水平”的可能性：行方向方差 / 列方向方差，越大越水平。
        """
        try:
            gray = image.convert("L")
            small = gray.copy()
            small.thumbnail((180, 180))
            edges = small.filter(ImageFilter.FIND_EDGES)
            w, h = edges.size
            px = list(edges.getdata())
            row_sums = [0] * h
            col_sums = [0] * w
            for y in range(h):
                offset = y * w
                s = 0
                for x in range(w):
                    v = px[offset + x]
                    s += v
                    col_sums[x] += v
                row_sums[y] = s
            def variance(vals: list[int]) -> float:
                n = len(vals)
                if n == 0:
                    return 0.0
                s = float(sum(vals))
                mean = s / n
                ss = sum((v - mean) * (v - mean) for v in vals)
                return ss / n
            row_var = variance(row_sums)
            col_var = variance(col_sums)
            return (row_var + 1e-6) / (col_var + 1e-6)
        except Exception:
            return 0.0

    # 新增：多维度方向检测与校正（基础版）
    def _detect_by_aspect_ratio(self, image: Image.Image) -> str:
        w, h = image.size
        if w <= 0 or h <= 0:
            return "uncertain"
        ratio = w / float(h)
        if ratio > 1.1:
            return "landscape"
        if ratio < 0.9:
            return "portrait"
        return "uncertain"

    def _detect_by_projection(self, image: Image.Image) -> str:
        gray = image.convert("L")
        small = gray.copy()
        small.thumbnail((220, 220))
        edges = small.filter(ImageFilter.FIND_EDGES)
        w, h = edges.size
        px = list(edges.getdata())
        row_sums = [0] * h
        col_sums = [0] * w
        for y in range(h):
            off = y * w
            s = 0
            for x in range(w):
                v = px[off + x]
                s += v
                col_sums[x] += v
            row_sums[y] = s
        def var(vals: list[int]) -> float:
            n = len(vals)
            if n == 0:
                return 0.0
            mean = sum(vals) / float(n)
            return sum((v - mean) * (v - mean) for v in vals) / float(n)
        rv = var(row_sums)
        cv = var(col_sums)
        if rv > cv * 1.25:
            return "portrait"
        if cv > rv * 1.25:
            return "landscape"
        return "uncertain"

    def _detect_page_orientation(self, image: Image.Image) -> str:
        ar = self._detect_by_aspect_ratio(image)
        if ar != "uncertain":
            return ar
        proj = self._detect_by_projection(image)
        if proj != "uncertain":
            return proj
        score = self._orientation_score(image)
        if score >= 1.1:
            return "portrait"
        if score <= 0.9:
            return "landscape"
        return "portrait"

    def _ensure_portrait(self, image: Image.Image) -> Image.Image:
        ori = self._detect_page_orientation(image)
        w, h = image.size
        if ori == "landscape" and w > h:
            return image.rotate(90, expand=True)
        if ori == "portrait" and w > h:
            return image.rotate(90, expand=True)
        return image

    def _detect_content_type(self, image: Image.Image) -> str:
        # 边缘密度
        gray = image.convert("L")
        edges = gray.filter(ImageFilter.FIND_EDGES)
        hist = edges.histogram()
        bright_pixels = sum(hist[200:])
        total_pixels = sum(hist)
        edge_density = (bright_pixels / max(1, total_pixels)) if total_pixels else 0.0

        # 颜色复杂度
        small = image.copy()
        small.thumbnail((256, 256))
        stat = ImageStat.Stat(small)
        var_sum = sum(stat.var)
        colors = small.convert("P", palette=Image.ADAPTIVE, colors=256).getcolors(256) or []
        color_count = sum(c for c, _ in colors)
        color_complexity = var_sum + color_count / 256.0 * 100.0

        if edge_density > 0.08 and color_complexity < 120:
            return "text_dense"
        if color_complexity > 220:
            return "image_heavy"
        if edge_density > 0.04:
            return "mixed_content"
        return "complex_background"

    def _preprocess_by_profile(
        self,
        image: Image.Image,
        max_dimension: int,
        color_reduction: bool,
        sharpen: bool,
    ) -> Image.Image:
        w, h = image.size
        long_edge = max(w, h)
        target_long = max(MIN_LONG_EDGE, max_dimension)
        if long_edge != 0 and long_edge > target_long:
            scale = target_long / long_edge
            image = image.resize((int(w * scale), int(h * scale)))
        if color_reduction:
            image = image.convert("P", palette=Image.ADAPTIVE, colors=256).convert("RGB")
        if sharpen:
            image = image.filter(ImageFilter.UnsharpMask(radius=1.2, percent=80, threshold=2))
        return image

    def _to_jpeg(self, image: Image.Image, quality: int) -> bytes:
        buf = io.BytesIO()
        image.save(buf, format="JPEG", quality=quality, optimize=True)
        return buf.getvalue()

    def _recompress_to_budget(self, page: PageItem, budget_bytes: int) -> PageItem:
        qualities = [75, 70, 65, 60, 55, 50]
        dim_scales = [1.0, 0.95, 0.9, 0.85, 0.8]

        base_content = page.content_image
        best_bytes = page.jpeg_bytes
        best_size = len(best_bytes)
        best_src = page.source_image

        for ds in dim_scales:
            cw, ch = page.canvas_w, page.canvas_h
            sw, sh = base_content.size
            scaled_content = base_content if ds == 1.0 else base_content.resize((int(sw * ds), int(sh * ds)))
            scw, sch = scaled_content.size
            if max(scw, sch) < int(0.75 * MIN_LONG_EDGE):
                scaled_content = base_content if ds == 1.0 else base_content.resize((int(sw * 0.8), int(sh * 0.8)))
            canvas = Image.new("RGB", (cw, ch), color=(255, 255, 255))
            off = ((cw - scaled_content.size[0]) // 2, (ch - scaled_content.size[1]) // 2)
            canvas.paste(scaled_content, off)
            for q in qualities:
                trial = self._to_jpeg(canvas, q)
                sz = len(trial)
                if sz < best_size:
                    best_bytes = trial
                    best_size = sz
                    best_src = canvas
                if sz <= budget_bytes:
                    return PageItem(
                        source_image=canvas,
                        content_image=scaled_content,
                        canvas_w=page.canvas_w,
                        canvas_h=page.canvas_h,
                        content_type=page.content_type,
                        importance=page.importance,
                        jpeg_bytes=trial,
                        size_bytes=sz,
                    )
        return PageItem(
            source_image=best_src,
            content_image=base_content,
            canvas_w=page.canvas_w,
            canvas_h=page.canvas_h,
            content_type=page.content_type,
            importance=page.importance,
            jpeg_bytes=best_bytes,
            size_bytes=len(best_bytes),
        )

    def _individual_ratio(self, reduction_ratio: float, importance: float) -> float:
        return 1.0 - (1.0 - reduction_ratio) * (1.0 - importance * 0.5)

    def _max_pages_for_target(self, target_size_mb: int) -> int | None:
        """
        返回目标大小对应允许的最大页数；若不在预设范围则不限制（返回 None）
        规则与前端 SIZE_OPTIONS 对应：
         - 1MB: 15
         - 2MB: 32
         - 4MB: 64
         - 5MB: 80
        """
        mapping = {
            1: 15,
            2: 32,
            4: 64,
            5: 80,
        }
        # 允许 target_size_mb 为例如 "2" 或 "2.0" 的场景已在路由层做类型保证；这里保守取整匹配
        return mapping.get(int(target_size_mb), None)

    def _build_pdf_from_jpegs(self, jpeg_list: List[bytes], out_path: str) -> None:
        doc = fitz.open()
        try:
            for jpg in jpeg_list:
                # 页面设为竖向（A4 portrait）
                PAGE_W = A4_WIDTH_PT
                PAGE_H = A4_HEIGHT_PT
                page = doc.new_page(width=PAGE_W, height=PAGE_H)
                # 明确图像宽高，若为横图则旋转为竖向
                try:
                    im = Image.open(io.BytesIO(jpg))
                    iw, ih = im.size
                    rotate_needed = iw > ih
                    if rotate_needed:
                        im = im.rotate(90, expand=True)
                        iw, ih = im.size
                        buf = io.BytesIO()
                        im.save(buf, format="JPEG", quality=95)
                        jpg_bytes = buf.getvalue()
                    else:
                        jpg_bytes = jpg
                except Exception:
                    iw, ih = (int(PAGE_W), int(PAGE_H))
                    jpg_bytes = jpg
                page_ratio = PAGE_W / PAGE_H
                img_ratio = (iw / ih) if ih else 1.0
                if img_ratio >= page_ratio:
                    w = PAGE_W
                    h = w / max(0.001, img_ratio)
                else:
                    h = PAGE_H
                    w = h * img_ratio
                x0 = (PAGE_W - w) / 2
                y0 = (PAGE_H - h) / 2
                rect = fitz.Rect(x0, y0, x0 + w, y0 + h)
                page.insert_image(rect, stream=jpg_bytes)
            temp_path = out_path + ".tmp"
            doc.save(temp_path, deflate=True, garbage=4)
            doc.close()
            if os.path.exists(out_path):
                os.remove(out_path)
            os.replace(temp_path, out_path)
        finally:
            if not doc.is_closed:
                doc.close()


