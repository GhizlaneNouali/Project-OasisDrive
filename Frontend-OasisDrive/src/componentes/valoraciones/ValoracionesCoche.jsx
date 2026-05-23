import { useEffect, useState } from "react"
import { obtenerValoracionesCoche } from "../../servicios/valoracionServicio"
import { Star, MessageSquare, TrendingUp, Award } from "lucide-react"

function EstrellasPuntuacion({ puntuacion, size = 16, className = "" }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < puntuacion ? "currentColor" : "none"}
          strokeWidth={1.5}
          className={
            i < puntuacion
              ? "text-amber-400"
              : "text-white/20"
          }
        />
      ))}
    </div>
  )
}

function BarraDistribucion({ puntuacion, cantidad, total }) {
  const porcentaje = total > 0 ? (cantidad / total) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-3 text-right">{puntuacion}</span>
      <Star size={10} fill="currentColor" className="text-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-4 text-right">{cantidad}</span>
    </div>
  )
}

function AvatarInicial({ nombre }) {
  const inicial = nombre ? nombre.charAt(0).toUpperCase() : "?"
  const colores = [
    "from-cyan-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ]
  const color = colores[inicial.charCodeAt(0) % colores.length]

  return (
    <div
      className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg`}
    >
      {inicial}
    </div>
  )
}

function TarjetaValoracion({ valoracion, index }) {
  return (
    <div
      className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-5 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Línea decorativa de puntuación */}
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-amber-400/60 to-amber-400/10"
        style={{ opacity: valoracion.puntuacion >= 4 ? 1 : 0.4 }}
      />

      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <AvatarInicial nombre={valoracion.usuario?.nombre} />
          <div>
            <p className="text-sm font-semibold text-white leading-tight">
              {valoracion.usuario?.nombre || "Usuario anónimo"}
            </p>
            {valoracion.fecha && (
              <p className="text-xs text-gray-500 mt-0.5">
                {new Date(valoracion.fecha).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <EstrellasPuntuacion puntuacion={valoracion.puntuacion} size={14} />
          <span className="text-xs font-bold text-amber-400">
            {valoracion.puntuacion}/5
          </span>
        </div>
      </div>

      {valoracion.comentario && (
        <p className="text-sm text-gray-300 leading-relaxed pl-0 border-t border-white/[0.06] pt-3 mt-3">
          {valoracion.comentario}
        </p>
      )}
    </div>
  )
}

export default function ValoracionesCoche({ cocheId }) {
  const [valoraciones, setValoraciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerValoracionesCoche(cocheId)
        setValoraciones(data)
      } catch (error) {
        console.error("Error cargando valoraciones:", error)
      } finally {
        setLoading(false)
      }
    }
    if (cocheId) cargar()
  }, [cocheId])

  // Estadísticas calculadas
  const promedio =
    valoraciones.length > 0
      ? valoraciones.reduce((acc, v) => acc + v.puntuacion, 0) / valoraciones.length
      : 0

  const distribucion = [5, 4, 3, 2, 1].map((p) => ({
    puntuacion: p,
    cantidad: valoraciones.filter((v) => v.puntuacion === p).length,
  }))

  const mejorValoracion = valoraciones.length > 0
    ? Math.max(...valoraciones.map((v) => v.puntuacion))
    : 0

  if (loading) {
    return (
      <div className="mt-10 flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Cargando opiniones...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="mt-10 lg:col-span-3">

      {/* Cabecera */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-cyan-400/20" />
        <h2 className="text-2xl font-bold text-white">Opiniones del vehículo</h2>
        {valoraciones.length > 0 && (
          <span className="ml-auto text-xs bg-white/10 text-gray-400 px-3 py-1 rounded-full">
            {valoraciones.length} {valoraciones.length === 1 ? "reseña" : "reseñas"}
          </span>
        )}
      </div>

      {valoraciones.length === 0 ? (
        /* Estado vacío */
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-12 flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <MessageSquare size={24} className="text-gray-500" />
          </div>
          <div>
            <p className="text-white font-semibold mb-1">Sin valoraciones todavía</p>
            <p className="text-sm text-gray-500">
              Sé el primero en compartir tu experiencia con este vehículo
            </p>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Panel resumen izquierda */}
          <div className="lg:col-span-1 space-y-4">

            {/* Puntuación global */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col items-center text-center">
              <p className="text-6xl font-black text-white tracking-tight">
                {promedio.toFixed(1)}
              </p>
              <EstrellasPuntuacion puntuacion={Math.round(promedio)} size={20} className="mt-2" />
              <p className="text-xs text-gray-500 mt-2">
                Basado en {valoraciones.length} {valoraciones.length === 1 ? "reseña" : "reseñas"}
              </p>
            </div>

            {/* Distribución */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-2.5">
              {distribucion.map(({ puntuacion, cantidad }) => (
                <BarraDistribucion
                  key={puntuacion}
                  puntuacion={puntuacion}
                  cantidad={cantidad}
                  total={valoraciones.length}
                />
              ))}
            </div>

            {/* Badges de métricas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex flex-col items-center gap-1">
                <TrendingUp size={18} className="text-cyan-400" />
                <p className="text-lg font-bold text-white">{promedio.toFixed(1)}</p>
                <p className="text-[10px] text-gray-500 text-center">Promedio</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 flex flex-col items-center gap-1">
                <Award size={18} className="text-amber-400" />
                <p className="text-lg font-bold text-white">{mejorValoracion}/5</p>
                <p className="text-[10px] text-gray-500 text-center">Mejor nota</p>
              </div>
            </div>
          </div>

          {/* Lista de reseñas */}
          <div className="lg:col-span-2 space-y-3">
            {valoraciones.map((v, i) => (
              <TarjetaValoracion key={v.id} valoracion={v} index={i} />
            ))}
          </div>

        </div>
      )}
    </section>
  )
}