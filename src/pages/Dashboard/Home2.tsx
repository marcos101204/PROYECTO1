import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const CATEGORIES = [
  { icon: "📚", name: "Libros", count: 342, color: "#fff3e8", border: "#ffd4a8" },
  { icon: "💻", name: "Tecnología", count: 189, color: "#e8f0ff", border: "#b8ceff" },
  { icon: "📐", name: "Material escolar", count: 211, color: "#eafff3", border: "#b0f0cb" },
  { icon: "🎒", name: "Mochilas y bolsos", count: 97, color: "#fff0f8", border: "#f5c2e4" },
  { icon: "👕", name: "Ropa universitaria", count: 154, color: "#f5f0ff", border: "#d4b8ff" },
  { icon: "🔬", name: "Instrumentos", count: 63, color: "#fffbe8", border: "#ffe8a0" },
];

const RECENT_ACTIVITY = [
  { user: "Ana G.", action: "publicó", item: "Cálculo Diferencial", time: "hace 5 min", emoji: "📚" },
  { user: "Carlos M.", action: "vendió", item: "Laptop HP", time: "hace 12 min", emoji: "🎉" },
  { user: "María T.", action: "publicó", item: "Kit de dibujo técnico", time: "hace 28 min", emoji: "📐" },
  { user: "Luis R.", action: "bajó el precio de", item: "Química Orgánica", time: "hace 1 hora", emoji: "🏷️" },
];

// Interfaz para los productos que vienen de PHP
interface Producto {
  id_producto: number;
  titulo: string;
  precio: number;
  condicion: string;
  categoria: string;
  icono: string;
  vendedor: string;
  imagen_url: string | null;
}

export default function Home() {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState<number[]>([]);
  
  // Nuevos estados para la conexión con el backend
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<{ nombre: string; id: number } | null>(null);

  useEffect(() => {
    // 1. Validar que el usuario haya iniciado sesión
    const userStorage = localStorage.getItem("user_markito");
    if (!userStorage) {
      navigate("/signin");
      return;
    }
    setUsuario(JSON.parse(userStorage));

    // 2. Traer los productos reales de la base de datos
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost/markito-api/productos.php");
        const result = await response.json();
        if (result.status === "success") {
          setProductos(result.data);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [navigate]);

  const logout = () => {
    try {
      localStorage.removeItem('user_markito');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuth');
    } catch (e) { console.warn('Error clearing storage', e); }
    navigate('/signin');
  };
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleSave = (id: number) => {
    setSavedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  // Función falsa de descuento para mantener la estética de tu diseño original
  const getFakeOriginalPrice = (price: number) => Math.round(price * 1.25);
  const discount = (price: number, original: number) => Math.round((1 - price / original) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .home-root { font-family: 'DM Sans', sans-serif; padding: 20px; max-width: 1280px; margin: 0 auto; }
        .hero-banner {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%);
          border-radius: 20px; padding: 32px 36px;
          position: relative; overflow: hidden;
          margin-bottom: 28px;
        }
        .hero-banner::before {
          content: ''; position: absolute; top: -40px; right: -30px;
          width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%);
        }
        .hero-banner::after {
          content: ''; position: absolute; bottom: -60px; right: 80px;
          width: 160px; height: 160px; border-radius: 50%;
          background: radial-gradient(circle, rgba(100,160,255,0.2) 0%, transparent 70%);
        }
        .cat-card {
          background: var(--cat-bg); border: 1.5px solid var(--cat-border);
          border-radius: 16px; padding: 16px 14px;
          cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .cat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
        .product-card {
          background: #ffffff; border: 1.5px solid #f0ebe4;
          border-radius: 18px; overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.10); }
        .product-img {
          background: linear-gradient(135deg, #fdf6ee, #ffe8d0);
          height: 150px; display: flex; align-items: center; justify-content: center;
          font-size: 52px; position: relative; overflow: hidden;
        }
        .product-img img {
          width: 100%; height: 100%; object-fit: cover;
        }
        .save-btn {
          position: absolute; top: 10px; right: 10px;
          background: rgba(255,255,255,0.9); border: none;
          border-radius: 50%; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 15px; transition: transform 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .save-btn:hover { transform: scale(1.15); }
        .discount-tag {
          position: absolute; top: 10px; left: 10px;
          background: #ff6b35; color: white;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 11px;
          padding: 3px 8px; border-radius: 8px;
        }
        .condition-tag {
          font-family: 'DM Sans', sans-serif; font-size: 11px;
          padding: 2px 8px; border-radius: 20px;
          background: #f5f0e8; color: #7a6a58; border: 1px solid #e8ddd0;
        }
        .add-cart-btn {
          width: 100%; background: #1a1a2e; color: white;
          border: none; border-radius: 10px; padding: 9px;
          font-family: 'Syne', sans-serif; font-weight: 600; font-size: 13px;
          cursor: pointer; transition: background 0.15s; margin-top: 10px;
        }
        .add-cart-btn:hover { background: #2d4a7a; }
        .activity-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0; border-bottom: 1px solid #f5f0ea;
        }
        .activity-item:last-child { border-bottom: none; }
        .section-title {
          font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px;
          color: #1a1a2e; margin: 0 0 16px;
        }
        .card-surface {
          background: #ffffff; border: 1.5px solid #f0ebe4;
          border-radius: 18px; padding: 20px;
        }
      `}</style>

      <div className="home-root">
        {/* Top Header - Nombre del usuario dinámico */}
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', alignItems: 'center', gap: 12}}>
          <span style={{fontFamily: "'Syne', sans-serif", fontWeight: 'bold', color: '#1a1a2e'}}>
            Hola, {usuario?.nombre} 👋
          </span>
          <button onClick={() => navigate('/mi-perfil')} style={{ background: '#ff6b35', color: 'white', border: 'none', borderRadius: 10, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>
            Mi Perfil
          </button>
          <button onClick={() => setShowLogoutConfirm(true)} style={{ background: 'transparent', color: '#d23a2a', border: '1.5px solid #f5d8d6', borderRadius: 10, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>

        {/* Hero Banner original */}
        <div className="hero-banner">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,107,53,0.2)", border: "1px solid rgba(255,107,53,0.4)", borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>
              <span style={{ fontSize: 12 }}>🔥</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ff8c5a", fontWeight: 500 }}>{productos.length} productos disponibles hoy</span>
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 28, color: "#ffffff", letterSpacing: "-0.03em", margin: "0 0 8px", lineHeight: 1.2 }}>
              Compra y vende entre<br />
              <span style={{ color: "#ff8c5a" }}>compañeros universitarios</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 20px" }}>
              Libros, tecnología, material escolar y más — a precios de estudiante.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button style={{ background: "linear-gradient(135deg,#ff6b35,#f7931e)", border: "none", borderRadius: 12, padding: "10px 22px", color: "white", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                🛍️ Explorar productos
              </button>
              <button onClick={() => navigate('/publicar')} style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 22px", color: "white", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
                + Publicar artículo
              </button>
            </div>
          </div>
          <div style={{ position: "absolute", right: 30, top: 20, fontSize: 36, opacity: 0.5, zIndex: 0 }}>📚</div>
          <div style={{ position: "absolute", right: 90, bottom: 18, fontSize: 28, opacity: 0.4, zIndex: 0 }}>💻</div>
          <div style={{ position: "absolute", right: 160, top: 30, fontSize: 24, opacity: 0.35, zIndex: 0 }}>🎒</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          
          {/* Left column */}
          <div>
            <h2 className="section-title">Explorar categorías</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="cat-card" style={{ "--cat-bg": cat.color, "--cat-border": cat.border } as React.CSSProperties}>
                  <span style={{ fontSize: 28 }}>{cat.icon}</span>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12.5, color: "#1a1a2e" }}>{cat.name}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 className="section-title" style={{ margin: 0 }}>Publicaciones recientes</h2>
              <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ff6b35", fontWeight: 500, textDecoration: "none" }}>Ver todas →</a>
            </div>
            
            {/* PRODUCTOS REALES DESDE LA BASE DE DATOS */}
            {loading ? (
              <p style={{textAlign: "center", color: "#9a8f85", padding: "40px"}}>Cargando productos...</p>
            ) : productos.length === 0 ? (
              <div style={{textAlign: "center", padding: "40px", background: "white", borderRadius: "18px", border: "1.5px solid #f0ebe4"}}>
                 <span style={{fontSize: "40px"}}>🏜️</span>
                 <p style={{color: "#1a1a2e", fontWeight: "bold"}}>No hay productos aún.</p>
                 <p style={{color: "#9a8f85", fontSize: "14px"}}>Sé el primero en vender algo.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 8 }}>
                {productos.map((p) => {
                  const originalPrice = getFakeOriginalPrice(p.precio);
                  return (
                    <div key={p.id_producto} className="product-card">
                      <div className="product-img">
                        {p.imagen_url ? (
                          <img src={p.imagen_url} alt={p.titulo} />
                        ) : (
                          <span>{p.icono || "📦"}</span>
                        )}
                        <button className="save-btn" onClick={() => toggleSave(p.id_producto)}>
                          {savedItems.includes(p.id_producto) ? "❤️" : "🤍"}
                        </button>
                        <div className="discount-tag">-{discount(p.precio, originalPrice)}%</div>
                      </div>
                      
                      <div style={{ padding: "12px 12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, flexWrap: "wrap" }}>
                          <span className="condition-tag">{p.condicion}</span>
                          <span className="condition-tag" style={{background: '#e8f0ff', color: '#2d4a7a', borderColor: '#b8ceff'}}>{p.categoria}</span>
                        </div>
                        
                        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e", margin: "0 0 6px", lineHeight: 1.35, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.titulo}
                        </p>
                        
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#ff6b35" }}>
                            ${parseFloat(p.precio.toString()).toLocaleString()}
                          </span>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#b0a898", textDecoration: "line-through" }}>
                            ${originalPrice.toLocaleString()}
                          </span>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9a8f85" }}>
                            👤 {p.vendedor}
                          </span>
                        </div>
                        
                        <button className="add-cart-btn">Contactar vendedor</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            
            <div className="card-surface">
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1a2e", margin: "0 0 14px" }}>Tu actividad</h3>
              {[
                { label: "Artículos publicados", value: "0", icon: "🏷️", color: "#ff6b35" },
                { label: "Artículos guardados", value: `${savedItems.length}`, icon: "❤️", color: "#e91e8c" },
                { label: "Mensajes pendientes", value: "0", icon: "💬", color: "#3b82f6" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #f5f0ea" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{s.icon}</span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#5a5248" }}>{s.label}</span>
                  </div>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            <div style={{ background: "linear-gradient(135deg,#fff3e8,#ffe8d0)", border: "1.5px solid #ffd4a8", borderRadius: 18, padding: 18, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1a2e", margin: "0 0 6px" }}>¿Tienes algo que ya no usas?</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9a7a5a", margin: "0 0 14px" }}>Publícalo en menos de 2 minutos y llega a cientos de compañeros.</p>
              <button onClick={() => navigate('/publicar')} style={{ background: "#ff6b35", border: "none", borderRadius: 12, padding: "9px 20px", color: "white", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", width: "100%" }}>
                + Publicar artículo
              </button>
            </div>

            <div className="card-surface">
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1a2e", margin: "0 0 12px" }}>Actividad reciente</h3>
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="activity-item">
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fdf6ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.emoji}</div>
                  <div>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#3d3530", margin: 0, lineHeight: 1.4 }}>
                      <strong>{a.user}</strong> {a.action} <strong>{a.item}</strong>
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#b0a898", margin: 0 }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
        {showLogoutConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
            <div style={{ width: 360, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 18 }}>¿Cerrar sesión?</h3>
              <p style={{ color: '#6b6b6b', marginTop: 8 }}>Confirma que deseas cerrar tu sesión actual.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
                <button onClick={() => setShowLogoutConfirm(false)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e8e0d8', background: 'transparent', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={() => { setShowLogoutConfirm(false); logout(); }} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: '#d23a2a', color: 'white', fontWeight: 700, cursor: 'pointer' }}>Cerrar sesión</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
