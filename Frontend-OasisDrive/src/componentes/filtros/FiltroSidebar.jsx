import {
  Search,
  Car,
  Euro,
  RotateCcw,
  CheckCircle2,
} from "lucide-react"

function FiltroSidebar({ filtros, setFiltros }) {

  const update = (campo, valor) => {
    setFiltros({ ...filtros, [campo]: valor })
  }

  const reset = () => {
    setFiltros({
      busqueda: "",
      marca: "",
      modelo: "",
      precioMin: "",
      precioMax: "",
      soloDisponibles: false,
      orden: ""
    })
  }

  return (
    <div className="space-y-6 text-white">

      {/* HEADER */}
      <div>
        <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/20 px-3 py-2 rounded-xl mb-4">
          <Car className="w-4 h-4 text-cyan-300" />

          <span className="text-sm font-medium text-cyan-200">
            Oasis Drive
          </span>
        </div>

        <h2 className="text-2xl font-black mb-2">
          Filtrar vehículos
        </h2>

        <p className="text-sm text-gray-400 leading-relaxed">
          Encuentra rápidamente el coche ideal para tu viaje.
        </p>
      </div>

      {/* SEARCH */}
      <div className="space-y-2">

        <label className="text-sm text-gray-300 font-medium">
          Buscar
        </label>

        <div className="relative">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-300" />

          <input
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition text-white placeholder:text-gray-500"
            placeholder="Marca o modelo..."
            value={filtros.busqueda}
            onChange={(e) => update("busqueda", e.target.value)}
          />

        </div>

      </div>

      {/* BRAND / MODEL */}
      <div className="space-y-4">

        <div>
          <label className="text-sm text-gray-300 font-medium block mb-2">
            Marca
          </label>

          <input
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition text-white placeholder:text-gray-500"
            placeholder="Ej: BMW"
            value={filtros.marca}
            onChange={(e) => update("marca", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-300 font-medium block mb-2">
            Modelo
          </label>

          <input
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition text-white placeholder:text-gray-500"
            placeholder="Ej: Serie 3"
            value={filtros.modelo}
            onChange={(e) => update("modelo", e.target.value)}
          />
        </div>

      </div>

      {/* PRICE */}
      <div className="space-y-3">

        <div className="flex items-center gap-2">
          <Euro className="w-4 h-4 text-cyan-300" />

          <label className="text-sm text-gray-300 font-medium">
            Rango de precio
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">

          <input
            className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition text-white placeholder:text-gray-500"
            placeholder="Min €"
            type="number"
            value={filtros.precioMin}
            onChange={(e) => update("precioMin", e.target.value)}
          />

          <input
            className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition text-white placeholder:text-gray-500"
            placeholder="Max €"
            type="number"
            value={filtros.precioMax}
            onChange={(e) => update("precioMax", e.target.value)}
          />

        </div>

      </div>

      {/* CHECKBOX */}
      <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-cyan-400/30 transition">

        <input
          type="checkbox"
          checked={filtros.soloDisponibles}
          onChange={(e) => update("soloDisponibles", e.target.checked)}
          className="w-5 h-5 accent-cyan-500"
        />

        <div className="flex items-center gap-2">

          <CheckCircle2 className="w-4 h-4 text-emerald-400" />

          <span className="text-sm text-gray-200 font-medium">
            Mostrar solo disponibles
          </span>

        </div>

      </label>

      {/* RESET */}
      <button
        onClick={reset}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 font-semibold"
      >

        <RotateCcw className="w-4 h-4" />

        Resetear filtros

      </button>

    </div>
  )
}

export default FiltroSidebar