import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Box,Text,useColorMode ,  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,Button } from '@chakra-ui/react';
import { MdZoomOutMap } from 'react-icons/md';
import { useAuth } from '../components/AuthContext';

const TemperaturaPrecipitacionBarra = ({ nodeId1, nodeId2 }) => {
    const [chartData, setChartData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { colorMode } = useColorMode();
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    const { token } = useAuth();

    const fetchChartData = async () => {
        try {
            const [temperaturaResponse1, temperaturaResponse2, precipitacionResponse1, precipitacionResponse2] = await Promise.all([
                axios.get('http://localhost:8000/api/v1/clima/temperatura', {headers: { Authorization: `Bearer ${token}`}}, { params: { node_id: nodeId1 } }),
                axios.get('http://localhost:8000/api/v1/clima/temperatura', {headers: { Authorization: `Bearer ${token}`}}, { params: { node_id: nodeId2 } }),
                axios.get('http://localhost:8000/api/v1/clima/precipitacion', {headers: { Authorization: `Bearer ${token}`}}, { params: { node_id: nodeId1 } }),
                axios.get('http://localhost:8000/api/v1/clima/precipitacion', {headers: { Authorization: `Bearer ${token}`}}, { params: { node_id: nodeId2 } })
            ]);

            const extractData = (response) => {
                if (response.data.data && Array.isArray(response.data.data)) {
                    const timestamps = response.data.data.map(item => new Date(item.timestamp));
                    const values = response.data.data.map(item => parseFloat(item.data));
                    return { timestamps, values };
                } else {
                    console.error("Data format unexpected:", response.data);
                    return { timestamps: [], values: [] };
                }
            };

            const temperatura1 = extractData(temperaturaResponse1);
            const temperatura2 = extractData(temperaturaResponse2);
            const precipitacion1 = extractData(precipitacionResponse1);
            const precipitacion2 = extractData(precipitacionResponse2);

            const chartData = {
                labels: temperatura1.timestamps.map(item => item.toLocaleTimeString()), 
                datasets: [
                    {
                        label: `Temperatura Nodo ${nodeId1}`,
                        data: temperatura1.values,
                        backgroundColor: 'rgba(75,192,192,0.6)',
                        yAxisID: 'y1',
                    },
                    {
                        label: `Temperatura Nodo ${nodeId2}`,
                        data: temperatura2.values,
                        backgroundColor: 'rgba(153,102,255,0.6)',
                        yAxisID: 'y1',
                    },
                    {
                        label: `Precipitacion Nodo ${nodeId1}`,
                        data: precipitacion1.values,
                        backgroundColor: 'rgba(255,159,64,0.6)',
                        yAxisID: 'y2',
                    },
                    {
                        label: `Precipitacion Nodo ${nodeId2}`,
                        data: precipitacion2.values,
                        backgroundColor: 'rgba(54,162,235,0.6)',
                        yAxisID: 'y2',
                    }
                ]
            };

            // Establecemos los datos del gráfico
            setChartData(chartData);
        } catch (error) {
            console.error('Error fetching chart data:', error);
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
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: colorMode === 'light' ? 'black' : 'white'},
                grid: { color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'   }
            },
            y1: { 
                ticks: { color: colorMode === 'light' ? 'black' : 'white'},
                grid: { color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'   },
                position: 'left',
                title: { display: true, text: 'Temperatura (°C)', color: colorMode === 'light' ? 'black' : 'white' }
            },
            y2: { 
                ticks: { color: colorMode === 'light' ? 'black' : 'white' },
                grid: { color: colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)' },
                position: 'right',
                title: { display: true, text: 'Precipitacion (mm)', color: colorMode === 'light' ? 'black' : 'white' }
            }
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
            <Button onClick={handleOpen} display="flex" mb="3"><MdZoomOutMap /></Button>
            {chartData ? (
                <Box height={{ base: '300px', md: '400px' }}>
                    <Bar data={chartData} options={chartOptions} />
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
                            <Bar data={chartData} options={chartOptions} /> {/* Cambiar a Bar */}
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

export default TemperaturaPrecipitacionBarra;