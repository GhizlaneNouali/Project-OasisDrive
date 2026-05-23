import { Link } from "react-router-dom"
import { Calendar, CreditCard, CarFront } from "lucide-react"

function ReservaCard({ reserva }) {

  const estadoColor = {
    CONFIRMADA: "bg-emerald-500/10 text-emerald-300 border-emerald-400/20",
    CANCELADA: "bg-red-500/10 text-red-300 border-red-400/20",
    FINALIZADA: "bg-blue-500/10 text-blue-300 border-blue-400/20"
  }

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 min-h-[240px] hover:border-cyan-400/30 transition-all duration-300">

      <div className="flex flex-col md:flex-row md:items-stretch justify-between gap-6 h-full">

        {/* LEFT */}
        <div className="space-y-4 flex-1 min-w-0">

          {/* TITLE + STATUS */}
          <div className="flex items-center gap-3 flex-wrap">

            <div className="flex items-center gap-2 text-white font-bold text-lg min-w-0">
              <CarFront className="w-5 h-5 text-cyan-300" />
              <span className="truncate">
                {reserva.coche.marca} {reserva.coche.modelo}
              </span>
            </div>

            <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${estadoColor[reserva.estado]}`}>
              {reserva.estado}
            </span>

          </div>

          {/* DATES */}
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-300">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 min-h-[80px]">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Calendar className="w-4 h-4" />
                Inicio
              </div>
              <p className="font-semibold text-white">
                {new Date(reserva.fecha_inicio).toLocaleDateString("es-ES")}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 min-h-[80px]">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                <Calendar className="w-4 h-4" />
                Fin
              </div>
              <p className="font-semibold text-white">
                {new Date(reserva.fecha_fin).toLocaleDateString("es-ES")}
              </p>
            </div>

          </div>

          {/* PRICE */}
          <div className="flex items-center gap-2 text-sm">

            <CreditCard className="w-4 h-4 text-cyan-300" />

            <span className="text-gray-400">Total:</span>

            <span className="text-white font-black text-lg">
              {reserva.precio_total}€
            </span>

          </div>

        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 md:items-start">

          <Link
            to={`/vehiculos/${reserva.coche.id}`}
            className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-gray-200 hover:border-cyan-400/30 hover:text-cyan-300 transition text-sm text-center"
          >
            Ver vehículo
          </Link>

          <Link
            to={`/reservas/${reserva.id}`}
            className="px-5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition text-sm text-center shadow-lg"
          >
            Detalles
          </Link>

        </div>

      </div>
    </div>
  )
}

export default ReservaCard