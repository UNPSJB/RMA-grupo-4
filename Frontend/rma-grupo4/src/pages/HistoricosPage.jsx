import React, { useState, useEffect } from 'react';
import { Box, Heading, Stack, Select, Table, Thead, Tbody, Tr, Th, Td, useMediaQuery, Flex } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(...registerables);

const variables = [
  { name: 'temperatura', color: 'rgba(255, 99, 132, 1)' },
  { name: 'humedad', color: 'rgba(54, 162, 235, 1)' },
  { name: 'presion', color: 'rgba(255, 206, 86, 1)' },
  { name: 'viento', color: 'rgba(75, 192, 192, 1)' },
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
  {value : '2024'},
  {value : '2025'},
  {value : '2026'},
  {value : '2027'},
  {value : '2028'},
  {value : '2029'}

];

function HistoricosPage() {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const [selectedCharts, setSelectedCharts] = useState(['line']);
  const [selectedVariable, setSelectedVariable] = useState('temperatura');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('10');
  const [selectedDay, setSelectedDay] = useState('10');
  const [chartData, setChartData] = useState(null);
  const [days, setDays] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  const getDias = (year, month) => Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
  const getHoras = () => Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

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
        console.log('Datos obtenidos:', response.data);
    
        const nodes = response.data;
        let processedData = [];
    
        nodes.forEach(node => {
          const mappedVariable = variableMapping[selectedVariable];
          const variableData = node[mappedVariable] || [];
          variableData.forEach(item => {
            const date = new Date(item.timestamp);
            processedData.push({
              id_nodo: node.id_nodo,
              year: date.getFullYear(),
              month: date.getMonth() + 1,
              day: date.getDate(),
              hour: date.getHours(),
              value: parseFloat(item.value) || 0,
            });
          });
        });
    
        console.log('Datos procesados:', processedData);
    
        processedData = processedData.filter(item => {
          if (selectedYear && item.year !== parseInt(selectedYear)) return false;
          if (selectedMonth && item.month !== parseInt(selectedMonth)) return false;
          if (selectedDay && item.day !== parseInt(selectedDay)) return false;
          return true;
        });
    
        let labels, data;
        if (selectedYear && !selectedMonth && !selectedDay) {
          labels = months.map(m => m.name);
          data = months.map(m => {
            const monthData = processedData.filter(item => item.month === parseInt(m.value));
            return monthData.length ? monthData.reduce((sum, item) => sum + item.value, 0) / monthData.length : 0;
          });
        } else if (selectedYear && selectedMonth && !selectedDay) {
          labels = getDias(selectedYear, parseInt(selectedMonth));
          data = labels.map(day => {
            const dayData = processedData.filter(item => item.day === day);
            return dayData.length ? dayData.reduce((sum, item) => sum + item.value, 0) / dayData.length : 0;
          });
        } else if (selectedYear && selectedMonth && selectedDay) {
          labels = getHoras();
          data = labels.map((_, hour) => {
            const hourData = processedData.filter(item => item.hour === hour);
            return hourData.length ? hourData.reduce((sum, item) => sum + item.value, 0) / hourData.length : 0;
          });
        }
        setChartData({
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: `${selectedVariable} (Línea) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
              data: data,
              borderColor: variables.find(v => v.name === selectedVariable)?.color || 'rgba(75, 192, 192, 1)',
              backgroundColor: variables.find(v => v.name === selectedVariable)?.color.replace('1)', '0.2)'),
              borderWidth: 2,
              fill: true,
            },
            {
              type: 'bar',
              label: `${selectedVariable} (Barra) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
              data: data,
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
          ]
        });
    
        const historicalValues = labels.map((label, index) => ({
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay || '-',
          hora: selectedDay ? getHoras()[index % 24] : '-',
          temperatura: selectedVariable === 'temperatura' ? data[index] : '-',
          humedad: selectedVariable === 'humedad' ? data[index] : '-',
          presion: selectedVariable === 'presion' ? data[index] : '-',
          viento: selectedVariable === 'viento' ? data[index] : '-',
        }));
    
        setHistoricalData(historicalValues);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    if (selectedVariable) {
      fetchData();
    }
  }, [selectedVariable, selectedYear, selectedMonth, selectedDay]);

  const handleChartTypeChange = (type) => {
    setSelectedCharts((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const renderCombinedChart = () => {
    if (!chartData) return null;

    const visibleDatasets = chartData.datasets.filter((ds) => selectedCharts.includes(ds.type));

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
        },
      },
      scales: {
        x: { title: { display: true, text: 'Período' } },
        y: { title: { display: true, text: 'Valores' } },
      },
    };

    return <Box height="400px" maxHeight="400px" overflow="hidden"> {/* Ajusta la altura aquí */}
    <Chart type="bar" data={{ ...chartData, datasets: visibleDatasets }} options={chartOptions} />
  </Box>
  };

  return (
    <Box p={4}>
      <Heading as="h1" m={7} textAlign="center">Históricos de variables</Heading>
      <Flex justify="center" mb={4} mt={5} wrap="wrap" gap={4}>
        <Select 
          value={selectedVariable} 
          onChange={(e) => setSelectedVariable(e.target.value)} 
          width="150px"
          variant="outline"
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.300" }}
          _selected={{ bg: "teal.100" }}
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
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.300" }}
          _selected={{ bg: "teal.100" }}
        
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
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.300" }}
          _selected={{ bg: "teal.100" }}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.name}</option>
          ))}
        </Select>
        <Select 
          value={selectedDay} 
          onChange={(e) => setSelectedDay(e.target.value)} 
          width="80px"
          variant="outline"
          focusBorderColor="teal.500"
          _hover={{ borderColor: "teal.300" }}
          _selected={{ bg: "teal.100" }}
        >
          <option value="">Seleccione un día</option>
          {days.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      </Flex>
      {renderCombinedChart()}
      <Heading as="h2" size="md" mt={4}>Datos históricos</Heading>
      <Table variant="striped" mt={4}>
        <Thead>
          <Tr>
            <Th>Año</Th>
            <Th>Mes</Th>
            <Th>Día</Th>
            <Th>Hora</Th>
            <Th>Temperatura</Th>
            <Th>Humedad</Th>
            <Th>Presión</Th>
            <Th>Viento</Th>
          </Tr>
        </Thead>
        <Tbody>
          {historicalData.map((row, index) => (
            <Tr key={index}>
              <Td>{row.year}</Td>
              <Td>{row.month}</Td>
              <Td>{row.day}</Td>
              <Td>{row.hora}</Td>
              <Td>{row.temperatura}</Td>
              <Td>{row.humedad}</Td>
              <Td>{row.presion}</Td>
              <Td>{row.viento}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default HistoricosPage;

