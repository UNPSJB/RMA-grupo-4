import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import { Box } from '@chakra-ui/react';
import axios from 'axios';

const VientoRosa = ({ nodeId1, nodeId2 }) => {
    const [vientoData, setVientoData] = useState(null);

    const fetchChartData = async () => {
        try {
            // Fetch Viento Data
            const vientoResponse1 = await axios.get(`http://localhost:8000/api/v1/clima/viento`, {
                params: { node_id: nodeId1 }
            });
            const vientoResponse2 = await axios.get(`http://localhost:8000/api/v1/clima/viento`, {
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
        fetchChartData();
    }, [nodeId1, nodeId2]);

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)', 
                },
                ticks: {
                    color: 'white', 
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
        <Box 
            bg="gray.700" 
            color="white" 
            p={{ base: 2, md: 4 }}
            borderRadius="md" 
            boxShadow="lg"
            width={{ base: '100%', md: 'auto' }}
            overflowX="auto"
        > 
            {vientoData ? (
                <Box height={{ base: '300px', md: '400px'}}>
                    <Radar data={vientoData} options={radarOptions} />
                </Box>
            ) : <p>Loading...</p>}
        </Box>
    );
};

export default VientoRosa;