import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

// Páginas públicas
import Login from '../paginas/Login'
import Registro from '../paginas/Registro'
import HomeCliente from '../paginas/HomeCliente'
import DetalleVehiculo from '../paginas/DetalleVehiculo'

// Páginas de usuario
import MisReservas from '../paginas/usuario/MisReservas'
import DetalleReserva from '../paginas/usuario/DetalleReserva'
import Perfil from '../paginas/usuario/Perfil'
import EditarPerfil from '../paginas/usuario/EditarPerfil'
import CambiarPassword from '../paginas/usuario/CambiarPassword'
import MisValoraciones from '../paginas/usuario/MisValoraciones'
import CrearValoracion from '../paginas/usuario/CrearValoracion'
import VerValoraciones from '../paginas/usuario/VerValoraciones'

// Páginas admin
import AdminDashboard from '../paginas/admin/AdminDashboard'
import GestionVehiculos from '../paginas/admin/GestionVehiculos'
import CrearVehiculo from '../paginas/admin/CrearVehiculo'
import EditarVehiculo from '../paginas/admin/EditarVehiculo'
import GestionReservas from '../paginas/admin/GestionReservas'
import GestionValoraciones from '../paginas/admin/GestionValoraciones'

// Componente para proteger rutas
function ProtectedRoute({ children, requiereAuth = false, requiereAdmin = false }) {
    const [usuario, setUsuario] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario')
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado))
        }
        setLoading(false)
    }, [])

    if (loading) return <p className="p-6 text-center">Cargando...</p>

    if (requiereAuth && !usuario) {
        return <Navigate to="/login" />
    }

    if (requiereAdmin && (!usuario || usuario.rol !== 'ADMIN')) {
        return <Navigate to="/" />
    }

    return children
}

function AppRouter() {
    return (
        <Routes>
            {/* PÚBLICAS */}
            <Route path="/" element={<HomeCliente />} />
            <Route path="/home" element={<HomeCliente />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/vehiculos/:id" element={<DetalleVehiculo />} />

            {/* USUARIO */}
            <Route path="/mis-reservas" element={<ProtectedRoute requiereAuth><MisReservas /></ProtectedRoute>} />
            <Route path="/reservas/:id" element={<ProtectedRoute requiereAuth><DetalleReserva /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute requiereAuth><Perfil /></ProtectedRoute>} />
            <Route path="/editar-perfil" element={<ProtectedRoute requiereAuth><EditarPerfil /></ProtectedRoute>} />
            <Route path="/cambiar-password" element={<ProtectedRoute requiereAuth><CambiarPassword /></ProtectedRoute>} />
            <Route path="/mis-valoraciones" element={<ProtectedRoute requiereAuth><MisValoraciones /></ProtectedRoute>} />
            <Route path="/valoraciones/crear/:idCoche" element={<ProtectedRoute requiereAuth><CrearValoracion /></ProtectedRoute>} />
            <Route path="/valoraciones/coche/:idCoche" element={<VerValoraciones />} />

            {/* ADMIN */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requiereAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/vehiculos" element={<ProtectedRoute requiereAdmin><GestionVehiculos /></ProtectedRoute>} />
            <Route path="/admin/vehiculos/crear" element={<ProtectedRoute requiereAdmin><CrearVehiculo /></ProtectedRoute>} />
            <Route path="/admin/vehiculos/:id/editar" element={<ProtectedRoute requiereAdmin><EditarVehiculo /></ProtectedRoute>} />
            <Route path="/admin/reservas" element={<ProtectedRoute requiereAdmin><GestionReservas /></ProtectedRoute>} />
            <Route path="/admin/valoraciones" element={<ProtectedRoute requiereAdmin><GestionValoraciones /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AppRouter