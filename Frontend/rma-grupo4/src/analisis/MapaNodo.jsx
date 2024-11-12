import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box, Fade, useColorMode, useToast } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';

function MapaNodo({ onMapClick }) {
  const markerPosition = [-43.518, -66.0423]; // Nueva posición en la región especificada
  const [showAttribution, setShowAttribution] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const { colorMode } = useColorMode();
  const toast = useToast(); // Hook para manejar toasts

  // Definir los límites de Argentina (aproximados y reducidos)
  const bounds = [
    [-55.0, -73.0], // Suroeste
    [-21.0, -53.0]  // Noreste
  ];

  const chubutBounds = [
    [-46.0, -72.0], // Suroeste 
    [-42.0, -65.0]  // Noreste 
  ];

  const handleScroll = () => {
    setShowAttribution(window.scrollY <= 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Componente que escucha el evento de clic en el mapa
  function MapClickHandler() {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;

        // Validar si las coordenadas están dentro de los límites de Argentina
        if (
          lat >= bounds[0][0] && lat <= bounds[1][0] && // Validar latitud
          lng >= bounds[0][1] && lng <= bounds[1][1]   // Validar longitud
        ) {
          setSelectedPosition([lat, lng]); 
          onMapClick(lat, lng); 
        } else {
          toast({
            render: () => (
              <Box 
                color="white" 
                bg="red.600" 
                borderRadius="md" 
                p={5} mb={4} 
                boxShadow="md" 
                fontSize="lg"
              >
                Las coordenadas seleccionadas están fuera de Argentina.
              </Box>
            ),
            duration: 2000,
            isClosable: true,
          });
        }
      },
    });
    return null;
  }

  return (
    <>
      <MapContainer 
        center={markerPosition} // Centrar en la nueva posición
        zoom={8} // Ajustar el zoom para comenzar en esa área específica
        style={{ height: '100%', width: '100%', borderRadius: '2%' }}
        bounds={bounds} // Establecer límites
        maxBounds={bounds} // Evitar que el mapa se desplace fuera de estos límites
        scrollWheelZoom={true} // Permitir el zoom con la rueda del ratón
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        />   
        {selectedPosition && (
          <Marker position={selectedPosition}>
            <Popup>
              <strong>Coordenadas seleccionadas:</strong>
              <br />
              Latitud: {selectedPosition[0].toFixed(5)}
              <br />
              Longitud: {selectedPosition[1].toFixed(5)}
            </Popup>
          </Marker>
        )}
        {/* Agregar el manejador de clics */}
        <MapClickHandler />

        {/* Usar Fade para ocultar la atribución */}
        <Fade in={showAttribution} unmountOnExit>
          <Box 
            position="absolute" 
            bottom="10px" 
            left="10px" 
            backgroundColor={colorMode === 'dark' ? 'gray.700' : 'white'}
            color={colorMode === 'dark' ? 'white' : 'black'}
            padding="2" 
            borderRadius="md" 
            boxShadow="md"
          >
            Tiles &copy; Esri
          </Box>
        </Fade>
      </MapContainer>
    </>
  );
}

export default MapaNodo;