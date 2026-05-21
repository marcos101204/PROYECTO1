import React, { useEffect, useState } from 'react';

interface Reporte {
  id_reporte: number;
  id_producto: number;
  id_usuario_reporta: number;
  motivo: string;
  fecha_reporte: string;
  estado: string;
}

export default function ReportesAdmin() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = 'http://localhost/PROYECTO1/project/conexion/reportes.php';

  const fetchReportes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const json = await res.json();
      if (json.status === 'success') setReportes(json.data || []);
      else setError('Error al cargar reportes');
    } catch (e) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReportes(); }, []);

  const updateEstado = async (id: number, estado: string) => {
    try {
      const res = await fetch(API, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_reporte: id, estado })
      });
      const j = await res.json();
      if (j.status === 'success') fetchReportes();
      else alert('No se pudo actualizar');
    } catch (e) { alert('Error de conexión'); }
  };

  const eliminar = async (id: number) => {
    if (!confirm('¿Eliminar este reporte?')) return;
    try {
      const res = await fetch(`${API}?id=${id}`, { method: 'DELETE' });
      const j = await res.json();
      if (j.status === 'success') fetchReportes();
      else alert('No se pudo eliminar');
    } catch { alert('Error de conexión'); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Centro de Reportes</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th><th>Producto</th><th>Usuario</th><th>Motivo</th><th>Fecha</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map(r => (
            <tr key={r.id_reporte} style={{ borderTop: '1px solid #eee' }}>
              <td>{r.id_reporte}</td>
              <td>{r.id_producto}</td>
              <td>{r.id_usuario_reporta}</td>
              <td style={{ maxWidth: 300 }}>{r.motivo}</td>
              <td>{r.fecha_reporte}</td>
              <td>{r.estado}</td>
              <td>
                <button onClick={() => updateEstado(r.id_reporte, 'Revisado')} style={{ marginRight: 8 }}>Marcar Revisado</button>
                <button onClick={() => updateEstado(r.id_reporte, 'Resuelto')} style={{ marginRight: 8 }}>Marcar Resuelto</button>
                <button onClick={() => eliminar(r.id_reporte)} style={{ color: 'red' }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
