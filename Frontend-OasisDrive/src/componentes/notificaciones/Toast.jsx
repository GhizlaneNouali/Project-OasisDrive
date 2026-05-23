import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

function Toast({ mensaje, tipo = "success", onClose }) {
  if (!mensaje) return null;

  const configs = {
    success: {
      bg: "bg-emerald-500/10 border-emerald-400/20 text-emerald-300",
      icon: <CheckCircle size={18} className="text-emerald-400" />
    },
    error: {
      bg: "bg-red-500/10 border-red-400/20 text-red-300",
      icon: <AlertCircle size={18} className="text-red-400" />
    },
    info: {
      bg: "bg-cyan-500/10 border-cyan-400/20 text-cyan-300",
      icon: <Info size={18} className="text-cyan-400" />
    },
    warning: {
      bg: "bg-amber-500/10 border-amber-400/20 text-amber-300",
      icon: <AlertTriangle size={18} className="text-amber-400" />
    }
  };

  const config = configs[tipo] || configs.success;

  return (
    <div
      className={`
        fixed top-6 right-6 z-50 max-w-sm
        rounded-2xl border backdrop-blur-xl
        px-4 py-4 shadow-xl
        bg-white/5
        ${config.bg}
      `}
    >
      <div className="flex items-start gap-3">

        {/* ICON */}
        <div className="mt-0.5">
          {config.icon}
        </div>

        {/* MESSAGE */}
        <div className="flex-1">
          <p className="text-sm font-medium text-white/90">
            {mensaje}
          </p>
        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition ml-2"
        >
          <X size={16} />
        </button>

      </div>
    </div>
  );
}

export default Toast;