import React, { useState, useEffect } from 'react';
import { Box, Heading, Select, Flex, useColorMode, Table, Thead, Tbody, Tr, Th, Td, Input, useToast, Center} from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Bar, PolarArea } from 'react-chartjs-2';
import { FaTemperatureHigh, FaTint, FaWind, FaClock } from 'react-icons/fa';
import { GiSpeedometer, GiWaterDrop } from 'react-icons/gi';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';

ChartJS.register(...registerables);

const variables = [
  { name: 'Temperatura', color: 'rgba(255, 99, 132, 0.5)' },
  { name: 'Humedad', color: 'rgba(54, 162, 235, 0.5)' },
  { name: 'Presión', color: 'rgba(100, 206, 86, 0.5)' },
  { name: 'Viento', color: 'rgba(75, 192, 192, 0.5)' },
  { name: 'Precipitacion', color: 'rgba(10, 122, 122, 0.5)' },
];

const variableMapping = {
  Temperatura: 'temperature',
  Humedad: 'humidity',
  Presión: 'pressure',
  Viento: 'wind',
  Precipitacion: 'precipitation',
};

function HistoricosPage() {
  const { colorMode } = useColorMode();
  const [selectedVariable, setSelectedVariable] = useState('Temperatura');
  const [chartData, setChartData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [options, setOptions] = useState({});
  const [optionsPolar, setOptionsPolar] = useState({});
  const today = new Date();
  const argentinaOffset = today.getTimezoneOffset() + 180; // UTC-3
  const argentinaDate = new Date(today.getTime() - argentinaOffset * 60000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(argentinaDate);
  const { token } = useAuth();
  const [availableDates, setAvailableDates] = useState([]);
  const [noData, setNoData] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/clima/nodos/historico', {headers: { Authorization: `Bearer ${token}`}});
        const nodes = response.data;
        let processedData = [];
        let datesSet = new Set();

        nodes.forEach(node => {
          const entry = {};
          entry.id_nodo = node.id_nodo;

          variables.forEach(({ name }) => {
            const mappedVariable = variableMapping[name];
            const variableData = node[mappedVariable] || [];

            variableData.forEach(item => {
              const date = new Date(item.timestamp);
              const timeKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
              datesSet.add(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`); // Guardamos la fecha

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

        // Convertimos el Set a un array y lo guardamos como fechas disponibles
        setAvailableDates(Array.from(datesSet));

        processedData = processedData.filter(item => {
          const [year, month, day] = selectedDate.split('-').map(Number);
          return (
            item.year === year &&
            item.month === month &&
            item.day === day &&
            item[selectedVariable] !== '-' &&
            item[selectedVariable] !== null &&
            !isNaN(item[selectedVariable])
          );
        });

        if (processedData.length === 0) {
          setNoData(true);
        } else {
          setNoData(false);
        }

        setHistoricalData(processedData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [selectedDate, selectedVariable]);

  useEffect(() => {
    if (historicalData.length === 0) return;
  
    const sortedData = historicalData.sort((a, b) => {
      const dateA = new Date(a.year, a.month - 1, a.day, a.hour);
      const dateB = new Date(b.year, b.month - 1, b.day, b.hour);
      return dateA - dateB;
    });
  
    const labels = sortedData.map(row => `${row.hour}:00`);
    const data = sortedData.map(row => (typeof row[selectedVariable] === 'number' ? row[selectedVariable] : null));
  
    const filteredData = data.filter(d => d !== null);
  
    const newChartData = {
      labels: labels.slice(0, filteredData.length),
      datasets: [
        {
          label: `${selectedVariable}`,
          data: filteredData,
          backgroundColor: variables.find(v => v.name === selectedVariable).color,
          borderColor: variables.find(v => v.name === selectedVariable).color,
          borderWidth: 4,
          fill: selectedVariable === 'Humedad' || selectedVariable === 'Precipitacion',
          tension: selectedVariable === 'Temperatura' || selectedVariable === 'Presión' || selectedVariable === 'Humedad' ? 0.4 : 0, // Curva solo en líneas
        },
      ],
    };
  
    // Muestra el titulo segun la variable que se selecciona
    const yAxisTitle = `${selectedVariable} (${selectedVariable === 'Temperatura' ? '°C' : selectedVariable === 'Humedad' ? '%' : selectedVariable === 'Presión' ? 'hPa' : selectedVariable === 'Viento' ? 'km/h' : selectedVariable === 'Precipitacion' ? 'mm' : ''})`;
  
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeInOutQuad',
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const row = sortedData[context.dataIndex];
              return `Nodo ${row.id}: ${context.formattedValue} ${selectedVariable}`;
            },
          },
        },
        legend: { 
          position: 'top',
          labels: { 
            color: colorMode === 'light' ? 'black' : 'white',
            font: { size: 12 } 
          }
        },
      },
      scales: {
        x: { 
          ticks: { 
            color: colorMode === 'light' ? 'black' : 'white', 
            font: { size: 12 } 
          },
          grid: { 
            color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' 
          }
        },
        y: { 
          ticks: { 
            color: colorMode === 'light' ? 'black' : 'white',
            font: { size: 12 }
          },
          title: { 
            display: true, 
            text: yAxisTitle, 
            color: colorMode === 'light' ? 'black' : 'white',
            font: { size: 12 },
        
          },
          grid: { 
            color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
          }
        },
      },
    };
  
    const chartOptionsPolar = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        legend: { position: 'right' },
      },
      scales: {
        ...chartOptions.scales,
        r: { 
          pointLabels: {
            color: colorMode === 'light' ? 'black' : 'white', 
            font: { size: 12 }
          },
          angleLines: {
            display: true,
            color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'white', 
          },
          ticks: { 
            color: colorMode === 'light' ? 'black' : 'black', 
            font: { size: 12 } 
          },
          grid: { 
            color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'white' 
          }
        }
      },
    };
  
    setChartData(newChartData);
    setOptions(chartOptions);
    setOptionsPolar(chartOptionsPolar);
  }, [historicalData, selectedVariable, colorMode]);

  const renderChart = () => {
    if (noData) return <Box textAlign="center" mt={4}>No hay datos disponibles para esta fecha.</Box>;
    if (!chartData) return null;

    if (selectedVariable === 'Temperatura' || selectedVariable === 'Presión') {
      return <Line data={chartData} options={options} />;
    } else if (selectedVariable === 'Humedad') {
      return <Line data={chartData} options={{ ...options, elements: { line: { fill: true } } }} />;
    } else if (selectedVariable === 'Precipitacion') {
      return <Bar data={chartData} options={options} />;
    } else if (selectedVariable === 'Viento') {
      return <PolarArea data={chartData} options={optionsPolar} />;
    }
  };

  return (
    <Box p={4} bg={colorMode === 'light' ? 'white' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'}>
      <Heading as="h1" m={7} textAlign="center">Gráficos Datos Históricos</Heading>
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
        <Box>
          <Input
            id="date-selector"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              const newDate = e.target.value;
              if (availableDates.includes(newDate)) {
                setSelectedDate(newDate);
              } else {
                toast({
                    render: () => (
                      <Box 
                      color="white" 
                      bg="red.600" 
                      borderRadius="md" 
                      p={5} mb={4} 
                      boxShadow="md" 
                      fontSize="lg"
                    >
                      No hay datos disponibles para esta fecha.
                    </Box>
                  ),
                  duration: 2000,
                  isClosable: true,
                })
              }
            }}
            min="2024-10-01" 
            max={argentinaDate}
          />
        </Box>
      </Flex>
      <Box
        bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} 
        p={{ base: 2, md: 4 }} 
        borderRadius="md" 
        boxShadow="lg"
      >
        <Box 
          borderRadius="md" 
          boxShadow="lg" 
          height="400px" 
          maxHeight="400px" 
          overflow="hidden" 
          bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} 
          color={colorMode === 'light' ? 'black' : 'white'}
          p={{ base: 2, md: 4 }}
        >
          {renderChart()}
        </Box>
      </Box>
      <Box bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
        <Box overflowX="auto" mt={2} borderRadius="md" boxShadow="lg" p={7} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
          <Table  variant="simple" colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"}>
            <Thead>
              <Tr>
                <Th textAlign={'center'} color={colorMode === 'light' ? 'black' : 'white'}>Nodo</Th>
                <Th>
                  <Center color={colorMode === 'light' ? 'black' : 'white'}>
                    <FaClock size="1.5em" style={{ marginRight: "5px" }} />
                    Fecha
                  </Center>
                </Th>
                <Th>
                  <Center color={colorMode === 'light' ? 'black' : 'white'}>
                    {
                      selectedVariable === 'Temperatura'
                      ? <FaTemperatureHigh style={{ marginRight: "5px" }} />
                      : selectedVariable === 'Viento'
                      ? <FaWind size="1.5em" style={{ marginRight: "5px" }} />
                      : selectedVariable === 'Humedad'
                      ? <FaTint size="1.5em" style={{ marginRight: "5px" }} />
                      : selectedVariable === 'Presión'
                      ? <GiSpeedometer size="1.5em" style={{ marginRight: "5px" }} />
                      : selectedVariable === 'Precipitacion'
                      ? <GiWaterDrop size="1.5em" style={{ marginRight: "5px" }} />
                      : ''
                    }
                    {selectedVariable}
                  </Center>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {historicalData.map((item, index) => (
                <Tr key={index} 
                  bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                  color={colorMode === 'light' ? 'black' : 'white'}
                  _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }}
                >
                  <Td textAlign={'center'}>{item.id}</Td>
                  <Td textAlign={'center'}>{item.year}-{item.month}-{item.day} {item.hour}:00</Td>
                  <Td textAlign={'center'}>
                  {
                    typeof item[selectedVariable] === 'number' && !isNaN(item[selectedVariable])
                      ? `${item[selectedVariable].toFixed(2)} ${
                          selectedVariable === 'Temperatura'
                            ? '°C'
                            : selectedVariable === 'Viento'
                            ? 'km/h'
                            : selectedVariable === 'Humedad'
                            ? '%'
                            : selectedVariable === 'Presión'
                            ? 'hPa'
                            : selectedVariable === 'Precipitacion'
                            ? 'mm'
                            : ''
                        }`
                      : '-'
                  }
                  </Td>
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