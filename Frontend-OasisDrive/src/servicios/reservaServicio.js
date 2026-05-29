const API_URL = '/api'

const authHeaders = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario')) || null;
    const headers = { 'Content-Type': 'application/json' };
    if (usuario && usuario.rol) headers['X-User-Role'] = usuario.rol;
    if (usuario && usuario.id) headers['X-User-Id'] = usuario.id;
    return headers;
}

export const crearReserva = async (idUsuario, idCoche, fechaInicio, fechaFin) => {
    const response = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ idUsuario, idCoche, fechaInicio, fechaFin })
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear reserva')
    }
    const data = await response.json()
    return data.reserva
}

export const obtenerReservasUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/reservas/usuario/${idUsuario}`, { headers: authHeaders() })
    if (!response.ok) throw new Error('Error obteniendo reservas')
    return response.json()
}

export const obtenerReserva = async (id) => {
    const response = await fetch(`${API_URL}/reservas/${id}`, { headers: authHeaders() })
    if (!response.ok) throw new Error('Reserva no encontrada')
    return response.json()
}

export const cancelarReserva = async (id) => {
    const response = await fetch(`${API_URL}/reservas/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error cancelando reserva')
    }
    const data = await response.json()
    return data.reserva
}

export const finalizarReserva = async (id) => {
    const usuario = JSON.parse(localStorage.getItem('usuario')) || null;
    const headers = { 'Content-Type': 'application/json' };
    if (usuario && usuario.rol) headers['X-User-Role'] = usuario.rol;
    if (usuario && usuario.id) headers['X-User-Id'] = usuario.id;

    const response = await fetch(`${API_URL}/reservas/${id}/finalizar`, { method: 'PUT', headers })
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Error finalizando reserva')
    }
    const data = await response.json()
    return data.reserva
}

export const obtenerTodasReservas = async () => {
    const response = await fetch(`${API_URL}/reservas`, { headers: authHeaders() })
    if (!response.ok) throw new Error('No se pudieron obtener las reservas')
    return response.json()
}