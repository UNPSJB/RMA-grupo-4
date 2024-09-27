import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Stack, Select, Text, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import NavigationButtons from '../components/NavigationButtons';

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
  const [selectedCharts, setSelectedCharts] = useState(['line']);
  const [selectedVariable, setSelectedVariable] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [days, setDays] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  
  // State variables for filtering
  const [filterYear, setFilterYear] = useState('2024');
  const [filterMonth, setFilterMonth] = useState(null);

  useEffect(() => {
    const getDaysInMonth = (year, month) => {
      return new Date(year, month, 0).getDate();
    };

    if (selectedYear && selectedMonth) {
      const monthIndex = parseInt(selectedMonth);
      const numberOfDays = getDaysInMonth(selectedYear, monthIndex);
      const daysArray = Array.from({ length: numberOfDays }, (_, i) => i + 1);
      setDays(daysArray);
      setSelectedDay(daysArray[0]);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    if (selectedVariable && selectedYear && selectedMonth && selectedDay) {
      const newData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            type: 'line',
            label: `${selectedVariable} (Línea) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
            data: Array(6).fill(0).map(() => Math.floor(Math.random() * 100)),
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false,
          },
          {
            type: 'bar',
            label: `${selectedVariable} (Barra) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
            data: Array(6).fill(0).map(() => Math.floor(Math.random() * 100)),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
      setChartData(newData);

      // Simulando datos históricos
      const historicalValues = [
        { year:'2024', month: 'Enero', value: 30 },
        { year:'2024', month: 'Febrero', value: 25 },
        { year:'2024', month: 'Marzo', value: 28 },
        { year:'2024', month: 'Abril', value: 35 },
        { year:'2024', month: 'Mayo', value: 32 },
        { year:'2023', month: 'Junio', value: 31 },
      ];
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

    const visibleDatasets = chartData.datasets.filter((ds) =>
      selectedCharts.includes(ds.type)
    );

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Gráfico Combinado',
        },
      },
    };

    return (
      <Chart type="bar" data={{ ...chartData, datasets: visibleDatasets }} options={chartOptions} />
    );
  };

  // Filtro al seleccionar año y mes
  const filteredHistoricalData = historicalData.filter(data => 
    (filterYear ? data.year === filterYear : true) &&
    (filterMonth ? data.month === filterMonth : true)
  );

  return (
    <Box bg="gray.800" color="white" p={4}>
      <NavigationButtons></NavigationButtons>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Datos Historicos
      </Heading>

      <Stack direction="row" spacing={4} mb={6} justifyContent="center" bg="black">
        <Select
          placeholder="Año"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          sx={{
            'option': {
              bg: 'black',
              color: 'white',
              _hover: {
                bg: 'blue.600',
              },
            },
          }}
        >
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
        </Select>
        <Select
          placeholder="Mes"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          sx={{
            'option': {
              bg: 'black',
              color: 'white',
              _hover: {
                bg: 'blue.600',
              },
            },
          }}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.name}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Día"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          sx={{
            'option': {
              bg: 'black',
              color: 'white',
              _hover: {
                bg: 'blue.600',
              },
            },
          }}
        >
          {days.map((day) => (
            <option key={day} value={String(day).padStart(2, '0')}>
              {day}
            </option>
          ))}
        </Select>
      </Stack>
      
      <Stack spacing={4} direction="row" mb={6} justifyContent="center">
        <Checkbox isChecked={selectedCharts.includes('line')} onChange={() => handleChartTypeChange('line')}>
          Líneas
        </Checkbox>
        <Checkbox isChecked={selectedCharts.includes('bar')} onChange={() => handleChartTypeChange('bar')}>
          Barras
        </Checkbox>
      </Stack>

      <Select
        placeholder="Selecciona una variable"
        value={selectedVariable}
        onChange={(e) => setSelectedVariable(e.target.value)}
        sx={{
          'option': {
            bg: 'black',
            color: 'white',
            _hover: {
              bg: 'blue.600',
            },
          },
        }}
      >
        {variables.map((variable) => (
          <option key={variable.name} value={variable.name}>
            {variable.name}
          </option>
        ))}
      </Select>

      <Grid templateColumns="1fr" gap={6}>
        <GridItem>
          <Box bg="white" p={4} borderRadius="md" color="black" height="600px">
            {renderCombinedChart() || (
              <Text color="gray.500" textAlign="center">
                Selecciona al menos un tipo de gráfico y una variable
              </Text>
            )}
          </Box>
        </GridItem>

        <GridItem>
          <Box bg="black" p={4} borderRadius="md" color="white">
            <Heading as="h2" size="lg" mb={4}>
              Datos Históricos
            </Heading>
            <Stack spacing={4}>
              <Select
                bg = "black"
                placeholder="Año"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                sx={{
                  'option': {
                    bg: 'black',
                    color: 'white',
                    _hover: {
                      bg: 'blue.600',
                    },
                  },
                }}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </Select>
              <Select
                bg = "black"
                placeholder="Mes"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                sx={{
                  'option': {
                    bg: 'black',
                    color: 'white',
                    _hover: {
                      bg: 'blue.600',
                    },
                  },
                }}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </Select>
            </Stack>

            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Año</Th>
                  <Th>Mes</Th>
                  <Th>Valor</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredHistoricalData.length > 0 ? (
                  filteredHistoricalData.map((data, index) => (
                    <Tr key={index}>
                      <Td>{data.year}</Td>
                      <Td>{data.month}</Td>
                      <Td>{data.value}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan="3" textAlign="center">No hay datos para mostrar</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default HistoricosPage;