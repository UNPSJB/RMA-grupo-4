import { Box, Grid, GridItem } from '@chakra-ui/react';
import ResumenVariable from '../components/ResumenVariable'; // Importa el componente
import GraficoLinea from '../pages/GraficoLinea';
import GraficoBarra from '../pages/GraficoBarra';
import TablaPage from '../pages/TablaPage';
import GraficosPage from '../pages/GraficosPage';

export default function Inicio() {
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
                <GraficoLinea/>
              </GridItem>

              {/* Grafico Barra */}
              <GridItem maxWidth="100%" overflowX="auto">  {/* Ajustar tamaño máximo y desbordamiento */}
                <GraficoBarra/>
              </GridItem>
            </Grid>
          </GridItem>

          {/* Componente de Gráficos adicionales */}
          <GridItem colSpan={{ base: 1, md: 1 }} bg="gray.800" p={{ base: 2, md: 4 }} borderRadius="md">
            <GraficosPage/>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
