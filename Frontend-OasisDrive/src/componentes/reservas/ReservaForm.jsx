import { useState, useEffect } from "react"
import { Calendar, Clock, AlertTriangle, Car } from "lucide-react"
import { obtenerTodasReservas } from "../../servicios/reservaServicio"

function ReservaForm({ coche, onReservar }) {

  const [form, setForm] = useState({
    inicio: "",
    fin: ""
  })

  const [estado, setEstado] = useState({
    error: "",
    loading: false,
    ocupadas: []
  })

  useEffect(() => {
    const cargar = async () => {
      try {
        const reservas = await obtenerTodasReservas()

        const ocupadas = reservas
          .filter(r => r.coche.id === coche.id && r.estado !== "CANCELADA")
          .map(r => ({
            inicio: r.fecha_inicio,
            fin: r.fecha_fin
          }))

        setEstado(prev => ({ ...prev, ocupadas }))
      } catch {}
    }

    if (coche?.id) cargar()
  }, [coche])

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const calcularDias = () => {
    if (!form.inicio || !form.fin) return 0
    return Math.ceil((new Date(form.fin) - new Date(form.inicio)) / 86400000)
  }

  const calcularTotal = () => {
    return calcularDias() * coche.precio_dia
  }

  const validar = () => {
    if (!form.inicio || !form.fin) return "Selecciona las fechas"

    const ini = new Date(form.inicio)
    const fin = new Date(form.fin)

    if (fin <= ini) return "Fechas inválidas"

    if (calcularDias() > 30) return "Máximo 30 días"

    for (const r of estado.ocupadas) {
      const rIni = new Date(r.inicio)
      const rFin = new Date(r.fin)

      if (ini <= rFin && fin >= rIni) {
        return "Fechas no disponibles"
      }
    }

    return ""
  }

  const submit = async () => {
    const err = validar()
    if (err) {
      setEstado(prev => ({ ...prev, error: err }))
      return
    }

    try {
      setEstado(prev => ({ ...prev, loading: true, error: "" }))
      await onReservar(form.inicio, form.fin)
    } catch (e) {
      setEstado(prev => ({ ...prev, error: e.message }))
    } finally {
      setEstado(prev => ({ ...prev, loading: false }))
    }
  }

  const dias = calcularDias()

  return (
    <div className="text-white space-y-6">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-cyan-300">
          <Car className="w-4 h-4" />
          <span className="text-xs font-medium">Reserva rápida</span>
        </div>

        <h3 className="text-2xl font-black">
          Reservar vehículo
        </h3>

        <p className="text-gray-400 text-sm">
          {coche.marca} {coche.modelo}
        </p>
      </div>

      {/* INPUTS */}
      <div className="space-y-4">

        <div>
          <label className="text-xs text-gray-400 flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4" />
            Fecha de inicio
          </label>

          <input
            type="date"
            name="inicio"
            value={form.inicio}
            onChange={change}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            Fecha de fin
          </label>

          <input
            type="date"
            name="fin"
            value={form.fin}
            onChange={change}
            min={form.inicio || new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
          />
        </div>

      </div>

      {/* OCUPADAS */}
      {estado.ocupadas.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-gray-300">

          <p className="font-semibold mb-2 text-cyan-300">
            Fechas ocupadas
          </p>

          <div className="space-y-1">
            {estado.ocupadas.map((r, i) => (
              <p key={i}>
                {r.inicio} → {r.fin}
              </p>
            ))}
          </div>

        </div>
      )}

      {/* RESUMEN */}
      {dias > 0 && (
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/20 rounded-2xl p-4">

          <p className="text-sm text-gray-300">
            Duración: {dias} días
          </p>

          <p className="text-3xl font-black text-white">
            {calcularTotal().toFixed(2)}€
          </p>

        </div>
      )}

      {/* ERROR */}
      {estado.error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-400/20 text-red-300 text-sm p-3 rounded-2xl">
          <AlertTriangle className="w-4 h-4" />
          {estado.error}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={submit}
        disabled={estado.loading}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        {estado.loading ? "Procesando..." : "Confirmar reserva"}
      </button>

    </div>
  )
}

export default ReservaForm