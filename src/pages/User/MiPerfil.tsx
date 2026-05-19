import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo_institucional: string;
  rol: string;
  esta_activo: number;
}

export default function MiPerfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [editCorreo, setEditCorreo] = useState('');

  const API_USER = 'http://localhost/PROYECTO1/conexion/usuarios.php';
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
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_USER}?id=${userId}`);
        const j = await res.json();
        setUsuario(j.data || null);
        setEditName(j.data?.nombre_completo || '');
        setEditCorreo(j.data?.correo_institucional || '');
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    };
    fetchUser();
  }, [userId, navigate]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;
    try {
      const body = {
        id_usuario: usuario.id_usuario,
        nombre_completo: editName,
        correo_institucional: editCorreo,
        rol: usuario.rol ?? 'Estudiante',
        esta_activo: usuario.esta_activo ?? 1
      };
      const res = await fetch(API_USER, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const j = await res.json();
      if (j.status === 'success') {
        // actualizar estado local y localStorage
        setUsuario(prev => prev ? { ...prev, nombre_completo: editName, correo_institucional: editCorreo } : prev);
        try {
          const storage = localStorage.getItem('user_markito');
          if (storage) {
            const obj = JSON.parse(storage);
            obj.nombre_completo = editName;
            obj.correo_institucional = editCorreo;
            localStorage.setItem('user_markito', JSON.stringify(obj));
          }
        } catch (e) { console.warn('No se pudo actualizar localStorage', e); }
        alert('Perfil actualizado');
      } else {
        alert('Error al actualizar: ' + (j.message || JSON.stringify(j)));
      }
    } catch { alert('Error de conexión'); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .profile-root { font-family: 'DM Sans', sans-serif; padding: 20px; }
        .profile-card { background: #ffffff; border-radius: 16px; padding: 20px; box-shadow: 0 12px 36px rgba(0,0,0,0.06); border: 1.5px solid #f0ebe4; max-width: 900px; margin: 0 auto; }
        .profile-header { display:flex; gap:16px; align-items:center; margin-bottom: 12px; }
        .avatar-circle { width:72px; height:72px; border-radius:18px; background: linear-gradient(135deg,#ff6b35,#f7931e); color:white; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:28px; }
        .uni-input { width:100%; height:48px; border-radius:12px; border:1.5px solid #e8e0d8; background:#fdf9f5; padding:0 14px; box-sizing:border-box; }
        .btn-main { background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color:white; border:none; border-radius:12px; padding:10px 16px; font-weight:700; cursor:pointer; }
        .btn-outline { background: transparent; border: 1.5px solid #e8e0d8; padding:8px 12px; border-radius:10px; cursor:pointer; }
        .meta-row { display:flex; gap:12px; align-items:center; margin-top:8px; }
      `}</style>

      <div className="profile-root">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-circle">{usuario ? (usuario.nombre_completo || 'U').charAt(0).toUpperCase() : 'U'}</div>
            <div>
              <h2 style={{ margin: 0, fontFamily: "'Syne', sans-serif" }}>{usuario?.nombre_completo || 'Usuario'}</h2>
              <div style={{ color: '#9a8f85', fontSize: 13 }}>{usuario?.correo_institucional}</div>
              <div className="meta-row">
                <button className="btn-outline" onClick={() => navigate('/Home2')}>Volver al inicio</button>
                <button className="btn-main" onClick={() => navigate('/mis-publicaciones')}>Mis publicaciones</button>
                <button className="btn-outline" onClick={() => navigate('/publicar')}>Publicar nuevo</button>
              </div>
            </div>
          </div>

          {loading ? <p>Cargando perfil...</p> : (
            <form onSubmit={guardar} style={{ marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Nombre completo</label>
                  <input className="uni-input" value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Correo institucional</label>
                  <input className="uni-input" value={editCorreo} onChange={e => setEditCorreo(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="submit" className="btn-main">Guardar cambios</button>
                <button type="button" className="btn-outline" onClick={() => { setEditName(usuario?.nombre_completo || ''); setEditCorreo(usuario?.correo_institucional || ''); }}>Cancelar</button>
              </div>
            </form>
          )}

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #f0ebe4' }} />

          <h3 style={{ marginTop: 0 }}>Historial de publicaciones</h3>
          <MisPublicacionesList userId={usuario?.id_usuario || 0} />
        </div>
      </div>
    </>
  );
}

function MisPublicacionesList({ userId }: { userId: number }) {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_PRODUCTOS = 'http://localhost/PROYECTO1/conexion/productos.php';

  useEffect(() => {
    if (!userId) { setLoading(false); setProductos([]); return; }
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
  }, [userId]);

  return (
    <div>
      {loading && <p>Cargando publicaciones...</p>}
      {!loading && productos.length === 0 && <p>No tienes publicaciones.</p>}
      {!loading && productos.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          {productos.map(p => (
            <div key={p.id_producto} style={{ background: '#fff', borderRadius: 12, padding: 12, border: '1px solid #f0ebe4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800 }}>{p.titulo}</div>
                <div style={{ color: '#9a8f85', fontSize: 13 }}>{p.condicion} • ${p.precio}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-outline" onClick={() => alert('Editar pendiente')}>Editar</button>
                <button className="btn-outline" onClick={async () => {
                  if (!confirm('¿Eliminar publicación?')) return;
                  try {
                    const res = await fetch(`http://localhost/PROYECTO1/conexion/productos.php?id=${p.id_producto}`, { method: 'DELETE' });
                    const j = await res.json();
                    if (j.status === 'success') setProductos(prev => prev.filter(x => x.id_producto !== p.id_producto));
                    else alert('No se pudo eliminar');
                  } catch { alert('Error de conexión'); }
                }} style={{ color: 'red' }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
