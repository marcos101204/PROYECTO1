import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// Simulamos los IDs de tus categorías en la BD (ajusta estos números a los reales de tu tabla 'categoria')
const CATEGORIAS_DB = [
  { id: 1, nombre: "Libros", emoji: "📚" },
  { id: 2, nombre: "Tecnología", emoji: "💻" },
  { id: 3, nombre: "Material escolar", emoji: "📐" },
  { id: 4, nombre: "Mochilas y bolsos", emoji: "🎒" },
  { id: 5, nombre: "Ropa universitaria", emoji: "👕" },
  { id: 6, nombre: "Instrumentos", emoji: "🔬" },
];

const CONDICIONES = ["Nuevo", "Como nuevo", "Buen estado", "Aceptable"];

export default function Publicar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<{ nombre: string; id: number } | null>(null);

  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [condicion, setCondicion] = useState(CONDICIONES[2]); // Por defecto: Buen estado
  const [categoria, setCategoria] = useState(CATEGORIAS_DB[0].id.toString());
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Buscamos las mismas llaves que usas en Home.tsx
    const isAuth = localStorage.getItem("isAuth");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");

    // 2. Si no hay sesión válida, lo mandamos al login
    if (isAuth !== "true" || !userName || !userId) {
      navigate("/signin");
      return;
    }

    // 3. Si todo está correcto, asignamos el usuario al estado
    setUsuario({
      nombre: userName,
      id: parseInt(userId, 10)
    });
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      setPreviewUrl(URL.createObjectURL(file)); // Crea una vista previa de la foto
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !precio || !usuario) {
      setError("El título y el precio son obligatorios.");
      return;
    }

    setLoading(true);
    setError("");

    // Usamos FormData para poder enviar el archivo (la imagen)
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("precio", precio);
    formData.append("condicion", condicion);
    formData.append("id_categoria", categoria);
    formData.append("id_vendedor", usuario.id.toString());

    if (imagen) {
      formData.append("imagen", imagen);
    }

    try {
      const response = await fetch("http://localhost/markito-api/publicar.php", {
        method: "POST",
        // NOTA: Cuando usas FormData NO debes poner 'Content-Type': 'application/json'
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("🎉 " + result.message);
        navigate("/"); // Lo regresamos al Home para que vea su producto
      } else {
        setError(result.message || "Error al publicar.");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');
        .pub-root { font-family: 'DM Sans', sans-serif; background: #fdf6ee; min-height: 100vh; padding: 40px 20px; }
        .pub-container { max-width: 600px; margin: 0 auto; }
        .pub-card {
          background: #ffffff; border-radius: 24px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.06);
          border: 1.5px solid rgba(0,0,0,0.05);
          padding: 32px;
        }
        .uni-input, .uni-select {
          width: 100%; height: 50px;
          border-radius: 12px; border: 1.5px solid #e8e0d8;
          background: #fdf9f5; padding: 0 16px;
          font-size: 15px; font-family: 'DM Sans', sans-serif;
          outline: none; transition: all 0.2s;
          box-sizing: border-box;
        }
        .uni-input:focus, .uni-select:focus {
          border-color: #ff6b35; box-shadow: 0 0 0 3px rgba(255,107,53,0.15);
        }
        .img-upload-box {
          border: 2px dashed #e8e0d8; border-radius: 16px;
          background: #fdf9f5; height: 180px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          cursor: pointer; position: relative; overflow: hidden; transition: all 0.2s;
        }
        .img-upload-box:hover { border-color: #ff6b35; background: #fff0e5; }
        .btn-publish {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          border-radius: 14px; color: white; border: none;
          font-weight: 700; font-size: 16px; font-family: 'Syne', sans-serif;
          width: 100%; height: 54px; cursor: pointer; transition: transform 0.2s;
        }
        .btn-publish:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255,107,53,0.3); }
        .btn-publish:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>

      <div className="pub-root">
        <div className="pub-container">

          <div className="flex items-center gap-4 mb-8 cursor-pointer" onClick={() => navigate("/")}>
            <div style={{ background: '#ffffff', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontWeight: 'bold' }}>
              ←
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '24px', fontWeight: 800, color: '#1a1a2e', margin: 0 }}>
              Vender un artículo
            </h1>
          </div>

          <div className="pub-card">
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* FOTO DEL PRODUCTO */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#3d3530' }}>Fotos del producto</label>
                <label className="img-upload-box">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <span style={{ fontSize: '32px', marginBottom: '8px' }}>📸</span>
                      <span style={{ color: '#9a8f85', fontSize: '14px', fontWeight: 500 }}>Sube una foto clara de lo que vendes</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </div>

              {/* TÍTULO */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#3d3530' }}>¿Qué estás vendiendo?</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Libro de Cálculo Diferencial 7ma Ed."
                  className="uni-input"
                  maxLength={60}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                {/* PRECIO */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#3d3530' }}>Precio ($ MXN)</label>
                  <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="Ej. 250"
                    className="uni-input"
                    min="1"
                  />
                </div>

                {/* CONDICIÓN */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#3d3530' }}>Condición</label>
                  <select value={condicion} onChange={(e) => setCondicion(e.target.value)} className="uni-select">
                    {CONDICIONES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* CATEGORÍA */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: '#3d3530' }}>Categoría</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="uni-select">
                  {CATEGORIAS_DB.map(c => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-publish" disabled={loading}>
                {loading ? "Publicando..." : "Publicar ahora 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}