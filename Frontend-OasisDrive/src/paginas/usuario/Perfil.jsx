import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { obtenerUsuarioStorage } from "../../servicios/authServicio";
import { User, Mail, Calendar } from "lucide-react";

function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const sync = () => setUsuario(obtenerUsuarioStorage());

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("usuario-changed", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("usuario-changed", sync);
    };
  }, []);

  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        <p className="text-gray-300">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black">
            Mi perfil
          </h1>
          <p className="text-gray-400 text-sm">
            Gestiona tu información personal
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-1 space-y-6">

            {/* USER CARD */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-3">

              <div className="flex items-center gap-2 text-cyan-300">
                <User size={18} />
                <span className="text-xs uppercase tracking-wide">
                  Usuario
                </span>
              </div>

              <h2 className="text-xl font-bold">
                {usuario.nombre}
              </h2>

              <p className="text-gray-400 text-sm">
                {usuario.email}
              </p>

            </div>

            {/* ACTIONS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-2 backdrop-blur-xl">

              <Link
                to="/editar-perfil"
                className="block text-center py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
              >
                Editar perfil
              </Link>

              <Link
                to="/cambiar-password"
                className="block text-center py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
              >
                Seguridad
              </Link>

              <Link
                to="/mis-valoraciones"
                className="block text-center py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
              >
                Mis valoraciones
              </Link>

            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 grid gap-4">

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-300 mb-2">
                <User size={16} />
                <span className="text-xs uppercase tracking-wide">Nombre</span>
              </div>
              <p className="text-lg font-semibold">{usuario.nombre}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-300 mb-2">
                <Mail size={16} />
                <span className="text-xs uppercase tracking-wide">Apellidos</span>
              </div>
              <p className="text-gray-300">
                {usuario.apellidos || "No especificado"}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-300 mb-2">
                <Mail size={16} />
                <span className="text-xs uppercase tracking-wide">Email</span>
              </div>
              <p className="text-gray-300">{usuario.email}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl">
              <div className="flex items-center gap-2 text-cyan-300 mb-2">
                <Calendar size={16} />
                <span className="text-xs uppercase tracking-wide">
                  Fecha de nacimiento
                </span>
              </div>

              <p className="text-gray-300">
                {usuario.fecha_nacimiento
                  ? new Date(usuario.fecha_nacimiento).toLocaleDateString("es-ES")
                  : "No especificada"}
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Perfil;