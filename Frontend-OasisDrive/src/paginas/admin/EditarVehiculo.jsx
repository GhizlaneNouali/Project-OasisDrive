import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  buildVehiculoPayload,
  obtenerVehiculo,
  actualizarVehiculo,
  subirImagenVehiculo
} from "../../servicios/vehiculoServicio";
import { obtenerSrcImagen } from "../../servicios/imagenServicio";

import Input from "../../componentes/formulario/Input";
import Toast from "../../componentes/notificaciones/Toast";
import { useNotificacion } from "../../hooks/useNotificacion";
import { ArrowLeft, UploadCloud, Car } from "lucide-react";

function EditarVehiculo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [imagenOriginal, setImagenOriginal] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { notificacion, mostrarNotificacion, cerrarNotificacion } =
    useNotificacion();

  useEffect(() => {
    (async () => {
      try {
        const v = await obtenerVehiculo(id);

        setForm({
          marca: v.marca || "",
          modelo: v.modelo || "",
          matricula: v.matricula || "",
          anio: v.anio ?? "",
          color: v.color || "",
          precio: v.precio_dia ?? "",
          kilometros: v.kilometros ?? ""
        });

        setImagenOriginal(v.imagen_url || "");
        setPreview(obtenerSrcImagen(v.imagen_url));
      } catch (err) {
        setError("Error al cargar el vehículo");
        mostrarNotificacion(err.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImg(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");

    const camposVacios = Object.values(form).some((v) => v === "" || v === null || v === undefined);
    if (camposVacios) {
      setError("Completa todos los campos");
      return;
    }

    if (!img && !imagenOriginal) {
      setError("Debes subir una imagen del vehículo");
      return;
    }

    try {
      setSaving(true);

      let imgUrl = imagenOriginal;

      if (img) {
        imgUrl = await subirImagenVehiculo(img);
      }

      await actualizarVehiculo(id, buildVehiculoPayload(form, imgUrl));

      mostrarNotificacion("Vehículo actualizado correctamente", "success");
      setTimeout(() => navigate("/admin/vehiculos"), 700);

    } catch (err) {
      setError(err.message || "Error al actualizar");
      mostrarNotificacion(err.message || "Error", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120] text-gray-400">
        Cargando vehículo...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white px-6 py-12">

      <div className="max-w-6xl mx-auto space-y-8">

        <Toast {...notificacion} onClose={cerrarNotificacion} />

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
              Editar vehículo
            </h1>

            <p className="text-gray-400 text-sm">
              Modifica la información del vehículo
            </p>
          </div>

        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* FORM */}
          <form
            onSubmit={save}
            className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl p-8 space-y-6"
          >

            <div className="grid md:grid-cols-2 gap-6">

              {[
                ["marca", "Marca"],
                ["modelo", "Modelo"],
                ["matricula", "Matrícula"],
                ["anio", "Año", "number"],
                ["color", "Color"],
                ["precio", "Precio/día (€)", "number"],
                ["kilometros", "Kilómetros", "number"]
              ].map(([name, label, type]) => (
                <div key={name} className="space-y-2">

                  <label className="text-xs text-gray-400">
                    {label}
                  </label>

                  <Input
                    name={name}
                    type={type || "text"}
                    value={form[name]}
                    onChange={handle}
                    className="bg-white/5 border border-white/10 text-white rounded-2xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />

                </div>
              ))}

            </div>

            {/* IMAGE */}
            <div className="pt-4 border-t border-white/10 space-y-3">

              <label className="text-xs text-gray-400">
                Imagen del vehículo
              </label>

              <label className="flex flex-col items-center justify-center border border-dashed border-white/20 bg-white/5 rounded-3xl p-6 cursor-pointer hover:border-cyan-400/40 transition">

                <UploadCloud className="w-6 h-6 text-cyan-300 mb-2" />

                <p className="text-sm text-gray-300">
                  {img ? img.name : "Cambiar imagen"}
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

            </div>

            {/* ERROR */}
            {error && (
              <div className="bg-red-500/10 border border-red-400/20 text-red-300 p-4 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 font-bold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

          </form>

          {/* PREVIEW */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit">

            <h3 className="text-sm text-gray-400 mb-4">
              Vista previa
            </h3>

            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/20">

              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Sin imagen
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default EditarVehiculo;