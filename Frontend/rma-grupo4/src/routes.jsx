import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Login from "./components/Login";
import Registrar from "./components/Registrar";
import Inicio from "./components/Inicio";
import PrivateRoute from "./components/PrivateRoute";
import HistoricosPage from "./pages/HistoricosPage";
import ModificarDatos from "./components/ModificarDatos";
import ModificarPassword from "./components/ModificarPassword";
import HelpModal from "./components/HelpModal";
import PantallaComparativa from "./analisis/PantallaComparativa";
import TablaDatosHistoricos from "./pages/TablaDatosHistoricos";
import TablaAuditoria from "./pages/TablaAuditoria";
import TablaNodo from "./components/TablaNodos";
import FormNodo from "./components/FormNodo";
import Admin from "./components/Admin";
import Usuarios from "./components/Usuarios";
import Roles from "./components/Roles";
import ListaNodos from "./components/ListaNodos";
import AlertasAdmin from "./components/AlertasAdmin";
import Error403 from "./components/Error403";
import CrearVariable from "./components/Variables";
import RangosVariables from './components/RangosVariables';
import Notificaciones from './notificaciones/NotificacionesTabla';
import EstadoNodos from "./components/EstadosNodo";
import PreferenciasTabla from "./notificaciones/PreferenciasTabla";
import ValidarOTP from "./components/ValidarOTP";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rutas pÃºblicas */}
        <Route
          path="/"
          element={
            <App>
              <Home />
            </App>
          }
        />
        <Route path="/*" element={<Error403 />} />
        <Route
          path="/login"
          element={
            <App>
              <Login />
            </App>
          }
        />
        <Route
          path="/registrar"
          element={
            <App>
              <Registrar />
            </App>
          }
        />
        <Route path="/error403" element={<Error403 />} />

        {/* Ruta protegida */}
        <Route
          path="/analisis_actual"
          element={
            <App>
              <PrivateRoute
                allowedRoles={["admin", "cooperativa", "profesional"]}
              >
                <Inicio />
              </PrivateRoute>
            </App>
          }
        />
        {/* Rutas adicionales protegidas */}
        <Route
          path="/graficos_historicos"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin", "invitado", "universidad"]}>
                <HistoricosPage />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/analisis_avanzado"
          element={
            <App>
              <PrivateRoute
                allowedRoles={["admin", "profesional", "cooperativa"]}
              >
                <PantallaComparativa />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/tabla_historicos"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin", "invitado", "universidad"]}>
                <TablaDatosHistoricos />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/tabla_auditoria"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin"]}>
                <TablaAuditoria />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/modificar_datos"
          element={
            <App>
              <PrivateRoute
                allowedRoles={[
                  "admin",
                  "cooperativa",
                  "profesional",
                  "invitado",
                  "universidad",
                ]}
              >
                <ModificarDatos />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/usuarios"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin"]}>
                <Usuarios />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/roles"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin"]}>
                <Roles />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/nodos"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin"]}>
                <ListaNodos />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/modificar_password"
          element={
            <App>
              <PrivateRoute
                allowedRoles={[
                  "admin",
                  "cooperativa",
                  "profesional",
                  "invitado",
                  "universidad",
                ]}
              >
                <ModificarPassword />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/help"
          element={
            <App>
              <PrivateRoute
                allowedRoles={[
                  "admin",
                  "cooperativa",
                  "profesional",
                  "invitado",
                  "universidad",
                ]}
              >
                <HelpModal />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/suscripcion_alertas"
          element={
            <App>
              <PrivateRoute
                allowedRoles={["admin", "cooperativa", "profesional"]}
              >
                <ValidarOTP />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/gestion_nodos"
          element={
            <App>
              <PrivateRoute
                allowedRoles={["admin", "cooperativa", "profesional"]}
              >
                <TablaNodo />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/formulario_nodo"
          element={
            <App>
              <PrivateRoute
                allowedRoles={["admin", "cooperativa", "profesional"]}
              >
                <FormNodo />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/estado_nodo"
          element={
            <App>
              <PrivateRoute
                allowedRoles={["admin"]}
              >
                <EstadoNodos />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/panel_admin"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin"]}>
                <Admin />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/alertaAdmin"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin"]}>
                <AlertasAdmin />
              </PrivateRoute>
            </App>
          }
        />
        <Route
          path="/gestionVariables"
          element={
            <App>
              <PrivateRoute allowedRoles={["admin"]}>
                <CrearVariable />
              </PrivateRoute>
            </App>
          }
        />
        <Route 
          path="/gestionRangosVariables" 
          element={
            <App>
              <PrivateRoute allowedRoles={['admin']}>
                <RangosVariables />
              </PrivateRoute>
            </App>
          } 
        />
        <Route 
          path="/notificaciones" 
          element={
            <App>
              <PrivateRoute allowedRoles={["admin", "cooperativa", "profesional"]}>
                <Notificaciones />
              </PrivateRoute>
            </App>
          } 
        />
          <Route 
          path="/preferenciaNotificaciones" 
          element={
            <App>
              <PrivateRoute allowedRoles={["admin", "cooperativa", "profesional"]}>
                <PreferenciasTabla />
              </PrivateRoute>
            </App>
          } 
        />
        
      </Routes>
    </Router>
  );
}

export default AppRoutes;
