import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  obtenerReserva,
  finalizarReserva
} from "../../servicios/reservaServicio";

import Toast from "../../componentes/notificaciones/Toast";
import { useNotificacion } from "../../hooks/useNotificacion";

import {
  ArrowLeft,
  CheckCircle,
  Calendar,
  Car,
  User,
  CreditCard
} from "lucide-react";

function DetalleReserva() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoFinalized, setAutoFinalized] = useState(false);
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuario")) || null;

  const { notificacion, mostrarNotificacion, cerrarNotificacion } =
    useNotificacion();

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerReserva(id);
        setReserva(data);

        if (data.estado === "CONFIRMADA") {
          const fechaFin = new Date(data.fecha_fin);
          const ahora = new Date();

          if (ahora >= fechaFin && !autoFinalized) {
            // Solo el admin puede finalizar reservas desde el frontend
            if (usuarioLogueado && usuarioLogueado.rol === "ADMIN") {
              try {
                await finalizarReserva(id);
                data.estado = "FINALIZADA";
                setReserva(data);
                setAutoFinalized(true);
                mostrarNotificacion("Reserva finalizada automáticamente", "success");
              } catch {}
            }
          }
        }
      } catch {
        mostrarNotificacion("Error al cargar la reserva", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const finalizar = async () => {
    // Comprobar rol en frontend para evitar mostrar botón a clientes
    if (!usuarioLogueado || usuarioLogueado.rol !== "ADMIN") {
      mostrarNotificacion("Acceso denegado: solo administradores pueden finalizar reservas", "error");
      return;
    }

    try {
      await finalizarReserva(id);
      setReserva({ ...reserva, estado: "FINALIZADA" });
      mostrarNotificacion("Reserva finalizada correctamente", "success");
      setTimeout(() => navigate("/mis-reservas"), 800);
    } catch (err) {
      mostrarNotificacion(err.message || "Error al finalizar", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Cargando reserva...</p>
        </div>
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Reserva no encontrada</p>
          <Link to="/mis-reservas" className="text-cyan-400 hover:text-cyan-300">
            Volver a mis reservas
          </Link>
        </div>
      </div>
    );
  }

  const dias = Math.ceil(
    (new Date(reserva.fecha_fin) - new Date(reserva.fecha_inicio)) /
    (1000 * 60 * 60 * 24)
  );

  const getStatus = (estado) => {
    switch (estado) {
      case "CONFIRMADA":
        return "text-cyan-300 bg-cyan-500/10 border-cyan-400/20";
      case "FINALIZADA":
        return "text-emerald-300 bg-emerald-500/10 border-emerald-400/20";
      case "CANCELADA":
        return "text-red-300 bg-red-500/10 border-red-400/20";
      default:
        return "text-gray-300 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      <Toast {...notificacion} onClose={cerrarNotificacion} />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

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
              Detalle de reserva
            </h1>
            <p className="text-gray-400 text-sm">
              Reserva #{reserva.id}
            </p>
          </div>

        </div>

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl overflow-hidden">

          {/* STATUS */}
          <div className={`px-6 py-4 border-b flex items-center gap-2 ${getStatus(reserva.estado)}`}>
            <CheckCircle size={18} />
            <span className="font-semibold text-sm">
              {reserva.estado}
            </span>
          </div>

          <div className="p-6 space-y-8">

            {/* VEHICLE */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-cyan-300 mb-2">
                <Car size={16} />
                <span className="text-xs uppercase tracking-wide">
                  Vehículo
                </span>
              </div>

              <p className="text-xl font-bold">
                {reserva.coche?.marca} {reserva.coche?.modelo}
              </p>

              <p className="text-gray-400 text-sm mt-1">
                Matrícula: {reserva.coche?.matricula}
              </p>
            </div>

            {/* USER */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-cyan-300 mb-2">
                <User size={16} />
                <span className="text-xs uppercase tracking-wide">
                  Cliente
                </span>
              </div>

              <p className="font-semibold">{reserva.usuario?.nombre}</p>
              <p className="text-gray-400 text-sm">{reserva.usuario?.email}</p>
            </div>

            {/* DATES */}
            <div className="grid sm:grid-cols-3 gap-4">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <Calendar className="mx-auto text-cyan-300 mb-2" size={18} />
                <p className="text-xs text-gray-400">Inicio</p>
                <p className="font-semibold">
                  {new Date(reserva.fecha_inicio).toLocaleDateString("es-ES")}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <Calendar className="mx-auto text-cyan-300 mb-2" size={18} />
                <p className="text-xs text-gray-400">Fin</p>
                <p className="font-semibold">
                  {new Date(reserva.fecha_fin).toLocaleDateString("es-ES")}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-2">Duración</p>
                <p className="text-lg font-bold text-cyan-300">
                  {dias} días
                </p>
              </div>

            </div>

            {/* PRICE */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/20 rounded-2xl p-6 flex items-center justify-between">

              <div>
                <p className="text-gray-300 text-sm">Precio total</p>
                <p className="text-3xl font-black">
                  {reserva.precio_total}€
                </p>
              </div>

              <CreditCard className="text-cyan-300" size={28} />

            </div>

            {/* ACTIONS */}
            <div className="space-y-3">

              {reserva.estado === "CONFIRMADA" && usuarioLogueado && usuarioLogueado.rol === "ADMIN" && (
                <button
                  onClick={finalizar}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:scale-[1.02] transition"
                >
                  Finalizar reserva
                </button>
              )}

              {reserva.estado === "FINALIZADA" && (
                <Link
                  to={`/valoraciones/crear/${reserva.coche?.id}`}
                  className="block text-center w-full py-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 font-semibold hover:bg-emerald-500/20 transition"
                >
                  Valorar vehículo
                </Link>
              )}

              <Link
                to="/mis-reservas"
                className="block text-center w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:border-cyan-400/30 transition"
              >
                Volver
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleReserva;