// src/pages/Inicio.jsx

import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';

// Importar los componentes
import GraficoLinea from '../pages/GraficoLinea';
import GraficoBarra from '../pages/GraficoBarra';
import TablaPage from '../pages/TablaPage';
import GraficosPage from '../pages/GraficosPage';

export default function Inicio() {
  const [selectedVariables, setSelectedVariables] = useState(['temperatura', 'humedad', 'presion', 'viento']);
  const [tablaData, setTablaData] = useState([]); // Datos para la tabla
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados por la selección de la tabla

  // Lógica para obtener los datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/clima/temperatura');
        const processedData = response.data.map((item) => ({
          Nodo: item.id_nodo ?? 'Desconocido',
          Humedad: parseFloat(item.humedad ?? 0), // Convertir a número
          Temperatura: parseFloat(item.temperatura ?? 0), // Convertir a número
          Presion: parseFloat(item.presion ?? 0), // Convertir a número
          time: item.time ?? "Sin timestamp", 
        }));
        setTablaData(processedData);
        setFilteredData(processedData);

        // Log para depuración
        console.log("Datos procesados de la API:", processedData);
      } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
      }
    };
    fetchData();
  }, []);

  // Función para manejar el filtrado de datos desde la tabla
  const handleRowSelection = (selectedRows) => {
    const newFilteredData = selectedRows.length
      ? tablaData.filter((_, index) => selectedRows.includes(index))
      : tablaData;
    setFilteredData(newFilteredData);

    // Log para verificar el estado de los datos filtrados
    console.log("Datos filtrados:", newFilteredData);
  };

  return (
    <Box textAlign="center" maxWidth="auto" mx="auto" bg="gray.900" boxShadow="md">
      {/* Sección de gráficos lineales y de barras */}
      <Box p={{ base: 2, md: 4 }}>
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
          gap={4}
          maxWidth="100%"
          bg="gray.900"
          p={{ base: 2, md: 6 }} 
          borderRadius="md"
        >
          <GridItem colSpan={2} bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              {/* Grafico Linea */}
              <GridItem>
              <GraficoLinea
                selectedVariables={selectedVariables}
                setSelectedVariables={setSelectedVariables}
                data={filteredData} // Pasar datos filtrados a GraficoLinea
              />
              </GridItem>

              {/* Grafico Barra */}
              <GridItem>
                <GraficoBarra
                  selectedVariables={selectedVariables}
                  setSelectedVariables={setSelectedVariables}
                  data={filteredData} // Pasar datos filtrados a GraficoBarra
                />
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Box>

      {/* Sección de Tabla y Gráficos adicionales */}
      <Box mt={0} p={{ base: 2, md: 4 }}>
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
          gap={4}
          maxWidth="100%"
          bg="gray.900"
          p={{ base: 2, md: 6 }} 
          borderRadius="md"
        >
          {/* Componente de la Tabla */}
          <GridItem colSpan={{ base: 1, md: 1 }} bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
            <TablaPage
              data={tablaData}          // Pasar los datos a la tabla
              onRowSelection={handleRowSelection} // Manejar selección de filas
            />
          </GridItem>

          {/* Componente de Gráficos adicionales */}
          <GridItem colSpan={{ base: 1, md: 1 }} bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md">
            <GraficosPage data={filteredData} /> {/* Pasar datos filtrados */}
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
