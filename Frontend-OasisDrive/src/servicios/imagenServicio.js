const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export const obtenerSrcImagen = (rutaImagen, fallback = 'https://via.placeholder.com/500x400') => {
  if (!rutaImagen) {
    return fallback
  }

  // Si es un blob URL (preview local)
  if (rutaImagen.startsWith('blob:')) {
    return rutaImagen
  }

  // Si es una URL absoluta HTTP/HTTPS
  if (rutaImagen.startsWith('http://') || rutaImagen.startsWith('https://')) {
    return rutaImagen
  }

  // Si es una ruta absoluta
  if (rutaImagen.startsWith('/')) {
    return `${API_BASE_URL}${rutaImagen}`
  }

  // Ruta relativa
  return `${API_BASE_URL}/${rutaImagen}`
}