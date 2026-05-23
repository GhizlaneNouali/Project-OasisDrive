import { useCallback, useEffect, useState } from 'react'

export function useNotificacion() {
  const [notificacion, setNotificacion] = useState({ mensaje: '', tipo: 'success' })

  const mostrarNotificacion = useCallback((mensaje, tipo = 'success') => {
    setNotificacion({ mensaje, tipo })
  }, [])

  const cerrarNotificacion = useCallback(() => {
    setNotificacion({ mensaje: '', tipo: 'success' })
  }, [])

  useEffect(() => {
    if (!notificacion.mensaje) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      cerrarNotificacion()
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [notificacion.mensaje, cerrarNotificacion])

  return {
    notificacion,
    mostrarNotificacion,
    cerrarNotificacion
  }
}