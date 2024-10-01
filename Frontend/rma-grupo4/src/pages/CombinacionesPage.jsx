import React, { useState, useEffect } from 'react';
import { Box, Heading, Checkbox, Stack, Text, Grid, GridItem, Button } from '@chakra-ui/react';
import { Chart as ChartJS, registerables, ArcElement } from 'chart.js';
import { Bar, Line, PolarArea, Doughnut } from 'react-chartjs-2';

ChartJS.register(...registerables, ArcElement);

const variables = [
  { name: 'temperatura', color: 'rgba(255, 99, 132, 1)' },
  { name: 'humedad', color: 'rgba(54, 162, 235, 1)' },
  { name: 'presion', color: 'rgba(255, 206, 86, 1)' },
  { name: 'viento', color: 'rgba(75, 192, 192, 1)' },
];

function CombinacionesPage() {
  const [selectedCharts, setSelectedCharts] = useState(['line']);
  const [selectedVariables, setSelectedVariables] = useState(['temperatura']);
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
            backgroundColor: variableInfo.color.replace('1)', '0.2)'),
            borderWidth: 2,
            fill: false
          };
        })
      };
      setChartData(newData);
    }
  }, [selectedVariables]);

  const handleChartTypeChange = (type) => {
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
          text: 'Gráfico Combinando Variables',
          color: 'white',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.2)', 
          },
          ticks: {
            color: 'white', 
          },
          border: {
            color: 'white',
          },
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.2)', 
          },
          ticks: {
            color: 'white', 
          },
          border: {
            color: 'white', 
          },
        },
      },
    };

    if (selectedCharts.includes('bar')) {
      return <Bar data={chartData} options={chartOptions} />;
    } else {
      return <Line data={chartData} options={chartOptions} />;
    }
  };

  const renderPolarChart = (customTitle = 'Gráfico Polar') => {
    if (!chartData) return null;
  
    const polarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: 'white',
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: customTitle,
          color: 'white',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        }
      },
      scales: {
        r: {
          ticks: {
            color: 'white',
            backdropColor: 'rgba(224, 255, 255, 0.4)'
          },
          grid: {
            color: 'rgba(176, 224, 230, 0.5)'
          },
          angleLines: {
            color: 'rgba(176, 224, 230, 0.5)'
          },
          pointLabels: {
            color: 'rgba(0, 0, 0, 0.7)',
            font: {
              size: 12,
              weight: 'bold'
            }
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.8)'
        }
      }
    };
  
    return <PolarArea data={chartData} options={polarOptions} />;
  };

  const renderDoughnutChart = () => {
    if (!chartData) return null;
  
    const doughnutData = {
      labels: selectedVariables,
      datasets: [{
        data: selectedVariables.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: selectedVariables.map(v => variables.find(variable => variable.name === v).color.replace('1)', '0.5)')),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 2,
        hoverBackgroundColor: selectedVariables.map(v => variables.find(variable => variable.name === v).color.replace('0.9)', '0.3)')),
        hoverBorderColor: 'rgba(255, 255, 255, 5)',
        hoverBorderWidth: 3
      }]
    };
  
    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: 'white',
            font: {
              size: 12
            },
            padding: 20
          }
        },
        title: {
          display: true,
          text: 'Gráfico de Dona',
          color: 'white',
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 30
          }
        },
      },
      cutout: '60%',
      rotation: -0.5 * Math.PI,
      animation: {
        animateScale: true,
        animateRotate: true
      }
    };
  
    return <Doughnut data={doughnutData} options={doughnutOptions} />;
  };

  return (
    <Box bg="gray.800" color="white" minH="100vh" p={4}>
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

      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={6}>
        <GridItem>
          <Box bg="gray.900"  p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="600px" boxShadow="dark-lg">
            {renderCombinedChart() || (
              <Text color="gray.500" textAlign="center">
                Selecciona al menos una variable para visualizar los datos
              </Text>
            )}
          </Box>
        </GridItem>
        <GridItem>
          <Stack spacing={6}>
            <Box bg="gray.900" p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="290px" boxShadow="dark-lg">
              {renderPolarChart() || (
                <Text color="gray.500" textAlign="center">
                  Gráfico Polar
                </Text>
              )}
            </Box>
            <Box bg="gray.900" p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="290px" boxShadow="dark-lg">
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

export default CombinacionesPage;
