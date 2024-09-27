import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Stack, Select, Text, Grid, GridItem, Button } from '@chakra-ui/react';
import { Chart as ChartJS, registerables, ArcElement } from 'chart.js';
import { Chart, PolarArea, Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

ChartJS.register(...registerables, ArcElement);

function GraficosPage() {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (selectedVariable) {
      // Aquí iría la lógica para traer los datos desde FastAPI
      const newData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          type: 'line',
          label: `${selectedVariable} (Línea)`,
          data: [30, 25, 28, 35, 32, 31],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false
        },
        {
          type: 'bar',
          label: `${selectedVariable} (Barra)`,
          data: [30, 25, 28, 35, 32, 31],
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
      };
      setChartData(newData);
    }
  }, [selectedVariable]);

  const handleChartTypeChange = (type) => {
    setSelectedCharts(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const renderCombinedChart = () => {
    if (!chartData) return null;
    
    const visibleDatasets = chartData.datasets.filter(ds => selectedCharts.includes(ds.type));

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
      <Chart 
        type="bar"
        data={{...chartData, datasets: visibleDatasets}} 
        options={chartOptions}
      />
    );
  };

  const renderPolarChart = () => {
    if (!chartData) return null;

    const polarData = {
      labels: chartData.labels,
      datasets: [{
        label: selectedVariable,
        data: chartData.datasets[0].data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderWidth: 1
      }]
    };

    return <PolarArea data={polarData} options={{ responsive: true, maintainAspectRatio: false }} />;
  };

  const renderDoughnutChart = () => {
    if (!chartData) return null;

    const doughnutData = {
      labels: chartData.labels,
      datasets: [{
        label: selectedVariable,
        data: chartData.datasets[0].data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1
      }]
    };

    return <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />;
  };

  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Datos en gráficos
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
      <Button 
        colorScheme="teal" 
        mb={4} 
        onClick={() => navigate('/inicio')} // Redirige a /inicio al hacer clic
      >
        Volver a Inicio
      </Button>
      <Select 
        placeholder="Selecciona una variable" 
        colorScheme="teal" 
        value={selectedVariable}
        onChange={(e) => setSelectedVariable(e.target.value)}
        mb={6}
        color="black"
        bg="white"
      >
        <option value="temperatura">Temperatura</option>
        <option value="humedad">Humedad</option>
        <option value="presion">Presión</option>
        <option value="viento">Velocidad del viento</option>
      </Select>

      <Grid templateColumns="2fr 1fr" gap={6}>
        <GridItem>
          <Box bg="white" p={4} borderRadius="md" color="black" height="600px">
            {renderCombinedChart() || (
              <Text color="gray.500" textAlign="center">
                Selecciona al menos un tipo de gráfico y una variable para visualizar los datos
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
    </Box>
  );
}

export default GraficosPage;