import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, useColorMode, Input, Alert, AlertIcon, AlertTitle, AlertDescription, Flex } from '@chakra-ui/react';
import axios from 'axios';
import { saveAs } from 'file-saver'; // Importamos file-saver para descargar el CSV
import { useColorModeValue } from "@chakra-ui/react"

const DescargasHistoricas = () => {
  const { colorMode } = useColorMode();
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('2024-10-01');  // Fecha inicial
  const [endDate, setEndDate] = useState('2024-12-31');      // Fecha final

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/clima/nodos/historico');
        setHistoricalData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError('No se pudieron cargar los datos. Por favor, intenta más tarde.');
      }
    };

    fetchData();
  }, []);

  const downloadCSV = () => {
    // Convertir las fechas seleccionadas a objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Filtrar los datos por el rango de fechas seleccionado
    const filteredData = historicalData.map(row => {
      // Filtrar los valores de cada variable que están dentro del rango de fechas
      const filteredHumidity = row.humidity.filter(humidityRow => {
        const rowDate = new Date(humidityRow.timestamp);
        return rowDate >= start && rowDate <= end;
      });
  
      const filteredTemperature = row.temperature.filter(temperatureRow => {
        const rowDate = new Date(temperatureRow.timestamp);
        return rowDate >= start && rowDate <= end;
      });
  
      const filteredPressure = row.pressure.filter(pressureRow => {
        const rowDate = new Date(pressureRow.timestamp);
        return rowDate >= start && rowDate <= end;
      });
  
      const filteredWind = row.wind.filter(windRow => {
        const rowDate = new Date(windRow.timestamp);
        return rowDate >= start && rowDate <= end;
      });
  
      return {
        id: row.id_nodo,
        humidity: filteredHumidity,
        temperature: filteredTemperature,
        pressure: filteredPressure,
        wind: filteredWind
      };
    }).filter(row => row.humidity.length > 0 || row.temperature.length > 0 || row.pressure.length > 0 || row.wind.length > 0); // Filtramos las filas que tienen al menos un valor en el rango.
  
    // Verificar los datos filtrados
    console.log('Datos filtrados para CSV:', filteredData);
  
    // Generar el contenido del CSV
    const csvContent = filteredData.flatMap(row => {
      return row.humidity.map((humidityRow, index) => {
        // Suponemos que todas las variables tienen los mismos índices de fecha, pero puedes ajustar esto si es necesario.
        const temperatureRow = row.temperature[index] || {};
        const pressureRow = row.pressure[index] || {};
        const windRow = row.wind[index] || {};
  
        // Convertimos el timestamp a un formato de fecha legible (año-mes-día, hora)
        const date = new Date(humidityRow.timestamp);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Mes formateado a dos dígitos
        const day = (`0${date.getDate()}`).slice(-2); // Día formateado a dos dígitos
        const hour = (`0${date.getHours()}`).slice(-2); // Hora formateada a dos dígitos
  
        // Retornamos la fila CSV construida con los valores
        return `${row.id},${year}-${month}-${day},${hour},${temperatureRow.value || 'N/A'},${humidityRow.value || 'N/A'},${pressureRow.value || 'N/A'},${windRow.value || 'N/A'}`;
      });
    });
  
    // Agregar la cabecera y generar el archivo CSV
    const header = 'NODO,Fecha,Hora,Temperatura,Humedad,Presion,Viento\n';
    const blob = new Blob([header + csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'historical_data.csv');
  };  

  return (

    <Box p={4} bg={useColorModeValue('white', 'gray.900')} color={useColorModeValue('black', 'white')}>
      <Heading as="h1" m={5} textAlign="center">Descargar Datos Históricos</Heading>
    
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          <AlertTitle>¡Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    
      <Box 
        p={6} 
        bg={useColorModeValue('white', 'gray.800')} 
        color={useColorModeValue('black', 'white')} 
        borderRadius="md" 
        boxShadow="md"
      >
        <Flex justify="space-evenly" mb={8} wrap="wrap" gap={4}>
          {/* Selector de Fecha Inicial */}
          <Box>
            <label htmlFor="start-date" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block', fontSize:"20px" }}>Fecha Inicio:</label>
            <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => {
                    setStartDate(e.target.value);
                    if (endDate < e.target.value) {
                    setEndDate(e.target.value); // Ajusta automáticamente la fecha de fin si es menor que la de inicio
                    }
                }}
                width="200px" // Ajusta el ancho a 200px para que sea más estrecho
                borderColor={useColorModeValue('gray.400', 'gray.600')}
                _hover={{ borderColor: "teal.500" }}
                _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal" }}
                p={5}
            />
          </Box>
    
          {/* Selector de Fecha Final */}
          <Box>
            <label htmlFor="end-date" style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block', fontSize:"20px"}}>Fecha Fin:</label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate}  // Se asegura de que la fecha de fin no pueda ser menor que la de inicio
              onChange={(e) => setEndDate(e.target.value)}
              width="200px"
              borderColor={useColorModeValue('gray.400', 'gray.600')}
              _hover={{ borderColor: "teal.500" }}
              _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal" }}
               p={5}
            />
          </Box>
        </Flex>
    
        {/* Botón de Descargar CSV */}
        <Flex justify="center">
          <Button 
            onClick={downloadCSV} 
            colorScheme="teal" 
            variant="solid" 
            size="md" 
            borderRadius="md" 
            _hover={{ bg: "teal.600", transform: 'scale(1.05)' }} 
            _active={{ bg: "teal.700", transform: 'scale(0.98)' }}
            transition="background-color 0.2s, transform 0.2s"
            boxShadow="lg"
            p={7}
          >
            Descargar CSV
          </Button>
        </Flex>
      </Box>

  </Box>
  );
};

export default DescargasHistoricas;
