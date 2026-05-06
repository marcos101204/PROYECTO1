import React, { useState, useEffect } from "react";
import "./estilos.css";

// --- INTERFACES ---
interface Usuario {
    id_usuario: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    correo: string;
    contrasena?: string;
    rol: "admin" | "usuario";
    estado_registro: "aprobado" | "pendiente";
    activo: number;
    fecha_registro: string;
}

interface Producto {
    id_producto: number;
    nombre: string;
    precio: string;
    detalles: string;
    fecha_creacion: string;
    nombre_categoria: string;
}

const INITIAL_USERS: Usuario[] = [
    { id_usuario: 1, nombre: "Juan", apellido_paterno: "Pérez", apellido_materno: "García", correo: "juan@example.com", rol: "usuario", estado_registro: "aprobado", activo: 1, fecha_registro: "2026-04-22 15:40:33" },
    { id_usuario: 2, nombre: "Maria", apellido_paterno: "López", apellido_materno: "Martínez", correo: "maria@example.com", rol: "usuario", estado_registro: "aprobado", activo: 1, fecha_registro: "2026-04-22 15:40:33" },
    { id_usuario: 3, nombre: "Jostin", apellido_paterno: "Admin", apellido_materno: "Sistema", correo: "admin@markito.com", rol: "admin", estado_registro: "aprobado", activo: 1, fecha_registro: "2026-04-22 15:40:33" },
];

export default function HomeAdmin() {
    const [users, setUsers] = useState<Usuario[]>(INITIAL_USERS);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    // Cambiamos Partial por una estructura más definida para evitar errores de undefined en inputs
    const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

    const [productos, setProductos] = useState<Producto[]>([]);
    const [loadingProds, setLoadingProds] = useState<boolean>(true);

    useEffect(() => {
        const fetchProductos = async () => {
            setLoadingProds(true); // Aseguramos que inicia la carga
            try {
                console.log("Intentando conectar a la API...");

                const response = await fetch("http://localhost/PROYECTO_REPOSITORIO%20-%20Copy/project/conexion/productos.php");

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const result = await response.json();
                console.log("Datos recibidos de PHP:", result);

                if (result.status === "success") {
                    setProductos(result.data);
                } else {
                    console.error("El PHP reportó un error:", result.message);
                }
            } catch (error) {
                console.error("Error crítico en el fetch:", error);
                // Si llega aquí, es que no hubo conexión o el JSON estaba mal
            } finally {
                // ESTO ES LO MÁS IMPORTANTE:
                // Pase lo que pase, quitamos el mensaje de "Cargando..."
                setLoadingProds(false);
            }
        };

        fetchProductos();
    }, []);

    const handleLogout = () => {
        if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            localStorage.removeItem("userToken");
            window.location.replace("/login");
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm("¿Eliminar este usuario?")) {
            setUsers(prev => prev.filter(u => u.id_usuario !== id));
        }
    };

    const openModal = (user: Usuario | null = null) => {
        if (user) {
            setCurrentUser({ ...user });
        } else {
            setCurrentUser({
                id_usuario: 0, // 0 indica que es nuevo
                nombre: "",
                apellido_paterno: "",
                apellido_materno: "",
                correo: "",
                rol: "usuario",
                estado_registro: "pendiente",
                activo: 1,
                fecha_registro: ""
            });
        }
        setIsModalOpen(true);
    };

    const saveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        if (currentUser.id_usuario !== 0) {
            // Editando
            setUsers(users.map(u => u.id_usuario === currentUser.id_usuario ? currentUser : u));
        } else {
            // Nuevo
            const nuevoUsuario: Usuario = {
                ...currentUser,
                id_usuario: Date.now(),
                fecha_registro: new Date().toISOString().replace('T', ' ').split('.')[0]
            };
            setUsers([...users, nuevoUsuario]);
        }
        setIsModalOpen(false);
        setCurrentUser(null);
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
                <section className="admin-section">
                    <div className="table-actions">
                        <h2>Gestión de Usuarios</h2>
                        <button onClick={() => openModal()} className="btn-add">+ Agregar Usuario</button>
                    </div>
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre Completo</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id_usuario}>
                                    <td>{user.id_usuario}</td>
                                    <td>{`${user.nombre} ${user.apellido_paterno}`}</td>
                                    <td>{user.correo}</td>
                                    <td><span className={`badge ${user.rol}`}>{user.rol}</span></td>
                                    <td><span className={`status ${user.estado_registro}`}>{user.estado_registro}</span></td>
                                    <td className="actions-cell">
                                        <button onClick={() => openModal(user)}>✏️</button>
                                        <button onClick={() => handleDelete(user.id_usuario)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <hr className="divider" />

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

            {isModalOpen && currentUser && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>{currentUser.id_usuario !== 0 ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                        <form onSubmit={saveUser}>
                            <div className="form-group">
                                <input
                                    placeholder="Nombre"
                                    value={currentUser.nombre}
                                    onChange={e => setCurrentUser({ ...currentUser, nombre: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Apellido Paterno"
                                    value={currentUser.apellido_paterno}
                                    onChange={e => setCurrentUser({ ...currentUser, apellido_paterno: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Correo Electrónico"
                                    type="email"
                                    value={currentUser.correo}
                                    onChange={e => setCurrentUser({ ...currentUser, correo: e.target.value })}
                                    required
                                />
                                <select
                                    value={currentUser.rol}
                                    onChange={e => setCurrentUser({ ...currentUser, rol: e.target.value as "admin" | "usuario" })}
                                >
                                    <option value="usuario">Usuario</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}