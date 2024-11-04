import { Box, Grid, GridItem, useColorMode, Heading, Button } from '@chakra-ui/react';
import { useState } from 'react';
import SelectorNodo from './SelectorNodo';
import ResumenVariable from '../pages/ResumenVariable'; 
import GraficoLinea from '../pages/GraficoLinea';
import GraficoBarra from '../pages/GraficoBarra';
import TablaPage from '../pages/TablaPage';
import GraficoArea from '../pages/GraficoArea';
import GraficoRosa from '../pages/GraficoRosa';
import GraficoMedidor from '../pages/GraficoMedidor';
import html2pdf from 'html2pdf.js';
import Breadcrumbs from './Breadcrumbs';

export default function Inicio() {
  const [selectedNode, setSelectedNode] = useState(0);

  const { colorMode } = useColorMode(); // Modo de color actual

  const downloadPDF = () => {
    const element = document.getElementById('viewToDownload');

    const options = {
      margin: [10, 0],
      filename: 'vista_datos_mejorada.pdf',
      html2canvas: {
        scale: 4, 
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff', // Fondo siempre blanco
      },
      jsPDF: { format: 'a2', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    // Aplicar estilos temporales
    const originalBackgroundColor = element.style.backgroundColor;
    const originalColor = element.style.color;

    // Obtener todos los gráficos
    const graphs = element.querySelectorAll('canvas');

    graphs.forEach((graph) => {
      const chart = graph.getContext('2d');
      chart.fillStyle = '#000000'; // Color de los gráficos a negro forzados
    });

    // Cambia el color de fondo y el color del texto para el PDF
    element.style.backgroundColor = '#ffffff'; 
    element.style.color = '#000000'; 

    setTimeout(() => {
      html2pdf().from(element).set(options).save().then(() => {
        // Restaurar los estilos originales después de la exportación
        element.style.backgroundColor = originalBackgroundColor;
        element.style.color = originalColor;
        
        // Restaurar los estilos de los gráficos
        graphs.forEach((graph) => {
          const chart = graph.getContext('2d');
          chart.fillStyle = ''; 
        });
      });
    }, 500); 
  };

  return (
    <Box 
      textAlign="center" 
      maxWidth="auto" 
      mx="auto" 
      bg={colorMode === 'light' ? 'gray.100' : 'gray.900'} 
      color={colorMode === 'light' ? 'black' : 'white'}
      boxShadow="md"
    >

      {/* Contenedor que se descargará como PDF */}
      <Box id="viewToDownload">
        <Box mt={0} p={{ base: 2, md: 4 }}>
          <Heading as="h1" m={7} textAlign="center">Análisis Actualizado</Heading>
          <Grid
            templateColumns="1fr"
            gap={4}
            width="100%"
            bg={colorMode === 'light' ? 'gray.200' : 'gray.900'}
            borderRadius="md"
          >
            <GridItem 
              colSpan={1} 
              bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
              p={{ base: 1, md: 2}} 
              borderRadius="md" 
              boxShadow="lg" 
              width="100%"
            >
              <TablaPage/>
            </GridItem>
          </Grid>
        </Box>

        <Heading as="h1" m={7} textAlign="center">Últimos Diez Actualizados</Heading>  
        <SelectorNodo onChange={(nodeId) => setSelectedNode(nodeId)} />

        <Box p={{ base: 2, md: 4 }}>
          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
            gap={4}
            maxWidth="100%"
            bg={colorMode === 'light' ? 'gray.300' : 'gray.700'}
            p={{ base: 2, md: 6 }}
            borderRadius="md"
          >
            <ResumenVariable title="Temperatura" url="http://localhost:8000/api/v1/clima/temperatura" nodeId={selectedNode} unidad="C°"/>
            <ResumenVariable title="Humedad" url="http://localhost:8000/api/v1/clima/humedad" nodeId={selectedNode} unidad="%"/>
            <ResumenVariable title="Precipitación" url="http://localhost:8000/api/v1/clima/precipitacion" nodeId={selectedNode} unidad="mm"/>
            <ResumenVariable title="Viento" url="http://localhost:8000/api/v1/clima/viento" nodeId={selectedNode} unidad="km/h"/>
            <ResumenVariable title="Presión" url="http://localhost:8000/api/v1/clima/presion" nodeId={selectedNode} unidad="hPa"/>
          </Grid>
        </Box>

        <Box p={{ base: 2, md: 4 }}>
          <Grid
            templateColumns={{ base: '1fr', md: '2fr 1fr' }}
            gap={4}
            maxWidth="100%"
          >
            <GridItem bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
              <GraficoLinea title="Temperatura" url="http://localhost:8000/api/v1/clima/temperatura" nodeId={selectedNode}/>
            </GridItem>

            <GridItem>
              <Grid templateRows="0.5fr 0.5fr" gap={4}>
                <GridItem bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                  <GraficoMedidor title="Presión" url="http://localhost:8000/api/v1/clima/presion" nodeId={selectedNode}/>
                </GridItem>
                <GridItem bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
                  <GraficoRosa title="V. de Viento" url="http://localhost:8000/api/v1/clima/viento" nodeId={selectedNode}/>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Box>

        <Box p={{ base: 2, md: 4 }}>
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr' }} 
            gap={4}
            maxWidth="100%"
            bg={colorMode === 'light' ? 'gray.200' : 'gray.900'}
            borderRadius="md"
          >
            <GridItem colSpan={{ base: 1, md: 1 }} bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={{ base: 2, md: 4 }} borderRadius="md">
              <GraficoArea url="http://localhost:8000/api/v1/clima/humedad" nodeId={selectedNode}/>
            </GridItem>
            <GridItem colSpan={{ base: 1, md: 1 }} bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={{ base: 2, md: 4 }} borderRadius="md">
              <GraficoBarra url="http://localhost:8000/api/v1/clima/precipitacion" nodeId={selectedNode}/>
            </GridItem>
          </Grid>
        </Box>
      </Box>
      {/* Botón para descargar la vista como PDF */}
      <Button colorScheme="blue" m={4} onClick={downloadPDF}>
        Descargar PDF
      </Button>
    </Box>
  );
}
