import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

import { obtenerVehiculo } from "../../servicios/vehiculoServicio";
import { crearValoracion } from "../../servicios/valoracionServicio";
import Toast from "../../componentes/notificaciones/Toast";
import { useNotificacion } from "../../hooks/useNotificacion";

function CrearValoracion() {
  const { idCoche } = useParams();
  const navigate = useNavigate();

  const [coche, setCoche] = useState(null);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const { notificacion, mostrarNotificacion, cerrarNotificacion } =
    useNotificacion();

  useEffect(() => {
    (async () => {
      const data = await obtenerVehiculo(idCoche);
      setCoche(data);
    })();
  }, [idCoche]);

  const enviar = async () => {
    if (!comentario.trim()) {
      return mostrarNotificacion("Escribe un comentario", "error");
    }

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("usuario"));

      await crearValoracion(user.id, idCoche, puntuacion, comentario);

      mostrarNotificacion("Valoración enviada correctamente", "success");

      setTimeout(() => navigate("/mis-reservas"), 800);
    } catch {
      mostrarNotificacion("Error al enviar la valoración", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!coche) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      <Toast {...notificacion} onClose={cerrarNotificacion} />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          <Link
            to="/mis-reservas"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-3xl font-black">
              Valorar vehículo
            </h1>

            <p className="text-gray-400 text-sm">
              {coche.marca} {coche.modelo}
            </p>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 space-y-6">

          {/* STARS */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wide">
              Puntuación
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPuntuacion(n)}
                  className="transition hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      n <= puntuacion
                        ? "text-cyan-400 fill-cyan-400"
                        : "text-gray-600"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* COMMENT */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wide">
              Comentario
            </label>

            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={5}
              placeholder="Escribe tu experiencia..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/40 transition resize-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="space-y-3 pt-4">

            <button
              onClick={enviar}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar valoración"}
            </button>

            <Link
              to="/mis-reservas"
              className="block text-center w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:border-cyan-400/30 transition"
            >
              Cancelar
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearValoracion;