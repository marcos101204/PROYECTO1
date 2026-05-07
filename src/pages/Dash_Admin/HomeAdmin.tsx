import React, { useState, useEffect } from "react";
import "./estilos.css";

// --- INTERFACES ---
interface Producto {
    id_producto: number;
    nombre: string;
    precio: string;
    detalles: string;
    fecha_creacion: string;
    nombre_categoria: string;
}

interface UsuarioDB {
    id_usuario: number;
    nombre_completo: string;
    correo_institucional: string;
    rol: string;
    esta_activo: number | string;
    fecha_creacion: string;
}

export default function HomeAdmin() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loadingProds, setLoadingProds] = useState<boolean>(true);

    const [usuariosDB, setUsuariosDB] = useState<UsuarioDB[]>([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState<boolean>(true);

    // --- FETCH PRODUCTOS ---
    useEffect(() => {
        const fetchProductos = async () => {
            setLoadingProds(true);
            try {
                const response = await fetch("http://localhost/PROYECTO_REPOSITORIO%20-%20Copy/project/conexion/productos.php");
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                const result = await response.json();
                if (result.status === "success") {
                    setProductos(result.data);
                } else {
                    console.error("El PHP reportó un error:", result.message);
                }
            } catch (error) {
                console.error("Error crítico en el fetch de productos:", error);
            } finally {
                setLoadingProds(false);
            }
        };
        fetchProductos();
    }, []);

    // --- FETCH USUARIOS DB ---
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoadingUsuarios(true);
            try {
                const response = await fetch("http://localhost/PROYECTO_REPOSITORIO%20-%20Copy/project/conexion/usuarios.php");
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                const result = await response.json();
                if (result.status === "success") {
                    setUsuariosDB(result.data);
                } else {
                    console.error("Error del servidor:", result.message);
                }
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            } finally {
                setLoadingUsuarios(false);
            }
        };
        fetchUsuarios();
    }, []);

    const handleLogout = () => {
        if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            localStorage.removeItem("userToken");
            window.location.replace("/login");
        }
    };

    return (
        <div className="admin-wrapper">
            <header className="admin-header">
                <div className="brand">
                    <h1>Panel Administrativo</h1>
                    <span>Gestión de Sistema</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión 🚪
                </button>
            </header>

            <main className="content">

                {/* ── SECCIÓN 1: USUARIOS DESDE BASE DE DATOS ── */}
                <section className="admin-section">
                    <div className="table-actions">
                        <h2>Usuarios </h2>
                    </div>
                    {loadingUsuarios ? (
                        <p className="loading-text">Cargando usuarios...</p>
                    ) : (
                        <table className="crud-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre Completo</th>
                                    <th>Correo Institucional</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Fecha Creación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariosDB.length > 0 ? (
                                    usuariosDB.map((u) => (
                                        <tr key={u.id_usuario}>
                                            <td>{u.id_usuario}</td>
                                            <td style={{ fontWeight: "bold" }}>{u.nombre_completo}</td>
                                            <td>{u.correo_institucional}</td>
                                            <td>
                                                <span className={`badge ${u.rol?.toLowerCase()}`}>
                                                    {u.rol}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status ${u.esta_activo == 1 || u.esta_activo === "activo" ? "aprobado" : "pendiente"}`}>
                                                    {u.esta_activo == 1 || u.esta_activo === "activo" ? "activo" : "inactivo"}
                                                </span>
                                            </td>
                                            <td>{new Date(u.fecha_creacion).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center" }}>
                                            No se encontraron usuarios en la base de datos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </section>

                <hr className="divider" />

                {/* ── SECCIÓN 2: PRODUCTOS DESDE BASE DE DATOS ── */}
                <section className="admin-section">
                    <h2>Lista de Productos</h2>
                    {loadingProds ? (
                        <p className="loading-text">Cargando productos...</p>
                    ) : (
                        <table className="crud-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Detalles</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.length > 0 ? (
                                    productos.map((prod) => (
                                        <tr key={prod.id_producto}>
                                            <td>{prod.id_producto}</td>
                                            <td style={{ fontWeight: "bold" }}>{prod.nombre}</td>
                                            <td><span className="badge-category">{prod.nombre_categoria}</span></td>
                                            <td style={{ color: "#27ae60", fontWeight: "bold" }}>
                                                ${parseFloat(prod.precio).toLocaleString()}
                                            </td>
                                            <td>{prod.detalles}</td>
                                            <td>{new Date(prod.fecha_creacion).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center" }}>No se encontraron productos.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </section>

            </main>
        </div>
    );
}