import React, { useState, useEffect } from "react";
import { Box, Icon, Text, HStack, Spinner } from "@chakra-ui/react";
import { FaTemperatureHigh, FaTint, FaWind, FaClock } from "react-icons/fa";
import axios from "axios";

const DatosNodo = ({ idNodo }) => {
  const [nodeData, setNodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchNodeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/clima/nodos/resumen/${idNodo}`
        );

        if (response.data.summary && response.data.summary.length > 0) {
          setNodeData(response.data.summary[0]); // Suponiendo que la respuesta tiene este formato
        } else {
          setError("No se encontraron datos para este nodo.");
        }
      } catch (err) {
        setError(`Error al obtener los datos del nodo: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNodeData();
  }, [idNodo]);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box p={4} textAlign="center">
      <HStack spacing={8} justify="center">
        <HStack>
          <Icon as={FaTemperatureHigh} boxSize={6} color="red.500" />
          <Text fontSize="lg" fontWeight="bold">
            Temperatura: {nodeData?.last_temperature ?? "N/A"}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaTint} boxSize={6} color="blue.500" />
          <Text fontSize="lg" fontWeight="bold">
            Humedad: {nodeData?.last_humidity ?? "N/A"}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaWind} boxSize={6} color="green.500" />
          <Text fontSize="lg" fontWeight="bold">
            Viento: {nodeData?.last_wind ?? "N/A"}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaClock} boxSize={6} color="gray.500" />
          <Text fontSize="lg" fontWeight="bold">
            Fecha:{" "}
            {nodeData?.last_update
              ? new Date(nodeData.last_update).toLocaleString()
              : "N/A"}
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default DatosNodo;
