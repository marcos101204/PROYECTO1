import React, { useEffect, useState } from 'react';
import "./estilos.css";

interface Reporte {
  id_reporte: number;
  id_producto: number;
  id_usuario_reporta: number;
  nombre_usuario: string;   // ← nuevo campo del JOIN
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="reportes-view-container">

      <div className="main-header">
        <h1 className="main-section-title">Centro de Reportes</h1>
      </div>

      {loading && <p className="loader">Cargando reportes...</p>}
      {error && <p style={{ color: 'var(--danger-color)', fontWeight: 600 }}>{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Usuario</th>        {/* ← ahora muestra nombre */}
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                    No hay reportes registrados.
                  </td>
                </tr>
              ) : (
                reportes.map(r => (
                  <tr key={r.id_reporte}>
                    <td>
                      <span className="category-id-pill">{r.id_reporte}</span>
                    </td>
                    <td className="category-name">#{r.id_producto}</td>
                    <td className="category-name">
                      {r.nombre_usuario ?? `#${r.id_usuario_reporta}`}  {/* fallback si el JOIN no encuentra usuario */}
                    </td>
                    <td>
                      <span className="category-description text-truncate">{r.motivo}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {r.fecha_reporte}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn-action-reporte revisado"
                          onClick={() => updateEstado(r.id_reporte, 'Revisado')}
                        >
                          Revisado
                        </button>
                        <button
                          className="btn-action-reporte resuelto"
                          onClick={() => updateEstado(r.id_reporte, 'Resuelto')}
                        >
                          Resuelto
                        </button>
                        <button
                          className="btn-action-row delete"
                          onClick={() => eliminar(r.id_reporte)}
                          title="Eliminar reporte"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}