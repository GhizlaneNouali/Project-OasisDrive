const API_URL = '/api'

// LOGIN

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
        throw new Error('Credenciales incorrectas')
    }

    const data = await response.json()
    return data.usuario
}

// REGISTRO

export const registro = async (usuario) => {
    const response = await fetch(`${API_URL}/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al registrar usuario')
    }

    const data = await response.json()
    return data.usuario
}

// OBTENER USUARIO

export const obtenerUsuario = async (id) => {

    const response = await fetch(
        `${API_URL}/usuarios/${id}`
    )

    if (!response.ok) {
        throw new Error('Usuario no encontrado')
    }

    return response.json()
}

// ACTUALIZAR USUARIO

export const actualizarUsuario = async (id, datos) => {

    const response = await fetch(
        `${API_URL}/usuarios/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        }
    )

    if (!response.ok) {
        throw new Error('Error al actualizar usuario')
    }

    return response.json()
}

// CAMBIAR PASSWORD

export const cambiarPassword = async (
    id,
    nuevaPassword
) => {

    const usuario = await obtenerUsuario(id)

    const response = await fetch(
        `${API_URL}/usuarios/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...usuario,
                password: nuevaPassword
            })
        }
    )

    if (!response.ok) {
        throw new Error('Error al cambiar contraseña')
    }

    return response.json()
}

// LOGOUT

export const logout = () => {

    localStorage.removeItem('usuario')
    window.dispatchEvent(new Event('usuario-changed'))
}

// GUARDAR USUARIO

export const guardarUsuario = (usuario) => {

    localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
    )

    window.dispatchEvent(new Event('usuario-changed'))
}

// OBTENER USUARIO STORAGE

export const obtenerUsuarioStorage = () => {

    const usuario = localStorage.getItem('usuario')

    return usuario
        ? JSON.parse(usuario)
        : null
}

// VERIFICAR AUTH
export const estaAutenticado = () => {

    return !!localStorage.getItem('usuario')
}