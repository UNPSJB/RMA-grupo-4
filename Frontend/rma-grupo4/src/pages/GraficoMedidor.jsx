import React, { useEffect, useState } from 'react';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2'; 
import axios from 'axios';

const GraficoMedidor = ({ title, url, nodeId }) => {
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

        // Procesar los datos para obtener la presión más reciente
        const lastPressureData = dataArray
          .filter(item => item.type === 'pressure_t') 
          .map(item => ({
            ...item,
            data: parseFloat(item.data)  
          }))
          .slice(-1)[0]; 

        if (lastPressureData) {
          const newData = {
            labels: ['Presión', 'Máximo', 'Mínimo'],
            datasets: [{
              label: `${title}`,
              data: [lastPressureData.data, 1050 - lastPressureData.data, lastPressureData.data - 950], // Simula un medidor entre 950 y 1050 hPa
              backgroundColor: [
                colorMode === 'light' ? 'rgba(75, 192, 192, 1)' : 'rgba(54, 162, 235, 1)', // Color de la presión actual
                'rgba(255, 200, 150, 0.5)', // Parte del medidor que no se llena
                'rgba(255, 99, 132, 0.5)', // Zona mínima
              ],
              borderColor: [
                colorMode === 'light' ? 'rgba(75, 192, 192, 1)' : 'rgba(54, 162, 235, 1)', // Borde del medidor actual
                'rgba(255, 255, 255, 0.2)', // Borde del resto
                'rgba(255, 99, 132, 0.2)', // Borde de la zona mínima
              ],
              borderWidth: 1
            }]
          };
          setChartData(newData);
        } else {
          console.error('No se encontraron datos de presión.');
        }

      } catch (error) {
        console.error(`Error al obtener los datos del resumen de ${title}:`, error);
      }
    };
    fetchData();
  }, [url, title, nodeId, colorMode]);


  const chartOptions = {
    maintainAspectRatio: false,
    rotation: -90, // Inicia en el ángulo superior
    circumference: 180, // Hace que sea semicircular
    responsive: true,
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
  };

  return (
    <Box 
      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} 
      color={colorMode === 'light' ? 'black' : 'white'} 
      p={{ base: 2, md: 4 }}
      borderRadius="md" 
      boxShadow="lg"
    >
      {chartData ? (
        <Box height={{ base: '100px', md: '180px' }}>
          <Doughnut data={chartData} options={chartOptions} /> {/* Gráfico tipo Doughnut para el medidor */}
        </Box>
      ) : (
        <Text fontSize={{ base: 'sm', md: 'md' }}>
          Cargando gráfico...
        </Text>
      )}
    </Box>
  );
}

export default GraficoMedidor;
