import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  obtenerVehiculos,
  eliminarVehiculo,
  activarVehiculo
} from "../../servicios/vehiculoServicio";

import Toast from "../../componentes/notificaciones/Toast";
import { useNotificacion } from "../../hooks/useNotificacion";

function GestionVehiculos() {
  const [coches, setCoches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendiente, setPendiente] = useState(null);

  const { notificacion, mostrarNotificacion, cerrarNotificacion } =
    useNotificacion();

  useEffect(() => {
    (async () => {
      const data = await obtenerVehiculos();
      setCoches(data || []);
      setLoading(false);
    })();
  }, []);

  const archivar = async (id) => {
    await eliminarVehiculo(id);
    setCoches((p) =>
      p.map((c) =>
        c.id === id ? { ...c, activo: false, disponible: false } : c
      )
    );
  };

  const activar = async (id) => {
    const data = await activarVehiculo(id);
    setCoches((p) =>
      p.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const ejecutar = async () => {
    const { coche, accion } = pendiente;
    setPendiente(null);

    try {
      if (accion === "activar") {
        await activar(coche.id);
        mostrarNotificacion("Vehículo activado", "success");
      } else {
        await archivar(coche.id);
        mostrarNotificacion("Vehículo archivado", "success");
      }
    } catch {
      mostrarNotificacion("Error", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
        Cargando flota...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6">

      <Toast {...notificacion} onClose={cerrarNotificacion} />

      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Gestión de vehículos
            </h1>
            <p className="text-slate-400 mt-1">
              Control total de tu flota de rent-a-car
            </p>
          </div>

          <Link
            to="/admin/vehiculos/crear"
            className="bg-white text-slate-900 hover:bg-slate-200 px-5 py-2.5 rounded-xl font-semibold transition"
          >
            Nuevo vehículo
          </Link>

        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {coches.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 bg-white/5 border border-white/10 rounded-2xl p-10">
              No hay vehículos registrados
            </div>
          ) : (
            coches.map((c) => (

              <div
                key={c.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl hover:bg-white/10 transition space-y-4"
              >

                {/* TOP */}
                <div className="flex justify-between items-start">

                  <div>
                    <h2 className="font-bold text-lg text-white">
                      {c.marca} {c.modelo}
                    </h2>
                    <p className="text-xs text-slate-400">
                      ID: {c.id}
                    </p>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    !c.activo
                      ? "bg-slate-700 text-slate-300"
                      : c.disponible
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    {!c.activo
                      ? "Archivado"
                      : c.disponible
                      ? "Disponible"
                      : "No disponible"}
                  </span>

                </div>

                {/* INFO */}
                <div className="space-y-1 text-sm text-slate-300">
                  <p>{c.precio_dia}€ / día</p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-2">

                  <Link
                    to={`/admin/vehiculos/${c.id}/editar`}
                    className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm font-medium transition"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() =>
                      setPendiente({
                        coche: c,
                        accion: c.activo ? "archivar" : "activar"
                      })
                    }
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      c.activo
                        ? "bg-red-500/20 hover:bg-red-500/30 text-red-300"
                        : "bg-green-500/20 hover:bg-green-500/30 text-green-300"
                    }`}
                  >
                    {c.activo ? "Archivar" : "Activar"}
                  </button>

                </div>

              </div>
            ))
          )}

        </div>
      </div>

      {/* MODAL */}
      {pendiente && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">

          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">

            <h2 className="text-xl font-bold text-white">
              Confirmar acción
            </h2>

            <p className="text-slate-300 text-sm">
              Estás a punto de cambiar el estado del vehículo.
            </p>

            <div className="flex justify-end gap-3 pt-2">

              <button
                onClick={() => setPendiente(null)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                Cancelar
              </button>

              <button
                onClick={ejecutar}
                className="px-4 py-2 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-200"
              >
                Confirmar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default GestionVehiculos;