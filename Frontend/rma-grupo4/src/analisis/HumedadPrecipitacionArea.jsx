import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@chakra-ui/react';
import axios from 'axios';

const HumedadPrecipitacionArea = ({ nodeId1, nodeId2 }) => {
    const [chartData, setChartData] = useState(null);

    const fetchChartData = async () => {
        try {
            const variables = ['humedad', 'precipitacion'];

            // Hacer las solicitudes para cada variable y nodo
            const datasets = await Promise.all(variables.map(async (variable) => {
                const response1 = await axios.get(`http://localhost:8000/api/v1/clima/${variable}`, {
                    params: { node_id: nodeId1 }
                });
                const response2 = await axios.get(`http://localhost:8000/api/v1/clima/${variable}`, {
                    params: { node_id: nodeId2 }
                });

                const processedData1 = response1.data.data.map(item => ({
                    ...item,
                    data: parseFloat(item.data),
                    timestamp: new Date(item.timestamp)
                }));

                const processedData2 = response2.data.data.map(item => ({
                    ...item,
                    data: parseFloat(item.data),
                    timestamp: new Date(item.timestamp)
                }));

                const labels = processedData1.map(item => item.timestamp.toLocaleTimeString());

                return {
                    variable,
                    labels,
                    datasets: [
                        {
                            label: `${variable} Nodo ${nodeId1}`,
                            data: processedData1.map(item => item.data),
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: true
                        },
                        {
                            label: `${variable} Nodo ${nodeId2}`,
                            data: processedData2.map(item => item.data),
                            backgroundColor: 'rgba(192, 75, 192, 0.5)',
                            borderColor: 'rgba(192, 75, 192, 1)',
                            borderWidth: 1,
                            fill: true
                        }
                    ]
                };
            }));

            setChartData({
                labels: datasets[0].labels,
                datasets: datasets.flatMap(item => item.datasets)
            });

        } catch (error) {
            console.error('Error al obtener los datos del gráfico:', error);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [nodeId1, nodeId2]);

    const chartOptions = {
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
        <Box 
        bg="gray.700" 
        color="white" 
        p={{ base: 2, md: 4 }}
        borderRadius="md" 
        boxShadow="lg"
        width={{ base: '100%', md: 'auto' }}
        overflowX="auto"
        > 
        {chartData ? (
            <Box height={{ base: '300px', md: '400px' }}>
                <Line data={chartData} options={chartOptions} />
            </Box>
        ) : <p>Loading...</p>}  
    </Box>
    );
};

export default HumedadPrecipitacionArea;