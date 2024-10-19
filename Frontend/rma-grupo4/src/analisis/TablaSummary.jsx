import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import axios from 'axios';

const TablaSummary = ({ nodeId1, nodeId2 }) => {
    const [summaryData, setSummaryData] = useState({
        temperatura: { node1: {}, node2: {} },
        presion: { node1: {}, node2: {} },
        precipitacion: { node1: {}, node2: {} },
        humedad: { node1: {}, node2: {} },
        viento: { node1: {}, node2: {} },
    });

    const fetchChartData = async () => {
        try {
            const endpoints = [
                { title: 'Temperatura', url: 'http://localhost:8000/api/v1/clima/temperatura' },
                { title: 'Humedad', url: 'http://localhost:8000/api/v1/clima/humedad' },
                { title: 'Precipitación', url: 'http://localhost:8000/api/v1/clima/precipitacion' },
                { title: 'Viento', url: 'http://localhost:8000/api/v1/clima/viento' },
                { title: 'Presión', url: 'http://localhost:8000/api/v1/clima/presion' },
            ];

            const summaryPromises = endpoints.map(async (endpoint) => {
                const response1 = await axios.get(endpoint.url, { params: { node_id: nodeId1 } });
                const response2 = await axios.get(endpoint.url, { params: { node_id: nodeId2 } });

                return {
                    [endpoint.title]: {
                        node1: response1.data.summary || {},
                        node2: response2.data.summary || {}
                    }
                };
            });

            const results = await Promise.all(summaryPromises);
            const summary = results.reduce((acc, item) => Object.assign(acc, item), {});
            setSummaryData(summary);

        } catch (error) {
            console.error('Error al obtener los datos del resumen:', error);
        }
    };

    useEffect(() => {
        fetchChartData();
    }, [nodeId1, nodeId2]);

    return (
        <Box 
            bg="gray.700" 
            color="white" 
            p={{ base: 2, sm: 3, md: 4 }}
            borderRadius="md" 
            boxShadow="lg"
            width="100%" 
            overflowX="auto" 
            >
            <Table variant="striped" colorScheme="blackAlpha" size={{ base: "sm", md: "md" }} height={{ base: '300px', md: '400px' }}>
                <Thead>
                <Tr>
                    <Th color="gray.300">Variable</Th>
                    <Th color="gray.300"><Text align="center">Nodo {nodeId1}</Text></Th>
                    <Th color="gray.300"><Text align="center">Nodo {nodeId2}</Text></Th>
                </Tr>
                </Thead>
                <Tbody>
                {Object.entries(summaryData).map(([key, values]) => (
                    <React.Fragment key={key}>
                    <Tr>
                        <Td fontWeight="bold">{key}</Td>
                        <Td>
                        <Text align="center">Máx: {values.node1.max_value?.toFixed(2) ?? 'N/A'}</Text>
                        </Td>
                        <Td>
                        <Text align="center">Máx: {values.node2.max_value?.toFixed(2) ?? 'N/A'}</Text>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td></Td>
                        <Td>
                        <Text align="center">Mín: {values.node1.min_value?.toFixed(2) ?? 'N/A'}</Text>
                        </Td>
                        <Td>
                        <Text align="center">Mín: {values.node2.min_value?.toFixed(2) ?? 'N/A'}</Text>
                        </Td>
                    </Tr>
                    <Tr>
                        <Td></Td>
                        <Td>
                        <Text align="center">Prom: {values.node1.average_value?.toFixed(2) ?? 'N/A'}</Text>
                        </Td>
                        <Td>
                        <Text align="center">Prom: {values.node2.average_value?.toFixed(2) ?? 'N/A'}</Text>
                        </Td>
                    </Tr>
                    </React.Fragment>
                ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default TablaSummary;
