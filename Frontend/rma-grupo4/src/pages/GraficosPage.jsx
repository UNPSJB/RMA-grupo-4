


import React, { useState, useEffect } from 'react';
import { Checkbox, Box, useDisclosure, Heading, IconButton, Stack, Text, Grid, GridItem, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, useBreakpointValue } from '@chakra-ui/react';
import { Chart as ChartJS, registerables, ArcElement } from 'chart.js';
import { Chart, PolarArea, Doughnut } from 'react-chartjs-2';
import { FaBars, FaTimes } from 'react-icons/fa';
import NavigationButtons from '../components/NavigationButtons';

ChartJS.register(...registerables, ArcElement);

const variables = [
  { name: 'temperatura', color: 'rgba(255, 99, 132, 1)' },
  { name: 'humedad', color: 'rgba(54, 162, 235, 1)' },
  { name: 'presion', color: 'rgba(255, 206, 86, 1)' },
  { name: 'viento', color: 'rgba(75, 192, 192, 1)' },
];

function GraficosPage() {
  const [selectedCharts, setSelectedCharts] = useState(['line']);
  const [selectedVariable, setSelectedVariable] = useState('temperatura');
  const [chartData, setChartData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isHamburger = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (selectedVariable) {
      const newData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
          {
            type: 'line',
            label: `${selectedVariable} (Línea)`,
            data: [30, 25, 28, 35, 32, 31],
            borderColor: variables.find(v => v.name === selectedVariable).color,
            borderWidth: 2,
            fill: false,
          },
          {
            type: 'bar',
            label: `${selectedVariable} (Barra)`,
            data: [30, 25, 28, 35, 32, 31],
            backgroundColor: variables.find(v => v.name === selectedVariable).color.replace('1)', '0.5)'),
          },
        ],
      };
      setChartData(newData);
    }
  }, [selectedVariable]);

  const handleVariableChange = (variable) => {
    setSelectedVariable(variable);
  };

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
      plugins: {
        legend: { position: 'top', labels: { color: 'white' } },
        title: {
          display: true,
          text: 'Gráfico Combinado',
          color: 'white',
          font: { size: 16, weight: 'bold' },
          padding: { top: 10, bottom: 20 },
        },
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.2)' }, ticks: { color: 'white' }, border: { color: 'white' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.2)' }, ticks: { color: 'white' }, border: { color: 'white' } },
      },
    };

    return <Chart type="bar" data={{ ...chartData, datasets: visibleDatasets }} options={chartOptions} />;
  };
  const renderPolarChart = () => {
    if (!chartData) return null;

    const polarData = {
      labels: chartData.labels,
      datasets: [
        {
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
          borderWidth: 1,
        },
      ],
    };

    const polarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: 'white' } },
        title: { display: true, text: 'Gráfico Polar', color: 'white' },
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    };

    return <PolarArea data={polarData} options={polarOptions} />;
  };

  const renderDoughnutChart = () => {
    if (!chartData) return null;

    const doughnutData = {
      labels: chartData.labels,
      datasets: [
        {
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
          borderWidth: 1,
        },
      ],
    };

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: 'white' } },
        title: { display: true, text: 'Gráfico de Dona', color: 'white' },
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    };

    return <Doughnut data={doughnutData} options={doughnutOptions} />;
  };
  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
      <NavigationButtons />
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Datos en gráficos
      </Heading>

      <Stack spacing={4} direction="row" mb={6} justifyContent="center">
        <Checkbox isChecked={selectedCharts.includes('line')} onChange={() => handleChartTypeChange('line')}>
          Líneas
        </Checkbox>
        <Checkbox isChecked={selectedCharts.includes('bar')} onChange={() => handleChartTypeChange('bar')}>
          Barras
        </Checkbox>
      </Stack>

      {isHamburger ? (
        <>
          <IconButton
            icon={isOpen ? <FaTimes /> : <FaBars />}
            colorScheme="teal"
            aria-label="Abrir menú"
            onClick={onOpen}
            mb={3}
          />
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent marginTop="200px" borderRadius="md" bgGradient="linear(to-r, gray.900, gray.800)" color="white" fontSize="lg" boxShadow="dark-lg">
              <DrawerHeader borderBottomWidth="1px" textAlign="center">
                Seleccionar Variable
              </DrawerHeader>
              <DrawerBody>
                <Stack spacing={3} alignItems="center">
                  {variables.map((variable) => (
                    <Button
                      key={variable.name}
                      onClick={() => {
                        handleVariableChange(variable.name);
                        onClose();
                      }}
                      colorScheme={selectedVariable === variable.name ? 'teal' : 'gray'}
                      size="lg"
                      width="100%"
                    >
                      {variable.name}
                    </Button>
                  ))}
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <Box display="flex" justifyContent="center">
          <Stack direction="row" spacing={4} mb={6}>
            {variables.map((variable) => (
              <Button
                key={variable.name}
                onClick={() => handleVariableChange(variable.name)}
                colorScheme={selectedVariable === variable.name ? 'teal' : 'gray'}
                size="md"
                _hover={{ transform: 'scale(1.05)' }}
                _active={{ transform: 'scale(0.95)' }}
              >
                {variable.name}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
        <GridItem>
          <Box bg="gray.900" p={4} borderRadius="md" height="600px" boxShadow="dark-lg">
            {renderCombinedChart() || <Text color="gray.500" textAlign="center">Selecciona una variable y un tipo de gráfico para visualizar los datos.</Text>}
          </Box>
        </GridItem>
        <GridItem>
          <Stack spacing={6}>
            <Box bg="gray.900" p={4} borderRadius="md" height="290px" boxShadow="dark-lg">
              {renderPolarChart() || (
                <Text color="gray.500" textAlign="center">
                  Gráfico Polar
                </Text>
              )}
            </Box>
            <Box bg="gray.900" p={4} borderRadius="md" height="290px" boxShadow="dark-lg">
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
