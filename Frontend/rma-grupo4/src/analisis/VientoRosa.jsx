import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import axios from 'axios';
import { Box,Text,useColorMode ,  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,Button } from '@chakra-ui/react';
import { MdZoomOutMap } from 'react-icons/md';
import { useAuth } from '../components/AuthContext';

const VientoRosa = ({ nodeId1, nodeId2 }) => {
    const [vientoData, setVientoData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { colorMode } = useColorMode();
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const { token } = useAuth();
    
    const fetchChartData = async () => {
        try {
            // Fetch Viento Data
            const vientoResponse1 = await axios.get(`http://localhost:8000/api/v1/clima/viento`, {headers: { Authorization: `Bearer ${token}`}}, {
                params: { node_id: nodeId1 }
            });
            const vientoResponse2 = await axios.get(`http://localhost:8000/api/v1/clima/viento`, {headers: { Authorization: `Bearer ${token}`}}, {
                params: { node_id: nodeId2 }
            });

            const vientoProcessedData1 = vientoResponse1.data.data.map(item => ({
                ...item,
                data: parseFloat(item.data),
                timestamp: new Date(item.timestamp)
            }));

            const vientoProcessedData2 = vientoResponse2.data.data.map(item => ({
                ...item,
                data: parseFloat(item.data),
                timestamp: new Date(item.timestamp)
            }));

            const vientoLabels = vientoProcessedData1.map(item => item.timestamp.toLocaleTimeString());

            // Create vientoData for Radar chart
            setVientoData({
                labels: vientoLabels,
                datasets: [
                    {
                        label: `Viento Nodo ${nodeId1}`,
                        data: vientoProcessedData1.map(item => item.data),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    },
                    {
                        label: `Viento Nodo ${nodeId2}`,
                        data: vientoProcessedData2.map(item => item.data),
                        backgroundColor: 'rgba(192, 75, 192, 0.5)',
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
    
    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                pointLabels: { // Controla las etiquetas de las horas alrededor del gráfico
                    color: colorMode === 'light' ? 'black' : 'white',  // Cambia este valor para ajustar el color de las etiquetas
                    font: { size: 12
                     } // Tamaño de las etiquetas de las horas
                  },

                grid: {
                    color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'white' 
                },
                ticks: { 
                    color: colorMode === 'light' ? 'black' : 'black', 
                    font: { size: 12 } 
                },
                angleLines: {
                    color: 'white', 
                },
            },
        },
        plugins: {
            legend: {
                labels: { color: 'white' }, 
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
        <Button onClick={handleOpen} display="flex" mb="3"><MdZoomOutMap /></Button>
            {vientoData ? (
                <Box height={{ base: '300px', md: '350px'}}>
                    <Radar data={vientoData} options={radarOptions} />
                </Box>
            ) : <p>Loading...</p>}
        </Box>
        <Modal isOpen={isOpen} onClose={handleClose} size="x1">
            <ModalOverlay />
            <ModalContent m={10}>
                <ModalCloseButton />
                <ModalBody p={4}>
                    <Box height="500px" width="100%" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                    {vientoData ? (
                        <Box height={{ base: '450px', md: '450px' }} bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'}>
                            <Radar data={vientoData} options={radarOptions} /> {/* Cambiar a Bar */}
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

export default VientoRosa;