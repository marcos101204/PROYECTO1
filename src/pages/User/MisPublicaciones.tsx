import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function MisPublicaciones() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_PRODUCTOS = 'http://localhost/PROYECTO1/conexion/productos.php';

  const getCurrentUserId = () => {
    const storage = localStorage.getItem('user_markito');
    if (storage) {
      try { const obj = JSON.parse(storage); return obj.id; } catch { }
    }
    const id = localStorage.getItem('userId');
    return id ? Number(id) : null;
  };

  const userId = getCurrentUserId();

  useEffect(() => {
    if (!userId) { navigate('/signin'); return; }
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_PRODUCTOS}?id_vendedor=${userId}`);
        const j = await res.json();
        setProductos(j.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchProductos();
  }, [userId, navigate]);

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar publicación?')) return;
    try {
      const res = await fetch(`${API_PRODUCTOS}?id=${id}`, { method: 'DELETE' });
      const j = await res.json();
      if (j.status === 'success') setProductos(prev => prev.filter(p => p.id_producto !== id));
      else alert('No se pudo eliminar');
    } catch { alert('Error de conexión'); }
  };

  const editar = (p: any) => {
    // Redirigir a la página de edición si existe (pendiente de implementar)
    alert('Función editar no implementada aún');
  };

  return (
    <div style={{ padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .mp-root { font-family: 'DM Sans', sans-serif; }
        .mp-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap:12px; }
        .mp-card { background:#fff; border-radius:12px; padding:12px; border:1px solid #f0ebe4; box-shadow: 0 8px 20px rgba(0,0,0,0.04); }
        .mp-title { font-weight:800; margin-bottom:6px; }
        .mp-meta { color:#9a8f85; font-size:13px; }
        .mp-actions { display:flex; gap:8px; margin-top:8px; }
        .btn-main { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color:white; border:none; border-radius:12px; padding:8px 12px; font-weight:700; cursor:pointer; }
        .btn-outline { background: transparent; border: 1.5px solid #e8e0d8; padding:6px 10px; border-radius:10px; cursor:pointer; }
      `}</style>

      <div className="mp-root">
        <h2>Mis Publicaciones</h2>
        {loading && <p>Cargando...</p>}
        {!loading && productos.length === 0 && <p>No tienes publicaciones.</p>}
        {!loading && productos.length > 0 && (
          <div className="mp-grid">
            {productos.map(p => (
              <div key={p.id_producto} className="mp-card">
                <div className="mp-title">{p.titulo}</div>
                <div className="mp-meta">{p.condicion} • ${p.precio}</div>
                <div style={{ marginTop: 8 }}>{p.descripcion && <div style={{ color: '#6b6b6b', fontSize: 13, maxHeight: 48, overflow: 'hidden' }}>{p.descripcion}</div>}</div>
                <div className="mp-actions">
                  <button className="btn-outline" onClick={() => editar(p)}>Editar</button>
                  <button className="btn-outline" onClick={() => eliminar(p.id_producto)} style={{ color: 'red' }}>Eliminar</button>
                  <button className="btn-main" onClick={() => navigate(`/producto/${p.id_producto}`)}>Ver</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
