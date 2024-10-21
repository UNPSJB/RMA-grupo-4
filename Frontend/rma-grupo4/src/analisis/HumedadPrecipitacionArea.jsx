import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Box,Text,useColorMode ,  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,Button } from '@chakra-ui/react';
import { MdZoomOutMap } from 'react-icons/md';

const HumedadPrecipitacionArea = ({ nodeId1, nodeId2 }) => {
    const [chartData, setChartData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const { colorMode } = useColorMode();
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const fetchChartData = async () => {
        try {
            const [humedadResponse1, humedadResponse2, precipitacionResponse1, precipitacionResponse2] = await Promise.all([
                axios.get('http://localhost:8000/api/v1/clima/humedad', { params: { node_id: nodeId1 } }),
                axios.get('http://localhost:8000/api/v1/clima/humedad', { params: { node_id: nodeId2 } }),
                axios.get('http://localhost:8000/api/v1/clima/precipitacion', { params: { node_id: nodeId1 } }),
                axios.get('http://localhost:8000/api/v1/clima/precipitacion', { params: { node_id: nodeId2 } })
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

            const humedad1 = extractData(humedadResponse1);
            const humedad2 = extractData(humedadResponse2);
            const precipitacion1 = extractData(precipitacionResponse1);
            const precipitacion2 = extractData(precipitacionResponse2);

            const chartData = {
                labels: humedad1.timestamps.map(item => item.toLocaleTimeString()), 
                datasets: [
                    {
                        label: `Humedad Nodo ${nodeId1}`,
                        data: humedad1.values,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: true,
                        yAxisID: 'y1',
                        tension: 0.4,
                    },
                    {
                        label: `Humedad Nodo ${nodeId2}`,
                        data: humedad2.values,
                        backgroundColor: 'rgba(153,102,255, 0.5)',
                        borderColor: 'rgba(153,102,255,1)',
                        borderWidth: 1,
                        fill: true,
                        yAxisID: 'y1',
                        tension: 0.4,
                    },
                    {
                        label: `Precipitacion Nodo ${nodeId1}`,
                        data: precipitacion1.values,
                        backgroundColor: 'rgba(255,159,64, 0.5)',
                        borderColor: 'rgba(255,159,64,1)',
                        borderWidth: 1,
                        fill: true,
                        yAxisID: 'y2',
                        tension: 0.4,
                    },
                    {
                        label: `Precipitacion Nodo ${nodeId2}`,
                        data: precipitacion2.values,
                        backgroundColor: 'rgba(54,162,235, 0.5)',
                        borderColor: 'rgba(54,162,235,1)',
                        borderWidth: 1,
                        fill: true,
                        yAxisID: 'y2',
                        tension: 0.4,
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
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.3)' }
            },
            y1: { 
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.3)' },
                position: 'left',
                title: { display: true, text: 'Precipitacion (mm)', color: 'white' }
            },
            y2: { 
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.3)' },
                position: 'right',
                title: { display: true, text: 'Humedad (%)', color: 'white' }
            }
        },
        plugins: {
            legend: {
                labels: { color: 'white' }
            }
        },
        elements: {
            line: { fill: true }
        }
    };

    return (
    <>
      

        <Box 
            bg="gray.700" 
            color="white" 
            p={{ base: 2, md: 4 }}
            borderRadius="md" 
            boxShadow="lg"
            width={{ base: '100%', md: 'auto' }}
            overflowX="auto"
            > 
          <Button onClick={handleOpen} display="flex" mb="3"><MdZoomOutMap /></Button>
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

export default HumedadPrecipitacionArea;