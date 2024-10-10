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

  // Lógica para obtener los datos de la API y combinarlos por nodo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          { url: 'http://localhost:8000/api/v1/clima/temperatura', variable: 'Temperatura' },
          { url: 'http://localhost:8000/api/v1/clima/humedad', variable: 'Humedad' },
          { url: 'http://localhost:8000/api/v1/clima/presion', variable: 'Presion' },
          { url: 'http://localhost:8000/api/v1/clima/precipitacion', variable: 'Precipitacion' },
          { url: 'http://localhost:8000/api/v1/clima/viento', variable: 'Viento' },
        ];

        let combinedData = {};

        // Obtener y procesar datos de cada endpoint
        for (const endpoint of endpoints) {
          const response = await axios.get(endpoint.url);
          const variableData = response.data.data;

          variableData.forEach(item => {
            const nodo = item.id_nodo ?? 'Desconocido';
            const timestamp = item.timestamp ? new Date(item.timestamp) : null;
            const value = parseFloat(item.data ?? 0);
          
            if (!combinedData[nodo]) {
              combinedData[nodo] = {
                Nodo: nodo,
                Temperatura: null,
                Humedad: null,
                Presion: null,
                Precipitacion: null,
                Viento: null,
                Timestamp: null // Guardar como objeto Date en lugar de string
              };
            }
          
            // Actualizar el valor y el timestamp solo si es más reciente
            if (!combinedData[nodo][endpoint.variable] || (timestamp && (!combinedData[nodo].Timestamp || timestamp > combinedData[nodo].Timestamp))) {
              combinedData[nodo][endpoint.variable] = value;
              combinedData[nodo].Timestamp = timestamp; // Guardar como objeto Date
            }
          });
        }

        // Convertir el objeto a un array para la tabla
        const combinedArray = Object.values(combinedData);

        setTablaData(combinedArray);
        setFilteredData(combinedArray);  // Inicialmente, los datos filtrados son los mismos que los de la tabla
        setSummary({}); // Aquí podrías agregar un resumen si es necesario

        console.log("Datos combinados por nodo:", combinedArray);
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
          templateColumns="1fr" // Ajustar la tabla para que use todo el ancho disponible
          gap={4}
          maxWidth="100%"
          bg="gray.900"
          p={{ base: 2, md: 6 }}
          borderRadius="md"
        >
          {/* Componente de la Tabla */}
          <GridItem colSpan={1} bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
            <TablaPage
              data={tablaData}          // Pasar los datos a la tabla
              onRowSelection={handleRowSelection} // Manejar selección de filas

            />
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
            <Grid 
              templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
              gap={4}
              maxWidth="100%"
              overflow="hidden"  // Evita desbordamiento en contenedor padre
            >
              {/* Grafico Linea */}
              <GridItem maxWidth="100%" overflowX="auto">  {/* Ajustar tamaño máximo y desbordamiento */}
                <GraficoLinea
                  selectedVariables={selectedVariables}
                  data={filteredData} // Pasar datos filtrados a GraficoLinea
                />
              </GridItem>

              {/* Grafico Barra */}
              <GridItem maxWidth="100%" overflowX="auto">  {/* Ajustar tamaño máximo y desbordamiento */}
                <GraficoBarra
                  selectedVariables={selectedVariables}
                  data={filteredData} // Pasar datos filtrados a GraficoBarra
                />
              </GridItem>
            </Grid>
          </GridItem>
          {/* Componente de Gráficos adicionales */}
          <GridItem colSpan={{ base: 1, md: 1 }} bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md">
            <GraficosPage 
              data={filteredData} 
              selectedVariables={selectedVariables} 
            />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}