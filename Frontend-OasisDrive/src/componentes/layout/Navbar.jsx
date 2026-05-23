import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LogOut, Menu, X, Car } from "lucide-react";
import {
  logout as cerrarSesion,
  obtenerUsuarioStorage
} from "../../servicios/authServicio";

function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const logout = () => {
    cerrarSesion();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        <div className="flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">

           

            <div className="leading-tight">
              <span className="block text-lg font-black text-white group-hover:text-cyan-300 transition">
                OasisDrive
              </span>
              <span className="block text-xs text-gray-400">
                Premium Rent a Car
              </span>
            </div>

          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">

            <Link to="/" className="text-gray-300 hover:text-cyan-300 text-sm font-medium transition">
              Vehículos
            </Link>

            {usuario && (
              <>
                <Link to="/mis-reservas" className="text-gray-300 hover:text-cyan-300 text-sm font-medium transition">
                  Mis reservas
                </Link>

                <Link to="/perfil" className="text-gray-300 hover:text-cyan-300 text-sm font-medium transition">
                  Perfil
                </Link>

                {usuario.rol === "ADMIN" && (
                  <Link
                    to="/admin/dashboard"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition"
                  >
                    Panel admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* USER SECTION */}
          <div className="hidden md:flex items-center gap-4">

            {usuario ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">

                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {usuario.nombre}
                  </p>
                  <p className="text-xs text-gray-400">
                    {usuario.rol === "ADMIN" ? "Administrador" : "Usuario"}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition"
                  title="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>

              </div>
            ) : (
              <div className="flex items-center gap-3">

                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white text-sm font-medium transition"
                >
                  Iniciar sesión
                </Link>

                <Link
                  to="/registro"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition"
                >
                  Registrarse
                </Link>

              </div>
            )}

          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-5 space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur">

            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-cyan-300 text-sm">
              Vehículos
            </Link>

            {usuario && (
              <>
                <Link to="/mis-reservas" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-cyan-300 text-sm">
                  Mis reservas
                </Link>

                <Link to="/perfil" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-cyan-300 text-sm">
                  Perfil
                </Link>

                {usuario.rol === "ADMIN" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
                  >
                    Panel admin
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="w-full text-left text-red-400 text-sm font-medium"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            {!usuario && (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 text-sm">
                  Iniciar sesión
                </Link>

                <Link
                  to="/registro"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
                >
                  Registrarse
                </Link>
              </>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;