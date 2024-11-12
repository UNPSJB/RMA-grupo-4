import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Box,Text,useColorMode ,  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,Button,useColorModeValue } from '@chakra-ui/react';
import { MdZoomOutMap } from 'react-icons/md';
import { useAuth } from '../components/AuthContext';

const PresionLineas = ({ nodeId1, nodeId2 }) => {
    const [presionData, setPresionData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { colorMode } = useColorMode();
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const { token } = useAuth();

    const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
    const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
    const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");
  
    const fetchChartData = async () => {
        try {
            const presionResponse1 = await axios.get(`http://localhost:8000/api/v1/clima/presion`, {
                params: { node_id: nodeId1 }, headers: { Authorization: `Bearer ${token}`}
            } );
            const presionResponse2 = await axios.get(`http://localhost:8000/api/v1/clima/presion`, {
                params: { node_id: nodeId2 }, headers: { Authorization: `Bearer ${token}`}
            });

            const presionProcessedData1 = presionResponse1.data.data.map(item => ({
                ...item,
                data: parseFloat(item.data),
                timestamp: new Date(item.timestamp)
            }));

            const presionProcessedData2 = presionResponse2.data.data.map(item => ({
                ...item,
                data: parseFloat(item.data),
                timestamp: new Date(item.timestamp)
            }));

            const presionLabels = presionProcessedData1.map(item => item.timestamp.toLocaleTimeString());

            setPresionData({
                labels: presionLabels,
                datasets: [
                    {
                        label: `Presión Nodo ${nodeId1}`,
                        data: presionProcessedData1.map(item => item.data),
                        borderColor: 'rgba(75,192,192,1)',
                        tension: 0.4 
                    },
                    {
                        label: `Presión Nodo ${nodeId2}`,
                        data: presionProcessedData2.map(item => item.data),
                        borderColor: 'rgba(153,102,255,1)',
                        tension: 0.4 
                    }
                ]
            });

        } catch (error) {
            console.error('Error al obtener los datos del gráfico:', error);
        }
    };

    useEffect(() => {
        let timeoutId;
        fetchChartData();
        const setupTimeout = () => {
          timeoutId = setTimeout(() => {
            fetchChartData();
            setupTimeout(); 
          }, 10000); 
        };
    
        setupTimeout();
        return () => clearTimeout(timeoutId);
    }, [nodeId1, nodeId2]);
    
    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { 
                ticks: { color: colorMode === 'light' ? 'black' : 'white'},
                grid: { color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' }
            },
            y: { 
                title: { display: true, text: 'Presión (hPa)', color: colorMode === 'light' ? 'black' : 'white'},
                ticks: { color: colorMode === 'light' ? 'black' : 'white' },
                grid: { color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' }
            },
        },
        plugins: {
            legend: {
                labels: { color: colorMode === 'light' ? 'black' : 'white' }
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
            {presionData ? (
                <Box height={{ base: '300px', md: '400px' }}>
                    <Line data={presionData} options={lineOptions} />
                </Box>
            ) : <p>Loading...</p>}  
        </Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="x1">
            <ModalOverlay />
            <ModalContent m={10}>
                <ModalCloseButton />
                <ModalBody p={4}>
                    <Box height="500px" width="100%" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                    {presionData ? (
                        <Box height={{ base: '450px', md: '450px' }} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                            <Line data={presionData} options={lineOptions} /> {/* Cambiar a Bar */}
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

export default PresionLineas;