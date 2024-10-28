import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './components/Home';
import Login from './components/Login';
import Registrar from './components/Registrar';
import Inicio from './components/Inicio';
import PrivateRoute from './components/PrivateRoute';
import TablaPage from './pages/TablaPage';   
import HistoricosPage from './pages/HistoricosPage'; 
import GraficoLinea from './pages/GraficoLinea';   
import GraficoBarra from './pages/GraficoBarra';  
import GraficoArea from './pages/GraficoArea';
import GraficoRosa from './pages/GraficoRosa';
import GraficoMedidor from './pages/GraficoMedidor';
import ModificarDatos from './components/ModificarDatos';
import ModificarPassword from './components/ModificarPassword';
import EliminarUsuario from './components/EliminarUsuario';
import HelpModal from './components/HelpModal';
import PantallaComparativa from './analisis/PantallaComparativa';
import GeneraQR from './utils/GeneraQR';
import TablaDatosHistoricos from './pages/TablaDatosHistoricos'; 
import TablaAuditoria from './pages/TablaAuditoria';
import CrearNodo from './components/Nodo';
import Admin from './components/Admin';
import AsignarRol from './components/AsignarRol';
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
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            </App>
          } 
        />
        
        {/* Rutas adicionales protegidas */}
        <Route 
          path="/tabla" 
          element={
            <App>
              <PrivateRoute>
                <TablaPage />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/area" 
          element={
            <App>
              <PrivateRoute>
                <GraficoArea />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/historicos" 
          element={
            <App>
              <PrivateRoute>
                <HistoricosPage />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/comparativo" 
          element={
            <App>
              <PrivateRoute>
                <PantallaComparativa />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/graficoLinea" 
          element={
            <App>
              <PrivateRoute>
                <GraficoLinea />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/graficoBarra" 
          element={
            <App>
              <PrivateRoute>
                <GraficoBarra />
              </PrivateRoute>
            </App>
          } 
        />
     
        <Route 
          path="/tabla_datos_historicos" 
          element={
            <App>
              <PrivateRoute>
                <TablaDatosHistoricos />
              </PrivateRoute>
            </App>
          } 
        />
         <Route 
          path="/auditoria" 
          element={
            <App>
              <PrivateRoute>
                <TablaAuditoria />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/graficoRosa" 
          element={
            <App>
              <PrivateRoute>
                <GraficoRosa />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/graficoMedidor" 
          element={
            <App>
              <PrivateRoute>
                <GraficoMedidor />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/modificar_datos" 
          element={
            <App>
              <PrivateRoute>
                <ModificarDatos />
              </PrivateRoute>
            </App>
          } 
        />
        
        <Route 
          path="/usuarios" 
          element={
            <App>
              <PrivateRoute>
                <Usuarios />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/roles" 
          element={
            <App>
              <PrivateRoute>
                <Roles />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/nodos" 
          element={
            <App>
              <PrivateRoute>
                <ListaNodos/>
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/modificar_password" 
          element={
            <App>
              <PrivateRoute>
                <ModificarPassword />
              </PrivateRoute>
            </App>
          } 
        />
         <Route 
          path="/eliminar_usuario" 
          element={
            <App>
              <PrivateRoute>
                <EliminarUsuario />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/help" 
          element={
            <App>
              <PrivateRoute>
                <HelpModal />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/generar_qr" 
          element={
            <App>
              <PrivateRoute>
                <GeneraQR />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/crear_nodo" 
          element={
            <App>
              <PrivateRoute>
                <CrearNodo/>
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <App>
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/alertaAdmin" 
          element={
            <App>
              <PrivateRoute>
                <AlertasAdmin/>
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/crear_nodo" 
          element={
            <App>
              <PrivateRoute>
                <CrearNodo/>
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/utils/GeneraQR" 
          element={
            <App>
              <PrivateRoute>
               <GeneraQR />
              </PrivateRoute>
            </App>
          } 
        />
      </Routes>
      
    </Router>
    
  );
}

export default AppRoutes;
