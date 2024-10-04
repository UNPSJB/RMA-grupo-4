import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'; 

ChartJS.register(...registerables);

const variables = [
  { name: 'temperatura', color: 'rgba(255, 99, 132, 1)' },
  { name: 'humedad', color: 'rgba(54, 162, 235, 1)' },
  { name: 'presion', color: 'rgba(255, 206, 86, 1)' },
  { name: 'viento', color: 'rgba(75, 192, 192, 1)' },
];

const GraficoLinea = ({ data, selectedVariables }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Si no hay datos, no hacer nada
    if (!data || data.length === 0) return;

    // Filtrar las variables seleccionadas para mostrarlas en el gráfico
    const filteredVariables = variables.filter(variable =>
      selectedVariables.includes(variable.name)
    );

    // Crear nuevo conjunto de datos basado en los datos pasados por `props`
    const newData = {
      labels: data.map(item => item.Nodo), // Usamos los Nodos como etiquetas
      datasets: filteredVariables.map(variable => ({
        label: variable.name,
        data: data.map(item => item[variable.name.charAt(0).toUpperCase() + variable.name.slice(1)]), // Obtenemos los valores de la variable seleccionada
        borderColor: variable.color,
        backgroundColor: variable.color.replace('1)', '0.2)'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      })),
    };

    setChartData(newData);
  }, [data, selectedVariables]); // Se actualiza cada vez que cambien los datos o las variables seleccionadas

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: { color: 'white', font: { size: 12 } }
      },
      title: {
        display: true,
        text: 'Gráfico de Linea',
        font: { size: 16, weight: 'bold' },
        color: 'white',
        padding: { top: 10, bottom: 10 },
      },
    },
    scales: {
      x: { 
        ticks: { color: 'white', font: { size: 12 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
      y: { 
        ticks: { color: 'white', font: { size: 12 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
    },
  };

  return (
    <Box 
      bg="gray.700" 
      color="white" 
      p={{ base: 2, md: 4 }}
      borderRadius="md" 
      boxShadow="lg"
      width={{ base: '100%', md: 'auto' }}
      overflowX="auto"
    >
      {chartData ? (
        <Box height={{ base: '300px', md: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      ) : (
        <Text fontSize={{ base: 'sm', md: 'md' }}>
          Cargando gráfico...
        </Text>
      )}
    </Box>
  );
}

export default GraficoLinea;
