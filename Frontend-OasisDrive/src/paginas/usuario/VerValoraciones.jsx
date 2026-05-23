import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";

import { obtenerVehiculo } from "../../servicios/vehiculoServicio";
import { obtenerValoracionesCoche } from "../../servicios/valoracionServicio";

function VerValoraciones() {

  const { idCoche } = useParams();

  const [coche, setCoche] = useState(null);
  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const cocheData = await obtenerVehiculo(idCoche);
      setCoche(cocheData);

      const valData = await obtenerValoracionesCoche(idCoche);
      setValoraciones(valData || []);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        <p className="text-gray-300">Cargando valoraciones...</p>
      </div>
    );
  }

  if (!coche) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        <p className="text-gray-400">Vehículo no encontrado</p>
      </div>
    );
  }

  const promedio =
    valoraciones.length > 0
      ? (
          valoraciones.reduce((sum, v) => sum + v.puntuacion, 0) /
          valoraciones.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          <Link
            to="/vehiculos"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-3xl font-black">
              {coche.marca} {coche.modelo}
            </h1>
            <p className="text-gray-400 text-sm">
              Valoraciones de usuarios
            </p>
          </div>

        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">

          <p className="text-5xl font-black text-amber-400">
            {promedio}
          </p>

          <p className="text-gray-300 mt-1">
            de 5 estrellas
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Basado en {valoraciones.length} valoración{valoraciones.length !== 1 ? "es" : ""}
          </p>

        </div>

        {/* LIST */}
        {valoraciones.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
            <p className="text-gray-400">
              No hay valoraciones aún
            </p>
          </div>
        ) : (
          <div className="grid gap-4">

            {valoraciones.map((val) => (
              <div
                key={val.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3"
              >

                {/* USER + STARS */}
                <div className="flex justify-between items-start">

                  <p className="font-semibold text-white">
                    {val.usuario?.nombre}
                  </p>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < val.puntuacion ? "currentColor" : "none"}
                        className={
                          i < val.puntuacion
                            ? "text-amber-400"
                            : "text-gray-600"
                        }
                      />
                    ))}
                    <span className="text-sm text-gray-300 ml-2">
                      {val.puntuacion}/5
                    </span>
                  </div>

                </div>

                {/* COMMENT */}
                <p className="text-gray-300 text-sm leading-relaxed">
                  {val.comentario}
                </p>

                {/* DATE */}
                <p className="text-xs text-gray-500">
                  {new Date(val.fecha).toLocaleDateString("es-ES")}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default VerValoraciones;