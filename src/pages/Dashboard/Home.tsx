import { useState } from "react";

import { useNavigate } from "react-router";

import "./estilos.css";



const CATEGORIES = [

  { icon: "📚", name: "Libros", count: 342, color: "#fff3e8", border: "#ffd4a8" },

  { icon: "💻", name: "Tecnología", count: 189, color: "#e8f0ff", border: "#b8ceff" },

  { icon: "📐", name: "Material escolar", count: 211, color: "#eafff3", border: "#b0f0cb" },

  { icon: "🎒", name: "Mochilas y bolsos", count: 97, color: "#fff0f8", border: "#f5c2e4" },

  { icon: "👕", name: "Ropa universitaria", count: 154, color: "#f5f0ff", border: "#d4b8ff" },

  { icon: "🔬", name: "Instrumentos", count: 63, color: "#fffbe8", border: "#ffe8a0" },

];



const PRODUCTS = [

  { id: 1, title: "Cálculo Diferencial — Stewart 7ma Ed.", price: 180, original: 320, condition: "Buen estado", category: "Libros", seller: "Ana G.", rating: 4.8, emoji: "📚", badge: "Popular", badgeColor: "#ff6b35" },

  { id: 2, title: "Laptop HP Pavilion 14\" Core i5", price: 4200, original: 6500, condition: "Como nuevo", category: "Tecnología", seller: "Carlos M.", rating: 5.0, emoji: "💻", badge: "Verificado", badgeColor: "#22c55e" },

  { id: 3, title: "Kit de dibujo técnico completo", price: 95, original: 180, condition: "Buen estado", category: "Material", seller: "María T.", rating: 4.5, emoji: "📐", badge: null, badgeColor: "" },

  { id: 4, title: "Química Orgánica — McMurry 8va Ed.", price: 150, original: 280, condition: "Aceptable", category: "Libros", seller: "Luis R.", rating: 4.2, emoji: "📗", badge: "Oferta", badgeColor: "#f59e0b" },

  { id: 5, title: "Mochila Samsonite impermeable", price: 350, original: 650, condition: "Como nuevo", category: "Mochilas", seller: "Sofia P.", rating: 4.9, emoji: "🎒", badge: null, badgeColor: "" },

  { id: 6, title: "Calculadora Casio fx-991EX", price: 420, original: 700, condition: "Buen estado", category: "Material", seller: "Diego F.", rating: 4.7, emoji: "🔢", badge: "Popular", badgeColor: "#ff6b35" },

];



const RECENT_ACTIVITY = [

  { user: "Ana G.", action: "publicó", item: "Cálculo Diferencial", time: "hace 5 min", emoji: "📚" },

  { user: "Carlos M.", action: "vendió", item: "Laptop HP", time: "hace 12 min", emoji: "🎉" },

  { user: "María T.", action: "publicó", item: "Kit de dibujo técnico", time: "hace 28 min", emoji: "📐" },

  { user: "Luis R.", action: "bajó el precio de", item: "Química Orgánica", time: "hace 1 hora", emoji: "🏷️" },

];



export default function Home() {

  const navigate = useNavigate();

  const [savedItems, setSavedItems] = useState<number[]>([]);



  // En un caso real, esto vendría de localStorage.getItem("isAuth")

  const [isLoggedIn, setIsLoggedIn] = useState(false);



  const toggleSave = (id: number) => {

    if (!isLoggedIn) {

      alert("Debes iniciar sesión para guardar artículos");

      navigate("/login");

      return;

    }

    setSavedItems((prev) =>

      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]

    );

  };



  const discount = (price: number, original: number) => Math.round((1 - price / original) * 100);



  return (

    <div className="home-root">

      {/* Header con navegación al Login */}

      <header className="main-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0" }}>

        <div className="logo-section" style={{ display: "flex", alignItems: "center", gap: "10px" }}>

          <span className="logo-icon" style={{ fontSize: "24px" }}>🎓</span>

          <span className="logo-text" style={{ fontWeight: 800, fontSize: "20px", color: "#1a1a2e" }}>markITO</span>

        </div>



        <div className="auth-section">

          {isLoggedIn ? (

            <span style={{ fontWeight: 600 }}>Hola, Compañero 👋</span>

          ) : (

            <button

              className="login-btn"

              onClick={() => navigate("/login")}

              style={{

                background: "#1a1a2e",

                color: "white",

                padding: "10px 24px",

                borderRadius: "12px",

                cursor: "pointer",

                border: "none",

                fontWeight: "bold",

                transition: "0.3s"

              }}

            >

              Iniciar Sesión

            </button>

          )}

        </div>

      </header>



      {/* Hero Banner */}

      <div className="hero-banner" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", borderRadius: "20px", padding: "40px", color: "white", marginBottom: "30px" }}>

        <h1 style={{ fontSize: "32px", margin: 0 }}>Compra y vende entre compañeros</h1>

        <p style={{ opacity: 0.8 }}>La forma más fácil de conseguir tus materiales universitarios.</p>

      </div>



      <div className="main-layout" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

        {/* Columna Izquierda */}

        <div className="content-area">

          <h2 className="section-title">Categorías</h2>

          <div className="categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "30px" }}>

            {CATEGORIES.map(cat => (

              <div key={cat.name} style={{ background: cat.color, border: `1px solid ${cat.border}`, padding: "15px", borderRadius: "12px", textAlign: "center" }}>

                <span style={{ fontSize: "24px" }}>{cat.icon}</span>

                <p style={{ margin: "5px 0 0", fontWeight: "bold", fontSize: "14px" }}>{cat.name}</p>

              </div>

            ))}

          </div>



          <h2 className="section-title">Productos Recientes</h2>

          <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>

            {PRODUCTS.map(p => (

              <div key={p.id} className="product-card" style={{ border: "1px solid #eee", borderRadius: "15px", overflow: "hidden" }}>

                <div style={{ background: "#f8f9fa", height: "120px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "40px", position: "relative" }}>

                  {p.emoji}

                  <button

                    onClick={() => toggleSave(p.id)}

                    style={{ position: "absolute", top: "10px", right: "10px", border: "none", background: "white", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}

                  >

                    {savedItems.includes(p.id) ? "❤️" : "🤍"}

                  </button>

                </div>

                <div style={{ padding: "15px" }}>

                  <h4 style={{ margin: "0 0 10px", fontSize: "14px" }}>{p.title}</h4>

                  <p style={{ color: "#ff6b35", fontWeight: "bold", margin: 0 }}>${p.price}</p>

                  <button

                    className="contact-btn"

                    onClick={() => !isLoggedIn && alert('Debes iniciar sesión para contactar al vendedor')}

                    style={{ width: "100%", marginTop: "10px", padding: "8px", borderRadius: "8px", border: "1px solid #1a1a2e", background: "transparent", cursor: "pointer" }}

                  >

                    Contactar

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>



        {/* Columna Derecha (Sidebar) */}

        <aside className="sidebar">

          {isLoggedIn ? (

            <div className="card-surface" style={{ padding: "20px", background: "#fff", borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>

              <h3 className="sidebar-title" style={{ marginTop: 0 }}>Tu actividad</h3>

              {[

                { label: "Publicados", value: "3", icon: "🏷️", color: "#ff6b35" },

                { label: "Guardados", value: `${savedItems.length}`, icon: "❤️", color: "#e91e8c" },

                { label: "Mensajes", value: "5", icon: "💬", color: "#3b82f6" },

              ].map((s) => (

                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>

                  <span>{s.icon} {s.label}</span>

                  <span style={{ color: s.color, fontWeight: "bold" }}>{s.value}</span>

                </div>

              ))}

            </div>

          ) : (

            <div className="card-surface login-promo" style={{ padding: "20px", background: "#fff3e8", borderRadius: "15px", border: "1px solid #ffd4a8" }}>

              <h3 style={{ marginTop: 0 }}>¡Únete a MarkITO!</h3>

              <p style={{ fontSize: "13px", color: "#666" }}>Inicia sesión para vender, guardar favoritos y chatear.</p>

              <button

                className="login-btn-full"

                onClick={() => navigate("/login")}

                style={{ width: "100%", background: "#ff6b35", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}

              >

                Identificarse ahora

              </button>

            </div>

          )}



          <div className="activity-feed" style={{ marginTop: "20px" }}>

            <h3 style={{ fontSize: "16px" }}>Actividad de la comunidad</h3>

            {RECENT_ACTIVITY.map((act, i) => (

              <div key={i} style={{ fontSize: "12px", marginBottom: "10px", padding: "10px", background: "#f9f9f9", borderRadius: "8px" }}>

                <strong>{act.user}</strong> {act.action} <strong>{act.item}</strong>

              </div>

            ))}

          </div>

        </aside>

      </div>

    </div>

  );

}