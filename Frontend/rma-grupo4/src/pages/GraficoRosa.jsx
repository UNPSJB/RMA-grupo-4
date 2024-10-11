import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Radar } from 'react-chartjs-2'; // Cambiamos PolarArea por Radar
import axios from 'axios';

const GraficoRosa = ({ title, url }) => {
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);

        // Verificar la estructura de response.data
        console.log("Datos obtenidos de la API ROSAS:", response.data.data);

        // Accede al arreglo de datos y al resumen
        const dataArray = response.data.data;
        const summaryData = response.data.summary;

        // Guardar el resumen en el estado si es necesario
        setSummary(summaryData);

        // Procesar los datos
        const processedData = dataArray
          .filter(item => item.type === 'windspd_t')  // Filtrar por el tipo "viento"
          .map(item => ({
            ...item,
            data: parseFloat(item.data)  // Convertir el valor de `data` a número
          }));

        // Preparar los datos para el gráfico si hay datos procesados
        if (processedData.length > 0) {
          const newData = {
            labels: processedData.map(item => new Date(item.timestamp).toLocaleDateString()), // Etiquetas con la fecha
            datasets: [{
              label: `${title}`,
              data: processedData.map(item => item.data), // Datos de viento
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
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
        text: `Gráfico de Radar`,
        font: { size: 16, weight: 'bold' },
        color: 'white',
        padding: { top: 10, bottom: 10 },
      },
    },
    scales: {
      r: { // Para la escala radial del gráfico Radar
        angleLines: {
          display: true,
          color: 'rgba(255, 255, 255, 0.1)', // Líneas angulares del gráfico
        },
        ticks: { 
          color: 'white', 
          font: { size: 12 } 
        },
        grid: { 
          color: 'rgba(255, 255, 255, 0.1)' 
        }
      }
    },
  };

  return (
    <Box 
      bg="gray.700" 
      color="white" 
      p={{ base: 2, md: 4 }}
      borderRadius="md" 
      boxShadow="lg"
    >
      {chartData ? (
        <Box height={{ base: '150px', md: '210px' }}>
          <Radar data={chartData} options={chartOptions} /> {/* Radar en lugar de PolarArea */}
        </Box>
      ) : (
        <Text fontSize={{ base: 'sm', md: 'md' }}>
          Cargando gráfico...
        </Text>
      )}
    </Box>
  );
}

export default GraficoRosa;
