import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Stack, Select, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td, useMediaQuery } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';

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

function HistoricosPage() {
  const [isMobile] = useMediaQuery("(max-width: 48em)");
  const [selectedCharts, setSelectedCharts] = useState(['line']);
  const [selectedVariable, setSelectedVariable] = useState('temperatura');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedDay, setSelectedDay] = useState('');
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
      setSelectedDay('');
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    let labels = [];
    let newData = [];

    if (selectedYear && !selectedMonth && !selectedDay) {
      labels = months.map(m => m.name);
      newData = labels.map(() => Math.floor(Math.random() * 100));
    } else if (selectedYear && selectedMonth && !selectedDay) {
      labels = getDias(selectedYear, selectedMonth);
      newData = labels.map(() => Math.floor(Math.random() * 100));
    } else if (selectedYear && selectedMonth && selectedDay) {
      labels = getHoras();
      newData = labels.map(() => Math.floor(Math.random() * 100));
    }

    if (selectedVariable) {
      const variableColor = variables.find(v => v.name === selectedVariable)?.color || 'rgba(75, 192, 192, 1)';
      const data = {
        labels: labels,
        datasets: [
          {
            type: 'line',
            label: `${selectedVariable} (Línea) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
            data: newData,
            borderColor: variableColor,
            backgroundColor: variableColor.replace('1)', '0.2)'),
            borderWidth: 2,
            fill: true,
          },
          {
            type: 'bar',
            label: `${selectedVariable} (Barra) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
            data: newData,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
      setChartData(data);

      // datos tabla datos históricos
      const historicalValues = labels.map((label, index) => ({
        year: selectedYear,
        month: selectedMonth,
        day: selectedDay || '-',
        hora: selectedDay ? getHoras()[index % 24] : '-',
        [selectedVariable]: newData[index],
        humedad: selectedVariable === 'humedad' ? newData[index] : '-',
        presion: selectedVariable === 'presion' ? newData[index] : '-',
        viento: selectedVariable === 'viento' ? newData[index] : '-',
      }));

      setHistoricalData(historicalValues);
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
        <Select placeholder="Año" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </Select>
        <Select placeholder="Mes" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </Select>
        <Select placeholder="Día" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {days.map((day) => (
            <option key={day} value={String(day).padStart(2, '0')}>
              {day}
            </option>
          ))}
        </Select>
      </Stack>

      <Stack spacing={4} direction={isMobile ? "column" : "row"} mb={isMobile ? 3 : 6} justifyContent="center">
        <Checkbox isChecked={selectedCharts.includes('line')} onChange={() => handleChartTypeChange('line')}>
          Líneas
        </Checkbox>
        <Checkbox isChecked={selectedCharts.includes('bar')} onChange={() => handleChartTypeChange('bar')}>
          Barras
        </Checkbox>
      </Stack>

      <Grid templateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"} gap={isMobile ? 3 : 6} mb={isMobile ? 3 : 6}>
        <GridItem colSpan={1}>
          <Select value={selectedVariable} onChange={(e) => setSelectedVariable(e.target.value)} placeholder="Seleccione una variable">
            {variables.map((variable) => (
              <option key={variable.name} value={variable.name}>
                {variable.name}
              </option>
            ))}
          </Select>
        </GridItem>
      </Grid>

      {renderCombinedChart()}

      <Box mt={isMobile ? 3 : 6} bg="gray.700" p={isMobile ? 2 : 4} borderRadius="md" boxShadow="md" overflowX="auto">
        <Heading as="h3" size={isMobile ? "md" : "lg"} mb={isMobile ? 2 : 4}>
          Tabla de datos históricos
        </Heading>
        <Table variant="striped" colorScheme="gray.500" size={isMobile ? "sm" : "md"}>
        <Thead>
          <Tr>
            <Th bg="gray.700" color="gray.300">Año</Th>
            <Th bg="gray.700" color="gray.300">Mes</Th>
            <Th bg="gray.700" color="gray.300">Día</Th>
            <Th bg="gray.700" color="gray.300">Hora</Th>
            <Th bg="gray.700" color="gray.300">Variable</Th>
            <Th bg="gray.700" color="gray.300">Humedad</Th>
            <Th bg="gray.700" color="gray.300">Presión</Th>
            <Th bg="gray.700" color="gray.300">Viento</Th>
          </Tr>
        </Thead>
          <Tbody>
            {historicalData.map((data, index) => (
              <Tr key={index} _hover={{ bg: "gray.600" }} bg={index % 2 === 0 ? "gray.700" : "gray.800"}>
                <Td>{data.year}</Td>
                <Td>{data.month}</Td>
                <Td>{data.day}</Td>
                <Td>{data.hora}</Td>
                <Td>{data[selectedVariable]}</Td>
                <Td>{data.humedad}</Td>
                <Td>{data.presion}</Td>
                <Td>{data.viento}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}

export default HistoricosPage;