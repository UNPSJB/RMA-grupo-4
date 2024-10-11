import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2'; // Cambiar a Bar para gráficos de barras
import axios from 'axios';

ChartJS.register(...registerables);

const GraficoBarra = ({ title, url, nodeId }) => {
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);  // Para almacenar el resumen

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalUrl = nodeId !== undefined ? `${url}?node_id=${nodeId}` : url;
        const response = await axios.get(finalUrl);

        const dataArray = response.data.data;
        const summaryData = response.data.summary;

        setSummary(summaryData);

        // Procesar los datos para obtener la precipitación
        const processedData = dataArray
          .filter(item => item.type === 'rainfall_t')  // Filtrar por tipo, en este caso "precipitación"
          .map(item => ({
            ...item,
            data: parseFloat(item.data)  // Convertir el valor de `data` a número
          }));

        // Preparar los datos para el gráfico si hay datos procesados
        if (processedData.length > 0) {
          const newData = {
            labels: processedData.map(item => new Date(item.timestamp).toLocaleTimeString()), // Etiquetas con el timestamp formateado
            datasets: [{
              label: `Precipitación`,
              data: processedData.map(item => item.data), // Datos de precipitación
              backgroundColor: 'rgba(255, 0, 0, 0.5)', // Cambiar a rojo con opacidad
              borderColor: 'rgba(255, 0, 0, 1)', // Cambiar el borde a rojo
              borderWidth: 2,
            }]
          };
          setChartData(newData);
        } else {
          console.error('No se encontraron datos procesables.');
        }

      } catch (error) {
        console.error(`Error al obtener los datos del resumen de ${title}:`, error);
      }
    };
    fetchData();
  }, [url, title, nodeId]);

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
        text: `Gráfico de Barras - Precipitación`,
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
          <Bar data={chartData} options={chartOptions} /> {/* Cambiar a Bar */}
        </Box>
      ) : (
        <Text fontSize={{ base: 'sm', md: 'md' }}>
          Cargando gráfico...
        </Text>
      )}
    </Box>
  );
};

export default GraficoBarra;
