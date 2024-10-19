import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const PresionLineas = ({ nodeId1, nodeId2 }) => {
    const [presionData, setPresionData] = useState(null);

    const fetchChartData = async () => {
        try {
            const presionResponse1 = await axios.get(`http://localhost:8000/api/v1/clima/presion`, {
                params: { node_id: nodeId1 }
            });
            const presionResponse2 = await axios.get(`http://localhost:8000/api/v1/clima/presion`, {
                params: { node_id: nodeId2 }
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
                    },
                    {
                        label: `Presión Nodo ${nodeId2}`,
                        data: presionProcessedData2.map(item => item.data),
                        borderColor: 'rgba(153,102,255,1)',
                    }
                ]
            });

        } catch (error) {
            console.error('Error al obtener los datos del gráfico:', error);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [nodeId1, nodeId2]);

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { 
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: { 
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
        },
        plugins: {
            legend: {
                labels: { color: 'white' }
            }
        }
    };

    return (
        <Box 
            bg="gray.700" 
            color="white" 
            p={{ base: 2, md: 4 }}
            borderRadius="md" 
            boxShadow="lg"
            width={{ base: '100%', md: 'auto' }}
            overflowX="auto"
        > 
            {presionData ? (
                <Box height={{ base: '300px', md: '400px' }}>
                    <Line data={presionData} options={lineOptions} />
                </Box>
            ) : <p>Loading...</p>}  
        </Box>
    );
};

export default PresionLineas;