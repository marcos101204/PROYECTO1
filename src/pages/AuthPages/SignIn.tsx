import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./estilosis.css";

interface FloatingItem {
  emoji: string;
  label: string;
  top: string;
  left?: string;
  right?: string;
  delay: string;
  rotate: string;
}

const FLOATING_ITEMS: FloatingItem[] = [
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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost/PROYECTO_REPOSITORIO%20-%20Copy/project/conexion/conexion.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("userRole", data.rol);
        localStorage.setItem("userName", data.nombre);
        localStorage.setItem("isAuth", "true");

        const rol = data.rol.toLowerCase().trim();
        if (rol === "admin" || rol === "administrador") {
          navigate("/HomeAdmin");
        } else {
          navigate("/Home2");
        }
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      setError("Error de conexión. Asegúrate de que XAMPP esté activo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uni-root uni-bg flex-center">
      <div className="grid-dots" />

      {FLOATING_ITEMS.map((item) => (
        <div
          key={item.label}
          className="float-tag"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            animationDelay: item.delay,
            ["--rot" as any]: item.rotate,
          } as React.CSSProperties}
        >
          <div className="tag-pill">
            <span>{item.emoji}</span> {item.label}
          </div>
        </div>
      ))}

      <div className="login-card">
        <div className="card-header">
          <div className="logo-icon">🎓</div>
          <div>
            <div className="brand-name">
              MarkITO <span className="beta-tag">Beta</span>
            </div>
            <p className="brand-sub">Marketplace universitario</p>
          </div>
        </div>

        <h1 className="welcome-text">
          Bienvenido de <span className="highlight">regreso</span> 👋
        </h1>

        {error && <div className="error-box">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Correo institucional</label>
            <div className="input-wrapper">
              <span className="icon-left">✉️</span>
              <input
                type="email"
                className="uni-input"
                placeholder="usuario@universidad.edu"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-wrapper">
              <span className="icon-left">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                className="uni-input"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-main" disabled={loading}>
            {loading ? "Iniciando..." : "Entrar al marketplace →"}
          </button>
        </form>

        <p className="footer-text">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </div>
    </div>
  );
}