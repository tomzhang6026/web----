import { useEffect, useState } from "react";
import { api, PlanInfo } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { getInitialLocale, Locale } from "../lib/i18n";
import { getRegion } from "../lib/region";

export default function Profile() {
  const [info, setInfo] = useState<PlanInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const { logoutCtx } = useAuth();
  const navigate = useNavigate();
  const [locale] = useState<Locale>(() => getInitialLocale(getRegion));

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    try {
      const res = await api.getMyPlan();
      setInfo(res);
    } catch (e) {
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
      alert(locale === 'zh-CN' ? "兑换成功！权益已生效。" : "Redemption successful! Plan activated.");
      setCode("");
      loadInfo();
    } catch (e: any) {
      alert(e.message || (locale === 'zh-CN' ? "兑换失败，请检查激活码" : "Redemption failed, invalid code"));
    } finally {
      setRedeemLoading(false);
    }
  };
  
  const handleLogout = () => {
      if(confirm(locale === 'zh-CN' ? "确定要退出登录吗？" : "Are you sure you want to logout?")) {
          logoutCtx();
      }
  };

  if (loading) return <div className="p-10 text-center">{locale === 'zh-CN' ? "加载中..." : "Loading..."}</div>;
  if (!info) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 个人信息卡片 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                  {locale === 'zh-CN' ? '我的账户' : 'My Account'}
              </h2>
              <div className="flex items-center gap-4">
                  <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1">
                      <span>←</span>
                      {locale === 'zh-CN' ? '去压缩文件' : 'Start Compressing'}
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 px-2">
                      {locale === 'zh-CN' ? '退出登录' : 'Logout'}
                  </button>
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
              <div>
                  <span className="text-gray-500">{locale === 'zh-CN' ? '邮箱：' : 'Email: '}</span>
                  <span className="font-medium text-gray-900 ml-2">{info.email}</span>
              </div>
              <div>
                  <span className="text-gray-500">{locale === 'zh-CN' ? '当前套餐：' : 'Current Plan: '}</span>
                  {info.is_valid ? (
                      <span className="font-bold text-green-600 ml-2">{info.plan_name}</span>
                  ) : (
                      <span className="text-gray-400 ml-2">{locale === 'zh-CN' ? '免费试用版' : 'Free Trial'}</span>
                  )}
              </div>
              {info.is_valid && (
                  <div>
                      <span className="text-gray-500">{locale === 'zh-CN' ? '有效期至：' : 'Expires At: '}</span>
                      <span className="font-medium text-gray-900 ml-2">
                          {info.expires_at ? new Date(info.expires_at + "Z").toLocaleDateString() : "Lifetime"}
                      </span>
                  </div>
              )}
              <div>
                  <span className="text-gray-500">{locale === 'zh-CN' ? '设备限制：' : 'Device Limit: '}</span>
                  <span className="font-medium text-gray-900 ml-2">{info.device_limit} {locale === 'zh-CN' ? '台' : 'Devices'}</span>
              </div>
          </div>
        </div>

        {/* 激活码兑换 */}
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                {locale === 'zh-CN' ? '使用激活码' : 'Redeem Code'}
            </h3>
            <div className="flex gap-4">
                <input 
                    type="text" 
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={locale === 'zh-CN' ? "输入 VF-XXXX-XXXX" : "Enter VF-XXXX-XXXX"}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                />
                <Button 
                    label={redeemLoading ? (locale === 'zh-CN' ? "兑换中..." : "Redeeming...") : (locale === 'zh-CN' ? "立即兑换" : "Redeem Now")} 
                    onClick={handleRedeem} 
                    disabled={redeemLoading || !code}
                />
            </div>
            <p className="mt-2 text-xs text-gray-500">
                {locale === 'zh-CN' 
                    ? '* 购买激活码后，请在此处输入以激活您的订阅权益。' 
                    : '* Enter your purchased activation code here to unlock premium features.'}
            </p>
        </div>

        {/* 购买套餐 */}
        <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
                {locale === 'zh-CN' ? '购买订阅 (中国大陆推荐)' : 'Purchase Subscription (CN)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 周卡 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all text-center">
                    <div className="text-sm font-medium text-gray-500">{locale === 'zh-CN' ? '7天体验卡' : '7-Day Pass'}</div>
                    <div className="text-2xl font-bold text-gray-900 my-2">¥ 9.9</div>
                    <p className="text-xs text-gray-500 mb-4">{locale === 'zh-CN' ? '适合短期处理少量签证文件' : 'Good for short term usage'}</p>
                    <a 
                        href="https://mbd.pub/o/bread/mbd-weekly" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700"
                    >
                        {locale === 'zh-CN' ? '购买激活码' : 'Buy Code'}
                    </a>
                </div>

                {/* 月卡 */}
                <div className="border-2 border-blue-500 relative rounded-lg p-4 shadow-md text-center transform scale-105">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                        {locale === 'zh-CN' ? '最热门' : 'Popular'}
                    </div>
                    <div className="text-sm font-medium text-gray-500 mt-2">{locale === 'zh-CN' ? '30天月卡' : '30-Day Pass'}</div>
                    <div className="text-2xl font-bold text-gray-900 my-2">¥ 19.9</div>
                    <p className="text-xs text-gray-500 mb-4">{locale === 'zh-CN' ? '适合整个申请季，不限次数' : 'Unlimited access for a month'}</p>
                    <a 
                        href="https://mbd.pub/o/bread/mbd-monthly" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700"
                    >
                        {locale === 'zh-CN' ? '购买激活码' : 'Buy Code'}
                    </a>
                </div>

                {/* 年卡 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all text-center">
                    <div className="text-sm font-medium text-gray-500">{locale === 'zh-CN' ? '年度会员' : 'Yearly Pass'}</div>
                    <div className="text-2xl font-bold text-gray-900 my-2">¥ 99.0</div>
                    <p className="text-xs text-gray-500 mb-4">{locale === 'zh-CN' ? '家庭共享，长期备用' : 'Best value for long term'}</p>
                    <a 
                        href="https://mbd.pub/o/bread/mbd-yearly" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-sm font-medium py-2 rounded hover:bg-blue-700"
                    >
                        {locale === 'zh-CN' ? '购买激活码' : 'Buy Code'}
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
