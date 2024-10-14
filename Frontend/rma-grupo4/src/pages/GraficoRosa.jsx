import React, { useEffect, useState } from 'react';
import { Box, Text, useColorMode ,  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,Button } from '@chakra-ui/react';
import { Radar } from 'react-chartjs-2'; // Cambiamos PolarArea por Radar
import axios from 'axios';
import { MdZoomOutMap } from "react-icons/md";

const GraficoRosa = ({ title, url, nodeId }) => {
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);  
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const finalUrl = nodeId !== undefined ? `${url}?node_id=${nodeId}` : url;
        const response = await axios.get(finalUrl);
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
              backgroundColor: colorMode === 'light' ? 'rgba(54, 162, 235, 0.2)' : 'rgba(54, 162, 235, 0.4)', 
              borderColor: colorMode === 'light' ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)', 
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
      text: `Gráfico de Rosa`,
      font: { size: 16, weight: 'bold' },
      color: colorMode === 'light' ? 'black' : 'white', 
      padding: { top: 10, bottom: 10 },
    },
  },
  scales: {
    r: { // Para la escala radial del gráfico Radar
      angleLines: {
        display: true,
        color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)', 
      },
      ticks: { 
        color: colorMode === 'light' ? 'black' : 'white', 
        font: { size: 12 } 
      },
      grid: { 
        color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' 
      }
    }
  },
};

  return (
  <>
    <Box 
      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
      color={colorMode === 'light' ? 'black' : 'white'} 
      p={{ base: 2, md: 4 }}
      borderRadius="md" 
      boxShadow="lg"
    >
      <Button onClick={handleOpen} display="flex"><MdZoomOutMap /></Button>
      {chartData ? (
        <Box height={{ base: '250px', md: '280px' } }  >
          <Radar data={chartData} options={chartOptions} /> {/* Radar en lugar de PolarArea */}
        </Box>
      ) : (
        <Text fontSize={{ base: 'sm', md: 'md' }}>
          Cargando gráfico...
        </Text>
      )}
    </Box>
    <Modal isOpen={isOpen} onClose={handleClose} size="x1">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
          <ModalBody p={0}>
            <Box height="500px" width="100%" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
              {chartData ? (
                <Box height={{ base: '450px', md: '450px' }} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                  <Radar data={chartData} options={chartOptions} /> {/* Radar en lugar de PolarArea */}
                </Box>
              ) : (
                <Text fontSize={{ base: 'sm', md: 'md' }}>
                  Cargando gráfico...
                </Text>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
    </Modal>
  </>
  );
}

export default GraficoRosa;
