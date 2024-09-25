import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Stack, Text, Grid, GridItem, Button } from '@chakra-ui/react';
import { Chart as ChartJS, registerables, ArcElement } from 'chart.js';
import { Bar, Line, PolarArea, Doughnut } from 'react-chartjs-2';
import NavigationButtons from '../components/NavigationButtons';
import Footer from '../components/Footer'; 

ChartJS.register(...registerables, ArcElement);

const variables = [
  { name: 'temperatura', color: 'rgba(255, 99, 132, 1)' },
  { name: 'humedad', color: 'rgba(54, 162, 235, 1)' },
  { name: 'presion', color: 'rgba(255, 206, 86, 1)' },
  { name: 'viento', color: 'rgba(75, 192, 192, 1)' },
];

function CombinacionesPage2() {
  const [selectedCharts, setSelectedCharts] = useState(['line']); // Inicia solo con 'line'
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (selectedVariables.length > 0) {
      const newData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: selectedVariables.map(variable => {
          const variableInfo = variables.find(v => v.name === variable);
          return {
            label: variable,
            data: Array(6).fill(0).map(() => Math.floor(Math.random() * 100)),
            borderColor: variableInfo.color,
            backgroundColor: variableInfo.color.replace('1)', '0.5)'),
            borderWidth: 2,
            fill: false
          };
        })
      };
      setChartData(newData);
    }
  }, [selectedVariables]);

  const handleChartTypeChange = (type) => {
    // Solo permite seleccionar un tipo a la vez
    setSelectedCharts([type]);
  };

  const handleVariableChange = (variable) => {
    setSelectedVariables(prev =>
      prev.includes(variable)
        ? prev.filter(v => v !== variable)
        : [...prev, variable]
    );
  };

  const renderCombinedChart = () => {
    if (!chartData) return null;

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

    // Solo renderiza el gráfico seleccionado (líneas o barras)
    if (selectedCharts.includes('bar')) {
      return <Bar data={chartData} options={chartOptions} />;
    } else {
      return <Line data={chartData} options={chartOptions} />;
    }
  };

  const renderPolarChart = () => {
    if (!chartData) return null;

    return <PolarArea data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />;
  };

  const renderDoughnutChart = () => {
    if (!chartData) return null;

    const doughnutData = {
      labels: selectedVariables,
      datasets: [{
        data: selectedVariables.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: selectedVariables.map(v => variables.find(variable => variable.name === v).color.replace('1)', '0.5)')),
        borderColor: selectedVariables.map(v => variables.find(variable => variable.name === v).color),
        borderWidth: 1
      }]
    };

    return <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />;
  };

  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      {/* Componente de botones de navegación */}
      <NavigationButtons />
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Combinaciones de variables
      </Heading>
      
      <Stack spacing={4} direction="row" mb={6} justifyContent="center">
        <Checkbox 
          isChecked={selectedCharts.includes('line')}
          onChange={() => handleChartTypeChange('line')}
        >
          Líneas
        </Checkbox>
        <Checkbox 
          isChecked={selectedCharts.includes('bar')}
          onChange={() => handleChartTypeChange('bar')}
        >
          Barras
        </Checkbox>
      </Stack>

      <Stack direction="row" spacing={4} mb={6}>
        {variables.map(variable => (
          <Button
            key={variable.name}
            onClick={() => handleVariableChange(variable.name)}
            colorScheme={selectedVariables.includes(variable.name) ? "teal" : "gray"}
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
                Selecciona al menos una variable para visualizar los datos
              </Text>
            )}
          </Box>
        </GridItem>
        <GridItem>
          <Stack spacing={6}>
            <Box bg="white" p={4} borderRadius="md" color="black" height="290px">
              {renderPolarChart() || (
                <Text color="gray.500" textAlign="center">
                  Gráfico Polar
                </Text>
              )}
            </Box>
            <Box bg="white" p={4} borderRadius="md" color="black" height="290px">
              {renderDoughnutChart() || (
                <Text color="gray.500" textAlign="center">
                  Gráfico de Dona
                </Text>
              )}
            </Box>
          </Stack>
        </GridItem>
      </Grid>
      {/* Footer reutilizable */}
      <Footer />
    </Box>
  );
}

export default CombinacionesPage2;
