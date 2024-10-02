import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Icon,
  Box,
  Heading,
  Select,
  Text,
} from '@chakra-ui/react';
import { Line, } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { HiChartBar } from "react-icons/hi";

ChartJS.register(...registerables);

const GraficosPage = () => {
  const [temperatureData, setTemperatureData] = useState([]);  // Cambiar a un solo estado para temperatura
  const [timeRange, setTimeRange] = useState('1h');  // Mantener el rango de tiempo seleccionado

  //const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, [timeRange]);
  
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/clima/temperatura', {
        params: {
          time_range: timeRange,  // Enviar el rango de tiempo como parámetro
        },
      });
      console.log("Datos de temperatura recibidos:", response.data);
      
      const processedData = response.data.map((item, index) => {
        // Validar que `temperatura` tenga un valor correcto
        let dataValue = item.temperatura;
  
        // Si `temperatura` es undefined, null o cualquier tipo que no sea un número válido, avisamos
        if (dataValue == null || isNaN(parseFloat(dataValue))) {
          console.warn(`Elemento en la posición ${index} tiene un valor inválido para 'temperatura':`, dataValue);
          dataValue = item.temperatura;  // Mantener el valor original para debug (puede ser `undefined`, `null`, etc.)
        } else {
          // Convertir `temperatura` a número si es posible (si ya es número, se queda igual)
          dataValue = parseFloat(dataValue);
        }
  
        return {
          id_nodo: item.id_nodo ?? "Desconocido",  // Verificar si `id_nodo` existe
          time: item.time ?? "Sin timestamp",  // Verificar si `time` está presente
          data: dataValue,  // Cambiar `data` a `temperatura`
        };
      });
  
      setTemperatureData(processedData);
    } catch (error) {
      console.error("Error fetching temperature data: ", error);
    }
  };
  
  
  
  

  const formatChartData = (data) => {
    const labels = data.map(item => new Date(item.time).toLocaleTimeString());  // Convertir el timestamp a una hora legible
    const values = data.map(item => parseFloat(item.data));
    return {
      labels,
      datasets: [{
        label: 'Temperatura (°C)',  // Etiqueta del gráfico
        data: values,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }],
    };
  };
  

  const renderTemperatureChart = () => {
    if (!temperatureData || temperatureData.length === 0) return <Text>No hay datos disponibles para mostrar.</Text>;
    
    return (
      <Line
        data={formatChartData(temperatureData)}  // Formatear y pasar los datos de temperatura
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Temperatura a lo largo del tiempo',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    );
  };
  
  return (
    <Box p={5}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        <Icon as={HiChartBar} p={0} verticalAlign="middle" marginRight={2} marginBottom={2} />
        Datos de Temperatura
      </Heading>
      <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} mb={5} bg="gray.900" color="gray">
        <option value="1h">Última hora</option>
        <option value="24h">Últimas 24 horas</option>
        <option value="7d">Últimos 7 días</option>
      </Select>

      <Box bg="white" p={{ base: 2, md: 4 }} borderRadius="md" color="black" height="400px" boxShadow="dark-lg">
        {renderTemperatureChart()}
      </Box>
    </Box>
  );
};

export default GraficosPage;