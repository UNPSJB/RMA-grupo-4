import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2'; 

ChartJS.register(...registerables);

// Definición de las variables y sus colores
const variables = [
  { name: 'temperatura', color: 'rgba(255, 99, 132, 1)' },
  { name: 'humedad', color: 'rgba(54, 162, 235, 1)' },
  { name: 'presion', color: 'rgba(255, 206, 86, 1)' },
  { name: 'viento', color: 'rgba(75, 192, 192, 1)' },
];

function GraficoBarra({ data, selectedVariables }) {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    // Si no hay datos, no hacer nada
    if (!data || data.length === 0) return;

    // Crear nuevo conjunto de datos basado en los datos pasados por `props`
    const newData = {
      labels: data.map(item => item.Nodo), // Usamos los Nodos como etiquetas
      datasets: selectedVariables.map(variable => {
        const variableInfo = variables.find(v => v.name === variable);
        return {
          label: variable,
          data: data.map(item => item[variable.charAt(0).toUpperCase() + variable.slice(1)]), // Obtener los valores de la variable seleccionada
          backgroundColor: variableInfo.color,
          borderColor: variableInfo.color,
          borderWidth: 1,
        };
      }),
    };
    setChartData(newData);
  }, [data, selectedVariables]); // Se actualiza cada vez que cambien los datos o las variables seleccionadas

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Gráfico de Barras',
        font: { size: 20, weight: 'bold' },
        color: 'white',
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      x: { 
        ticks: { color: 'white' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
      y: { 
        ticks: { color: 'white' }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
    },
  };

  return (
    <Box bg="gray.700" color="white" p={4} borderRadius="md" boxShadow="lg">
      {chartData ? (
        <Box height="400px">
          <Bar data={chartData} options={chartOptions} />
        </Box>
      ) : (
        <Text>Generando datos para el gráfico...</Text>
      )}
    </Box>
  );
}

export default GraficoBarra;
