import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .app-root { font-family: 'DM Sans', sans-serif; }
        .sidebar {
          background: #1a1a2e;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
          flex-shrink: 0; overflow: hidden;
          display: flex; flex-direction: column;
        }
        .sidebar-wide { width: 240px; }
        .sidebar-narrow { width: 68px; }
        .nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 500;
          color: rgba(255,255,255,0.55); text-decoration: none;
          transition: all 0.15s ease; white-space: nowrap;
          margin-bottom: 2px;
        }
        .nav-link:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.9); }
        .nav-link.active { background: rgba(255,107,53,0.18); color: #ff8c5a; }
        .nav-icon { font-size: 18px; flex-shrink: 0; width: 22px; text-align: center; }
        .top-header {
          background: #ffffff;
          border-bottom: 1px solid #f0ebe4;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; height: 60px; flex-shrink: 0;
        }
        .dark .top-header { background: #111827; border-color: #1f2937; }
        .icon-btn {
          background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 10px;
          color: #7a7068; font-size: 16px;
          transition: background 0.15s;
        }
        .icon-btn:hover { background: #f5f0ea; }
        .dark .icon-btn:hover { background: #1f2937; color: #d1d5db; }
        .search-bar {
          display: flex; align-items: center; gap: 8px;
          background: #fdf6ee; border: 1.5px solid #ede5d8;
          border-radius: 12px; padding: 0 14px; height: 38px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-bar:focus-within { border-color: #ff6b35; box-shadow: 0 0 0 3px rgba(255,107,53,0.1); }
        .search-bar input { background: none; border: none; outline: none; font-size: 13.5px; font-family: 'DM Sans', sans-serif; color: #3d3530; width: 180px; }
        .search-bar input::placeholder { color: #b8a898; }
        .dark .search-bar { background: #1f2937; border-color: #374151; }
        .dark .search-bar input { color: #d1d5db; }
        .avatar-btn { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35, #f7931e); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; border: none; cursor: pointer; font-family: 'Syne', sans-serif; }
        .notif-dot { width: 8px; height: 8px; background: #ff6b35; border-radius: 50%; border: 2px solid white; position: absolute; top: 1px; right: 1px; }
      `}</style>

      <div className="app-root flex h-screen overflow-hidden" style={{ background: theme === "dark" ? "#0f172a" : "#faf6f1" }}>
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "sidebar-wide" : "sidebar-narrow"}`}>
          {/* Brand */}
          <div style={{ padding: "18px 14px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#ff6b35,#f7931e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎓</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.02em" }}>UniMarket</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Marketplace</div>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "14px 10px" }}>
            {sidebarOpen && <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", padding: "0 6px 8px" }}>Principal</p>}

            {[
              { to: "/", icon: "🏠", label: "Inicio", end: true },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={() => navigate("/signin")}
              className="nav-link"
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", justifyContent: sidebarOpen ? "flex-start" : "center" }}
              title={!sidebarOpen ? "Cerrar sesión" : undefined}
            >
              <span className="nav-icon">🚪</span>
              {sidebarOpen && <span>Cerrar sesión</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <header className="top-header">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle menú">
                ☰
              </button>
              <div className="search-bar">
                <span style={{ fontSize: 14, color: "#b8a898" }}>🔍</span>
                <input placeholder="Buscar productos, libros, material..." />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button className="icon-btn" onClick={toggleTheme} title="Modo oscuro">
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <div style={{ position: "relative" }}>
                <button className="icon-btn">🔔</button>
                <div className="notif-dot" />
              </div>
              <button className="icon-btn">🛒</button>
              <div className="avatar-btn">A</div>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
