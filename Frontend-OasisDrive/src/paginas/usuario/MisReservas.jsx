import { useEffect, useState } from "react"
import { obtenerReservasUsuario } from "../../servicios/reservaServicio"
import ReservaCard from "../../componentes/reservas/ReservaCard"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

function MisReservas() {

  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const init = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario"))

        if (!usuario) {
          navigate("/login")
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

    init()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        <p className="text-gray-300">Cargando reservas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER IGUAL QUE VALORACIONES */}
        <div className="flex items-center gap-4">

          <Link
            to="/perfil"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-3xl font-black">
              Mis reservas
            </h1>
            <p className="text-gray-400 text-sm">
              Gestiona y revisa todos tus alquileres de vehículos
            </p>
          </div>

        </div>

        {/* CONTENT */}
        {reservas.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
            <p className="text-gray-400 text-lg">
              No tienes reservas todavía
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {reservas.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default MisReservas