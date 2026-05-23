import { Link } from "react-router-dom";
import {
  Car,
  Calendar,
  Star,
  ArrowUpRight
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white px-6 py-12">

      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div>
          <p className="text-cyan-300 text-xs uppercase tracking-widest mb-2">
            Panel de administración
          </p>

          <h1 className="text-4xl font-black">
            Dashboard
          </h1>

          <p className="text-gray-400 mt-2">
            Gestión general del sistema Oasis Drive
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* VEHÍCULOS */}
          <Link
            to="/admin/vehiculos"
            className="group bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-cyan-400/40 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <Car className="text-cyan-300 w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition">
              Gestionar vehículos
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Administra los vehículos disponibles, agrega nuevos registros y actualiza el catálogo.
            </p>

            <div className="flex items-center justify-between text-sm text-cyan-300 font-medium">
              <span>Entrar</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* RESERVAS */}
          <Link
            to="/admin/reservas"
            className="group bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-cyan-400/40 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <Calendar className="text-cyan-300 w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition">
              Gestionar reservas
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Consulta, edita y controla las reservas realizadas por los usuarios.
            </p>

            <div className="flex items-center justify-between text-sm text-cyan-300 font-medium">
              <span>Entrar</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* VALORACIONES */}
          <Link
            to="/admin/valoraciones"
            className="group bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-cyan-400/40 transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <Star className="text-cyan-300 w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition">
              Gestionar valoraciones
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Revisa comentarios y calificaciones realizadas por los clientes.
            </p>

            <div className="flex items-center justify-between text-sm text-cyan-300 font-medium">
              <span>Entrar</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </Link>

        </div>

        {/* FOOTER */}
        <div className="pt-6 border-t border-white/10 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-2">
          <p>© 2026 Oasis Drive</p>
          <p>Sistema de administración</p>
        </div>

      </div>
    </div>
  );
}