import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const normalizeImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://localhost/markito-api/')) {
    return url.replace('http://localhost/markito-api/', `${window.location.protocol}//${window.location.host}/PROYECTO1/project/`);
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return `${window.location.protocol}//${window.location.host}${url}`;
  }
  return `${window.location.protocol}//${window.location.host}/PROYECTO1/project/${url}`;
};

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [alias, setAlias] = useState('');
  const [ventas, setVentas] = useState<any[]>([]);
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = parseInt(localStorage.getItem('userId') || '0', 10);

  useEffect(() => {
    if (!userId) {
      navigate('/signin');
      return;
    }
    fetchUser();
    fetchVentas();
    fetchCompras();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost/PROYECTO1/project/conexion/usuario_perfil.php?id=${userId}`);
      const j = await res.json();
      if (j.status === 'success') {
        setUser(j.data);
        setAlias(j.data.alias || '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVentas = async () => {
    try {
      const res = await fetch(`http://localhost/PROYECTO1/project/conexion/usuario_perfil.php?id=${userId}&history=ventas`);
      const j = await res.json();
      if (j.status === 'success') setVentas(j.ventas || []);
      else console.error(j);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCompras = async () => {
    try {
      const res = await fetch(`http://localhost/PROYECTO1/project/conexion/usuario_perfil.php?id=${userId}&history=compras`);
      const j = await res.json();
      if (j.status === 'success') setCompras(j.compras || []);
      else console.error(j);
    } catch (e) {
      console.error(e);
    }
  };

  const saveAlias = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/PROYECTO1/project/conexion/usuario_perfil.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: userId, alias })
      });
      const j = await res.json();
      if (j.status === 'success') fetchUser();
      else console.error(j);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };


  return (
    <div className="home-root">
      <style>{`
        .home-root {
          font-family: 'DM Sans', sans-serif;
          padding: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .profile-header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-end;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }
        .profile-header h1 {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          margin: 0 0 6px;
          color: #1a1a2e;
        }
        .profile-header p {
          margin: 0;
          color: #5a5248;
          font-size: 14px;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: minmax(280px, 360px) 1fr;
          gap: 22px;
          align-items: start;
          width: 100%;
          min-width: 0;
        }
        .card-surface {
          background: #ffffff;
          border: 1.5px solid #f0ebe4;
          border-radius: 22px;
          padding: 24px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.04);
          width: 100%;
          min-width: 0;
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 18px;
          color: #1a1a2e;
        }
        .profile-avatar {
          width: 100%;
          min-height: 120px;
          border-radius: 22px;
          background: linear-gradient(135deg, #fff7f0, #ffe8d5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff6b35;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 18px;
          padding: 20px;
          text-align: center;
        }
        .secondary-btn {
          background: transparent;
          color: #1a1a2e;
          border: 1.5px solid #f0ebe4;
          border-radius: 14px;
          padding: 12px 18px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, background 0.15s;
        }
        .secondary-btn:hover {
          background: #f5f0ea;
        }
        .profile-label {
          font-size: 12px;
          color: #9a8f85;
          margin-bottom: 6px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
        }
        .profile-value {
          color: #1a1a2e;
          font-size: 15px;
          margin: 0 0 16px;
          word-break: break-word;
        }
        .input-field {
          width: 100%;
          border: 1.5px solid #ede5d8;
          border-radius: 14px;
          padding: 12px 14px;
          outline: none;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #3d3530;
          background: #fff;
          transition: border-color 0.15s ease;
        }
        .input-field:focus {
          border-color: #ff6b35;
          box-shadow: 0 0 0 4px rgba(255,107,53,0.1);
        }
        .action-btn {
          background: #ff6b35;
          color: white;
          border: none;
          border-radius: 14px;
          padding: 12px 18px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
        }
        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          opacity: 0.95;
        }
        .action-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .profile-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 14px;
          margin-top: 22px;
          width: 100%;
          min-width: 0;
        }
        .stat-card {
          min-width: 0;
        }
        .profile-header > div:last-child {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        @media (max-width: 820px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .profile-header {
            align-items: flex-start;
          }
          .profile-header > div:last-child {
            width: 100%;
            justify-content: flex-end;
            flex-wrap: wrap;
          }
          .profile-header > div:last-child button {
            flex: 1 1 auto;
          }
        }
        .stat-card {
          background: #fdf9f5;
          border: 1.5px solid #f0ebe4;
          border-radius: 18px;
          padding: 18px;
        }
        .stat-card span {
          display: block;
          font-size: 11px;
          color: #9a8f85;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
        }
        .stat-card strong {
          display: block;
          font-size: 30px;
          color: #1a1a2e;
          font-family: 'Syne', sans-serif;
        }
        .history-list {
          display: grid;
          gap: 14px;
        }
        .history-item {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 16px;
          border-radius: 18px;
          border: 1px solid #f0ebe4;
          background: #ffffff;
          flex-wrap: wrap;
        }
        .history-item img {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          object-fit: cover;
        }
        .history-empty {
          background: #fdf9f5;
          border: 1px solid #f0ebe4;
          color: #7a6a58;
          border-radius: 18px;
          padding: 18px;
        }
      `}</style>

      <div className="profile-header">
        <div>
          <h1>Mi perfil</h1>
          <p>Gestiona tu alias y revisa tu actividad de ventas y compras.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="secondary-btn" onClick={() => navigate('/home2')}>Volver a Home</button>
          <button className="secondary-btn" onClick={() => navigate('/mis-publicaciones')}>Mis publicaciones</button>
          <button className="action-btn" onClick={saveAlias} disabled={loading}>Guardar cambios</button>
        </div>
      </div>

      {!user ? (
        <div className="card-surface">
          <p>Cargando perfil...</p>
        </div>
      ) : (
        <div className="profile-grid">
          <div className="card-surface">
            <div className="profile-avatar">
              <div>
                <div style={{ fontSize: 42, marginBottom: 10 }}>{user.nombre_completo?.split(' ').map((part: string) => part[0]).slice(0, 2).join('').toUpperCase()}</div>
                <div style={{ fontSize: 13, color: '#7a6a58' }}>Bienvenido a tu espacio</div>
              </div>
            </div>
            <div>
              <label className="profile-label">Nombre</label>
              <p className="profile-value">{user.nombre_completo}</p>
            </div>
            <div>
              <label className="profile-label">Correo</label>
              <p className="profile-value">{user.correo_institucional}</p>
            </div>
            <div>
              <label className="profile-label">Alias</label>
              <input className="input-field" value={alias} onChange={(e) => setAlias(e.target.value)} />
            </div>

            <div className="profile-stats">
              <div className="stat-card">
                <span>Ventas publicadas</span>
                <strong>{ventas.length}</strong>
              </div>
              <div className="stat-card">
                <span>Compras</span>
                <strong>{compras.length}</strong>
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gap: 22 }}>
            <section className="card-surface">
              <h3 className="section-title">Ventas recientes</h3>
              {ventas.length === 0 ? (
                <div className="history-empty">No tienes publicaciones vendidas aún.</div>
              ) : (
                <div className="history-list">
                  {ventas.map((item) => (
                    <article key={item.id_producto} className="history-item">
                      {item.imagen_url ? (
                        <img src={normalizeImageUrl(item.imagen_url!)} alt={item.titulo} />
                      ) : (
                        <div style={{ width: 72, height: 72, borderRadius: 16, background: '#fff3e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📦</div>
                      )}
                      <div>
                        <h4>{item.titulo}</h4>
                        <span>{item.categoria} · {item.condicion}</span>
                        <div style={{ marginTop: 8, fontWeight: 700, color: '#1a1a2e' }}>${item.precio}</div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
            <section className="card-surface">
              <h3 className="section-title">Compras recientes</h3>
              {compras.length === 0 ? (
                <div className="history-empty">Aún no hay compras registradas o el historial no está disponible.</div>
              ) : (
                <div className="history-list">
                  {compras.map((item) => (
                    <article key={item.id_producto} className="history-item">
                      {item.imagen_url ? (
                        <img src={normalizeImageUrl(item.imagen_url!)} alt={item.titulo} />
                      ) : (
                        <div style={{ width: 72, height: 72, borderRadius: 16, background: '#fff3e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📦</div>
                      )}
                      <div>
                        <h4>{item.titulo}</h4>
                        <span>{item.categoria} · {item.condicion}</span>
                        <div style={{ marginTop: 8, fontWeight: 700, color: '#1a1a2e' }}>${item.precio}</div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
