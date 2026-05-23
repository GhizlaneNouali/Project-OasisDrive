function CocheDetalleInfo({ coche }) {
  return (
    <div className="space-y-6 text-white">

      {/* TITULO */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-black leading-tight">
          {coche.marca}{" "}
          <span className="text-cyan-400">
            {coche.modelo}
          </span>
        </h1>

        <p className="text-gray-400 mt-2">
          {coche.anio} • {coche.kilometros} km
        </p>
      </div>

      {/* PRECIO */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/20 rounded-2xl p-5 backdrop-blur-xl">

        <p className="text-sm text-gray-300 mb-1">
          Precio por día
        </p>

        <p className="text-3xl font-black text-white">
          {coche.precio_dia}€
          <span className="text-lg text-gray-400 font-medium">
            {" "} / día
          </span>
        </p>

      </div>

      {/* DETALLES */}
      <div className="grid grid-cols-2 gap-3 text-sm">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-xs">Marca</p>
          <p className="font-semibold text-white">{coche.marca}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-xs">Modelo</p>
          <p className="font-semibold text-white">{coche.modelo}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-xs">Año</p>
          <p className="font-semibold text-white">{coche.anio}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-gray-400 text-xs">Color</p>
          <p className="font-semibold text-white">{coche.color}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 col-span-2">
          <p className="text-gray-400 text-xs">Matrícula</p>
          <p className="font-semibold text-white tracking-wider">
            {coche.matricula}
          </p>
        </div>

        <div className="col-span-2">
          <div className={`rounded-2xl p-4 border ${
            coche.disponible
              ? "bg-emerald-500/10 border-emerald-400/20 text-emerald-300"
              : "bg-red-500/10 border-red-400/20 text-red-300"
          }`}>
            <p className="font-semibold text-sm">
              {coche.disponible ? "✓ Disponible" : "✗ No disponible"}
            </p>
          </div>
        </div>

      </div>

    </div>
  )
}

export default CocheDetalleInfo