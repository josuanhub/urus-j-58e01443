import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      style={{ backgroundColor: "#0A0A0F", borderColor: "#1A1A2E" }}
      className={`
        relative flex flex-col border-r transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-64"}
        min-h-screen
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        style={{ backgroundColor: "#1A1A2E", borderColor: "#6C63FF" }}
        className="
          absolute -right-3 top-6 z-50
          flex items-center justify-center
          w-6 h-6 rounded-full border
          text-white transition-all duration-200
          hover:scale-110 hover:shadow-lg
        "
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={12} style={{ color: "#6C63FF" }} />
        ) : (
          <ChevronLeft size={12} style={{ color: "#6C63FF" }} />
        )}
      </button>

      {/* Logo */}
      <div
        style={{ borderColor: "#1A1A2E" }}
        className={`
          flex items-center border-b py-5 px-4
          ${collapsed ? "justify-center" : "gap-3"}
          transition-all duration-300
        `}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
          }}
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl shadow-lg"
        >
          <Sparkles size={18} className="text-white" />
        </div>

        <span
          className={`
            font-bold text-lg tracking-tight whitespace-nowrap overflow-hidden
            transition-all duration-300
            ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
          `}
          style={{
            background: "linear-gradient(90deg, #6C63FF, #00D4AA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Sistema j
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.length === 0 ? (
          <div
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg
              text-sm transition-all duration-200
              ${collapsed ? "justify-center" : ""}
            `}
            style={{ color: "#6C63FF", opacity: 0.4 }}
          >
            <LayoutDashboard size={18} />
            {!collapsed && (
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                Sin secciones
              </span>
            )}
          </div>
        ) : (
          NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }
                `}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(0,212,170,0.15))",
                        borderLeft: "3px solid #6C63FF",
                      }
                    : {
                        borderLeft: "3px solid transparent",
                      }
                }
              >
                {/* Hover background */}
                {!isActive && (
                  <span
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: "#1A1A2E" }}
                  />
                )}

                <Icon
                  size={18}
                  className="flex-shrink-0 relative z-10"
                  style={{ color: isActive ? "#6C63FF" : undefined }}
                />

                <span
                  className={`
                    relative z-10 whitespace-nowrap overflow-hidden transition-all duration-300
                    ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
                  `}
                >
                  {item.label}
                </span>

                {/* Tooltip on collapsed */}
                {collapsed && (
                  <span
                    className="
                      absolute left-full ml-3 px-2 py-1 rounded-md text-xs font-medium
                      whitespace-nowrap pointer-events-none z-50
                      opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
                      transition-all duration-200
                    "
                    style={{
                      backgroundColor: "#1A1A2E",
                      color: "#fff",
                      border: "1px solid #6C63FF33",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* Footer - Company Name */}
      <div
        style={{ borderColor: "#1A1A2E" }}
        className={`
          border-t py-4 px-3
          flex items-center
          ${collapsed ? "justify-center" : "gap-3"}
          transition-all duration-300
        `}
      >
        <div
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #6C63FF, #00D4AA)",
          }}
        >
          J
        </div>

        <div
          className={`
            overflow-hidden transition-all duration-300
            ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}
          `}
        >
          <p
            className="text-xs font-semibold whitespace-nowrap"
            style={{ color: "#fff" }}
          >
            j
          </p>
          <p className="text-xs whitespace-nowrap" style={{ color: "#6C63FF" }}>
            Sistema j
          </p>
        </div>
      </div>
    </aside>
  );
}