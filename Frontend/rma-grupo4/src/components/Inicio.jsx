import { Box, Grid, GridItem } from '@chakra-ui/react';
import { useState } from 'react';
import SelectorNodo from './SelectorNodo';
import ResumenVariable from '../pages/ResumenVariable'; 
import GraficoLinea from '../pages/GraficoLinea';
import GraficoBarra from '../pages/GraficoBarra';
import TablaPage from '../pages/TablaPage';
import GraficoArea from '../pages/GraficoArea';
import GraficoRosa from '../pages/GraficoRosa';
import GraficoMedidor from '../pages/GraficoMedidor';

export default function Inicio() {
  const [selectedNode, setSelectedNode] = useState(0);
  return (
    <Box textAlign="center" maxWidth="auto" mx="auto" bg="gray.900" boxShadow="md">
     

      {/* Sección de Tabla y Gráficos adicionales */}
      <Box mt={0} p={{ base: 2, md: 4 }}>
        <Grid
          templateColumns="1fr" // Ajustar la tabla para que use todo el ancho disponible
          gap={4}
          width="100%"
          bg="gray.900"
          borderRadius="md"
        >
          {/* Componente de la Tabla */}
          <GridItem colSpan={1} bg="gray.800" p={{ base: 1, md: 2}} borderRadius="md" boxShadow="lg" width="100%">
            <TablaPage/>
          </GridItem>
        </Grid>
      </Box>
      {/* Seleccionar Nodo*/}
      <SelectorNodo onChange={(nodeId) => setSelectedNode(nodeId)} />

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
          <ResumenVariable title="Temperatura" url="http://localhost:8000/api/v1/clima/temperatura" nodeId={selectedNode}/>
          <ResumenVariable title="Humedad" url="http://localhost:8000/api/v1/clima/humedad" nodeId={selectedNode}/>
          <ResumenVariable title="Precipitación" url="http://localhost:8000/api/v1/clima/precipitacion" nodeId={selectedNode}/>
          <ResumenVariable title="Viento" url="http://localhost:8000/api/v1/clima/viento" nodeId={selectedNode}/>
          <ResumenVariable title="Presión" url="http://localhost:8000/api/v1/clima/presion" nodeId={selectedNode}/>
        </Grid>
      </Box>
      <Box p={{ base: 2, md: 4 }}>
      <Grid
        templateColumns={{ base: '1fr', md: '2fr 1fr' }}
        gap={4}
        maxWidth="100%"
      >
        {/* Gráfico Lineas - Temperatura */}
        <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
          <GraficoLinea title="Temperatura" url="http://localhost:8000/api/v1/clima/temperatura" nodeId={selectedNode}/>
        </GridItem>

        {/* Columna derecha con dos gráficos */}
        <GridItem>
          <Grid templateRows="1fr 1fr" gap={4}>
              {/* Gráfico medidor o gauge-chart - Presión */}
            <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
              <GraficoMedidor title="Presión" url="http://localhost:8000/api/v1/clima/presion" nodeId={selectedNode}/>
            </GridItem>
            {/* Gráfico rosa de viento */}
            <GridItem bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
              <GraficoRosa title="V. de Viento" url="http://localhost:8000/api/v1/clima/viento" nodeId={selectedNode}/>
            </GridItem>
          </Grid>
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
          borderRadius="md"
        >
          <GridItem colSpan={{ base: 1, md: 1 }} bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md">
            <GraficoArea url="http://localhost:8000/api/v1/clima/humedad" nodeId={selectedNode}/>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 1 }} bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md" >
            <GraficoBarra url="http://localhost:8000/api/v1/clima/precipitacion" nodeId={selectedNode}/>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
