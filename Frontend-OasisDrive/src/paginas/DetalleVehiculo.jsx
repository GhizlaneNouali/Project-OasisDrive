import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { obtenerVehiculo } from "../servicios/vehiculoServicio"
import { crearReserva } from "../servicios/reservaServicio"
import { obtenerSrcImagen } from "../servicios/imagenServicio"

import Toast from "../componentes/notificaciones/Toast"
import { useNotificacion } from "../hooks/useNotificacion"

import CocheDetalleInfo from "../componentes/coches/CocheDetalleInfo"
import ReservaForm from "../componentes/reservas/ReservaForm"
import ValoracionesCoche from "../componentes/valoraciones/ValoracionesCoche"

function DetalleVehiculo() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [coche, setCoche] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { notificacion, mostrarNotificacion, cerrarNotificacion } =
    useNotificacion()

  useEffect(() => {
    const init = async () => {
      try {
        const data = await obtenerVehiculo(id)
        setCoche(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [id])

  const reservar = async (inicio, fin) => {
    const usuario = JSON.parse(localStorage.getItem("usuario"))

    if (!usuario) {
      navigate("/login")
      return
    }

    try {
      await crearReserva(usuario.id, coche.id, inicio, fin)
      mostrarNotificacion("Reserva creada", "success")
      navigate("/mis-reservas")
    } catch (err) {
      mostrarNotificacion(err.message, "error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Cargando vehículo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-white">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      <Toast
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        onClose={cerrarNotificacion}
      />

      {/* HERO */}
      <div className="relative">

        <div className="h-[520px] w-full overflow-hidden">
          <img
            src={obtenerSrcImagen(
              coche.imagen_url,
              "https://via.placeholder.com/900x500"
            )}
            alt={`${coche.marca} ${coche.modelo}`}
            className="w-full h-full object-cover scale-105"
          />

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        {/* HERO INFO */}
        <div className="absolute bottom-10 left-0 right-0">
          <div className="max-w-6xl mx-auto px-6">

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

              <div>

                <span className={`inline-flex px-4 py-1 rounded-full text-sm font-semibold mb-4 ${coche.disponible
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-red-500/20 text-red-300 border border-red-400/30"
                  }`}>
                  {coche.disponible ? "Disponible ahora" : "No disponible"}
                </span>

                <h1 className="text-4xl lg:text-5xl font-black">
                  {coche.marca}{" "}
                  <span className="text-cyan-400">
                    {coche.modelo}
                  </span>
                </h1>

                <p className="text-gray-400 mt-2">
                  Vehículo premium disponible para alquiler
                </p>

              </div>

            </div>

          </div>
        </div>

      </div>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-3 gap-10">

          {/* INFO */}
          <div className="lg:col-span-2">

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
              <CocheDetalleInfo coche={coche} />
            </div>

          </div>

          {/* RESERVA */}
          <aside className="lg:col-span-1">

            <div className="sticky top-6">

              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">

                <ReservaForm
                  coche={coche}
                  onReservar={reservar}
                />

              </div>

            </div>

          </aside>

        </div>
        <ValoracionesCoche cocheId={coche.id} />

      </main>

    </div>
  )
}

export default DetalleVehiculo