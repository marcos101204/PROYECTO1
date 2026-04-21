import { useState } from "react";
import { useNavigate } from "react-router";

const FLOATING_ITEMS = [
  { emoji: "📚", label: "Libros", top: "12%", left: "8%", delay: "0s", rotate: "-8deg" },
  { emoji: "💻", label: "Laptop", top: "20%", right: "7%", delay: "0.4s", rotate: "6deg" },
  { emoji: "🎒", label: "Mochila", top: "55%", left: "5%", delay: "0.8s", rotate: "10deg" },
  { emoji: "🔬", label: "Microscopio", top: "65%", right: "6%", delay: "0.2s", rotate: "-5deg" },
  { emoji: "📐", label: "Reglas", top: "38%", left: "3%", delay: "1s", rotate: "14deg" },
  { emoji: "🎨", label: "Arte", top: "80%", left: "12%", delay: "0.6s", rotate: "-12deg" },
  { emoji: "🧪", label: "Química", top: "82%", right: "10%", delay: "1.2s", rotate: "8deg" },
  { emoji: "📓", label: "Cuaderno", top: "42%", right: "4%", delay: "0.3s", rotate: "-10deg" },
];

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 800);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');
        .uni-root { font-family: 'Syne', sans-serif; }
        .uni-bg {
          background: #fdf6ee;
          background-image:
            radial-gradient(ellipse 80% 60% at 20% 0%, #ffe8c8 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 100%, #d4eaff 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 90% 10%, #ffd6e7 0%, transparent 50%);
          min-height: 100vh;
        }
        .grid-dots {
          background-image: radial-gradient(circle, #c8b8a2 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.3;
          position: absolute; inset: 0; pointer-events: none;
        }
        .float-tag {
          position: absolute;
          animation: floatBob 4s ease-in-out infinite;
          pointer-events: none; user-select: none;
        }
        @keyframes floatBob {
          0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-12px) rotate(var(--rot, 0deg)); }
        }
        .tag-pill {
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(0,0,0,0.07);
          border-radius: 40px;
          padding: 6px 14px 6px 10px;
          display: flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 600; color: #2d2d2d;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          white-space: nowrap; font-family: 'DM Sans', sans-serif;
        }
        .login-card {
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.10);
          border: 1.5px solid rgba(0,0,0,0.06);
        }
        .btn-main {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 14px; color: white;
          font-weight: 700; font-size: 15px; letter-spacing: 0.01em;
          transition: all 0.2s ease;
          position: relative; overflow: hidden;
          font-family: 'Syne', sans-serif;
          border: none; cursor: pointer;
        }
        .btn-main::after {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transition: left 0.4s ease;
        }
        .btn-main:hover::after { left: 100%; }
        .btn-main:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(26,26,46,0.35); }
        .btn-main:active { transform: translateY(0); }
        .btn-main:disabled { opacity: 0.7; cursor: not-allowed; }
        .uni-input {
          width: 100%; height: 48px;
          border-radius: 12px;
          border: 1.5px solid #e8e0d8;
          background: #fdf9f5;
          padding: 0 44px 0 44px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a2e; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .uni-input:focus {
          border-color: #ff6b35; background: #fff;
          box-shadow: 0 0 0 3px rgba(255,107,53,0.12);
        }
        .uni-input::placeholder { color: #b0a898; }
        .badge-uni {
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          border-radius: 8px; color: white;
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 8px; font-family: 'Syne', sans-serif;
        }
        .slide-in {
          animation: slideIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
          opacity: 0;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .logo-mark {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #1a1a2e, #2d4a7a);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(26,26,46,0.25); font-size: 24px; flex-shrink: 0;
        }
      `}</style>

      <div className="uni-root uni-bg relative flex items-center justify-center px-4 py-10" style={{ minHeight: "100vh" }}>
        <div className="grid-dots" />

        {/* Floating tags */}
        {FLOATING_ITEMS.map((item) => (
          <div
            key={item.label}
            className="float-tag"
            style={{
              top: item.top,
              left: (item as { left?: string }).left,
              right: (item as { right?: string }).right,
              animationDelay: item.delay,
              ["--rot" as string]: item.rotate,
            }}
          >
            <div className="tag-pill">
              <span style={{ fontSize: 17 }}>{item.emoji}</span>
              {item.label}
            </div>
          </div>
        ))}

        {/* Login card */}
        <div className="login-card slide-in relative z-10 w-full p-8" style={{ maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div className="logo-mark">🎓</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#1a1a2e", letterSpacing: "-0.02em" }}>
                  MarkITO
                </span>
                <span className="badge-uni">Beta</span>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9a8f85", margin: 0 }}>
                Marketplace universitario
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: "#f0ebe4", marginBottom: 22 }} />

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 27, fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 8px" }}>
            Bienvenido de<br />
            <span style={{ color: "#ff6b35" }}>regreso</span> 👋
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#9a8f85", margin: "0 0 24px" }}>
            Inicia sesión para comprar, vender e intercambiar con tus compañeros.
          </p>

          {error && (
            <div style={{ background: "#fff1ee", border: "1.5px solid #ffd0c4", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c0392b", fontFamily: "'DM Sans', sans-serif" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: "#3d3530", display: "block", marginBottom: 6 }}>
                Correo institucional
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tunombre@universidad.edu.mx"
                  className="uni-input"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: "#3d3530", display: "block", marginBottom: 6 }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="uni-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 15, padding: 0, lineHeight: 1 }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#ff6b35", width: 15, height: 15 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#7a7068" }}>Recordarme</span>
              </label>
              <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ff6b35", fontWeight: 500, textDecoration: "none" }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button type="submit" className="btn-main" style={{ width: "100%", height: 50 }} disabled={loading}>
              {loading ? "Entrando..." : "Entrar al marketplace →"}
            </button>
          </form>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9a8f85", textAlign: "center", margin: "18px 0 0" }}>
            ¿Primera vez?{" "}
            <a href="#" style={{ color: "#1a1a2e", fontWeight: 600, textDecoration: "none" }}>
              Crear cuenta gratis
            </a>
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 22, paddingTop: 18, borderTop: "1px solid #f0ebe4" }}>
            {[["1,240+", "Productos"], ["380+", "Estudiantes"], ["4.9★", "Calificación"]].map(([num, lbl]) => (
              <div key={lbl} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#1a1a2e" }}>{num}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#b0a898" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
