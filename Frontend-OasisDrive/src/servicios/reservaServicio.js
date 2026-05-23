const API_URL = '/api'

export const crearReserva = async (idUsuario, idCoche, fechaInicio, fechaFin) => {
    const response = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${API_URL}/reservas/usuario/${idUsuario}`)
    if (!response.ok) throw new Error('Error obteniendo reservas')
    return response.json()
}

export const obtenerReserva = async (id) => {
    const response = await fetch(`${API_URL}/reservas/${id}`)
    if (!response.ok) throw new Error('Reserva no encontrada')
    return response.json()
}

export const cancelarReserva = async (id) => {
    const response = await fetch(`${API_URL}/reservas/${id}`, { method: 'DELETE' })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error cancelando reserva')
    }
    const data = await response.json()
    return data.reserva
}

export const finalizarReserva = async (id) => {
    const response = await fetch(`${API_URL}/reservas/${id}/finalizar`, { method: 'PUT' })
    if (!response.ok) throw new Error('Error finalizando reserva')
    const data = await response.json()
    return data.reserva
}

export const obtenerTodasReservas = async () => {
    const response = await fetch(`${API_URL}/reservas`)
    if (!response.ok) throw new Error('No se pudieron obtener las reservas')
    return response.json()
}