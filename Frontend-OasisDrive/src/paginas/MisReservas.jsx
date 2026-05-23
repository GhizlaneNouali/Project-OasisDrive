import { useEffect, useState } from "react"
import { obtenerReservasUsuario, cancelarReserva } from "../servicios/reservaServicio"
import ReservaCard from "../componentes/reservas/ReservaCard"
import { Link, useNavigate } from "react-router-dom"
import Toast from "../componentes/notificaciones/Toast"
import { useNotificacion } from "../hooks/useNotificacion"

function MisReservas() {

  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { notificacion, mostrarNotificacion, cerrarNotificacion } = useNotificacion()

  useEffect(() => {
    cargarReservas()
  }, [])

  const cargarReservas = async () => {
    try {
      setLoading(true)

      const usuario = JSON.parse(localStorage.getItem("usuario"))
      
      if (!usuario) {
        navigate('/login')
        return
      }

      const data = await obtenerReservasUsuario(usuario.id)
      setReservas(data)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelar = async (id) => {
    try {
      await cancelarReserva(id)
      setReservas((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, estado: "CANCELADA" } : r
        )
      )
    } catch (err) {
      mostrarNotificacion(err.message, 'error')
    }
  }

  if (loading) return <p className="p-6 text-center">Cargando reservas...</p>
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toast
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        onClose={cerrarNotificacion}
      />

      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mis reservas
          </h1>
          <p className="text-gray-600">Gestiona tus alquileres de vehículos</p>
        </div>

        {reservas.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">
              No tienes reservas aún
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition"
            >
              Explorar vehículos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservas.map((reserva) => (
              <ReservaCard 
                key={reserva.id} 
                reserva={reserva} 
                onCancel={cancelar}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  )
}

export default MisReservas