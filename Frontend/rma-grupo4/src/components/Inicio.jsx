import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import ResumenVariable from '../components/ResumenVariable'; // Importa el componente
import GraficoLinea from '../pages/GraficoLinea';
import GraficoBarra from '../pages/GraficoBarra';
import TablaPage from '../pages/TablaPage';
import GraficosPage from '../pages/GraficosPage';

export default function Inicio() {
  const [selectedVariables, setSelectedVariables] = useState(['temperatura']);
  const [tablaData, setTablaData] = useState([]); // Datos para la tabla
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados por la selección de la tabla
  const [summary, setSummary] = useState({}); // Resumen de los datos


  // Función para manejar el filtrado de datos desde la tabla
  const handleRowSelection = (selectedRows) => {
    const newFilteredData = selectedRows.length
      ? tablaData.filter((_, index) => selectedRows.includes(index))
      : tablaData;
    setFilteredData(newFilteredData);
  };

  return (
    <Box textAlign="center" maxWidth="auto" mx="auto" bg="gray.900" boxShadow="md">
      
      {/* Sección de Resumen de Variables */}
      <Box p={{ base: 2, md: 4 }}>
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
          gap={4}
          maxWidth="100%"
          bg="gray.700"
          p={{ base: 2, md: 6 }}
          borderRadius="md"
        >
          {/** Aca estan las tarjetas de los resumenes del componente ResumenVariable */}
          <ResumenVariable title="Temperatura" url="http://localhost:8000/api/v1/clima/temperatura" />
          <ResumenVariable title="Humedad" url="http://localhost:8000/api/v1/clima/humedad" />
          <ResumenVariable title="Precipitación" url="http://localhost:8000/api/v1/clima/precipitacion" />
          <ResumenVariable title="Viento" url="http://localhost:8000/api/v1/clima/viento" />
          <ResumenVariable title="Presión" url="http://localhost:8000/api/v1/clima/presion" />
        </Grid>
      </Box>

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
           
            />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
