import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import { obtenerSrcImagen } from "../../servicios/imagenServicio"

function CocheCard({ coche }) {
  return (
    <Link
      to={`/vehiculos/${coche.id}`}
      className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
    >

      {/* IMAGE */}
      <div className="relative overflow-hidden h-56">

        <img
          src={obtenerSrcImagen(
            coche.imagen_url,
            "https://via.placeholder.com/300x200"
          )}
          alt={`${coche.marca} ${coche.modelo}`}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* STATUS */}
        <div className="absolute top-4 right-4">
          {coche.disponible ? (
            <div className="flex items-center gap-2 bg-emerald-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur">
              <CheckCircle2 className="w-4 h-4" />
              Disponible
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg backdrop-blur">
              <XCircle className="w-4 h-4" />
              No disponible
            </div>
          )}
        </div>

        {/* TITLE */}
        <div className="absolute bottom-4 left-4">
          <h2 className="text-2xl font-black text-white leading-tight">
            {coche.marca}
          </h2>

          <p className="text-gray-200">
            {coche.modelo}
          </p>
        </div>

      </div>

      {/* CONTENT */}
      <div className="p-5">

        {/* PRICE */}
        <div className="mb-5">
          <p className="text-sm text-gray-400">
            Precio por día
          </p>

          <h3 className="text-3xl font-black text-white">
            {coche.precio_dia}€
          </h3>
        </div>

        {/* BUTTON */}
        <div className="flex items-center justify-between">

          <span className="text-sm text-cyan-300 font-medium">
            Ver detalles
          </span>

          <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500 group-hover:bg-cyan-400 transition-all duration-300 shadow-lg">

            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />

          </div>

        </div>

      </div>

      {/* BORDER EFFECT */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <div className="absolute -inset-1 rounded-3xl border border-cyan-400/30" />
      </div>

    </Link>
  )
}

export default CocheCard