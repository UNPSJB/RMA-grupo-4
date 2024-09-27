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
import VariablesPage from './pages/VariablesPage';  
import CombinacionesPage from './pages/CombinacionesPage';  

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
          path="/variables" 
          element={
            <App>
              <PrivateRoute>
                <VariablesPage />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/combinaciones" 
          element={
            <App>
              <PrivateRoute>
                <CombinacionesPage />
              </PrivateRoute>
            </App>
          } 
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
