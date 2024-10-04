import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './components/Home';
import Login from './components/Login';
import Registrar from './components/Registrar';
import Inicio from './components/Inicio';
import PrivateRoute from './components/PrivateRoute';
import TablaPage from './pages/TablaPage';  
import GraficosPage from './pages/GraficosPage';  
import HistoricosPage from './pages/HistoricosPage'; 
import GraficoLinea from './pages/GraficoLinea';   
import GraficoBarra from './pages/GraficoBarra';  
import ModificarDatos from './components/ModificarDatos';
import ModificarPassword from './components/ModificarPassword';
import EliminarUsuario from './components/EliminarUsuario';
import HelpModal from './components/HelpModal';

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
          path="/graficos" 
          element={
            <App>
              <PrivateRoute>
                <GraficosPage />
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
      </Routes>
    </Router>
  );
}

export default AppRoutes;
