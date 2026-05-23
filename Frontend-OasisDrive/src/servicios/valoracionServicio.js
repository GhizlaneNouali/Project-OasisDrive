const API_URL = '/api';

export const crearValoracion = async (idUsuario, idCoche, puntuacion, comentario) => {
    const response = await fetch(`${API_URL}/valoraciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario, idCoche, puntuacion, comentario })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear valoración');
    }

    const data = await response.json();
    return data.valoracion;
};

export const obtenerValoracionesUsuario = async (idUsuario) => {
    const response = await fetch(`${API_URL}/valoraciones/usuario/${idUsuario}`);

    if (!response.ok) {
        throw new Error('Error obteniendo valoraciones');
    }

    return response.json();
};

export const obtenerValoracionesCoche = async (idCoche) => {
    const response = await fetch(`${API_URL}/valoraciones/coche/${idCoche}`);

    if (!response.ok) {
        throw new Error('Error obteniendo valoraciones');
    }

    return response.json();
};

export const obtenerPromedioCoche = async (idCoche) => {
    const response = await fetch(`${API_URL}/valoraciones/coche/${idCoche}/promedio`);

    if (!response.ok) {
        throw new Error('Error obteniendo promedio');
    }

    const data = await response.json();
    return data.puntuacionPromedio;
};

export const actualizarValoracion = async (id, puntuacion, comentario) => {
    const response = await fetch(`${API_URL}/valoraciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puntuacion, comentario })
    });

    if (!response.ok) {
        throw new Error('Error actualizando valoración');
    }

    const data = await response.json();
    return data.valoracion;
};

export const obtenerTodasValoraciones = async () => {
    const response = await fetch(`${API_URL}/valoraciones`);

    if (!response.ok) {
        throw new Error('Error obteniendo todas las valoraciones');
    }

    return response.json();
};

export const eliminarValoracion = async (id) => {
    const response = await fetch(`${API_URL}/valoraciones/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Error eliminando valoración');
    }

    return response.json();
};