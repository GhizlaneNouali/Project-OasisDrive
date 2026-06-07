import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../componentes/formulario/Input";
import {
  buildVehiculoPayload,
  crearVehiculo,
  subirImagenVehiculo,
} from "../../servicios/vehiculoServicio";
import Toast from "../../componentes/notificaciones/Toast";
import { useNotificacion } from "../../hooks/useNotificacion";
import { ArrowLeft, UploadCloud, Car } from "lucide-react";

function CrearVehiculo() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    matricula: "",
    anio: "",
    color: "",
    precio: "",
    kilometros: "",
  });

  const [imagen, setImagen] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { notificacion, mostrarNotificacion, cerrarNotificacion } =
    useNotificacion();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const crear = async (e) => {
    e.preventDefault();
    setError("");

    const empty = Object.values(form).some((v) => !v) || !imagen;
    if (empty) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      const imagen_url = await subirImagenVehiculo(imagen);

      await crearVehiculo(buildVehiculoPayload(form, imagen_url));

      mostrarNotificacion("Vehículo creado correctamente", "success");
      setTimeout(() => navigate("/admin/vehiculos"), 700);
    } catch (err) {
      mostrarNotificacion(err.message || "Error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white px-6 py-12">

      <div className="max-w-4xl mx-auto space-y-8">

        <Toast
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          onClose={cerrarNotificacion}
        />

        {/* HEADER */}
        <div className="flex items-center gap-4">

          <Link
            to="/admin/vehiculos"
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-cyan-300 text-xs uppercase tracking-widest mb-1">
              <Car className="w-4 h-4" />
              Admin
            </div>

            <h1 className="text-3xl font-black">
              Nuevo vehículo
            </h1>

            <p className="text-gray-400 text-sm">
              Añade un coche al catálogo de la flota
            </p>
          </div>

        </div>

        {/* FORM CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8">

          <form onSubmit={crear} className="space-y-6">

            {/* GRID */}
            <div className="grid md:grid-cols-2 gap-6">

              {[
                { label: "Marca", name: "marca" },
                { label: "Modelo", name: "modelo" },
                { label: "Matrícula", name: "matricula" },
                { label: "Año", name: "anio", type: "number" },
                { label: "Color", name: "color" },
                { label: "Precio/día (€)", name: "precio", type: "number" },
                { label: "Kilómetros", name: "kilometros", type: "number" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">

                  <label className="text-xs text-gray-400">
                    {field.label}
                  </label>

                  <Input
                    name={field.name}
                    type={field.type || "text"}
                    value={form[field.name]}
                    onChange={handleChange}
                    className="bg-white/5 border border-white/10 text-white rounded-2xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />

                </div>
              ))}

              {/* IMAGE UPLOAD */}
              <div className="space-y-3">

                <label className="text-xs text-gray-400">
                  Imagen del vehículo
                </label>

                <label className="flex flex-col items-center justify-center border border-dashed border-white/20 bg-white/5 rounded-3xl p-6 cursor-pointer hover:border-cyan-400/40 transition">

                  <UploadCloud className="w-6 h-6 text-cyan-300 mb-2" />

                  <p className="text-sm text-gray-300 text-center">
                    {imagen ? imagen.name : "Sube una imagen"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />

                </label>

                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-2xl border border-white/10"
                  />
                )}

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/20 text-red-300 p-4 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Creando..." : "Crear vehículo"}
              </button>

              <Link
                to="/admin/vehiculos"
                className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-300 hover:border-cyan-400/30 transition"
              >
                Cancelar
              </Link>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default CrearVehiculo;