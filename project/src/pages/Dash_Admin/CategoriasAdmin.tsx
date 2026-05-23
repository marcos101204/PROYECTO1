import React, { useEffect, useState } from 'react';
import "./estilos.css";

interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion?: string | null;
}

export default function CategoriasAdmin() {
  const [cats, setCats] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editing, setEditing] = useState<number | null>(null);

  const API = 'http://localhost/PROYECTO1/project/conexion/categorias.php';

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const j = await res.json();
      if (j.status === 'success') setCats(j.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCats(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return alert('Nombre requerido');
    try {
      const method = editing ? 'PUT' : 'POST';
      const body = editing ? { id_categoria: editing, nombre, descripcion } : { nombre, descripcion };
      const res = await fetch(API, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const j = await res.json();
      if (j.status === 'success') { setNombre(''); setDescripcion(''); setEditing(null); fetchCats(); }
      else alert('Error al guardar');
    } catch { alert('Error de conexión'); }
  };

  const editar = (c: Categoria) => { setEditing(c.id_categoria); setNombre(c.nombre); setDescripcion(c.descripcion || ''); };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar categoría?')) return;
    try {
      const res = await fetch(`${API}?id=${id}`, { method: 'DELETE' });
      const j = await res.json();
      if (j.status === 'success') fetchCats();
      else alert('No se pudo eliminar');
    } catch { alert('Error de conexión'); }
  };

  return (
    <div className="category-view-container">
      {/* Título Principal de la Sección */}
      <div className="section-title-container">
        <h1 className="main-section-title">Gestión de Categorías</h1>
      </div>

      {/* Caja del Formulario */}
      <div className="category-header-box">
        <h2>{editing ? '📝 Editar Categoría' : '✨ Nueva Categoría'}</h2>

        <form onSubmit={save} className="category-form">
          <div className="form-inputs-group">
            <input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Nombre de la categoría (ej. Electrónica)"
              required
            />
            <input
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Añade una breve descripción..."
            />
          </div>
          <div className="form-actions-group">
            <button type="submit" className="btn-add">
              {editing ? 'Actualizar' : 'Crear'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setNombre(''); setDescripcion(''); }}
                className="btn-cancel"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado / Tabla */}
      {loading ? (
        <div className="loader">Cargando categorías...</div>
      ) : (
        <div className="table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id_categoria}>
                  <td>
                    <span className="category-id-pill">#{c.id_categoria}</span>
                  </td>
                  <td>
                    <span className="category-name">{c.nombre}</span>
                  </td>
                  <td>
                    <div className="category-description">
                      {c.descripcion || <span style={{ color: '#bbb', fontStyle: 'italic' }}>Sin descripción</span>}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell" style={{ justifyContent: 'center' }}>
                      <button
                        className="btn-action-row edit"
                        onClick={() => editar(c)}
                        title="Editar categoría"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-action-row delete"
                        onClick={() => eliminar(c.id_categoria)}
                        title="Eliminar categoría"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
