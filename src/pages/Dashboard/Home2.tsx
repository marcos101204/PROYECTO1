import { useState } from "react";

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



export default function Home2() {

    const [savedItems, setSavedItems] = useState<number[]>([]);
    const toggleSave = (id: number) => {

        setSavedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);

    };


    const discount = (price: number, original: number) => Math.round((1 - price / original) * 100);



    return (

        <>




            <div className="home-root">

                {/* Hero */}

                <div className="hero-banner">

                    <div style={{ position: "relative", zIndex: 1 }}>

                        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,107,53,0.2)", border: "1px solid rgba(255,107,53,0.4)", borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>

                            <span style={{ fontSize: 12 }}>🔥</span>

                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#ff8c5a", fontWeight: 500 }}>1,240 productos disponibles hoy</span>

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

                            <button style={{ background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 22px", color: "white", fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>

                                + Publicar artículo

                            </button>

                        </div>

                    </div>

                    {/* Decoration emojis */}

                    <div style={{ position: "absolute", right: 30, top: 20, fontSize: 36, opacity: 0.5, zIndex: 0 }}>📚</div>

                    <div style={{ position: "absolute", right: 90, bottom: 18, fontSize: 28, opacity: 0.4, zIndex: 0 }}>💻</div>

                    <div style={{ position: "absolute", right: 160, top: 30, fontSize: 24, opacity: 0.35, zIndex: 0 }}>🎒</div>

                </div>



                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>

                    {/* Left column */}

                    <div>

                        {/* Categories */}

                        <h2 className="section-title">Explorar categorías</h2>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 28 }}>

                            {CATEGORIES.map((cat) => (

                                <div

                                    key={cat.name}

                                    className="cat-card"

                                    style={{ "--cat-bg": cat.color, "--cat-border": cat.border } as React.CSSProperties}

                                >

                                    <span style={{ fontSize: 28 }}>{cat.icon}</span>

                                    <div style={{ textAlign: "center" }}>

                                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12.5, color: "#1a1a2e" }}>{cat.name}</div>

                                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9a8f85" }}>{cat.count} artículos</div>

                                    </div>

                                </div>

                            ))}

                        </div>



                        {/* Products */}

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>

                            <h2 className="section-title" style={{ margin: 0 }}>Publicaciones recientes</h2>

                            <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#ff6b35", fontWeight: 500, textDecoration: "none" }}>Ver todas →</a>

                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 8 }}>

                            {PRODUCTS.map((p) => (

                                <div key={p.id} className="product-card">

                                    <div className="product-img">

                                        <span>{p.emoji}</span>

                                        <button className="save-btn" onClick={() => toggleSave(p.id)}>

                                            {savedItems.includes(p.id) ? "❤️" : "🤍"}

                                        </button>

                                        <div className="discount-tag">-{discount(p.price, p.original)}%</div>

                                    </div>

                                    <div style={{ padding: "12px 12px 14px" }}>

                                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, flexWrap: "wrap" }}>

                                            {p.badge && (

                                                <span className="badge-pill" style={{ background: p.badgeColor + "22", color: p.badgeColor, border: `1px solid ${p.badgeColor}44` }}>

                                                    {p.badge}

                                                </span>

                                            )}

                                            <span className="condition-tag">{p.condition}</span>

                                        </div>

                                        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e", margin: "0 0 6px", lineHeight: 1.35 }}>

                                            {p.title}

                                        </p>

                                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>

                                            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 17, color: "#ff6b35" }}>

                                                ${p.price.toLocaleString()}

                                            </span>

                                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#b0a898", textDecoration: "line-through" }}>

                                                ${p.original.toLocaleString()}

                                            </span>

                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#9a8f85" }}>

                                                👤 {p.seller} · ⭐ {p.rating}

                                            </span>

                                        </div>

                                        <button className="add-cart-btn">Contactar vendedor</button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>



                    {/* Right column */}

                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                        {/* Stats */}

                        <div className="card-surface">

                            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1a2e", margin: "0 0 14px" }}>Tu actividad</h3>

                            {[

                                { label: "Artículos publicados", value: "3", icon: "🏷️", color: "#ff6b35" },

                                { label: "Artículos guardados", value: `${savedItems.length}`, icon: "❤️", color: "#e91e8c" },

                                { label: "Mensajes pendientes", value: "5", icon: "💬", color: "#3b82f6" },

                                { label: "Ventas este mes", value: "2", icon: "✅", color: "#22c55e" },

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



                        {/* CTA publicar */}

                        <div style={{ background: "linear-gradient(135deg,#fff3e8,#ffe8d0)", border: "1.5px solid #ffd4a8", borderRadius: 18, padding: 18, textAlign: "center" }}>

                            <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>

                            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1a2e", margin: "0 0 6px" }}>¿Tienes algo que ya no usas?</p>

                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9a7a5a", margin: "0 0 14px" }}>Publícalo en menos de 2 minutos y llega a cientos de compañeros.</p>

                            <button style={{ background: "#ff6b35", border: "none", borderRadius: 12, padding: "9px 20px", color: "white", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", width: "100%" }}>

                                + Publicar artículo

                            </button>

                        </div>



                        {/* Actividad reciente */}

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

            </div>

        </>

    );

}