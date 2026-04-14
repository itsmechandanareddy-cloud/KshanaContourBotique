import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import { 
  LayoutDashboard, ShoppingBag, Users, Package, 
  BarChart3, Image, Star, LogOut, Menu, X, Scissors
} from "lucide-react";
import { Button } from "./ui/button";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_869a086f-518b-43e3-a2ba-4fade532d0ef/artifacts/af1ehik2_image.png";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { path: "/admin/employees", icon: Users, label: "Employees" },
  { path: "/admin/materials", icon: Package, label: "Materials" },
  { path: "/admin/reports", icon: BarChart3, label: "Reports" },
  { path: "/admin/gallery", icon: Image, label: "Gallery" },
  { path: "/admin/reviews", icon: Star, label: "Reviews & Contact" },
];

const AdminLayout = ({ children, title }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#EFEBE4] z-40 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          <Menu className="w-6 h-6 text-[#2D2420]" />
        </button>
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-[#C05C3B]" />
          <span className="font-['Cormorant_Garamond'] text-xl font-medium text-[#2D2420]">Kshana</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-white border-r border-[#EFEBE4] z-50 
        transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#EFEBE4]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scissors className="w-6 h-6 text-[#C05C3B]" />
                <div>
                  <h1 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#2D2420]">Kshana</h1>
                  <p className="text-xs text-[#8A7D76] uppercase tracking-wider">Admin Portal</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1"
              >
                <X className="w-5 h-5 text-[#8A7D76]" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-[#C05C3B] text-white' 
                    : 'text-[#5C504A] hover:bg-[#F7F2EB]'
                  }
                `}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-[#EFEBE4]">
            <div className="px-4 py-2 mb-2">
              <p className="text-sm font-medium text-[#2D2420]">{user?.name || "Admin"}</p>
              <p className="text-xs text-[#8A7D76]">{user?.phone}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-[#5C504A] hover:text-[#B85450] hover:bg-[#B85450]/10"
              data-testid="logout-button"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
