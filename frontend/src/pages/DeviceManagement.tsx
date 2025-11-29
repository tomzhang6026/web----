import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, Device } from "../lib/api";
import Button from "../components/ui/Button";

export default function DeviceManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // tempToken 来自 Login 页面的跳转 state
  const tempToken = location.state?.tempToken;
  const email = location.state?.email;

  useEffect(() => {
    if (!tempToken) {
      navigate("/login");
      return;
    }
    loadDevices();
  }, [tempToken, navigate]);

  const loadDevices = async () => {
    try {
      const list = await api.getDevices(tempToken);
      setDevices(list);
    } catch (e) {
      setError("无法加载设备列表");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要移除这台设备吗？这将导致该设备下线。")) return;
    try {
      await api.deleteDevice(id, tempToken);
      await loadDevices();
    } catch (e) {
      alert("删除失败，请重试");
    }
  };
  
  const handleBackToLogin = () => {
      // 带着 email 跳回登录页，方便用户重试
      navigate("/login", { state: { email } });
  };

  // 计算当前是否已满足登录条件（设备数 < 2）
  // 注意：getDevices 返回的是已经在库里的 session。
  // 如果我们现在删到了 < 2，那么本机再登录就能成功了。
  const canLoginNow = devices.length < 2; // 假设限制是 2

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-red-50">
          <div>
             <h2 className="text-lg font-medium text-red-800">设备数量超限</h2>
             <p className="text-sm text-red-600 mt-1">您的账户同时登录设备已达上限 (2台)。请先移除一台旧设备。</p>
          </div>
          <div className="text-3xl">📱</div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-10">加载中...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="space-y-4">
               {devices.map(dev => (
                   <div key={dev.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                       <div>
                           <div className="font-medium text-gray-900">
                               {dev.user_agent.includes("Mac") ? "Mac" : dev.user_agent.includes("Win") ? "Windows" : "Unknown Device"}
                               {dev.is_current && <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">本机</span>}
                           </div>
                           <div className="text-xs text-gray-500 mt-1">
                               IP: {dev.ip_address}
                           </div>
                           <div className="text-xs text-gray-400 mt-0.5">
                               最后活跃: {new Date(dev.last_active_at + "Z").toLocaleString()}
                           </div>
                       </div>
                       <button
                         onClick={() => handleDelete(dev.id)}
                         className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                       >
                         下线
                       </button>
                   </div>
               ))}
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            {canLoginNow ? (
                <div className="flex items-center gap-4">
                    <span className="text-green-600 text-sm">已腾出空位！</span>
                    <Button label="返回登录激活本机" onClick={handleBackToLogin} />
                </div>
            ) : (
                <div className="text-sm text-gray-500">请至少删除一台设备以继续</div>
            )}
        </div>
      </div>
    </div>
  );
}

