import React, { useState, useEffect } from "react";
import {
  Box,
  Icon,
  Text,
  HStack,
  Spinner,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaTemperatureHigh,
  FaTint,
  FaWind,
  FaClock,
  FaNetworkWired,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DatosNodo = ({ idNodo }) => {
  const [nodeData, setNodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const buttonDefaultColor = useColorModeValue("gray.300", "gray.600");
  const buttonHoverColor = useColorModeValue(
    "rgb(0, 31, 63)",
    "rgb(255, 130, 37)"
  );
  const buttonShadow = useColorModeValue(
    "5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff",
    "2px 2px 3px rgba(0, 0, 0, 0.3)"
  );

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
        setError(`El nodo no tiene datos`);
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

  const handlClick = () => {
    navigate(`/analisis_actual`);
  };

  return (
    <Box p={4} textAlign="center">
      <HStack spacing={8} justify="center">
        <HStack>
          <Icon as={FaNetworkWired} boxSize={6} color="orange.500" />
          <Text fontSize="lg" fontWeight="bold">
            Nodo: {idNodo ?? "--"}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaTemperatureHigh} boxSize={6} color="red.500" />
          <Text fontSize="lg" fontWeight="bold">
            Temperatura: {nodeData?.last_temperature.toFixed(2) ?? "-"}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaTint} boxSize={6} color="blue.500" />
          <Text fontSize="lg" fontWeight="bold">
            Humedad: {nodeData?.last_humidity.toFixed(2) ?? "-"}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaWind} boxSize={6} color="green.500" />
          <Text fontSize="lg" fontWeight="bold">
            Viento: {nodeData?.last_wind.toFixed(2) ?? "-"}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaClock} boxSize={6} color="gray.500" />
          <Text fontSize="lg" fontWeight="bold">
            Fecha:{" "}
            {nodeData?.last_update
              ? new Date(nodeData.last_update).toLocaleString()
              : "-"}
          </Text>
        </HStack>
        <HStack>
          <Button
            background={buttonDefaultColor}
            borderRadius="6px"
            boxShadow={buttonShadow}
            _hover={{
              background: buttonHoverColor,
              color: "lightgray",
            }}
            onClick={handlClick}
          >
            Detalle
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};

export default DatosNodo;
