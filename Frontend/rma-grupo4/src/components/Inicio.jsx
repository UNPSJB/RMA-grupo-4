import { Box, Grid, GridItem, useColorMode, Heading, Button, Select, useColorModeValue} from '@chakra-ui/react';
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
import GraficoNivelAgua from '../pages/GraficoNivelAgua';
import { useAuth } from './AuthContext'; // Importa el hook de autenticación

export default function Inicio() {
  const [selectedNode, setSelectedNode] = useState(0);
  const [dateRange, setDateRange] = useState(24);
  const { colorMode } = useColorMode(); // Modo de color actual
  const { userRole } = useAuth(); // Obtenemos el rol del usuario desde el contexto

  const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

  const handleRangeChange = (event) => {
    const hours = parseInt(event.target.value, 10);
    setDateRange(hours);
  };

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

        <Heading as="h1" m={7} textAlign="center">Últimos Actualizados</Heading>  
        <Box p={{ base: 2, md: 4 }}>
          <Box gap={4} mb={4} display="flex" justifyContent="center">
            <SelectorNodo onChange={(nodeId) => setSelectedNode(nodeId)} />
            <Select 
              placeholder="Selecciona un rango de tiempo" 
              onChange={handleRangeChange}
              size="md"  
              bg={colorMode === 'light' ? 'white' : 'gray.800'}
              color={colorMode === 'light' ? 'black' : 'white'} 
              borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
              _hover={{ borderColor: 'teal.300' }}  
              _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}  
              borderRadius="md"  
              w="300px"
              sx={{
                option: {
                  backgroundColor: colorMode === 'light' ? 'white' : 'gray.900',
                  color: colorMode === 'light' ? 'black' : 'white',
                },
              }}
            >
              <option value={1}>1 Hora</option>
              <option value={24}>1 Día</option>
              <option value={72}>3 Días</option>
              <option value={168}>7 Días</option>
            </Select>
          </Box>
          <Grid
            templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
            gap={4}
            maxWidth="100%"
            bg={colorMode === 'light' ? 'gray.300' : 'gray.700'}
            p={{ base: 2, md: 6 }}
            borderRadius="md"
          >
            <ResumenVariable title="Temperatura" url="http://localhost:8000/api/v1/clima/temperatura" nodeId={selectedNode} unidad="C°" dateRange={dateRange}/>
            <ResumenVariable title="Humedad" url="http://localhost:8000/api/v1/clima/humedad" nodeId={selectedNode} unidad="%" dateRange={dateRange}/>
            <ResumenVariable title="Precipitación" url="http://localhost:8000/api/v1/clima/precipitacion" nodeId={selectedNode} unidad="mm" dateRange={dateRange}/>
            <ResumenVariable title="Viento" url="http://localhost:8000/api/v1/clima/viento" nodeId={selectedNode} unidad="km/h" dateRange={dateRange}/>
            <ResumenVariable title="Presión" url="http://localhost:8000/api/v1/clima/presion" nodeId={selectedNode} unidad="hPa" dateRange={dateRange}/>
          </Grid>
        </Box>

        <Box p={{ base: 2, md: 4 }}>
          {userRole?.trim() === 'cooperativa' ? (
            // Aca si es cooperativa ordena de otra manera los graficos
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={6}
              bg={colorMode === 'light' ? 'gray.200' : 'gray.900'}
              p={{ base: 4, md: 6 }}
              borderRadius="md"
              boxShadow="lg"
            >
              {/* Gráfico de Nivel de Agua */}
              <Box 
                bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
                p={{ base: 2, md: 4 }} 
                borderRadius="md" 
                width="80%"
              >
                <GraficoNivelAgua 
                  title="Nivel de Agua" 
                  url="http://localhost:8000/api/v1/clima/nivel-agua" 
                  nodeId={selectedNode} 
                />
              </Box>
              
              {/* Gráfico de Temperatura */}
              <Box 
                bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
                p={{ base: 2, md: 4 }} 
                borderRadius="md" 
                width="80%"
              >
                <GraficoLinea 
                  title="Temperatura" 
                  url="http://localhost:8000/api/v1/clima/temperatura" 
                  nodeId={selectedNode} 
                />
              </Box>

              {/* Gráfico de Viento */}
              <Box 
                bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
                p={{ base: 2, md: 4 }} 
                borderRadius="md" 
                width="80%"
              >
                <GraficoRosa 
                  title="V. de Viento" 
                  url="http://localhost:8000/api/v1/clima/viento" 
                  nodeId={selectedNode}
                />
              </Box>
            </Box>
          ) : (
            <Grid
              templateColumns={{ base: '1fr', md: '2fr 1fr' }}
              gap={4}
              maxWidth="100%"
            >
              <GridItem 
                bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
                p={{ base: 2, md: 4 }} 
                borderRadius="md" 
                boxShadow="lg"
              >
                <GraficoLinea title="Temperatura" url="http://localhost:8000/api/v1/clima/temperatura" nodeId={selectedNode}/>
              </GridItem>

              <GridItem>
                <Grid templateRows="0.5fr 0.5fr" gap={4}>
                  <GridItem 
                    bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
                    p={{ base: 2, md: 4 }} 
                    borderRadius="md" 
                    boxShadow="lg"
                  >
                    {(userRole?.trim() === 'profesional' || userRole?.trim() === 'admin') ? (
                      <GraficoMedidor 
                        title="Presión" 
                        url="http://localhost:8000/api/v1/clima/presion" 
                        nodeId={selectedNode} 
                      />
                    ) : (
                      <GraficoNivelAgua 
                        title="Nivel de Agua" 
                        url="http://localhost:8000/api/v1/clima/nivel-agua" 
                        nodeId={selectedNode} 
                      />
                    )}
                  </GridItem>
                  
                  <GridItem 
                    bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
                    p={{ base: 2, md: 4 }} 
                    borderRadius="md" 
                    boxShadow="lg"
                  >
                    <GraficoRosa title="V. de Viento" url="http://localhost:8000/api/v1/clima/viento" nodeId={selectedNode}/>
                  </GridItem>
                </Grid>
              </GridItem>
            </Grid>
            )}
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
        <Button 
          background={buttonDefaultColor}
          borderRadius="6px"
          boxShadow={buttonShadow}
          _hover={{ 
              background: buttonHoverColor, 
              color: "lightgray"
          }} 
          m={4} 
          onClick={downloadPDF}
        >
          Descargar PDF
        </Button>
    </Box>
  );
}
