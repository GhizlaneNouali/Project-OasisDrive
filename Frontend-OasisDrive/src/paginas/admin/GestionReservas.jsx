import { useState, useEffect } from "react";
import {
  obtenerTodasReservas,
  cancelarReserva
} from "../../servicios/reservaServicio";

import { Calendar, User, Car, XCircle } from "lucide-react";

function GestionReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerTodasReservas();
        setReservas(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cancelar = async (id) => {
    await cancelarReserva(id);

    setReservas((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: "CANCELADA" } : r
      )
    );
  };

  const estadoStyle = (estado) => {
    switch (estado) {
      case "CONFIRMADA":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      case "CANCELADA":
        return "bg-red-500/10 text-red-300 border-red-500/20";
      default:
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-gray-400">
        Cargando reservas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white px-6 py-12">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <p className="text-cyan-300 text-xs uppercase tracking-widest mb-2">
            Admin / Reservas
          </p>

          <h1 className="text-4xl font-black">
            Gestión de reservas
          </h1>

          <p className="text-gray-400 mt-2">
            Control total de alquileres y estados del sistema
          </p>
        </div>

        {/* TABLE WRAPPER */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              {/* HEADER */}
              <thead className="text-gray-400 border-b border-white/10 bg-white/5">
                <tr>
                  <th className="p-4 text-left">Usuario</th>
                  <th className="p-4 text-left">Vehículo</th>
                  <th className="p-4 text-left">Fechas</th>
                  <th className="p-4 text-left">Total</th>
                  <th className="p-4 text-left">Estado</th>
                  <th className="p-4 text-left">Acciones</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>

                {reservas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-10 text-center text-gray-400">
                      No hay reservas registradas
                    </td>
                  </tr>
                ) : (
                  reservas.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >

                      {/* USER */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-200">
                          <User className="w-4 h-4 text-gray-500" />
                          {r.usuario?.nombre}
                        </div>
                      </td>

                      {/* CAR */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-200">
                          <Car className="w-4 h-4 text-gray-500" />
                          {r.coche?.marca} {r.coche?.modelo}
                        </div>
                      </td>

                      {/* DATES */}
                      <td className="p-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {new Date(r.fecha_inicio).toLocaleDateString()} →{" "}
                          {new Date(r.fecha_fin).toLocaleDateString()}
                        </div>
                      </td>

                      {/* TOTAL */}
                      <td className="p-4 font-semibold text-white">
                        {r.precio_total}€
                      </td>

                      {/* STATUS */}
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs border ${estadoStyle(r.estado)}`}>
                          {r.estado}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4">
                        {r.estado === "CONFIRMADA" ? (
                          <button
                            onClick={() => cancelar(r.id)}
                            className="flex items-center gap-1 text-red-300 hover:text-red-200 text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancelar
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">
                            —
                          </span>
                        )}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionReservas;