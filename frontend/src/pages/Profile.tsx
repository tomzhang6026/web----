import { useEffect, useState } from "react";
import { api, PlanInfo } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function Profile() {
  const [info, setInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const { logoutCtx } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    try {
      const res = await api.getMyPlan();
      setInfo(res);
    } catch (e) {
      // Token 失效或未登录
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setRedeemLoading(true);
    try {
      await api.redeemCode(code.trim());
      alert("兑换成功！权益已生效。");
      setCode("");
      loadInfo();
    } catch (e: any) {
      alert(e.message || "兑换失败，请检查激活码");
    } finally {
      setRedeemLoading(false);
    }
  };
  
  const handleLogout = () => {
      if(confirm("确定要退出登录吗？")) {
          logoutCtx();
      }
  };

  if (loading) return <div className="p-10 text-center">加载中...</div>;
  if (!info) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 个人信息卡片 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">我的账户</h2>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">退出登录</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                  <span className="text-gray-500">邮箱：</span>
                  <span className="font-medium text-gray-900 ml-2">{info.email}</span>
              </div>
              <div>
                  <span className="text-gray-500">当前套餐：</span>
                  {info.is_valid ? (
                      <span className="font-bold text-green-600 ml-2">{info.plan_name}</span>
                  ) : (
                      <span className="text-gray-400 ml-2">免费试用版</span>
                  )}
              </div>
              {info.is_valid && (
                  <div>
                      <span className="text-gray-500">有效期至：</span>
                      <span className="font-medium text-gray-900 ml-2">
                          {info.expires_at ? new Date(info.expires_at + "Z").toLocaleDateString() : "永久"}
                      </span>
                  </div>
              )}
              <div>
                  <span className="text-gray-500">设备限制：</span>
                  <span className="font-medium text-gray-900 ml-2">{info.device_limit} 台</span>
              </div>
          </div>
        </div>

        {/* 激活码兑换 */}
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">使用激活码</h3>
            <div className="flex gap-4">
                <input 
                    type="text" 
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="输入 VF-XXXX-XXXX"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                />
                <Button 
                    label={redeemLoading ? "兑换中..." : "立即兑换"} 
                    onClick={handleRedeem} 
                    disabled={redeemLoading || !code}
                />
            </div>
            <p className="mt-2 text-xs text-gray-500">
                * 购买激活码后，请在此处输入以激活您的订阅权益。
            </p>
        </div>

        {/* 购买套餐 */}
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">购买订阅 (中国大陆推荐)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 周卡 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all text-center">
                    <div className="text-sm font-medium text-gray-500">7天体验卡</div>
                    <div className="text-2xl font-bold text-gray-900 my-2">¥ 9.9</div>
                    <p className="text-xs text-gray-500 mb-4">适合短期处理少量签证文件</p>
                    <a 
                        href="https://mbd.pub/o/bread/mbd-weekly" // 替换为您在面包多的真实链接
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700"
                    >
                        购买激活码
                    </a>
                </div>

                {/* 月卡 */}
                <div className="border-2 border-blue-500 relative rounded-lg p-4 shadow-md text-center transform scale-105">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                        最热门
                    </div>
                    <div className="text-sm font-medium text-gray-500 mt-2">30天月卡</div>
                    <div className="text-2xl font-bold text-gray-900 my-2">¥ 19.9</div>
                    <p className="text-xs text-gray-500 mb-4">适合整个申请季，不限次数</p>
                    <a 
                        href="https://mbd.pub/o/bread/mbd-monthly" // 替换
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700"
                    >
                        购买激活码
                    </a>
                </div>

                {/* 年卡 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all text-center">
                    <div className="text-sm font-medium text-gray-500">年度会员</div>
                    <div className="text-2xl font-bold text-gray-900 my-2">¥ 99.0</div>
                    <p className="text-xs text-gray-500 mb-4">家庭共享，长期备用</p>
                    <a 
                        href="https://mbd.pub/o/bread/mbd-yearly" // 替换
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700"
                    >
                        购买激活码
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

