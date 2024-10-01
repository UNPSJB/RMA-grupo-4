import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Icon,
  Box,
  Grid,
  GridItem,
  Heading,
  Select,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Center,
} from '@chakra-ui/react';
import { Line, Bar, Doughnut ,Radar} from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { HiChartBar } from "react-icons/hi";

ChartJS.register(...registerables);

const variables = ['temp_t']; //,'temperatura', 'humedad', 'presion', 'viento' 

const GraficosPage = () => {
  const [data, setData] = useState({});
  const [timeRange, setTimeRange] = useState('1h');

  useEffect(() => {
    fetchData();
  }, [timeRange]);
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/mensajes`, {
        params: {
          time_range: timeRange
        }
      });
      console.log("Datos recibidos:", response.data); // Testeando datos recibidos
      const newData = {};
      response.data.forEach(item => {
        if (!newData[item.type]) {
          newData[item.type] = [];
        }
        newData[item.type].push({
          id_nodo: item.id_nodo,
          time: item.time,
          data: item.data
        });
      });
      
      setData(newData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const formatChartData = (variableData) => {
    const labels = variableData.map(item => new Date(item.time).toLocaleTimeString());
    const values = variableData.map(item => parseFloat(item.data));

    return {
      labels,
      datasets: [{
        label: 'Valor',
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }]
    };
  };

  const renderLineChart = (variable) => {
    console.log(`Datos para ${variable}:`, data[variable]); // Log para verificar datos
    if (!data[variable] || data[variable].length === 0) return <Text>No hay datos disponibles.</Text>;
  
    return (
      <Line
        data={formatChartData(data[variable])}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: variable.charAt(0).toUpperCase() + variable.slice(1),
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    );
  };

  const renderBarChart = (variable) => {
    if (!data[variable] || data[variable].length === 0) return <Text>Cargando datos...</Text>;

    const chartData = {
      labels: variables,
      datasets: [{
        label: 'Promedio',
        data: variables.map(variable => {
          const values = data[variable].map(item => parseFloat(item.data));
          return values.reduce((a, b) => a + b, 0) / values.length;
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      }],
    };

    return (
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Promedios por Variable',
            },
          },
        }}
      />
    );
  };

  const renderDoughnutChart = (variable) => {
    if (!data[variable] || data[variable].length === 0) return <Text>Cargando datos...</Text>;

    const chartData = {
      labels: variables,
      datasets: [{
        data: variables.map(variable => {
          const values = data[variable].map(item => parseFloat(item.data));
          return values.reduce((a, b) => a + b, 0);
        }),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      }],
    };

    return (
      <Doughnut
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Distribución de Variables',
            },
          },
        }}
      />
    );
  };
  const renderRadarChart =(variable)=>{
    if (!data[variable] || data[variable].length === 0) return <Text>Cargando datos...</Text>;
    return (
      <Radar
        data={formatChartData(data[variable])}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: variable.charAt(0).toUpperCase() + variable.slice(1),
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    );
  }
  const renderStatCards = () => {
    return variables.map(variable => {
      if (!data[variable]) return null;
      const values = data[variable].map(item => parseFloat(item.data));
      const currentValue = values[values.length - 1];
      const previousValue = values[values.length - 2] || currentValue;
      const change = ((currentValue - previousValue) / previousValue) * 100;

      return (
        <Stat key={variable} bg="transparent" p={4} borderRadius="md" boxShadow="sm" color="white">
          <StatLabel>{variable.charAt(0).toUpperCase() + variable.slice(1)}</StatLabel>
          <StatNumber>{currentValue.toFixed(2)}</StatNumber>
          <StatHelpText>
            <StatArrow type={change > 0 ? 'increase' : 'decrease'} />
            {Math.abs(change).toFixed(2)}%
          </StatHelpText>
        </Stat>
      );
    });
  };

  return (
    <Box p={5}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
      <Icon as={HiChartBar} p={0} verticalAlign="middle" marginRight={2} marginBottom={2}/>
        Datos en Gráficos
      </Heading>
      <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} mb={5} bg="gray.900" color="gray">
        <option value="1h" >Última hora</option>
        <option value="24h">Últimas 24 horas</option>
        <option value="7d">Últimos 7 días</option>
      </Select>
      
      {variables.map(variable => (
          <SimpleGrid key={variable} columns={4} spacing={5} mb={5}>
            <Box bg="gray.900" p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="130px" width="140px" boxShadow="dark-lg">
              {renderStatCards(variable)}
            </Box>
          </SimpleGrid>
        ))}
      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
        {variables.map(variable => (
          <GridItem key={variable}>
            <Box bg="gray.900" p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="280px" boxShadow="dark-lg">
              {renderLineChart(variable)}
            </Box>
          </GridItem>
        ))}
        {variables.map(variable => (
          <GridItem key={variable}>
            <Box bg="gray.900" p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="290px" boxShadow="dark-lg">
              {renderRadarChart(variable)}
            </Box>
          </GridItem>
        ))}
        {variables.map(variable => (
          <GridItem key={variable}>
            <Box bg="gray.900" p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="290px" boxShadow="dark-lg">
              {renderBarChart(variable)}
            </Box>
          </GridItem>
        ))}
        {variables.map(variable => (
          <GridItem key={variable}>
            <Box bg="gray.900" p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="290px" boxShadow="dark-lg">
              {renderDoughnutChart(variable)}
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default GraficosPage;