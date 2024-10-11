import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2'; 
import axios from 'axios';

const GraficoLinea = ({ title, url }) => {
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);  // Para almacenar el resumen

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);

        const dataArray = response.data.data;
        const summaryData = response.data.summary;

        setSummary(summaryData);

        const processedData = dataArray
          .filter(item => item.type === 'temp_t')  
          .map(item => ({
            ...item,
            data: parseFloat(item.data)  
          }));

        if (processedData.length > 0) {
          const newData = {
            labels: processedData.map(item => new Date(item.timestamp).toLocaleDateString()), // Etiquetas con el timestamp formateado
            datasets: [{
              label: `${title}`,
              data: processedData.map(item => item.data), // Datos de temperatura
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderWidth: 2,
              fill: false,
              tension: 0.4
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
  }, [url, title]);

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
        text: `Gráfico de Línea`,
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
        <Box height={{ base: '300px', md: '500px' }}>
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
