import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box, Fade, useColorMode } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';

function MapaNodo({ onMapClick }) {
  const markerPosition = [-43.518, -66.0423];
  const [showAttribution, setShowAttribution] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null); 
  const { colorMode } = useColorMode();

  // Detectar el scroll de la ventana para mostrar u ocultar la atribución
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
        setSelectedPosition([lat, lng]); 
        onMapClick(lat, lng); 
      },
    });
    return null;
  }

  return (
    <MapContainer 
      center={markerPosition} 
      zoom={7} 
      style={{ height: '100%', width: '100%', borderRadius: '2%' }}
      zoomControl={false}
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
