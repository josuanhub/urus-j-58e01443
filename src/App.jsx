import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Upload, Settings, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import ImportarDatos from "./pages/ImportarDatos";
import Configuracion from "./pages/Configuracion";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/importar", label: "Importar Datos", icon: Upload },
  { path: "/configuracion", label: "Configuración", icon: Settings },
];

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
              <span className="text-white font-bold text-sm">J</span>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">Sistema j</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
            <span className="text-white font-bold text-sm">J</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleNav(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${active
                  ? "bg-gradient-to-r from-[#6C63FF]/20 to-[#00D4AA]/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ background: "linear-gradient(180deg, #6C63FF, #00D4AA)" }} />
              )}
              <Icon size={20} className={active ? "text-[#6C63FF]" : "group-hover:text-[#6C63FF] transition-colors"} />
              {!collapsed && (
                <span className="font-medium text-sm truncate">{label}</span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1A1A2E] text-white text-xs font-medium rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200 shadow-xl">
                  {label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-4 py-4 border-t border-white/10 ${collapsed ? "text-center" : ""}`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
              j
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Sistema j</p>
              <p className="text-gray-500 text-xs">v1.0.0</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto" style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
            j
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-white/10 transition-all duration-300 ease-in-out z-30 flex-shrink-0`}
        style={{
          width: collapsed ? "72px" : "240px",
          background: "linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col lg:hidden transition-transform duration-300 ease-in-out border-r border-white/10
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background: "linear-gradient(180deg, #1A1A2E 0%, #0A0A0F 100%)" }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

function TopBar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const current = navItems.find((n) => n.pathname === location.pathname) ||
    navItems.find((n) => location.pathname.startsWith(n.path));

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 z-20" style={{ background: "#0A0A0F" }}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6C63FF, #00D4AA)" }}>
            <span className="text-white font-bold text-xs">J</span>
          </div>
          <span className="text-white font-semibold text-sm">Sistema j</span>
        </div>
      </div>
      <span className="text-gray-400 text-xs font-medium">{current?.label || ""}</span>
    </header>
  );
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#0A0A0F" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/importar" element={<ImportarDatos />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}