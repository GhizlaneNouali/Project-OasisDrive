import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../componentes/formulario/Input";
import { login, guardarUsuario } from "../servicios/authServicio";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      const usuario = await login(email, password);
      guardarUsuario(usuario);

      navigate("/");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4 text-white">

      <div className="relative w-full max-w-md">

        {/* glow background */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/20 blur-3xl rounded-full"></div>

        {/* CARD */}
        <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-8 space-y-6">

          {/* HEADER */}
          <div className="text-center space-y-2">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg">
              OD
            </div>

            <h1 className="text-2xl font-black">
              Bienvenido
            </h1>

            <p className="text-gray-400 text-sm">
              Accede a tu cuenta de <span className="text-cyan-300 font-semibold">OasisDrive</span>
            </p>

          </div>

          {/* FORM */}
          <form onSubmit={enviar} className="space-y-4">

            <div>
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-gray-500 text-xs">o</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-400">
            ¿No tienes cuenta?{" "}
            <Link
              to="/registro"
              className="text-cyan-300 hover:text-cyan-200 font-medium"
            >
              Crear cuenta
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;