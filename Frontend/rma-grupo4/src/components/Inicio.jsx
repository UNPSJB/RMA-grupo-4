import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import GraficoLinea from '../pages/GraficoLinea';
import GraficoBarra from '../pages/GraficoBarra';
import TablaPage from '../pages/TablaPage';
import GraficosPage from '../pages/GraficosPage';

export default function Inicio() {
  const [selectedVariables, setSelectedVariables] = useState(['temperatura']);
  const [tablaData, setTablaData] = useState([]); // Datos para la tabla
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados por la selección de la tabla
  const [summary, setSummary] = useState({}); // Resumen de los datos

  // Lógica para obtener los datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener temperatura
        const tempResponse = await axios.get('http://localhost:8000/api/v1/clima/temperatura');
        const tempData = tempResponse.data.data.map(item => ({
          Nodo: item.id_nodo ?? 'Desconocido',
          Temperatura: parseFloat(item.data ?? 0),
          Timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString('es-AR') : "Sin timestamp",
        }));

        // Obtener humedad
        const humidityResponse = await axios.get('http://localhost:8000/api/v1/clima/humedad');
        const humidityData = humidityResponse.data.data.map(item => ({
          Nodo: item.id_nodo ?? 'Desconocido',
          Humedad: parseFloat(item.data ?? 0),
          Timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString('es-AR') : "Sin timestamp",
        }));

        // Obtener presión
        const pressureResponse = await axios.get('http://localhost:8000/api/v1/clima/presion');
        const pressureData = pressureResponse.data.data.map(item => ({
          Nodo: item.id_nodo ?? 'Desconocido',
          Presion: parseFloat(item.data ?? 0),
          Timestamp: item.timestamp ? new Date(item.timestamp).toLocaleString('es-AR') : "Sin timestamp",
        }));

        // Combinar los datos
        const combinedData = [...tempData, ...humidityData, ...pressureData];

        setTablaData(combinedData);
        setFilteredData(combinedData);  // Inicialmente, los datos filtrados son los mismos que los de la tabla
        setSummary({}); // Aquí podrías agregar un resumen si es necesario

        console.log("Datos combinados de la API:", combinedData);
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
                  data={filteredData} // Pasar datos filtrados a GraficoLinea
                />
              </GridItem>

              {/* Grafico Barra */}
              <GridItem>
                <GraficoBarra
                  selectedVariables={selectedVariables}
                  data={filteredData} // Pasar datos filtrados a GraficoBarra
                />
              </GridItem>
            </Grid>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}