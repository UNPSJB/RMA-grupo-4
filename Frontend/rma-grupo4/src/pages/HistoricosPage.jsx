import React, { useState, useEffect } from 'react';
import { Box, Heading, Select, Flex, useColorMode, Table, Thead, Tbody, Tr, Th, Td, } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Bar, PolarArea } from 'react-chartjs-2'; // Importar diferentes tipos de gráficos
import axios from 'axios';

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
  { value: '2024' },
];

function HistoricosPage() {
  const { colorMode } = useColorMode();
  const [selectedVariable, setSelectedVariable] = useState('Temperatura');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [selectedDay, setSelectedDay] = useState('21');
  const [chartData, setChartData] = useState(null);
  const [days, setDays] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [options, setOptions] = useState({});
  const [optionsPolar, setOptionsPolar] = useState({});

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

        processedData = processedData.filter(item => {
          if (selectedYear && item.year !== parseInt(selectedYear)) return false;
          if (selectedMonth && item.month !== parseInt(selectedMonth)) return false;
          if (selectedDay && item.day !== parseInt(selectedDay)) return false;

          return item[selectedVariable] !== '-' && item[selectedVariable] !== null && !isNaN(item[selectedVariable]);
        });

        setHistoricalData(processedData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth, selectedDay, selectedVariable]);

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
          title: { display: true, color: 'white' },
          grid: { 
            color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
          }
        },
      },
    };

    const chartOptionsPolar = {
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
          position: 'right',
          labels: { 
            color: colorMode === 'light' ? 'black' : 'white',
            font: { size: 12 } 
          }
        },
      },
      scales: {
        y: { 
          ticks: { 
            color: colorMode === 'light' ? 'black' : 'white',
            font: { size: 12 }
          },
          title: { display: true, color: 'white' },
          grid: { 
            color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
          }
        },
        r: { // Para la escala radial del gráfico Radar
          pointLabels: { // Controla las etiquetas de las horas alrededor del gráfico
            color: colorMode === 'light' ? 'black' : 'white',  // Cambia este valor para ajustar el color de las etiquetas
            font: { size: 12
             } // Tamaño de las etiquetas de las horas
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
    }

    setChartData(newChartData);
    setOptions(chartOptions);
    setOptionsPolar(chartOptionsPolar);
  }, [historicalData, selectedVariable, colorMode]);

  const renderChart = () => {
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
      <Heading as="h1" m={7} textAlign="center">Graficos Datos Históricos</Heading>
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
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </Flex>

      <Box borderRadius="md" boxShadow="md" height="400px" maxHeight="400px" overflow="hidden" bg={colorMode === 'light' ? 'white' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
        {renderChart()}
      </Box>
      <Box mt={10} borderRadius="md" boxShadow="md" overflow="hidden" bg={colorMode === 'light' ? 'white' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
        <Table  size="sm" variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th textAlign={'center'}>Nodo</Th>
              <Th textAlign={'center'}>Fecha</Th>
              <Th textAlign={'center'}>Hora</Th>
              <Th textAlign={'center'}>{selectedVariable}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {historicalData.map((item, index) => (
              <Tr key={index}>
                <Td textAlign={'center'}>{item.id}</Td>
                <Td textAlign={'center'}>{item.year}-{item.month}-{item.day}</Td>
                <Td textAlign={'center'}>{item.hour}:00</Td>
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
  );
}

export default HistoricosPage;