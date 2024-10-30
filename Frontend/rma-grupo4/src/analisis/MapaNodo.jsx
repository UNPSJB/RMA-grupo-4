import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box, Fade, useColorMode } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';

function MapaNodo({ onMapClick }) {
  const markerPosition = [-38.4161, -63.6167]; // Centro de Argentina
  const [showAttribution, setShowAttribution] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null); 
  const { colorMode } = useColorMode();

  // Definir los límites de Argentina (aproximados y reducidos)
  const bounds = [
    [-55.0, -73.0], // Suroeste
    [-21.0, -53.0]  // Noreste
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
          alert("No se puede colocar un pin fuera de Argentina."); // Mensaje de advertencia
        }
      },
    });
    return null;
  }

  return (
    <MapContainer 
      center={markerPosition} 
      zoom={5} 
      style={{ height: '100%', width: '100%', borderRadius: '2%' }}
      bounds={bounds} // Establecer límites
      maxBounds={bounds} // Evitar que el mapa se desplace fuera de estos límites
      scrollWheelZoom={true} // Permitir el zoom con la rueda del ratón
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <Marker position={markerPosition}>
        <Popup>Descarga Cuenca Sagmata</Popup>
      </Marker>
      
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
  );
};

export default MapaNodo;
