const API_URL = '/api'

const authHeaders = (json = true) => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || null
  const headers = {}
  if (json) headers['Content-Type'] = 'application/json'
  if (usuario?.rol) headers['X-User-Role'] = usuario.rol
  if (usuario?.id) headers['X-User-Id'] = usuario.id
  return headers
}

export const buildVehiculoPayload = (form, imagen_url) => ({
  marca: form.marca?.trim(),
  modelo: form.modelo?.trim(),
  matricula: form.matricula?.trim(),
  anio: Number(form.anio),
  color: form.color?.trim(),
  kilometros: Number(form.kilometros),
  precio_dia: Number(form.precio),
  imagen_url,
})

// OBTENER TODOS LOS COCHES

export const obtenerVehiculos = async () => {
    const response = await fetch(`${API_URL}/coches`)
    if (!response.ok) throw new Error('Error obteniendo vehículos')
    return response.json()
}

// OBTENER VEHÍCULOS ACTIVOS

export const obtenerVehiculosActivos = async () => {
  const response = await fetch(`${API_URL}/coches/activos/lista`)
  if (!response.ok) throw new Error('Error obteniendo vehículos activos')
  return response.json()
}

// OBTENER VEHÍCULO POR ID

export const obtenerVehiculo = async (id) => {
    const response = await fetch(`${API_URL}/coches/${id}`)
    if (!response.ok) throw new Error('Vehículo no encontrado')
    return response.json()
}

// VEHÍCULOS DISPONIBLES

export const obtenerVehiculosDisponibles = async () => {
    const response = await fetch(`${API_URL}/coches/disponibles/lista`)
    if (!response.ok) throw new Error('Error obteniendo vehículos')
    return response.json()
}

// FILTRAR POR MARCA

export const obtenerVehiculosMarca = async (marca) => {
    const response = await fetch(`${API_URL}/coches/marca/${marca}`)
    if (!response.ok) throw new Error('Error filtrando vehículos')
    return response.json()
}

// FILTRAR POR PRECIO

export const obtenerVehiculosPrecio = async (min, max) => {
    const response = await fetch(`${API_URL}/coches/precio?min=${min}&max=${max}`)
    if (!response.ok) throw new Error('Error filtrando por precio')
    return response.json()
}

// CREAR VEHÍCULO

export const crearVehiculo = async (vehiculo) => {
  const response = await fetch(`${API_URL}/coches`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(vehiculo)
  })

  if (!response.ok) {
    let errorMsg = 'Error al crear vehículo'
    try {
      const errorData = await response.json()
      errorMsg = errorData.error || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }

  return response.json()
}

// ACTUALIZAR VEHÍCULO

export const actualizarVehiculo = async (id, vehiculo) => {
  const response = await fetch(`${API_URL}/coches/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(vehiculo)
  })

  if (!response.ok) {
    let errorMsg = 'Error actualizando vehículo'
    try {
      const errorData = await response.json()
      errorMsg = errorData.error || errorMsg
    } catch {}
    throw new Error(errorMsg)
  }

  const data = await response.json()
  return data.coche
}

// ELIMINAR VEHÍCULO

export const eliminarVehiculo = async (id) => {
    const response = await fetch(
        `${API_URL}/coches/${id}`,
        {
            method: 'DELETE',
            headers: authHeaders()
        }
    )

    if (!response.ok) {
        let errorMsg = 'Error eliminando vehículo'
        try {
            const errorData = await response.json()
            errorMsg = errorData.error || errorMsg
        } catch {}
        throw new Error(errorMsg)
    }

    const data = await response.json()
    return data.coche || true
  }

  // ACTIVAR VEHÍCULO

  export const activarVehiculo = async (id) => {
    const response = await fetch(`${API_URL}/coches/${id}/activar`, {
      method: 'PUT',
      headers: authHeaders()
    })

    if (!response.ok) {
      let errorMsg = 'Error activando vehículo'
      try {
        const errorData = await response.json()
        errorMsg = errorData.error || errorMsg
      } catch {}
      throw new Error(errorMsg)
    }

    const data = await response.json()
    return data.coche
}

// SUBIR IMAGEN VEHÍCULO

export const subirImagenVehiculo = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/coches/upload`, {
    method: 'POST',
    headers: authHeaders(false),
    body: formData
  })

  if (!response.ok) throw new Error('Error al subir la imagen')

  const data = await response.json()
  if (!data.url) throw new Error('No se recibió la URL de la imagen')
  return data.url
}