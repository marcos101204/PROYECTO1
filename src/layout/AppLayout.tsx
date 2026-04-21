import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { useTheme } from "../context/ThemeContext";
import "../layout/est_layout.css"

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin", { replace: true });
  };

  return (
    <>
      <div className="app-root flex h-screen overflow-hidden" style={{ background: theme === "dark" ? "#0f172a" : "#faf6f1" }}>
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "sidebar-wide" : "sidebar-narrow"}`}>
          {/* Brand */}
          <div style={{ padding: "18px 14px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#ff6b35,#f7931e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🎓</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.02em" }}>MarkITO</div>
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

          {/* Logout - CORRECCIÓN 3: Cambiar onClick para usar handleLogout */}
          <div style={{ padding: "10px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={handleLogout} // CAMBIADO: antes era () => navigate("/signin")
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