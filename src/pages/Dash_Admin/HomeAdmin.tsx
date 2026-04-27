import React, { useState } from "react";
import "./estilos.css";

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

const INITIAL_USERS: Usuario[] = [
    { id_usuario: 1, nombre: "Juan", apellido_paterno: "Pérez", apellido_materno: "García", correo: "juan@example.com", rol: "usuario", estado_registro: "aprobado", activo: 1, fecha_registro: "2026-04-22 15:40:33" },
    { id_usuario: 2, nombre: "Maria", apellido_paterno: "López", apellido_materno: "Martínez", correo: "maria@example.com", rol: "usuario", estado_registro: "aprobado", activo: 1, fecha_registro: "2026-04-22 15:40:33" },
    { id_usuario: 3, nombre: "Jostin", apellido_paterno: "Admin", apellido_materno: "Sistema", correo: "admin@markito.com", rol: "admin", estado_registro: "aprobado", activo: 1, fecha_registro: "2026-04-22 15:40:33" },
];

export default function HomeAdmin() {
    const [users, setUsers] = useState<Usuario[]>(INITIAL_USERS);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<Partial<Usuario> | null>(null);

    const handleLogout = () => {
        if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            localStorage.removeItem("userToken");
            window.location.replace("/login");
        }
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Eliminar este usuario?")) {
            setUsers(users.filter(u => u.id_usuario !== id));
        }
    };

    const openModal = (user: Usuario | null = null) => {
        setCurrentUser(user || {
            nombre: "",
            apellido_paterno: "",
            apellido_materno: "",
            correo: "",
            rol: "usuario",
            estado_registro: "pendiente",
            activo: 1
        });
        setIsModalOpen(true);
    };

    // ✅ CORREGIDO LÍNEA 123: Función saveUser ahora está correctamente definida dentro del componente
    const saveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        if (currentUser.id_usuario) {
            // Editar usuario existente
            setUsers(users.map(u => u.id_usuario === currentUser.id_usuario ? (currentUser as Usuario) : u));
        } else {
            // ✅ CORREGIDO LÍNEA 64: Ahora fecha_registro es un string, no un array
            const nuevoUsuario: Usuario = {
                ...(currentUser as Usuario),
                id_usuario: Date.now(),
                fecha_registro: new Date().toISOString().split('T')[0] + " " + new Date().toLocaleTimeString()
            };
            setUsers([...users, nuevoUsuario]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="admin-wrapper">
            <header className="admin-header">
                <div className="brand">
                    <h1>Panel Administrativo</h1>
                    <span>Tabla: usuario</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión 🚪
                </button>
            </header>

            <main className="content">
                <div className="table-actions">
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
            </main>

            {isModalOpen && currentUser && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2>{currentUser.id_usuario ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                        <form onSubmit={saveUser}>
                            <div className="form-group">
                                <input
                                    placeholder="Nombre"
                                    value={currentUser.nombre || ""}
                                    onChange={e => setCurrentUser({ ...currentUser, nombre: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Apellido Paterno"
                                    value={currentUser.apellido_paterno || ""}
                                    onChange={e => setCurrentUser({ ...currentUser, apellido_paterno: e.target.value })}
                                    required
                                />
                                <input
                                    placeholder="Correo Electrónico"
                                    type="email"
                                    value={currentUser.correo || ""}
                                    onChange={e => setCurrentUser({ ...currentUser, correo: e.target.value })}
                                    required
                                />
                                <select
                                    value={currentUser.rol}
                                    onChange={e => setCurrentUser({ ...currentUser, rol: e.target.value as any })}
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