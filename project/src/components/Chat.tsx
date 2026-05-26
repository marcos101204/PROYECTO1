import React, { useEffect, useState, useRef } from 'react';

interface ChatProps {
    currentUserId: number;
    vendorId: number;
    productId?: number | null;
    convId?: number | null;
    onClose: () => void;
}

interface Mensaje {
    id_mensaje: number;
    id_conversacion: number;
    id_emisor: number;
    texto: string;
    tipo: string;
    url_media?: string;
    fecha_creacion: string;
    nombre_emisor?: string;
    avatar_url?: string;
}

const API_BASE = 'http://localhost/PROYECTO1/project/conexion';

export default function Chat({ currentUserId, vendorId, productId = null, convId: initialConvId = null, onClose }: ChatProps) {
    const [convId, setConvId] = useState<number | null>(null);
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [texto, setTexto] = useState('');
    const [loading, setLoading] = useState(true);
    const pollingRef = useRef<number | null>(null);
    const lastFetchRef = useRef<string | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Si se pasó un convId inicial, usarlo; si no, crear/recuperar conversación
        const createConv = async () => {
            if (initialConvId) {
                setConvId(initialConvId);
                setLoading(false);
                return;
            }
            const res = await fetch(`${API_BASE}/mensajes.php?action=create_conversation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user1: currentUserId, user2: vendorId, id_producto: productId })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setConvId(Number(data.id_conversacion));
            }
            setLoading(false);
        };
        createConv();
        return () => { if (pollingRef.current) window.clearInterval(pollingRef.current); };
    }, [currentUserId, vendorId, productId, initialConvId]);

    useEffect(() => {
        if (!convId) return;
        const fetchAll = async () => {
            try {
                const res = await fetch(`${API_BASE}/mensajes.php?action=get_messages&conv=${convId}`);
                const data = await res.json();
                if (data.status === 'success') {
                    setMensajes(data.data || []);
                    if ((data.data || []).length > 0) lastFetchRef.current = (data.data || [])[ (data.data || []).length -1 ].fecha_creacion;
                    // scroll
                    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 80);
                }
            } catch (e) { console.error(e); }
        };
        fetchAll();

        // polling cada 2.5s
        pollingRef.current = window.setInterval(async () => {
            try {
                const since = lastFetchRef.current ? `&since=${encodeURIComponent(lastFetchRef.current)}` : '';
                const res = await fetch(`${API_BASE}/mensajes.php?action=get_messages&conv=${convId}${since}`);
                const data = await res.json();
                if (data.status === 'success' && data.data && data.data.length) {
                    // merge and deduplicate by id_mensaje
                    setMensajes((prev) => {
                        const combined = [...prev, ...data.data];
                        const seen = new Set<number>();
                        const deduped: any[] = [];
                        for (const m of combined) {
                            const id = Number(m.id_mensaje ?? m.id_mensaje);
                            if (!seen.has(id)) { seen.add(id); deduped.push(m); }
                        }
                        return deduped;
                    });
                    lastFetchRef.current = data.data[data.data.length - 1].fecha_creacion;
                    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);
                }
            } catch (e) { console.error(e); }
        }, 2500);

        return () => { if (pollingRef.current) window.clearInterval(pollingRef.current); };
    }, [convId]);

    const handleSend = async () => {
        if (!convId || texto.trim() === '') return;
        const body = { id_conversacion: convId, id_emisor: currentUserId, texto: texto.trim() };
        try {
            const res = await fetch(`${API_BASE}/mensajes.php?action=send_message`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.status === 'success' && data.message) {
                setMensajes((prev) => {
                    const combined = [...prev, data.message];
                    const seen = new Set<number>();
                    const deduped: any[] = [];
                    for (const m of combined) {
                        const id = Number(m.id_mensaje ?? m.id_mensaje);
                        if (!seen.has(id)) { seen.add(id); deduped.push(m); }
                    }
                    return deduped;
                });
                setTexto('');
                setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50);
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div style={{ maxWidth: 720, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Chat con vendedor</h3>
                <button onClick={onClose} style={{ background: '#f0ebe4', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>Cerrar</button>
            </div>

            <div ref={listRef} style={{ height: 340, overflowY: 'auto', border: '1px solid #eee', borderRadius: 12, padding: 12, background: 'white', marginBottom: 12 }}>
                {loading ? <p style={{ color: '#888' }}>Cargando conversación...</p> : (
                    mensajes.length === 0 ? <p style={{ color: '#888' }}>No hay mensajes aún. Envía el primero.</p>
                    : mensajes.map((m: Mensaje) => (
                        <div key={m.id_mensaje} style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-end', justifyContent: m.id_emisor === currentUserId ? 'flex-end' : 'flex-start' }}>
                            {m.id_emisor !== currentUserId && (
                                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden' }}>
                                    {m.avatar_url ? <img src={m.avatar_url} alt="a" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#ff6b35,#f7931e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{(m.nombre_emisor||'U').charAt(0).toUpperCase()}</div>}
                                </div>
                            )}
                            <div style={{ maxWidth: '75%', background: m.id_emisor === currentUserId ? '#e8f8ff' : '#f7f2ee', padding: '10px 12px', borderRadius: 12 }}>
                                <div style={{ fontSize: 13, color: '#222' }}>{m.texto}</div>
                                <div style={{ fontSize: 11, color: '#9a8f85', marginTop: 6 }}>{new Date(m.fecha_creacion).toLocaleString()}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
                <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe un mensaje..." style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '1px solid #e6ded4' }} />
                <button onClick={handleSend} style={{ background: '#ff6b35', color: 'white', border: 'none', padding: '10px 14px', borderRadius: 10 }}>Enviar</button>
            </div>
        </div>
    );
}
