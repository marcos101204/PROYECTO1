import React, { useEffect, useState } from 'react';

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

  const API = 'http://localhost/PROYECTO1/conexion/categorias.php';

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
    <div style={{ padding: 20 }}>
      <h2>Gestión de Categorías</h2>
      <form onSubmit={save} style={{ marginBottom: 20 }}>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" style={{ marginRight: 8 }} />
        <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción" style={{ marginRight: 8 }} />
        <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setNombre(''); setDescripcion(''); }} style={{ marginLeft: 8 }}>Cancelar</button>}
      </form>

      {loading ? <p>Cargando...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr></thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id_categoria} style={{ borderTop: '1px solid #eee' }}>
                <td>{c.id_categoria}</td>
                <td>{c.nombre}</td>
                <td>{c.descripcion}</td>
                <td>
                  <button onClick={() => editar(c)} style={{ marginRight: 8 }}>Editar</button>
                  <button onClick={() => eliminar(c.id_categoria)} style={{ color: 'red' }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
