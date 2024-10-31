import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2'; 
import axios from 'axios';
import { MdZoomOutMap } from "react-icons/md";
import { Box,Text,useColorMode ,  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,Button } from '@chakra-ui/react';
import { useAuth } from '../components/AuthContext';

const GraficoLinea = ({ title, url, nodeId }) => {
  const [chartData, setChartData] = useState(null);
  const [summary, setSummary] = useState(null);  
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const { token } = useAuth();

  useEffect(() => {
    let timeoutId;
    const fetchData = async () => {
      try {
        const finalUrl = nodeId !== undefined ? `${url}?node_id=${nodeId}` : url;
        const response = await axios.get(finalUrl, {headers: { Authorization: `Bearer ${token}`}});

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
            labels: processedData.map(item => new Date(item.timestamp).toLocaleTimeString()).reverse(), 
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
    const setupTimeout = () => {
      timeoutId = setTimeout(() => {
        fetchData();
        setupTimeout(); 
      }, 10000); 
    };

    setupTimeout();

    return () => clearTimeout(timeoutId);
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
        title: { display: true, text: 'Temperatura (°C)', color: 'white' },
        grid: { 
          color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
        }
      },
    },
  };

  return (
  <>
    <Box 
      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}  // Fondo dinámico según el tema
      color={colorMode === 'light' ? 'black' : 'white'} 
      p={{ base: 2, md: 4 }}
      borderRadius="md" 
      boxShadow="lg"
      width={{ base: '100%', md: 'auto' }}
      overflowX="auto"
    >
    <Button onClick={handleOpen} display="flex"><MdZoomOutMap /></Button>
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
      <Modal isOpen={isOpen} onClose={handleClose} size="x1">
      <ModalOverlay />
      <ModalContent m={10}>
        <ModalCloseButton />
          <ModalBody p={4}>
            <Box height="500px" width="100%" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
              {chartData ? (
                <Box height={{ base: '450px', md: '450px' }} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                  <Line data={chartData} options={chartOptions} />
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

export default GraficoLinea;
