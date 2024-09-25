import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import TablaPage from "./pages/TablaPage";  
import GraficosPage from "./pages/GraficosPage";  
import HistoricosPage from "./pages/HistoricosPage"; 
import VariablesPage from "./pages/VariablesPage";  
import CombinacionesPage from "./pages/CombinacionesPage";  
import CombinacionesPage2 from "./pages/CombinacionesPage2";  

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tabla" element={<TablaPage />} />
        <Route path="/graficos" element={<GraficosPage />} />
        <Route path="/historicos" element={<HistoricosPage />} />
        <Route path="/variables" element={<VariablesPage />} />
        <Route path="/combinaciones" element={<CombinacionesPage />} />
        <Route path="/combinaciones2" element={<CombinacionesPage2 />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
