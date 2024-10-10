import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Stack, Select, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td, useMediaQuery } from '@chakra-ui/react';
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

function HistoricosPage(data) {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const [selectedCharts, setSelectedCharts] = useState(['line']);
  const [selectedVariable, setSelectedVariable] = useState('temperatura');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('10');
  const [selectedDay, setSelectedDay] = useState('10');
  const [chartData, setChartData] = useState('');
  const [days, setDays] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  const getDias = (year, month) => Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
  const getHoras = () => Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const monthIndex = parseInt(selectedMonth);
      const daysArray = getDias(selectedYear, monthIndex);
      setDays(daysArray);
      
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/clima/temperatura`, {
          params: { time_range: `${selectedYear}-${selectedMonth}-${selectedDay || ''}` },
        });
        console.log('Datos obtenidos:', response.data);
        const processedData = response.data.map((item) => ({
          id_nodo: item.id_nodo ?? 'Desconocido',
          time: item.time ?? 'Sin timestamp',
          data: parseFloat(item.temperatura) || 0, 
        }));
        let labels = [];
        if (selectedYear && !selectedMonth && !selectedDay) {
          labels = months.map(m => m.name);
        } else if (selectedYear && selectedMonth && !selectedDay) {
          labels = getDias(selectedYear, selectedMonth);
        } else if (selectedYear && selectedMonth && selectedDay) {
          labels = getHoras();
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: `${selectedVariable} (Línea) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
              data: processedData.map(d => d.data),
              borderColor: variables.find(v => v.name === selectedVariable)?.color || 'rgba(75, 192, 192, 1)',
              backgroundColor: variables.find(v => v.name === selectedVariable)?.color.replace('1)', '0.2)'),
              borderWidth: 2,
              fill: true,
            },
            {
              type: 'bar',
              label: `${selectedVariable} (Barra) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
              data: processedData.map(d => d.data),
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
          ]
        });

        const historicalValues = labels.map((label, index) => ({
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay || '-',
          hora: selectedDay ? getHoras()[index % 24] : '-',
          [selectedVariable]: processedData[index].data || '-',
          humedad: selectedVariable === 'humedad' ? processedData[index].data : '-',
          presion: selectedVariable === 'presion' ? processedData[index].data : '-',
          viento: selectedVariable === 'viento' ? processedData[index].data : '-',
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
          labels: { color: 'white', boxWidth: isMobile ? 10 : 40 } 
        },
        title: {
          display: true,
          text: 'Gráfico Combinado',
          font: { size: isMobile ? 16 : 20, weight: 'bold' },
          color: 'gray',
          padding: { top: 10, bottom: isMobile ? 10 : 20 },
        },
      },
      scales: {
        x: { 
          ticks: { color: 'white', maxRotation: 90, minRotation: 90 }, 
          grid: { color: 'rgba(255, 255, 255, 0.2)' } 
        },
        y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.2)' } },
      },
    };

    return (
      <Box bg="gray.700" p={isMobile ? 2 : 4} borderRadius="md" boxShadow="md" height={isMobile ? "300px" : "400px"}>
        <Chart type="bar" data={{ ...chartData, datasets: visibleDatasets }} options={chartOptions} />
      </Box>
    );
  };

  return (
    <Box bg="gray.800" color="white" p={isMobile ? 3 : 6} borderRadius="md">
      <Heading as="h1" size={isMobile ? "lg" : "xl"} mb={isMobile ? 3 : 6} textAlign="center" color="white">
        Datos Históricos
      </Heading>

      <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 4} mb={isMobile ? 3 : 6} justifyContent="center">
        <Select placeholder="Año" value={selectedYear}  onChange={(e)  => setSelectedYear(e.target.value) } 
        sx={{ option : {
          backgroundColor: 'black'
        }
          
            
        }}
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </Select>
        <Select placeholder="Mes" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
          sx={{ option : {
            backgroundColor: 'black'
          }
            
              
          }}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </Select>
        <Select placeholder="Día" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}
          sx={{ option : {
            backgroundColor: 'black'
          }
            
              
          }}
          >
          {days.map((day) => (
            <option key={day} value={String(day).padStart(2, '0')}>
              {day}
            </option>
          ))}
        </Select>
        <Select value={selectedVariable} onChange={(e) => setSelectedVariable(e.target.value)}
          sx={{ option : {
            backgroundColor: 'black'
          }
            
              
          }}
          >
          {variables.map((variable) => (
            <option key={variable.name} value={variable.name}>
              {variable.name.charAt(0).toUpperCase() + variable.name.slice(1)}
            </option>
          ))}
        </Select>
      </Stack>

      <Stack direction="row" spacing={4} justifyContent="center" mb={4}>
        <Checkbox isChecked={selectedCharts.includes('line')} onChange={() => handleChartTypeChange('line')}>
          Línea
        </Checkbox>
        <Checkbox isChecked={selectedCharts.includes('bar')} onChange={() => handleChartTypeChange('bar')}>
          Barra
        </Checkbox>
      </Stack>

      {renderCombinedChart()}

      <Table variant="striped" colorScheme="gray" size="sm" mt={4}>
        <Thead>
          <Tr>
            <Th>Año</Th>
            <Th>Mes</Th>
            <Th>Día</Th>
            <Th>Hora</Th>
            <Th>{selectedVariable.charAt(0).toUpperCase() + selectedVariable.slice(1)}</Th>
            <Th>Humedad</Th>
            <Th>Presión</Th>
            <Th>Viento</Th>
          </Tr>
        </Thead>
        <Tbody>
          {historicalData.map((row, index) => (
            <Tr key={index}>
              <Td>{row.year}</Td>
              <Td>{months.find((m) => m.value === row.month)?.name}</Td>
              <Td>{row.day}</Td>
              <Td>{row.hora}</Td>
              <Td>{row[selectedVariable]}</Td>
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
