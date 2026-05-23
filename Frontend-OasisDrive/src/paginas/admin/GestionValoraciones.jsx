import { useState, useEffect } from "react";
import { Star, User, Car, Trash2 } from "lucide-react";

import {
  obtenerTodasValoraciones,
  eliminarValoracion
} from "../../servicios/valoracionServicio";

import Toast from "../../componentes/notificaciones/Toast";
import { useNotificacion } from "../../hooks/useNotificacion";

function GestionValoraciones() {

  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    notificacion,
    mostrarNotificacion,
    cerrarNotificacion
  } = useNotificacion();

  useEffect(() => {
    const cargarValoraciones = async () => {
      try {
        setLoading(true);

        const data = await obtenerTodasValoraciones();
        setValoraciones(data);

      } catch (err) {
        console.error(err);
        mostrarNotificacion("Error al cargar valoraciones", "error");
        setValoraciones([]);
      } finally {
        setLoading(false);
      }
    };

    cargarValoraciones();
  }, []);

  const handleEliminar = async (id) => {
    try {
      await eliminarValoracion(id);

      setValoraciones(prev =>
        prev.filter(v => v.id !== id)
      );

      mostrarNotificacion("Valoración eliminada correctamente", "success");

    } catch (err) {
      console.error(err);
      mostrarNotificacion("Error al eliminar la valoración", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-gray-400">
        Cargando valoraciones...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white px-6 py-12">

      {/* TOAST */}
      <Toast
        mensaje={notificacion.mensaje}
        tipo={notificacion.tipo}
        onClose={cerrarNotificacion}
      />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <p className="text-cyan-300 text-xs uppercase tracking-widest mb-2">
            Admin / Valoraciones
          </p>

          <h1 className="text-4xl font-black">
            Gestión de valoraciones
          </h1>

          <p className="text-gray-400 mt-2">
            Opiniones y puntuaciones de clientes
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="text-gray-400 border-b border-white/10 bg-white/5">
                <tr>
                  <th className="p-4 text-left">Usuario</th>
                  <th className="p-4 text-left">Vehículo</th>
                  <th className="p-4 text-left">Puntuación</th>
                  <th className="p-4 text-left">Comentario</th>
                  <th className="p-4 text-left">Acción</th>
                </tr>
              </thead>

              <tbody>
                {valoraciones.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-gray-400">
                      No hay valoraciones registradas
                    </td>
                  </tr>
                ) : (
                  valoraciones.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-200">
                          <User className="w-4 h-4 text-gray-500" />
                          {v.usuario?.nombre}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-200">
                          <Car className="w-4 h-4 text-gray-500" />
                          {v.coche?.marca} {v.coche?.modelo}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-yellow-300 font-semibold">
                          <Star className="w-4 h-4 fill-yellow-300" />
                          {v.puntuacion}/5
                        </div>
                      </td>

                      <td className="p-4 text-gray-400 max-w-md">
                        <p className="truncate">
                          {v.comentario}
                        </p>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleEliminar(v.id)}
                          className="flex items-center gap-1 text-red-300 hover:text-red-200 text-sm font-medium transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
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

export default GestionValoraciones;