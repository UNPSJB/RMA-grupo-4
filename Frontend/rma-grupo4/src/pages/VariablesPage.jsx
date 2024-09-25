import React, { useState, useEffect } from 'react';
import { Box, Heading, IconButton, Checkbox, Stack, Text, Grid, GridItem, Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Chart as ChartJS, registerables, ArcElement } from 'chart.js';
import { Bar, Line, PolarArea, Doughnut, Radar, Scatter } from 'react-chartjs-2';

ChartJS.register(...registerables, ArcElement);

const variables = [
  { name: 'temperatura', color: 'rgba(255, 99, 132, 1)' },
  { name: 'humedad', color: 'rgba(54, 162, 235, 1)' },
  { name: 'presion', color: 'rgba(255, 206, 86, 1)' },
  { name: 'viento', color: 'rgba(75, 192, 192, 1)' },
];

function VariablesPage() {
  const [selectedCharts, setSelectedCharts] = useState(['line']); // Inicia con gráfico de líneas
  const [selectedVariable, setSelectedVariable] = useState(null); // Solo una variable seleccionada
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (selectedVariable) {
      const variableInfo = variables.find(v => v.name === selectedVariable);
      const newData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: selectedVariable,
          data: Array(6).fill(0).map(() => Math.floor(Math.random() * 100)),
          borderColor: variableInfo.color,
          backgroundColor: variableInfo.color.replace('1)', '0.5)'),
          borderWidth: 2,
          fill: false,
        }]
      };
      setChartData(newData);
    }
  }, [selectedVariable]);

  const handleChartTypeChange = (type) => {
    // Solo permite seleccionar un tipo de gráfico a la vez
    setSelectedCharts([type]);
  };

  const handleVariableChange = (variable) => {
    setSelectedVariable(variable);
  };

  const renderCombinedChart = () => {
    if (!chartData) return null;
 
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Datos Variable Seleccionada'  },
      
      },
    };

    if (selectedCharts.includes('bar')) {
      return <Bar data={chartData} options={chartOptions} />;
    } else if (selectedCharts.includes('line')) {
      return <Line data={chartData} options={chartOptions} />;
    }
    return null;
  };

  const renderRadarChart = () => {
    if (!chartData) return null;

    return <Radar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
  };

  const renderScatterChart = () => {
    if (!chartData) return null;

    const scatterData = {
      datasets: [{
        label: selectedVariable,
        data: Array(6).fill(0).map(() => ({ x: Math.random() * 100, y: Math.random() * 100 })),
        backgroundColor: variables.find(v => v.name === selectedVariable).color.replace('1)', '0.5)'),
      }]
    };

    return <Scatter data={scatterData} options={{ responsive: true, maintainAspectRatio: false }} />;
  };


return (
  <Box bg="gray.800" color="white" minH="100vh" p={4}>
    <IconButton 
      as={Link} 
      to="/" 
      icon={<FaArrowLeft />} 
      colorScheme="teal" 
      aria-label="Volver a la Página Principal" 
      mb={4} 
    />
    <Heading as="h1" size="xl" mb={6} textAlign="center" >
      Datos Variable
    </Heading>
    
    <Stack spacing={4} direction="row" mb={6} justifyContent="center">
      <Button 
        isActive={selectedCharts.includes('line')}
        onClick={() => handleChartTypeChange('line')}
        colorScheme={selectedCharts.includes('line') ? "teal" : "gray"}
      >
        Líneas
      </Button>
      <Button 
        isActive={selectedCharts.includes('bar')}
        onClick={() => handleChartTypeChange('bar')}
        colorScheme={selectedCharts.includes('bar') ? "teal" : "gray"}

      >
        Barras
      </Button>
    </Stack>

    <Stack direction="row" spacing={4} mb={6}>
      {variables.map(variable => (
        <Button
          key={variable.name}
          onClick={() => handleVariableChange(variable.name)}
          colorScheme={selectedVariable === variable.name ? "teal" : "gray"}
        >
          {variable.name}
        </Button>
      ))}
    </Stack>

    <Grid templateColumns="2fr 1fr" gap={6}>
      <GridItem>
        <Box bg="white" p={4} borderRadius="md" color="black" height="600px">
          {renderCombinedChart() || (
            <Text color="gray.500" textAlign="center">
              Selecciona una variable para visualizar los datos
            </Text>
          )}
        </Box>
      </GridItem>
      <GridItem>
        <Stack spacing={6}>
          <Box bg="white" p={4} borderRadius="md" color="black" height="290px">
            {renderRadarChart() || (
              <Text color="gray.500" textAlign="center">
                Gráfico Radar
              </Text>
            )}
          </Box>
          <Box bg="white" p={4} borderRadius="md" color="black" height="290px">
            {renderScatterChart() || (
              <Text color="gray.500" textAlign="center">
                Gráfico de Dispersión
              </Text>
            )}
          </Box>
        </Stack>
      </GridItem>
    </Grid>
  </Box>
);

}

export default VariablesPage;