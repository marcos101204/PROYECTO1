import React, { useState, useEffect } from "react";
import "./estilos.css";
import ReportesAdmin from "./ReportesAdmin";
import CategoriasAdmin from "./CategoriasAdmin";

// --- INTERFACES ---
interface Producto {
    id_producto?: number;
    titulo: string;
    descripcion: string;
    precio: string;
    condicion: string;
    estado_vendedor: string;
    estado_moderacion: string;
    fecha_publicacion?: string;
    id_vendedor: number;
    id_categoria: number;
}

interface UsuarioDB {
    id_usuario?: number;
    nombre_completo: string;
    correo_institucional: string;
    rol: string;
    esta_activo: number | string;
    fecha_creacion?: string;
    contrasena?: string;
}

interface Reporte {
    id_reporte: number;
    id_producto: number;
    id_usuario_reporta: number;
    motivo: string;
    fecha_reporte: string;
    estado: string; // 'Pendiente', 'Revisado', 'Resuelto'
}

export default function HomeAdmin() {
    // Estado de la vista: ahora incluye 'inicio' y 'reportes'
    const [view, setView] = useState<"inicio" | "usuarios" | "productos" | "reportes" | "categorias">("inicio");
    const [productos, setProductos] = useState<Producto[]>([]);
    const [usuariosDB, setUsuariosDB] = useState<UsuarioDB[]>([]);
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<any>({});

    // Cargar datos según la vista activa
    useEffect(() => {
        if (view === "usuarios") fetchUsuarios();
        else if (view === "productos") fetchProductos();
        else if (view === "reportes") fetchReportes();
        else if (view === "categorias") { /* CategoriasAdmin se encarga de fetch propio */ }
    }, [view]);

    // --- FETCHES ---
    const fetchProductos = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost/PROYECTO1/project/conexion/productos.php");
            const result = await res.json();
            if (result.status === "success") setProductos(result.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const fetchUsuarios = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost/PROYECTO1/project/conexion/usuarios.php");
            const result = await res.json();
            if (result.status === "success") setUsuariosDB(result.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const fetchReportes = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost/PROYECTO1/project/conexion/reportes.php");
            const result = await res.json();
            if (result.status === "success") setReportes(result.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    // --- ACCIONES ---
    const openModal = (item: any = null) => {
        if (item) {
            setEditMode(true);
            setFormData(item);
        } else {
            setEditMode(false);
            setFormData(view === "usuarios"
                ? { nombre_completo: "", correo_institucional: "", contrasena: "", rol: "Estudiante", esta_activo: 1 }
                : { titulo: "", descripcion: "", precio: "", condicion: "Nuevo", id_vendedor: 1, id_categoria: 1 }
            );
        }
        setShowModal(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const tipo = view;
        const method = editMode ? "PUT" : "POST";
        const url = `http://localhost/PROYECTO1/project/conexion/${tipo}.php`;

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (result.status === "success") {
                alert(editMode ? "Actualizado con éxito" : "Creado con éxito");
                setShowModal(false);
                tipo === "usuarios" ? fetchUsuarios() : fetchProductos();
            } else {
                alert("Error: " + result.message);
            }
        } catch (error) {
            alert("Error al procesar la solicitud");
        }
    };

    const handleDelete = async (tipo: 'usuarios' | 'productos', id: number) => {
        if (!window.confirm("¿Estás seguro de eliminar este registro?")) return;
        try {
            const res = await fetch(`http://localhost/PROYECTO1/project/conexion/${tipo}.php?id=${id}`, {
                method: 'DELETE'
            });
            const result = await res.json();
            if (result.status === "success") {
                alert("Eliminado con éxito");
                tipo === 'usuarios' ? fetchUsuarios() : fetchProductos();
            }
        } catch (error) { alert("Error al eliminar"); }
    };

    const handleLogout = () => {
        if (window.confirm("¿Cerrar sesión?")) {
            localStorage.removeItem("userToken");
            window.location.replace("/login");
        }
    };

    // --- RENDERIZADO DE CONTENIDO PRINCIPAL ---
    const renderContent = () => {
        if (loading) return <div className="loader">Cargando...</div>;

        switch (view) {
            case "inicio":
                return (
                    <div className="admin-welcome-hero">
                        <div className="hero-overlay"></div>
                        <div className="hero-content">
                            <div className="hero-text">
                                <h1>Bienvenido al Panel de Control</h1>
                                <p>Gestiona usuarios, productos y reportes de manera eficiente. Tu rol como administrador es clave para mantener la integridad de la plataforma.</p>
                            </div>

                            <div className="hero-stats">
                                <div className="stat-card">
                                    <span className="stat-icon">👥</span>
                                    <div className="stat-info">
                                        <span className="stat-number">{usuariosDB.length}</span>
                                        <span className="stat-label">Usuarios Totales</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-icon">📦</span>
                                    <div className="stat-info">
                                        <span className="stat-number">{productos.length}</span>
                                        <span className="stat-label">Productos Activos</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <span className="stat-icon">🚩</span>
                                    <div className="stat-info">
                                        <span className="stat-number">{reportes.length}</span>
                                        <span className="stat-label">Reportes Pendientes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case "usuarios":
                return <TablaUsuarios data={usuariosDB} onDelete={(id) => handleDelete('usuarios', id)} onEdit={(u) => openModal(u)} />;
            case "productos":
                return <TablaProductos data={productos} onDelete={(id) => handleDelete('productos', id)} onEdit={(p) => openModal(p)} />;
            case "reportes":
                return <ReportesAdmin />;
            case "categorias":
                return <CategoriasAdmin />;
            default:
                return null;
        }
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-header"><h3>Menú Admin</h3></div>
                <nav className="sidebar-nav">
                    <button className={view === "inicio" ? "active" : ""} onClick={() => setView("inicio")}>🏠 Inicio</button>
                    <button className={view === "usuarios" ? "active" : ""} onClick={() => setView("usuarios")}>👥 Usuarios</button>
                    <button className={view === "productos" ? "active" : ""} onClick={() => setView("productos")}>📦 Productos</button>
                    <button className={view === "categorias" ? "active" : ""} onClick={() => setView("categorias")}>🗂️ Categorías</button>
                    <button className={view === "reportes" ? "active" : ""} onClick={() => setView("reportes")}>🚩 Reportes</button>
                </nav>
                <button onClick={handleLogout} className="btn-logout-sidebar">Cerrar Sesión 🚪</button>
            </aside>

            <main className="admin-main">
                <header className="main-header">
                    <h1>
                        {view === "inicio" && "Dashboard Principal"}
                        {view === "usuarios" && "Gestión de Usuarios"}
                        {view === "productos" && "Gestión de Productos"}
                        {view === "reportes" && "Centro de Reportes"}
                    </h1>
                    {(view === "usuarios" || view === "productos") && (
                        <button className="btn-add" onClick={() => openModal()}>+ Añadir Nuevo</button>
                    )}
                </header>

                <section className="table-container">
                    {renderContent()}
                </section>
            </main>

            {/* MODAL PARA USUARIOS Y PRODUCTOS */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editMode ? "Editar" : "Nuevo"} {view === "usuarios" ? "Usuario" : "Producto"}</h2>
                        <form onSubmit={handleSave}>
                            {view === "usuarios" ? (
                                <>
                                    <input type="text" placeholder="Nombre Completo" value={formData.nombre_completo} onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })} required />
                                    <input type="email" placeholder="Correo Institucional" value={formData.correo_institucional} onChange={e => setFormData({ ...formData, correo_institucional: e.target.value })} required />
                                    {!editMode && (
                                        <input type="password" placeholder="Contraseña Nueva" value={formData.contrasena} onChange={e => setFormData({ ...formData, contrasena: e.target.value })} required />
                                    )}
                                    <select value={formData.rol} onChange={e => setFormData({ ...formData, rol: e.target.value })}>
                                        <option value="Estudiante">Estudiante</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                    <select value={formData.esta_activo} onChange={e => setFormData({ ...formData, esta_activo: e.target.value })}>
                                        <option value={1}>Activo</option>
                                        <option value={0}>Inactivo</option>
                                    </select>
                                </>
                            ) : (
                                <>
                                    <input type="text" placeholder="Título" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required />
                                    <textarea placeholder="Descripción" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} required />
                                    <input type="number" placeholder="Precio" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} required />
                                    <select value={formData.condicion} onChange={e => setFormData({ ...formData, condicion: e.target.value })}>
                                        <option value="Nuevo">Nuevo</option>
                                        <option value="Usado - Como nuevo">Usado - Como nuevo</option>
                                        <option value="Usado - Buen estado">Usado - Buen estado</option>
                                    </select>
                                </>
                            )}
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancelar</button>
                                <button type="submit" className="btn-save">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- COMPONENTES DE TABLA ---

const TablaUsuarios = ({ data, onDelete, onEdit }: { data: UsuarioDB[], onDelete: (id: number) => void, onEdit: (u: UsuarioDB) => void }) => (
    <table className="crud-table">
        <thead><tr><th>ID</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody>
            {data.map(u => (
                <tr key={u.id_usuario}>
                    <td>{u.id_usuario}</td>
                    <td>{u.nombre_completo}</td>
                    <td><span className={`badge ${u.rol.toLowerCase()}`}>{u.rol}</span></td>
                    <td>{Number(u.esta_activo) === 1 ? "✅ ACTIVO" : "❌ INACTIVO"}</td>
                    <td>
                        <button className="btn-edit" onClick={() => onEdit(u)}>✏️</button>
                        <button className="btn-delete" onClick={() => onDelete(u.id_usuario!)}>🗑️</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const TablaProductos = ({ data, onDelete, onEdit }: { data: Producto[], onDelete: (id: number) => void, onEdit: (p: Producto) => void }) => (
    <table className="crud-table">
        <thead><tr><th>ID</th><th>Título</th><th>Descripción</th><th>Precio</th><th>Condición</th><th>Acciones</th></tr></thead>
        <tbody>
            {data.map(p => (
                <tr key={p.id_producto}>
                    <td>{p.id_producto}</td>
                    <td style={{ fontWeight: 'bold' }}>{p.titulo}</td>
                    <td className="text-truncate">{p.descripcion}</td>
                    <td className="price-text">${parseFloat(p.precio).toFixed(2)}</td>
                    <td><span className={`badge-condicion ${p.condicion.replace(/\s+/g, '-').toLowerCase()}`}>{p.condicion}</span></td>
                    <td>
                        <button className="btn-edit" onClick={() => onEdit(p)}>✏️</button>
                        <button className="btn-delete" onClick={() => onDelete(p.id_producto!)}>🗑️</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const TablaReportes = ({ data }: { data: Reporte[] }) => (
    <table className="crud-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Producto ID</th>
                <th>Usuario Denunciante</th>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            {data.map(r => (
                <tr key={r.id_reporte}>
                    <td>{r.id_reporte}</td>
                    <td>{r.id_producto}</td>
                    <td>{r.id_usuario_reporta}</td>
                    <td>{r.motivo}</td>
                    <td>{r.fecha_reporte}</td>
                    <td>
                        <span className={`badge-reporte ${r.estado.toLowerCase()}`}>
                            {r.estado}
                        </span>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);