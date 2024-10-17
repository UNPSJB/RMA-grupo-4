import React, { useState, useEffect } from 'react';
import { Box, Heading, Select, Table, Thead, Tbody, Tr, Th, Td, useMediaQuery, Flex, useColorMode } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(...registerables);

const variables = [
  { name: 'temperatura', color: 'rgba(255, 99, 132, 0.5)' },
  { name: 'humedad', color: 'rgba(54, 162, 235, 0.5)' },
  { name: 'presion', color: 'rgba(100, 206, 86, 0.5)' },
  { name: 'viento', color: 'rgba(75, 192, 192, 0.5)' },
];

const variableMapping = {
  temperatura: 'temperature',
  humedad: 'humidity',
  presion: 'pressure',
  viento: 'wind',
};

const months = [
  { name: 'Enero', value: '01' },
  { name: 'Febrero', value: '02' },
  { name: 'Marzo', value: '03' },
  { name: 'Abril', value: '04' },
  { name: 'Mayo', value: '05' },
  { name: 'Junio', value: '06' },
  { name: 'Julio', value: '07' },
  { name: 'Agosto', value: '08' },
  { name: 'Septiembre', value: '09' },
  { name: 'Octubre', value: '10' },
  { name: 'Noviembre', value: '11' },
  { name: 'Diciembre', value: '12' },
];

const years = [
  { value: '2023' },
  { value: '2024' },
];

function HistoricosPage() {
  const { colorMode } = useColorMode(); // Obtener el estado del color mode
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const [selectedVariable, setSelectedVariable] = useState('temperatura');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedDay, setSelectedDay] = useState(new Date().getDate().toString());
  const [chartData, setChartData] = useState(null);
  const [days, setDays] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const getDias = (year, month) => Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const monthIndex = parseInt(selectedMonth, 10);
      const daysArray = getDias(selectedYear, monthIndex);
      setDays(daysArray);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/clima/nodos/historico');
  
        const nodes = response.data;
        let processedData = [];
  
        nodes.forEach(node => {
          const entry = {};
          entry.id_nodo = node.id_nodo;
          
          variables.forEach(({ name }) => {
            const mappedVariable = variableMapping[name];
            const variableData = node[mappedVariable] || [];
            
            variableData.forEach(item => {
              const date = new Date(item.timestamp);
              const timeKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
              if (!entry[timeKey]) {
                entry[timeKey] = {
                  id: node.id_nodo,
                  year: date.getFullYear(),
                  month: date.getMonth() + 1,
                  day: date.getDate(),
                  hour: date.getHours(),
                  temperatura: '-',
                  humedad: '-',
                  presion: '-',
                  viento: '-',
                };
              }
              entry[timeKey][name] = parseFloat(item.value) || 0;
            });
          });
  
          Object.values(entry).forEach(e => processedData.push(e));
        });
  
        // Filtrar los datos según el año, mes, día seleccionado
        processedData = processedData.filter(item => {
          if (selectedYear && item.year !== parseInt(selectedYear)) return false;
          if (selectedMonth && item.month !== parseInt(selectedMonth)) return false;
          if (selectedDay && item.day !== parseInt(selectedDay)) return false;
          return item[selectedVariable] !== '-';  // Solo mostrar filas donde la variable seleccionada tenga valores
        });
        
        setHistoricalData(processedData);
        setSelectedNode(nodes[0]?.id_nodo); // Seleccionamos el nodo actual
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };
  
    fetchData();
  }, [selectedYear, selectedMonth, selectedDay, selectedVariable]);

  useEffect(() => {
    if (historicalData.length === 0) return;

    const labels = historicalData.map(row => `${row.year}-${row.month}-${row.day} ${row.hour}:00`);
    const data = historicalData.map(row => row[selectedVariable]);
    const newChartData = {
      labels,
      datasets: [
        {
          label: selectedVariable,
          data,
          backgroundColor: variables.find(v => v.name === selectedVariable).color,
          borderColor: variables.find(v => v.name === selectedVariable).color,
          borderWidth: 4,
          fill: false,
          tension: 0.4
        },
      ],
    };

    setChartData(newChartData);
  }, [historicalData, selectedVariable]);

  const renderBarChart = () => {
    if (!chartData) return null;

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
      },
      plugins: {
        legend: { 
          position: isMobile ? 'bottom' : 'top',
          labels: { 
            color: colorMode === 'light' ? 'black' : 'white',
            font: { size: 12 } 
          }
        },
        title: {
          display: true,
          font: { size: 16, weight: 'bold' },
          color: colorMode === 'light' ? 'black' : 'white',
          padding: { top: 10, bottom: 10 },
        },
      },

      scales: {
        x: { 
          title: { display: true, text: 'Período' },
          ticks: { 
            color: colorMode === 'light' ? 'black' : 'white',
            font: { size: 12 } 
          },
          grid: { 
            color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' 
          }
        },
        y: { 
          title: { display: true, text: 'Valores' },
          ticks: { 
            color: colorMode === 'light' ? 'black' : 'white',  
            font: { size: 12 } 
          },
          grid: { 
            color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'  
          }
        },
      },
    };
    return (
      <Box borderRadius="md" boxShadow="md" height="400px" maxHeight="400px" overflow="hidden" bg={colorMode === 'light' ? 'white' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    );
  };

  return (
    <Box p={4} bg={colorMode === 'light' ? 'white' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'}>
      <Heading as="h1" m={7} textAlign="center">Históricos de variables</Heading>
      <Flex justify="center" mb={4} mt={5} wrap="wrap" gap={4}>
        <Select 
          value={selectedVariable} 
          onChange={(e) => setSelectedVariable(e.target.value)} 
          width="150px"
          variant="outline"
        >
          {variables.map((v) => (
            <option key={v.name} value={v.name}>{v.name}</option>
          ))}
        </Select>
        <Select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)} 
          width="100px"
          variant="outline"
        >
          {years.map((m) => (
            <option key={m.value} value={m.value}>{m.value}</option>
          ))}
        </Select>
        <Select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)} 
          width="120px"
          variant="outline"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.name}</option>
          ))}
        </Select>
        <Select 
          value={selectedDay} 
          onChange={(e) => setSelectedDay(e.target.value)} 
          width="90px"
          variant="outline"
        >
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </Select>
      </Flex>
      <Box
        bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}  // Fondo dinámico según el tema
        color={colorMode === 'light' ? 'black' : 'white'}
        p={isMobile ? 1 : 4} 
        borderRadius="md" 
        boxShadow="md" 
        width="100%"
      >
        <Box 
          bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}  // Fondo dinámico según el tema
          color={colorMode === 'light' ? 'black' : 'white'}
          p={isMobile ? 1 : 4} 
          borderRadius="md" 
          boxShadow="md" 
          width="100%"
          mb="4"
        >
          {renderBarChart()}
        </Box>
        <Box
          bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}  // Fondo dinámico según el tema
          color={colorMode === 'light' ? 'black' : 'white'}
          p={isMobile ? 1 : 4} 
          borderRadius="md" 
          boxShadow="md" 
          width="100%"
        >
          <Table variant="striped" colorScheme="teal" mt={4}>
            <Thead>
              <Tr>
                <Th textAlign="center">Nodo</Th>
                <Th textAlign="center">Año</Th>
                <Th textAlign="center">Hora</Th>
                <Th textAlign="center">{selectedVariable}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {historicalData.map((row, index) => (
                <Tr key={index}>
                  <Td textAlign="center">{row.id}</Td>
                  <Td textAlign="center">{`${row.year}-${row.month}-${row.day}`}</Td>
                  <Td textAlign="center">{row.hour}</Td>
                  <Td textAlign="center">{typeof row[selectedVariable] === 'number' ? row[selectedVariable].toFixed(2) : row[selectedVariable]}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}

export default HistoricosPage;
