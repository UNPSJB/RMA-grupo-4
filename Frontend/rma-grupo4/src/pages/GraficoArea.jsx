import React, { useEffect, useState } from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(...registerables);

const GraficoArea = ({ title, url, nodeId }) => {
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);  // Para almacenar el resumen
  const { colorMode } = useColorMode();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalUrl = nodeId !== undefined ? `${url}?node_id=${nodeId}` : url;
        const response = await axios.get(finalUrl);

        // Accede al arreglo de datos y al resumen
        const dataArray = response.data.data;
        const summaryData = response.data.summary;

        // Guardar el resumen en el estado si es necesario
        setSummary(summaryData);

        // Procesar los datos para obtener la humedad
        const processedData = dataArray
          .filter(item => item.type === 'humidity_t')  // Filtrar por tipo, en este caso "humedad"
          .map(item => ({
            ...item,
            data: parseFloat(item.data)  // Convertir el valor de `data` a número
          }));

        // Preparar los datos para el gráfico si hay datos procesados
        if (processedData.length > 0) {
          const newData = {
            labels: processedData.map(item => new Date(item.timestamp).toLocaleTimeString()), // Etiquetas con el timestamp formateado
            datasets: [{
              label: `Humedad`,
              data: processedData.map(item => item.data), // Datos de humedad
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)', // Cambiar la opacidad para el área
              borderWidth: 2,
              fill: true, // Habilitar el relleno debajo de la línea
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
  }, [url, title, nodeId]);

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
        text: `Gráfico de Area`,
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
      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'}
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
};

export default GraficoArea;
