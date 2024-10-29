import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './components/Home';
import Login from './components/Login';
import Registrar from './components/Registrar';
import Inicio from './components/Inicio';
import PrivateRoute from './components/PrivateRoute';
import HistoricosPage from './pages/HistoricosPage'; 
import ModificarDatos from './components/ModificarDatos';
import ModificarPassword from './components/ModificarPassword';
import HelpModal from './components/HelpModal';
import PantallaComparativa from './analisis/PantallaComparativa';
import GeneraQR from './utils/GeneraQR';
import TablaDatosHistoricos from './pages/TablaDatosHistoricos'; 
import TablaAuditoria from './pages/TablaAuditoria';
import CrearNodo from './components/Nodo';
import Admin from './components/Admin';
import Usuarios from './components/Usuarios';
import Roles from './components/Roles';
import ListaNodos from './components/ListaNodos';
import AlertasAdmin from './components/AlertasAdmin';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<App><Home /></App>} />
        <Route path="/login" element={<App><Login /></App>} />
        <Route path="/registrar" element={<App><Registrar /></App>} />
        
        {/* Ruta protegida */}
        <Route 
          path="/inicio" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin','cooperativa','profesional']}>
                <Inicio />
              </PrivateRoute>
            </App>
          } 
        />
        {/* Rutas adicionales protegidas */}
        <Route 
          path="/historicos" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin', 'invitado', 'universidad']}>
                <HistoricosPage />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/comparativo" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin', 'profesional', 'cooperativa']}>
                <PantallaComparativa />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/tabla_datos_historicos" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin', 'invitado', 'universidad']}>
                <TablaDatosHistoricos />
              </PrivateRoute>
            </App>
          } 
        />
         <Route 
          path="/auditoria" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin']}>
                <TablaAuditoria />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/modificar_datos" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin','cooperativa','profesional','invitado', 'universidad']}>
                <ModificarDatos />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/usuarios" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin']}>
                <Usuarios />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/roles" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin']}>
                <Roles />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/nodos" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin']}>
                <ListaNodos/>
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/modificar_password" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin','cooperativa','profesional','invitado', 'universidad']}>
                <ModificarPassword />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/help" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin','cooperativa','profesional','invitado', 'universidad']}>
                <HelpModal />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/generar_qr" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin','cooperativa','profesional']}>
                <GeneraQR />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/crear_nodo" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin','cooperativa','profesional']}>
                <CrearNodo/>
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin']}>
                <Admin />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/alertaAdmin" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin']}>
                <AlertasAdmin/>
              </PrivateRoute>
            </App>
          } 
        />
      </Routes>  
    </Router>
  );
}

export default AppRoutes;
