import React, { useEffect, useState } from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2'; 
import axios from 'axios';

const GraficoLinea = ({ title, url, nodeId }) => {
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);  
  const { colorMode } = useColorMode();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalUrl = nodeId !== undefined ? `${url}?node_id=${nodeId}` : url;
        const response = await axios.get(finalUrl);

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
            labels: processedData.map(item => new Date(item.timestamp).toLocaleDateString()), 
            datasets: [{
              label: `${title}`,
              data: processedData.map(item => item.data), 
              borderColor: colorMode === 'light' ? 'rgba(75,192,192,1)' : 'rgba(255,99,132,1)',
              backgroundColor: colorMode === 'light' ? 'rgba(75,192,192,0.2)' : 'rgba(255,99,132,0.2)',
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
  }, [url, title, nodeId, colorMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: { 
          color: colorMode === 'light' ? 'black' : 'white',
          font: { size: 12 } 
        }
      },
      title: {
        display: true,
        text: `Gráfico de Línea`,
        font: { size: 16, weight: 'bold' },
        color: colorMode === 'light' ? 'black' : 'white',
        padding: { top: 10, bottom: 10 },
      },
    },
    scales: {
      x: { 
        ticks: { 
          color: colorMode === 'light' ? 'black' : 'white', 
          font: { size: 12 } 
        },
        grid: { 
          color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' 
        }
      },
      y: { 
        ticks: { 
          color: colorMode === 'light' ? 'black' : 'white',
          font: { size: 12 } 
        },
        grid: { 
          color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
        }
      },
    },
  };

  return (
    <Box 
      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}  // Fondo dinámico según el tema
      color={colorMode === 'light' ? 'black' : 'white'} 
      p={{ base: 2, md: 4 }}
      borderRadius="md" 
      boxShadow="lg"
      width={{ base: '100%', md: 'auto' }}
      overflowX="auto"
    >
      {chartData ? (
        <Box height={{ base: '300px', md: '550px' }}>
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
