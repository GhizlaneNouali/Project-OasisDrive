import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../componentes/formulario/Input";
import { actualizarUsuario } from "../../servicios/authServicio";
import Toast from "../../componentes/notificaciones/Toast";
import { useNotificacion } from "../../hooks/useNotificacion";

import { ArrowLeft, User } from "lucide-react";

function EditarPerfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    fecha_nacimiento: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { notificacion, mostrarNotificacion, cerrarNotificacion } =
    useNotificacion();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario"));
    if (u) {
      setUsuario(u);
      setForm({
        nombre: u.nombre || "",
        apellidos: u.apellidos || "",
        email: u.email || "",
        fecha_nacimiento: u.fecha_nacimiento || ""
      });
    }
  }, []);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.fecha_nacimiento) {
      setError("Completa los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      const actualizado = {
        ...usuario,
        nombre: form.nombre,
        apellidos: form.apellidos,
        fecha_nacimiento: form.fecha_nacimiento
      };

      await actualizarUsuario(usuario.id, actualizado);

      localStorage.setItem("usuario", JSON.stringify(actualizado));

      mostrarNotificacion("Perfil actualizado correctamente", "success");

      setTimeout(() => navigate("/perfil"), 800);
    } catch {
      mostrarNotificacion("Error al actualizar el perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
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
            to="/perfil"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-3xl font-black">
              Editar perfil
            </h1>

            <p className="text-gray-400 text-sm">
              Actualiza tu información personal
            </p>
          </div>

        </div>

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-6 space-y-6">

          {/* USER ICON */}
          <div className="flex items-center gap-2 text-cyan-300 mb-2">
            <User size={16} />
            <span className="text-xs uppercase tracking-wide">
              Datos personales
            </span>
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-5">

            <div className="space-y-2">
              <label className="text-xs text-gray-400">Nombre</label>
              <Input
                name="nombre"
                value={form.nombre}
                onChange={handle}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400">Apellidos</label>
              <Input
                name="apellidos"
                value={form.apellidos}
                onChange={handle}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs text-gray-400">Email</label>
              <Input
                value={form.email}
                disabled
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs text-gray-400">
                Fecha de nacimiento
              </label>
              <Input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handle}
              />
            </div>

          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/20 text-red-300 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="space-y-3 pt-4">

            <button
              onClick={guardar}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>

            <Link
              to="/perfil"
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

export default EditarPerfil;