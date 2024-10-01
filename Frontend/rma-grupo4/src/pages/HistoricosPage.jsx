import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Stack, Select, Text, Grid, GridItem, Table, Thead, Tbody, Tr, Th, Td, background } from '@chakra-ui/react';
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
      setSelectedDay(daysArray['']); 
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
      const data = {
        labels: labels,
        datasets: [
          {
            type: 'line',
            label: `${selectedVariable} (Línea) - ${selectedYear}/${selectedMonth}/${selectedDay}`,
            data: newData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'black',
            borderWidth: 2,
            fill: false,
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
        day: selectedMonth,
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

  return (
    <Box bg="gray.800" color="white" p={4}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Datos Históricos
      </Heading>

      <Stack direction="row" spacing={4} mb={6} justifyContent="center">
        <Select
          placeholder="Año"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          sx={{
            option:{
              bg: 'black'
            }

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
            option:{
              bg: 'black'
            }

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
            option:{
              bg: 'black'
            }

          }}
        >
          {days.map((day) => (
            <option key={day} value={String(day).padStart(2, '0')} background = "black" >
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
        mb={4}
      >
        {variables.map((variable) => (
          <option key={variable.name} value={variable.name}>
            {variable.name}
          </option>
        ))}
      </Select>

      <Grid templateColumns="1fr" gap={6}>
        <GridItem>
          <Box bg="black" p={4} borderRadius="md" color="black" height="600px">
            {renderCombinedChart() || (
              <Text color="gray.500" textAlign="center">
                Selecciona al menos un tipo de gráfico y una variable
              </Text>
            )}
          </Box>
        </GridItem>

        <GridItem>
          <Box bg="white" p={4} borderRadius="md" color="black">
            <Heading as="h2" size="lg" mb={4}>
              Datos Históricos
            </Heading>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Año</Th>
                  <Th>Mes</Th>
                  <Th>Día</Th>
                  <Th>Hora</Th>
                  <Th>{selectedVariable}</Th>
                  <Th>Humedad</Th>
                  <Th>Presión</Th>
                  <Th>Viento</Th>
                </Tr>
              </Thead>
              <Tbody>
                {historicalData.map((data, index) => (
                  <Tr key={index}>
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
        </GridItem>
      </Grid>
    </Box>
  );
}

export default HistoricosPage;
