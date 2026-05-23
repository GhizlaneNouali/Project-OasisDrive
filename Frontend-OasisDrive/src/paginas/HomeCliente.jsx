import { useEffect, useState } from "react"
import { Search, SlidersHorizontal, Sparkles } from "lucide-react"

import { obtenerVehiculosActivos } from "../servicios/vehiculoServicio"
import CocheCard from "../componentes/coches/CocheCard"
import FiltroSidebar from "../componentes/filtros/FiltroSidebar"

function HomeCliente() {

  const [coches, setCoches] = useState([])
  const [loading, setLoading] = useState(true)

  const [filtros, setFiltros] = useState({
    busqueda: "",
    marca: "",
    modelo: "",
    precioMin: "",
    precioMax: "",
    soloDisponibles: false,
    orden: ""
  })

  useEffect(() => {
    cargarCoches()
  }, [])

  const cargarCoches = async () => {
    setLoading(true)
    const data = await obtenerVehiculosActivos()
    setCoches(data)
    setLoading(false)
  }

  const cochesFiltrados = coches.filter((coche) => {
    const b = filtros.busqueda.toLowerCase()

    return (
      (coche.marca + coche.modelo).toLowerCase().includes(b) &&
      (filtros.marca === "" || coche.marca.toLowerCase() === filtros.marca.toLowerCase()) &&
      (filtros.modelo === "" || coche.modelo.toLowerCase().includes(filtros.modelo.toLowerCase())) &&
      (filtros.precioMin === "" || coche.precio_dia >= Number(filtros.precioMin)) &&
      (filtros.precioMax === "" || coche.precio_dia <= Number(filtros.precioMax)) &&
      (coche.activo !== false) &&
      (!filtros.soloDisponibles || coche.disponible)
    )
  })

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full -top-32 -left-32" />
        <div className="absolute w-[400px] h-[400px] bg-yellow-400/20 blur-3xl rounded-full top-40 right-0" />
        <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full bottom-0 left-1/2" />
      </div>

      <div className="relative z-10">

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-10">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* LEFT */}
            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur px-4 py-2 rounded-full text-sm text-cyan-300 mb-6">
                <Sparkles className="w-4 h-4" />
                Premium Rent a Car Experience
              </div>

              <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
                Encuentra el coche perfecto para tu próximo viaje
              </h1>

              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Reserva vehículos premium de forma rápida, segura y elegante.
                Descubre una experiencia moderna de alquiler con Oasis Drive.
              </p>

              {/* SEARCH */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 max-w-xl shadow-2xl">

                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500">
                  <Search className="w-5 h-5 text-white" />
                </div>

                <input
                  type="text"
                  placeholder="Buscar por marca o modelo..."
                  value={filtros.busqueda}
                  onChange={(e) =>
                    setFiltros({
                      ...filtros,
                      busqueda: e.target.value
                    })
                  }
                  className="bg-transparent outline-none w-full text-white placeholder:text-gray-400"
                />

              </div>

            </div>

            {/* RIGHT CARD */}
            <div className="w-full max-w-sm">

              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)] border border-white/10">

                <p className="text-cyan-100 text-sm mb-2">
                  Vehículos disponibles
                </p>

                <h2 className="text-5xl font-black mb-6">
                  {cochesFiltrados.length}
                </h2>

                <div className="space-y-4">

                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                    <p className="text-sm text-cyan-100">
                      Reserva rápida
                    </p>
                    <p className="font-semibold">
                      Confirmación instantánea
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                    <p className="text-sm text-cyan-100">
                      Vehículos premium
                    </p>
                    <p className="font-semibold">
                      Deportivos, SUVs y lujo
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* MAIN CONTENT */}
        <section className="max-w-7xl mx-auto px-6 pb-16">

          <div className="grid lg:grid-cols-[320px_1fr] gap-8">

            {/* FILTERS */}
            <aside className="h-fit sticky top-6">

              <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Filtros
                    </h3>

                    <p className="text-sm text-gray-300">
                      Ajusta tu búsqueda
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <FiltroSidebar
                    filtros={filtros}
                    setFiltros={setFiltros}
                  />
                </div>

              </div>

            </aside>

            {/* VEHICLES */}
            <div className="space-y-6">

              {/* TOP BAR */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <p className="text-sm text-cyan-300">
                    Catálogo disponible
                  </p>

                  <h2 className="text-2xl font-bold">
                    Vehículos destacados
                  </h2>
                </div>

                <div className="bg-cyan-500/20 border border-cyan-400/20 px-5 py-2 rounded-xl">
                  <span className="font-semibold text-cyan-200">
                    {cochesFiltrados.length} resultados encontrados
                  </span>
                </div>

              </div>

              {/* LOADING */}
              {loading && (
                <div className="bg-white/10 border border-white/10 rounded-3xl py-20 text-center backdrop-blur-xl">
                  <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

                  <p className="text-gray-300 text-lg">
                    Cargando vehículos...
                  </p>
                </div>
              )}

              {/* EMPTY */}
              {!loading && cochesFiltrados.length === 0 && (
                <div className="bg-white/10 border border-white/10 rounded-3xl py-20 text-center backdrop-blur-xl">
                  <h3 className="text-2xl font-bold mb-3">
                    No hay resultados
                  </h3>

                  <p className="text-gray-400">
                    Prueba cambiando los filtros de búsqueda.
                  </p>
                </div>
              )}

              {/* GRID */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {cochesFiltrados.map((coche) => (
                  <CocheCard
                    key={coche.id}
                    coche={coche}
                  />
                ))}
              </div>

            </div>

          </div>

        </section>

      </div>
    </div>
  )
}

export default HomeCliente