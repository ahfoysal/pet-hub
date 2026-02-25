import { User, Lock, Bell, CreditCard, FileText, LogOut } from "lucide-react";
import { useAppDispatch } from "@/redux/store/hooks";
import { clearCredentials } from "@/redux/features/slice/authSlice";
import { signOut } from "next-auth/react";

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
  const dispatch = useAppDispatch();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "banking", label: "Banking", icon: CreditCard },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const handleLogout = async () => {
    dispatch(clearCredentials());
    await signOut({ redirect: false });
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || "http://auth.lvh.me:3000";
    window.location.href = `${authUrl}/logout`;
  };

  return (
    <div className="lg:col-span-3 bg-white border border-[#e5e7eb] rounded-[20px] p-6 shadow-sm space-y-2">
      <div className="space-y-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-4 px-4 py-[14px] rounded-[12px] font-normal text-[16px] transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-[#fff1f1] text-[#ff7176]"
                : "text-[#4a5565] hover:bg-gray-50"
            }`}
          >
            <tab.icon size={20} className={activeTab === tab.id ? "text-[#ff7176]" : "text-[#4a5565]"} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="my-6 border-t border-[#f2f4f8]"></div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-4 px-4 py-[14px] rounded-[12px] font-normal text-[16px] text-red-500 hover:bg-red-50 transition-all duration-200"
      >
        <LogOut size={20} className="text-red-500" />
        Log out
      </button>
    </div>
  );
}
