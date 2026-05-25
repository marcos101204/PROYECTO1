import React, { useState, useEffect } from "react";

interface Valoracion {
    id_valoracion: number;
    id_usuario: number;
    calificacion: number;
    comentario: string;
    fecha_creacion: string;
    nombre_usuario?: string;
}

interface ProductReviewProps {
    id_producto: number;
    id_usuario: number;
}

export default function ProductReview({ id_producto, id_usuario }: ProductReviewProps) {
    const [valoraciones, setValoraciones] = useState<Valoracion[]>([]);
    const [calificacion, setCalificacion] = useState(0);
    const [hoverStar, setHoverStar] = useState(0);
    const [comentario, setComentario] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const API_BASE = "http://localhost/PROYECTO1/project/conexion";

    const fetchValoraciones = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/valoraciones.php?id_producto=${id_producto}`);
            const data = await res.json();
            if (data.status === "success") {
                setValoraciones(data.data || []);
            }
        } catch (e) {
            console.error("Error cargando valoraciones", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchValoraciones();
    }, [id_producto]);

    const promedioCalificacion =
        valoraciones.length > 0
            ? valoraciones.reduce((sum, v) => sum + v.calificacion, 0) / valoraciones.length
            : 0;

    const handleSubmit = async () => {
        if (calificacion === 0) {
            setErrorMsg("Por favor selecciona una calificación de 1 a 5 estrellas.");
            return;
        }
        if (comentario.trim().length < 5) {
            setErrorMsg("El comentario debe tener al menos 5 caracteres.");
            return;
        }
        setErrorMsg("");
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/valorar.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_producto,
                    id_usuario,
                    calificacion,
                    comentario: comentario.trim(),
                }),
            });
            const data = await res.json();
            if (data.status === "success") {
                setSuccessMsg("¡Valoración enviada exitosamente!");
                setCalificacion(0);
                setComentario("");
                fetchValoraciones();
                setTimeout(() => setSuccessMsg(""), 3500);
            } else {
                setErrorMsg(data.message || "Ocurrió un error al enviar tu valoración.");
            }
        } catch {
            setErrorMsg("No se pudo conectar con el servidor.");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
    };

    const renderStars = (rating: number, interactive = false, size = 20) => {
        return (
            <div style={{ display: "flex", gap: 3 }}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const filled = interactive ? star <= (hoverStar || calificacion) : star <= Math.round(rating);
                    return (
                        <span
                            key={star}
                            style={{
                                fontSize: size,
                                cursor: interactive ? "pointer" : "default",
                                color: filled ? "#f7931e" : "#e0d8d0",
                                transition: "color 0.1s, transform 0.1s",
                                transform: interactive && star <= (hoverStar || calificacion) ? "scale(1.15)" : "scale(1)",
                                display: "inline-block",
                            }}
                            onMouseEnter={() => interactive && setHoverStar(star)}
                            onMouseLeave={() => interactive && setHoverStar(0)}
                            onClick={() => interactive && setCalificacion(star)}
                        >
                            ★
                        </span>
                    );
                })}
            </div>
        );
    };

    const starDistribution = [5, 4, 3, 2, 1].map((s) => ({
        star: s,
        count: valoraciones.filter((v) => v.calificacion === s).length,
    }));

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .review-root { font-family: 'DM Sans', sans-serif; }
        .review-textarea {
          width: 100%; box-sizing: border-box;
          border: 1.5px solid #e8ddd0; border-radius: 12px;
          padding: 12px 14px; font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; color: #1a1a2e; resize: vertical;
          min-height: 90px; outline: none; background: #fdf9f5;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .review-textarea:focus {
          border-color: #ff6b35;
          box-shadow: 0 0 0 3px rgba(255,107,53,0.12);
        }
        .review-submit-btn {
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          border: none; border-radius: 12px; padding: 10px 26px;
          color: white; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 13.5px; cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
        }
        .review-submit-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .review-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .review-card {
          background: #fdf9f5; border: 1.5px solid #f0ebe4;
          border-radius: 14px; padding: 14px 16px;
          transition: box-shadow 0.15s;
        }
        .review-card:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
        .bar-fill {
          height: 7px; border-radius: 99px;
          background: linear-gradient(90deg, #ff6b35, #f7931e);
          transition: width 0.5s ease;
        }
        .alert-success {
          background: #eafff3; border: 1.5px solid #b0f0cb;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #1a6b40;
          font-family: 'DM Sans', sans-serif;
        }
        .alert-error {
          background: #fff3f3; border: 1.5px solid #fbb8b8;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #c0392b;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

            <div className="review-root" style={{ maxWidth: 860, margin: "0 auto" }}>

                {/* Resumen de calificaciones */}
                {!loading && valoraciones.length > 0 && (
                    <div style={{
                        background: "white", border: "1.5px solid #f0ebe4",
                        borderRadius: 18, padding: "20px 24px", marginBottom: 22,
                        display: "grid", gridTemplateColumns: "auto 1fr", gap: 28, alignItems: "center"
                    }}>
                        {/* Score grande */}
                        <div style={{ textAlign: "center", minWidth: 100 }}>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 48, color: "#ff6b35", lineHeight: 1 }}>
                                {promedioCalificacion.toFixed(1)}
                            </div>
                            <div style={{ marginTop: 6 }}>{renderStars(promedioCalificacion, false, 18)}</div>
                            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9a8f85", marginTop: 4 }}>
                                {valoraciones.length} reseña{valoraciones.length !== 1 ? "s" : ""}
                            </div>
                        </div>

                        {/* Barras por estrella */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                            {starDistribution.map(({ star, count }) => (
                                <div key={star} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 700, color: "#5a5248", width: 14, textAlign: "right" }}>{star}</span>
                                    <span style={{ fontSize: 13, color: "#f7931e" }}>★</span>
                                    <div style={{ flex: 1, background: "#f0ebe4", borderRadius: 99, height: 7 }}>
                                        <div className="bar-fill" style={{ width: valoraciones.length > 0 ? `${(count / valoraciones.length) * 100}%` : "0%" }} />
                                    </div>
                                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9a8f85", width: 18 }}>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Formulario para nueva reseña */}
                <div style={{
                    background: "white", border: "1.5px solid #f0ebe4",
                    borderRadius: 18, padding: "20px 24px", marginBottom: 22
                }}>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#1a1a2e", margin: "0 0 16px" }}>
                        ✍️ Dejar una reseña
                    </h3>

                    {/* Estrellas interactivas */}
                    <div style={{ marginBottom: 14 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#5a5248", margin: "0 0 8px" }}>
                            Tu calificación <span style={{ color: "#d23a2a" }}>*</span>
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {renderStars(calificacion, true, 32)}
                            {calificacion > 0 && (
                                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "#9a8f85" }}>
                                    {["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"][calificacion]}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Textarea */}
                    <div style={{ marginBottom: 14 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#5a5248", margin: "0 0 8px" }}>
                            Comentario <span style={{ color: "#d23a2a" }}>*</span>
                        </p>
                        <textarea
                            className="review-textarea"
                            placeholder="¿Qué te pareció el producto? Comparte tu experiencia con otros compañeros..."
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            maxLength={500}
                        />
                        <div style={{ textAlign: "right", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#b0a898", marginTop: 4 }}>
                            {comentario.length}/500
                        </div>
                    </div>

                    {/* Alertas */}
                    {successMsg && <div className="alert-success" style={{ marginBottom: 12 }}>✅ {successMsg}</div>}
                    {errorMsg && <div className="alert-error" style={{ marginBottom: 12 }}>⚠️ {errorMsg}</div>}

                    <button
                        className="review-submit-btn"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Enviando..." : "Publicar reseña"}
                    </button>
                </div>

                {/* Lista de reseñas */}
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, color: "#1a1a2e", margin: 0 }}>
                            Reseñas del producto
                        </h3>
                        {valoraciones.length > 0 && (
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#9a8f85" }}>
                                {valoraciones.length} reseña{valoraciones.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <p style={{ textAlign: "center", color: "#9a8f85", padding: "30px 0", fontFamily: "'DM Sans', sans-serif" }}>
                            Cargando reseñas...
                        </p>
                    ) : valoraciones.length === 0 ? (
                        <div style={{
                            textAlign: "center", padding: "36px", background: "white",
                            borderRadius: 18, border: "1.5px solid #f0ebe4"
                        }}>
                            <span style={{ fontSize: 36 }}>💬</span>
                            <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1a2e", margin: "10px 0 4px" }}>
                                Sin reseñas todavía
                            </p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9a8f85", margin: 0 }}>
                                Sé el primero en opinar sobre este producto.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {valoraciones.map((v) => (
                                <div key={v.id_valoracion} className="review-card">
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: "50%",
                                                background: "linear-gradient(135deg, #ff6b35, #f7931e)",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: "white"
                                            }}>
                                                {(v.nombre_usuario || "U").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, color: "#1a1a2e", margin: 0 }}>
                                                    {v.nombre_usuario || `Usuario #${v.id_usuario}`}
                                                </p>
                                                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#b0a898", margin: 0 }}>
                                                    {formatDate(v.fecha_creacion)}
                                                </p>
                                            </div>
                                        </div>
                                        {renderStars(v.calificacion, false, 15)}
                                    </div>
                                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: "#3d3530", margin: 0, lineHeight: 1.55 }}>
                                        {v.comentario}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}