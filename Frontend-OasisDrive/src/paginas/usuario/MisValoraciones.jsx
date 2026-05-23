import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { obtenerValoracionesUsuario } from "../../servicios/valoracionServicio";

function MisValoraciones() {

  const navigate = useNavigate();
  const [valoraciones, setValoraciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarValoraciones();
  }, []);

  const cargarValoraciones = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (!usuario) {
        navigate("/login");
        return;
      }

      const data = await obtenerValoracionesUsuario(usuario.id);
      setValoraciones(data);

    } catch (error) {
      console.error("Error cargando valoraciones:", error);
      setValoraciones([]);
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

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-4">

          <Link
            to="/perfil"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-3xl font-black">Mis valoraciones</h1>
            <p className="text-gray-400 text-sm">
              Opiniones que has dejado sobre vehículos
            </p>
          </div>

        </div>

        {/* CONTENT */}
        {valoraciones.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-xl">
            <p className="text-gray-400 text-lg">
              Aún no has valorado ningún vehículo
            </p>
          </div>
        ) : (
          <div className="grid gap-4">

            {valoraciones.map((val) => (
              <div
                key={val.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3"
              >

                <div>
                  <h3 className="text-lg font-bold">
                    {val.coche?.marca} {val.coche?.modelo}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {val.coche?.matricula}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < val.puntuacion ? "currentColor" : "none"}
                      className={i < val.puntuacion ? "text-amber-400" : "text-gray-600"}
                    />
                  ))}
                  <span className="text-sm text-gray-300 ml-2">
                    {val.puntuacion}/5
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {val.comentario}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MisValoraciones;