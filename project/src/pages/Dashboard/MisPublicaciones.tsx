import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const CATEGORIAS_DB = [
  { id: 1, nombre: 'Libros' },
  { id: 2, nombre: 'Tecnología' },
  { id: 3, nombre: 'Material escolar' },
  { id: 4, nombre: 'Mochilas y bolsos' },
  { id: 5, nombre: 'Ropa universitaria' },
  { id: 6, nombre: 'Instrumentos' },
];

const CONDICIONES = ['Nuevo', 'Como nuevo', 'Buen estado', 'Aceptable'];

const normalizeImageUrl = (url: string | null) => {
  if (!url) return null;
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

export default function MisPublicaciones() {
  const navigate = useNavigate();
  const [misPublicaciones, setMisPublicaciones] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    condicion: CONDICIONES[2],
    id_categoria: '1',
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const userId = parseInt(localStorage.getItem('userId') || '0', 10);

  useEffect(() => {
    if (!userId) {
      navigate('/signin');
      return;
    }
    fetchMisPublicaciones();
  }, [navigate, userId]);

  const fetchMisPublicaciones = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/PROYECTO1/project/conexion/productos.php?id_vendedor=${userId}&limit=50`);
      const j = await res.json();
      if (j.status === 'success') setMisPublicaciones(j.data || []);
      else {
        console.error(j);
        setMisPublicaciones([]);
      }
    } catch (e) {
      console.error(e);
      setMisPublicaciones([]);
    }
    setLoading(false);
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setEditForm({
      titulo: product.titulo || '',
      descripcion: product.descripcion || '',
      precio: product.precio ? String(product.precio) : '',
      condicion: product.condicion || CONDICIONES[2],
      id_categoria: String(product.id_categoria || '1'),
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProductChanges = async () => {
    if (!editingProduct) return;
    setActionLoading(true);
    try {
      const res = await fetch('http://localhost/PROYECTO1/project/conexion/productos.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_producto: editingProduct.id_producto,
          titulo: editForm.titulo,
          descripcion: editForm.descripcion,
          precio: editForm.precio,
          condicion: editForm.condicion,
          id_categoria: editForm.id_categoria,
        }),
      });
      const j = await res.json();
      if (j.status === 'success') {
        fetchMisPublicaciones();
        setEditingProduct(null);
      } else {
        console.error(j);
      }
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const deleteProduct = async (id: number) => {
    const confirmed = window.confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    setActionLoading(true);
    try {
      const res = await fetch(`http://localhost/PROYECTO1/project/conexion/productos.php?id=${id}`, {
        method: 'DELETE',
      });
      const j = await res.json();
      if (j.status === 'success') fetchMisPublicaciones();
      else console.error(j);
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
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
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }
        .page-header h1 {
          font-family: 'Syne', sans-serif;
          font-size: 30px;
          margin: 0 0 6px;
          color: #1a1a2e;
        }
        .page-header p {
          margin: 0;
          color: #5a5248;
          font-size: 14px;
        }
        .card-surface {
          background: #ffffff;
          border: 1.5px solid #f0ebe4;
          border-radius: 22px;
          padding: 24px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.04);
        }
        .section-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 18px;
          color: #1a1a2e;
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
        .item-actions {
          display: flex;
          gap: 10px;
          flex-direction: column;
          min-width: 140px;
        }
        .secondary-btn,
        .action-btn {
          border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, background 0.15s;
          min-height: 48px;
          padding: 12px 18px;
        }
        .secondary-btn {
          background: transparent;
          color: #1a1a2e;
          border: 1.5px solid #f0ebe4;
        }
        .secondary-btn:hover {
          background: #f5f0ea;
        }
        .action-btn {
          background: #ff6b35;
          border: none;
          color: #fff;
        }
        .action-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          opacity: 0.95;
        }
        .action-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .edit-card {
          background: #fff7f0;
          border: 1px solid #fde3cf;
          border-radius: 20px;
          padding: 20px;
          margin-top: 20px;
        }
        .edit-card .edit-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .edit-card .edit-row.full {
          grid-template-columns: 1fr;
        }
        .edit-card label {
          display: block;
          margin-bottom: 8px;
          color: #5a5248;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-family: 'Syne', sans-serif;
        }
        .edit-card input,
        .edit-card select,
        .edit-card textarea {
          width: 100%;
          border: 1.5px solid #ede5d8;
          border-radius: 14px;
          padding: 12px 14px;
          font-size: 14px;
          background: #fff;
          outline: none;
          resize: vertical;
          font-family: 'DM Sans', sans-serif;
        }
        .edit-card textarea {
          min-height: 100px;
        }
        .edit-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .history-empty {
          background: #fdf9f5;
          border: 1px solid #f0ebe4;
          color: #7a6a58;
          border-radius: 18px;
          padding: 18px;
        }
      `}</style>

      <div className="page-header">
        <div>
          <h1>Mis publicaciones</h1>
          <p>Gestiona tus artículos publicados, edítalos o elimínalos desde aquí.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="secondary-btn" onClick={() => navigate('/mi-perfil')}>Volver al perfil</button>
          <button className="secondary-btn" onClick={() => navigate('/publicar')}>Nueva publicación</button>
        </div>
      </div>

      <div className="card-surface">
        {loading ? (
          <p>Cargando tus publicaciones...</p>
        ) : misPublicaciones.length === 0 ? (
          <div className="history-empty">Aún no tienes publicaciones activas. Empieza creando tu primer anuncio.</div>
        ) : (
          <div className="history-list">
            {misPublicaciones.map((item) => (
              <article key={item.id_producto} className="history-item">
                {item.imagen_url ? (
                  <img src={normalizeImageUrl(item.imagen_url)} alt={item.titulo} />
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: 16, background: '#fff3e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>📦</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4>{item.titulo}</h4>
                  <span>{item.categoria ?? `Categoría ${item.id_categoria}`} · {item.condicion}</span>
                  <div style={{ marginTop: 8, fontWeight: 700, color: '#1a1a2e' }}>${item.precio}</div>
                </div>
                <div className="item-actions">
                  <button className="secondary-btn" onClick={() => startEditProduct(item)}>Editar</button>
                  <button className="action-btn" onClick={() => deleteProduct(item.id_producto)} disabled={actionLoading}>Eliminar</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {editingProduct && (
          <div className="edit-card">
            <h3 className="section-title" style={{ marginBottom: 14 }}>Editar publicación</h3>
            <div className="edit-row full">
              <label>Título</label>
              <input value={editForm.titulo} onChange={(e) => handleEditChange('titulo', e.target.value)} />
            </div>
            <div className="edit-row full">
              <label>Descripción</label>
              <textarea value={editForm.descripcion} onChange={(e) => handleEditChange('descripcion', e.target.value)} />
            </div>
            <div className="edit-row">
              <div>
                <label>Precio</label>
                <input type="number" value={editForm.precio} onChange={(e) => handleEditChange('precio', e.target.value)} />
              </div>
              <div>
                <label>Condición</label>
                <select value={editForm.condicion} onChange={(e) => handleEditChange('condicion', e.target.value)}>
                  {CONDICIONES.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="edit-row full">
              <label>Categoría</label>
              <select value={editForm.id_categoria} onChange={(e) => handleEditChange('id_categoria', e.target.value)}>
                {CATEGORIAS_DB.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>
            <div className="edit-actions">
              <button className="action-btn" onClick={saveProductChanges} disabled={actionLoading}>Guardar cambios</button>
              <button className="secondary-btn" onClick={cancelEdit} disabled={actionLoading}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
