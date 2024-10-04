import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Select, Grid, GridItem, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Card, CardBody, Text } from '@chakra-ui/react';
import { Doughnut, Radar, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const GraficosPage = () => {
  const [timeRange, setTimeRange] = useState('1h');
  const [temperatureData, setTemperatureData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/clima/temperatura', {
        params: { time_range: timeRange },
      });

      const processedData = response.data.map((item) => ({
        id_nodo: item.id_nodo ?? 'Desconocido',
        time: item.time ?? 'Sin timestamp',
        data: parseFloat(item.temperatura) || 0,
      }));

      setTemperatureData(processedData);
    } catch (error) {
      console.error('Error fetching temperature data: ', error);
    }
  };

  // Datos de ejemplo para gráficos
  const doughnutData = {
    labels: ['Valor', 'Restante'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['#FF6384', '#E2E2E2'],
        hoverBackgroundColor: ['#FF6384', '#E2E2E2'],
      },
    ],
  };

  const radarData = {
    labels: ['A', 'B', 'C', 'D', 'E', 'F'],
    datasets: [
      {
        label: 'Valores de Radar',
        data: [65, 59, 90, 81, 56, 55],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
    ],
  };

  const scatterData = {
    labels: ['X', 'Y'],
    datasets: [
      {
        label: 'Gráfico de Dispersión',
        data: [
          { x: -10, y: 0 },
          { x: 0, y: 10 },
          { x: 10, y: 5 },
          { x: 0.5, y: 5.5 },
        ],
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Datos de ejemplo para la tarjeta de información
  const temperatureChange = {
    value: -2.3, // Valor de cambio en la temperatura
    description: 'Cambio de temperatura',
    unit: '°C',
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'white', font: { size: 12 } },
      },
      title: {
        display: true,
        text: 'Gráficos Meteorológicos',
        font: { size: 16, weight: 'bold' },
        color: 'white',
      },
    },
    scales: {
      x: {
        ticks: { color: 'white', font: { size: 12 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      y: {
        ticks: { color: 'white', font: { size: 12 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    },
  };

  return (
    <Box bg="gray.700" color="white" p={4} borderRadius="md" boxShadow="lg">
      <Select
        value={timeRange}
        onChange={(e) => setTimeRange(e.target.value)}
        mb={3}
        bg="gray.800"
        color="gray.200"
        borderColor="gray.600"
        _hover={{ bg: 'gray.600' }}
        _focus={{ borderColor: 'gray.500' }}
      >
        <option style={{ backgroundColor: '#2D3748', color: 'white' }} value="1h">
          Última hora
        </option>
        <option style={{ backgroundColor: '#2D3748', color: 'white' }} value="24h">
          Últimas 24 horas
        </option>
        <option style={{ backgroundColor: '#2D3748', color: 'white' }} value="7d">
          Últimos 7 días
        </option>
      </Select>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={2}>
          {/* Primer gráfico - Gráfico de dona */}
          <GridItem
            bg="gray.600"
            p={2}
            borderRadius="md"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box height={{ base: '200px', md: '250px' }} width="100%">
              <Doughnut 
                data={doughnutData} 
                options={{
                  ...chartOptions,
                  responsive: true, // Asegura que el gráfico sea responsivo
                  maintainAspectRatio: false, // Permite ajustar las dimensiones
                }}
              />
            </Box>
          </GridItem>

          {/* Segundo gráfico - Gráfico radar */}
          <GridItem
            bg="gray.600"
            p={2}
            borderRadius="md"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box height={{ base: '200px', md: '250px' }} width="100%">
              <Radar 
                data={radarData} 
                options={{
                  ...chartOptions,
                  responsive: true,
                  maintainAspectRatio: false,
                }} 
              />
            </Box>
          </GridItem>

          {/* Tercer gráfico - Gráfico de dispersión */}
          <GridItem
            bg="gray.600"
            p={2}
            borderRadius="md"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box height={{ base: '200px', md: '250px' }} width="100%">
              <Scatter 
                data={scatterData} 
                options={{
                  ...chartOptions,
                  responsive: true,
                  maintainAspectRatio: false,
                
                }} 
              />
            </Box>
          </GridItem>

          {/* Cuarto componente - Tarjeta de información sobre el cambio de temperatura */}
          <GridItem
            bg="gray.600"
            p={2}
            borderRadius="md"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Card bg="gray.600" color="white" p={4} width="100%">
              <CardBody>
                <Stat>
                  <StatLabel>{temperatureChange.description}</StatLabel>
                  <StatNumber>{temperatureChange.value} {temperatureChange.unit}</StatNumber>
                  <StatHelpText>
                    <StatArrow type={temperatureChange.value > 0 ? 'increase' : 'decrease'} />
                    {Math.abs(temperatureChange.value)}% desde el último período
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
    </Box>
  );
};

export default GraficosPage;
