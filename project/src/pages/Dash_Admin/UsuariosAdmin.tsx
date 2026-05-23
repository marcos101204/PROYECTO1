import React, { useEffect, useState } from 'react';
import "./estilos.css";

// 1. Corregimos la interfaz para que coincida EXACTAMENTE con los campos del JSON de PHP
interface Usuario {
    id_usuario: number;
    nombre_completo: string;
    correo_institucional: string;
    rol: string;
    esta_activo: number | boolean; // PHP devuelve un entero (0 o 1) o un booleano
    fecha_creacion: string;
}

export default function UsuariosAdmin() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtro, setFiltro] = useState<'todos' | 'pendientes' | 'activos'>('pendientes');

    const API = 'http://localhost/PROYECTO1/project/conexion/usuarios.php';

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const res = await fetch(API);
            const j = await res.json();
            if (j.status === 'success') {
                setUsuarios(j.data || []);
            }
        } catch (e) {
            console.error("Error al cargar usuarios:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    // 2. Ajustamos la actualización para enviar los datos requeridos por el PUT de tu PHP
    const toggleEstadoUsuario = async (usuario: Usuario) => {
        // En la base de datos comúnmente manejamos 1 (activo) y 0 (inactivo)
        const nuevoEstado = usuario.esta_activo == 1 || usuario.esta_activo === true ? 0 : 1;
        const accion = nuevoEstado === 1 ? 'activar' : 'desactivar';

        if (!confirm(`¿Estás seguro de que deseas ${accion} a este usuario?`)) return;

        try {
            const res = await fetch(API, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                // Tu PHP en el CASE 'PUT' necesita todos estos campos obligatoriamente
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    nombre_completo: usuario.nombre_completo,
                    correo_institucional: usuario.correo_institucional,
                    rol: usuario.rol,
                    esta_activo: nuevoEstado
                })
            });
            const j = await res.json();

            if (j.status === 'success') {
                fetchUsuarios(); // Recargamos la lista
            } else {
                alert('No se pudo cambiar el estado del usuario: ' + j.message);
            }
        } catch {
            alert('Error de conexión con el servidor');
        }
    };

    // 3. Modificamos los filtros locales adaptándolos a 'esta_activo' (1 o 0)
    const usuariosFiltrados = usuarios.filter(u => {
        const esActivo = u.esta_activo == 1 || u.esta_activo === true;
        if (filtro === 'pendientes') return !esActivo;
        if (filtro === 'activos') return esActivo;
        return true;
    });

    return (
        <div className="category-view-container">
            {/* Título Principal */}
            <div className="section-title-container">
                <h1 className="main-section-title">Control de Acceso de Usuarios</h1>
                <p style={{ color: '#666', marginTop: -5, fontSize: '0.95rem' }}>
                    Autoriza o bloquea el ingreso de usuarios al sistema.
                </p>
            </div>

            {/* Barra de Filtros Estilizada */}
            <div className="category-header-box">
                <h2 style={{ marginBottom: 12 }}>🔍 Filtrar Lista</h2>
                <div className="form-actions-group">
                    <button
                        type="button"
                        className={`btn-add ${filtro === 'pendientes' ? '' : 'btn-cancel'}`}
                        style={{ background: filtro === 'pendientes' ? '#f59e0b' : '' }}
                        onClick={() => setFiltro('pendientes')}
                    >
                        {/* Adaptación de contadores de botones */}
                        ⏳ Pendientes de Activar ({usuarios.filter(u => !(u.esta_activo == 1 || u.esta_activo === true)).length})
                    </button>
                    <button
                        type="button"
                        className={`btn-add ${filtro === 'activos' ? '' : 'btn-cancel'}`}
                        onClick={() => setFiltro('activos')}
                    >
                        ✅ Usuarios Activos ({usuarios.filter(u => u.esta_activo == 1 || u.esta_activo === true).length})
                    </button>
                    <button
                        type="button"
                        className={`btn-add ${filtro === 'todos' ? '' : 'btn-cancel'}`}
                        style={{ background: filtro === 'todos' ? '#6b7280' : '' }}
                        onClick={() => setFiltro('todos')}
                    >
                        📋 Todos ({usuarios.length})
                    </button>
                </div>
            </div>

            {/* Listado / Tabla */}
            {loading ? (
                <div className="loader">Cargando registros de usuarios...</div>
            ) : (
                <div className="table-container">
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nombre Completo</th>
                                <th>Correo Institucional</th>
                                <th>Rol</th>
                                <th>Fecha Registro</th>
                                <th style={{ width: '140px', textAlign: 'center' }}>Estado</th>
                                <th style={{ width: '150px', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                                        No se encontraron usuarios en esta lista.
                                    </td>
                                </tr>
                            ) : (
                                usuariosFiltrados.map(u => {
                                    const esActivo = u.esta_activo == 1 || u.esta_activo === true;
                                    return (
                                        <tr key={u.id_usuario}>
                                            <td>
                                                <span className="category-id-pill">#{u.id_usuario}</span>
                                            </td>
                                            <td>
                                                {/* Corregido a u.nombre_completo */}
                                                <span className="category-name" style={{ fontWeight: 600 }}>{u.nombre_completo}</span>
                                            </td>
                                            {/* Corregido a u.correo_institucional */}
                                            <td>{u.correo_institucional}</td>
                                            <td>{u.rol}</td>
                                            <td>
                                                <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    {/* Corregido a u.fecha_creacion */}
                                                    {u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString() : 'N/A'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {esActivo ? (
                                                    <span style={{
                                                        background: '#e6f4ea', color: '#137333',
                                                        padding: '4px 10px', borderRadius: '12px',
                                                        fontSize: '0.85rem', fontWeight: 'bold'
                                                    }}>
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        background: '#fce8e6', color: '#c5221f',
                                                        padding: '4px 10px', borderRadius: '12px',
                                                        fontSize: '0.85rem', fontWeight: 'bold'
                                                    }}>
                                                        Inactivo
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="actions-cell" style={{ justifyContent: 'center' }}>
                                                    <button
                                                        className={`btn-action-row ${esActivo ? 'delete' : 'edit'}`}
                                                        onClick={() => toggleEstadoUsuario(u)}
                                                        title={esActivo ? "Desactivar y bloquear acceso" : "Activar y permitir acceso"}
                                                        style={{
                                                            fontSize: '0.9rem', padding: '6px 12px', width: 'auto', borderRadius: '6px',
                                                            background: esActivo ? '' : '#10b981',
                                                            color: esActivo ? '' : 'white'
                                                        }}
                                                    >
                                                        {esActivo ? '🔒 Bloquear' : '🔓 Activar'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}