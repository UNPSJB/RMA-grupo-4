import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@chakra-ui/react';
import axios from 'axios';

const TemperaturaHumedadLineas = ({ nodeId1, nodeId2 }) => {
    const [chartData, setChartData] = useState(null);

    const fetchChartData = async () => {
        try {
            const [temperaturaResponse1, temperaturaResponse2, humedadResponse1, humedadResponse2] = await Promise.all([
                axios.get('http://localhost:8000/api/v1/clima/temperatura', { params: { node_id: nodeId1 } }),
                axios.get('http://localhost:8000/api/v1/clima/temperatura', { params: { node_id: nodeId2 } }),
                axios.get('http://localhost:8000/api/v1/clima/humedad', { params: { node_id: nodeId1 } }),
                axios.get('http://localhost:8000/api/v1/clima/humedad', { params: { node_id: nodeId2 } })
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
            const humedad1 = extractData(humedadResponse1);
            const humedad2 = extractData(humedadResponse2);

            const chartData = {
                labels: temperatura1.timestamps.map(item => item.toLocaleTimeString()), 
                datasets: [
                    {
                        label: `Temperatura Nodo ${nodeId1}`,
                        data: temperatura1.values,
                        borderColor: 'rgba(75,192,192,1)',
                        fill: false,
                        yAxisID: 'y1', 
                    },
                    {
                        label: `Temperatura Nodo ${nodeId2}`,
                        data: temperatura2.values,
                        borderColor: 'rgba(153,102,255,1)',
                        fill: false,
                        yAxisID: 'y1', 
                    },
                    {
                        label: `Humedad Nodo ${nodeId1}`,
                        data: humedad1.values,
                        borderColor: 'rgba(255,159,64,1)',
                        fill: false,
                        yAxisID: 'y2', 
                    },
                    {
                        label: `Humedad Nodo ${nodeId2}`,
                        data: humedad2.values,
                        borderColor: 'rgba(54,162,235,1)',
                        fill: false,
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
            y1: { 
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                position: 'left',
                title: { display: true, text: 'Temperatura (°C)', color: 'white' }
            },
            y2: { 
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                position: 'right',
                title: { display: true, text: 'Humedad (%)', color: 'white' }
            }
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
            {chartData ? (
                <Box height={{ base: '300px', md: '400px' }}>
                    <Line data={chartData} options={chartOptions} />
                </Box>
            ) : <p>Loading...</p>}  
        </Box>
    );
};
export default TemperaturaHumedadLineas;
