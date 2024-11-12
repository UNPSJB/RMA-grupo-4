import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { MdZoomOutMap } from "react-icons/md";
import { Box, Text, useColorMode, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Button, useColorModeValue} from '@chakra-ui/react';
import { useAuth } from '../components/AuthContext';

const NivelesDeAgua = ({ title, url, nodeId1, nodeId2 }) => {
  const [chartData, setChartData] = useState(null);
  const { colorMode } = useColorMode();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  const { token } = useAuth();

  const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          axios.get(`${url}?node_id=${nodeId1}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${url}?node_id=${nodeId2}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const dataNode1 = response1.data.data
          .filter(item => item.type === 'Nivel de agua')
          .map(item => ({
            ...item,
            data: parseFloat(item.data)
          }));

        const dataNode2 = response2.data.data
          .filter(item => item.type === 'Nivel de agua')
          .map(item => ({
            ...item,
            data: parseFloat(item.data)
          }));

        const newData = {
          labels: dataNode1.map(item => new Date(item.timestamp).toLocaleTimeString()).reverse(),
          datasets: [
            {
              label: `Nivel de Agua Nodo ${nodeId1}`,
              data: dataNode1.map(item => item.data),
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            },
            {
              label: `Nivel de Agua Nodo ${nodeId2}`,
              data: dataNode2.map(item => item.data),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            }
          ]
        };

        setChartData(newData);
      } catch (error) {
        console.error(`Error al obtener los datos del nivel de agua:`, error);
      }
    };

    fetchData();
  }, [url, nodeId1, nodeId2, token]);

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
        text: `Gráfico de Nivel de Agua`,
        font: { size: 16, weight: 'bold' },
        color: colorMode === 'light' ? 'black' : 'white'
      }
    },
    scales: {
      x: {
        ticks: {
          color: colorMode === 'light' ? 'black' : 'white'
        }
      },
      y: {
        ticks: {
          color: colorMode === 'light' ? 'black' : 'white'
        },
        title: { display: true, text: 'Nivel de Agua (m)', color: 'white' }
      }
    }
  };

  return (
    <>
        <Box 
            bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
            color={colorMode === 'light' ? 'black' : 'white'}  
            p={{ base: 2, md: 4 }}
            borderRadius="md" 
            boxShadow="lg"
            width={{ base: '100%', md: 'auto' }}
            overflowX="auto"
            > 
          <Button 
            onClick={handleOpen} 
            display="flex"
            background={buttonDefaultColor}
            boxShadow={buttonShadow}
            _hover={{ 
                background: buttonHoverColor, 
                color: "lightgray"
            }}
          ><MdZoomOutMap /></Button>
            {chartData ? (
                <Box height={{ base: '300px', md: '400px' }}>
                    <Line data={chartData} options={chartOptions} />
                </Box>
            ) : <p>Loading...</p>}
            
          
        </Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="x1">
            <ModalOverlay />
            <ModalContent m={10}>
                <ModalCloseButton />
                <ModalBody p={4}>
                    <Box height="500px" width="100%" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                    {chartData ? (
                        <Box height={{ base: '450px', md: '450px' }} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                            <Line data={chartData} options={chartOptions} /> {/* Cambiar a Bar */}
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
};

export default NivelesDeAgua;
