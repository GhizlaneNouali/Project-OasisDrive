import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../componentes/formulario/Input";
import { registro } from "../servicios/authServicio";

function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 calcular edad
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre || !apellidos || !fechaNacimiento || !email || !password) {
      setError("Completa todos los campos");
      return;
    }

    // 🔹 validación edad
    const edad = calcularEdad(fechaNacimiento);

    if (edad < 20) {
      setError("Debes tener al menos 20 años para registrarte");
      return;
    }

    try {
      setLoading(true);

      await registro({
        nombre,
        apellidos,
        fecha_nacimiento: fechaNacimiento,
        email,
        password
      });

      navigate("/login");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4 text-white overflow-hidden">

      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/20 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-600/20 blur-3xl rounded-full"></div>
      </div>

      {/* CARD */}
      <div className="relative w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 space-y-6 shadow-xl">

        {/* HEADER */}
        <div className="text-center space-y-2">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
            OD
          </div>

          <h1 className="text-2xl font-black">
            Crear cuenta
          </h1>

          <p className="text-gray-400 text-sm">
            Regístrate en <span className="text-cyan-300 font-semibold">OasisDrive</span>
          </p>

        </div>

        {/* FORM */}
        <form onSubmit={enviar} className="space-y-4">

          <Input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <Input
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />

          {/* FECHA NACIMIENTO (con límite 20 años) */}
          <Input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            max={
              new Date(
                new Date().setFullYear(new Date().getFullYear() - 20)
              )
                .toISOString()
                .split("T")[0]
            }
          />

          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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
            {loading ? "Creando cuenta..." : "Registrarse"}
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
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-cyan-300 hover:text-cyan-200 font-medium"
          >
            Iniciar sesión
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Registro;  