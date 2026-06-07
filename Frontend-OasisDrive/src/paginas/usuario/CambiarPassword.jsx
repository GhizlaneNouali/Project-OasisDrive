import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../componentes/formulario/Input";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { cambiarPassword } from "../../servicios/authServicio";
import { obtenerUsuario } from "../../servicios/authServicio";

function CambiarPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    actual: "",
    nueva: "",
    repetir: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const cambiar = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);

    if (!form.actual || !form.nueva || !form.repetir) {
      return setError("Completa todos los campos");
    }

    if (form.nueva !== form.repetir) {
      return setError("Las contraseñas no coinciden");
    }

    if (form.nueva.length < 8) {
      return setError("La contraseña debe tener al menos 8 caracteres");
    }

    try {
      setLoading(true);
      // Obtener usuario logueado
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) {
        setError("No hay usuario logueado");
        return;
      }
      await cambiarPassword(usuario.id, form.actual, form.nueva);
      setOk(true);
      setTimeout(() => navigate("/perfil"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        {/* HEADER */}
        <div className="space-y-2">
          <Link
            to="/perfil"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
          >
            <ArrowLeft size={16} />
            Volver al perfil
          </Link>

          <h1 className="text-3xl font-black flex items-center gap-2">
            Seguridad de la cuenta
          </h1>

          <p className="text-gray-400 text-sm">
            Cambia tu contraseña para mantener tu cuenta protegida
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-6">

          <form className="space-y-4" onSubmit={cambiar}>

            <Input
              name="actual"
              type="password"
              value={form.actual}
              onChange={handle}
              placeholder="Contraseña actual"
            />

            <Input
              name="nueva"
              type="password"
              value={form.nueva}
              onChange={handle}
              placeholder="Nueva contraseña (mín. 8 caracteres)"
              minLength={8}
            />

            <Input
              name="repetir"
              type="password"
              value={form.repetir}
              onChange={handle}
              placeholder="Repetir nueva contraseña"
            />

            {/* ERROR */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 rounded-2xl">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {ok && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm p-3 rounded-2xl flex items-center gap-2">
                <CheckCircle size={16} />
                Contraseña actualizada correctamente
              </div>
            )}

            {/* BUTTON */}
            <button
              disabled={loading || ok}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Cambiar contraseña"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default CambiarPassword;