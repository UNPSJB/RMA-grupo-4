import React, { useState, useEffect } from 'react'; // Importación de hooks para manejar el estado y efectos secundarios en React.
import axios from 'axios'; // Librería para realizar peticiones HTTP.
import {
  Box, Heading, IconButton, Stack, Text, Grid, GridItem, Button, Drawer, DrawerBody,
  DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure, useBreakpointValue, Select,
} from '@chakra-ui/react'; // Componentes de la librería Chakra UI para la interfaz de usuario.
import { FaBars, FaTimes } from 'react-icons/fa'; // Iconos de Font Awesome.
import { Chart as ChartJS, registerables, ArcElement } from 'chart.js'; // Importación de componentes de Chart.js para los gráficos.
import { Bar, Line, Radar, Scatter } from 'react-chartjs-2'; // Tipos de gráficos disponibles de react-chartjs-2.
import NavigationButtons from '../components/NavigationButtons'; // Componente personalizado para botones de navegación.
ChartJS.register(...registerables, ArcElement);

const variables = [{ name: 'temp_t', color: 'rgba(75, 192, 192, 1)' }]; // Definición de las variables con su nombre y color.

function VariablesPage() {
  const [selectedCharts, setSelectedCharts] = useState(['line']);
  const [selectedVariable, setSelectedVariable] = useState('temp_t');
  const [data, setData] = useState({});
  const [timeRange, setTimeRange] = useState("24h"); // Rango de tiempo inicial configurado en '1h'
  const [chartData, setChartData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isHamburger = useBreakpointValue({ base: true, md: false });

    // Efecto para obtener datos cuando cambia el rango de tiempo seleccionado.
    useEffect(() => {
      fetchData();
    }, [timeRange]);


   // Efecto para actualizar los datos de los gráficos cada vez que cambian los datos o la variable seleccionada.  
  useEffect(() => {
    if (data[selectedVariable]) {
      // Extraer las etiquetas (horas) y los valores (datos) de la variable seleccionada.
      const labels = data[selectedVariable].map(item => new Date(item.time).toLocaleTimeString());
      const values = data[selectedVariable].map(item => parseFloat(item.data));
      // Configurar los datos para el gráfico.
      setChartData({
        labels,
        datasets: [
          {
            label: selectedVariable,
            data: values,
            borderColor: variables.find(v => v.name === selectedVariable).color,
            backgroundColor: variables.find(v => v.name === selectedVariable).color.replace('1)', '0.5)'),
            borderWidth: 2,
            fill: false,
          },
        ],
      });
    }
  }, [data, selectedVariable]);

   // Función para obtener datos del backend según el rango de tiempo seleccionado.
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/mensajes', {
        params: { time_range: timeRange },
      });
      const newData = {};
      response.data.forEach(item => {
        if (!newData[item.type]) {
          newData[item.type] = [];
        }
        newData[item.type].push({ id_nodo: item.id_nodo, time: item.time, data: item.data });
      });
      setData(newData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

    // Función para renderizar el gráfico basado en el tipo especificado.
  const renderChart = (type) => {
    if (!chartData) return <Text color="gray.500" textAlign="center">Selecciona una variable para visualizar los datos</Text>;

    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'radar':
        return <Radar data={chartData} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={chartData} options={chartOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

   // Opciones de configuración para los gráficos.
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Datos: ${selectedVariable}` },
    },
  };

  return (
   
    <Box p={5} bg="gray.800" color="white" minH="100vh">
      <NavigationButtons />{/* Componente de botones de navegación */}
      <Heading as="h1" size="xl" mb={6} textAlign="center">Datos Variable</Heading>
       {/* Select para elegir el rango de tiempo */}
      <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} mb={5} bg="gray.700" color="white" borderColor="teal.400">
        <option style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} value="1h">Última hora</option>
        <option style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} value="24h">Últimas 24 horas</option>
        <option style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} value="7d">Últimos 7 días</option>
        <option style={{ backgroundColor: '#2D3748', color: '#E2E8F0' }} value="7d">Últimos 30 días</option>
      </Select>

   {/* Select de variables para mobile (Drawer) y desktop (Botones) */}
      {isHamburger ? (
        <>
          <IconButton icon={isOpen ? <FaTimes /> : <FaBars />} aria-label="Abrir menú" onClick={onOpen} mb="3" bg="teal.500" size="lg" />
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent bg="gray.900" color="white">
              <DrawerHeader bg="teal.600">Seleccionar Variable</DrawerHeader>
              <DrawerBody>
                <Stack spacing={4}>
                  {variables.map(variable => (
                    <Button key={variable.name} onClick={() => { setSelectedVariable(variable.name); onClose(); }} colorScheme={selectedVariable === variable.name ? 'teal' : 'gray'}>{variable.name}</Button>
                  ))}
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <Stack spacing={4} direction="row" mb={6} justifyContent="center">
          {variables.map(variable => (
            <Button key={variable.name} onClick={() => setSelectedVariable(variable.name)} colorScheme={selectedVariable === variable.name ? 'teal' : 'gray'}>{variable.name}</Button>
          ))}
        </Stack>
      )}

       {/* Contenedor de gráficos */}
       <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
        <GridItem>
          <Box bg="white" p={6} borderRadius="lg" boxShadow="md" height={{ base: '300px', md: '600px' }}>
            {renderChart('line')}
          </Box>
        </GridItem>
        <GridItem>
          <Stack spacing={6}>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" height="290px">
              {renderChart('bar')}
            </Box>
            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" height="290px">
              {renderChart('scatter')}
            </Box>
          </Stack>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default VariablesPage;
