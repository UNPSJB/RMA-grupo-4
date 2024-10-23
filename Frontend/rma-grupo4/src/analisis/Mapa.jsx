import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Fade, useColorMode } from '@chakra-ui/react'; // Importar useColorMode
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const markerPosition = [-43.518, -66.0423];
  const [showAttribution, setShowAttribution] = useState(true);
  const { colorMode } = useColorMode(); // Usar el hook useColorMode

  // Detectar el scroll de la ventana
  const handleScroll = () => {
    if (window.scrollY > 50) { // Ajusta el valor de scrollY según sea necesario
      setShowAttribution(false);
    } else {
      setShowAttribution(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Limpiar el event listener al desmontar el componente
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MapContainer 
      center={markerPosition} 
      zoom={7} 
      style={{ height: '100%', width: '100%', borderRadius:'2%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
      />
      <Marker position={markerPosition}>
        <Popup>Descarga Cuenca Sagmata</Popup>
      </Marker>
      
      {/* Usar Fade para ocultar la atribución */}
      <Fade in={showAttribution} unmountOnExit>
        <Box 
          position="absolute" 
          bottom="10px" 
          left="10px" 
          backgroundColor={colorMode === 'dark' ? 'gray.700' : 'white'} // Cambiar fondo según el tema
          color={colorMode === 'dark' ? 'white' : 'black'} // Cambiar color del texto según el tema
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

const Mapa = () => {
  const { colorMode } = useColorMode(); // Usar el hook useColorMode

  return (
    <Box 
      height="420px" 
      borderRadius="md" 
      boxShadow="lg" 
      cursor="pointer"
      overflow="hidden"
      bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'} // Cambiar fondo según el tema
      color={colorMode === 'dark' ? 'white' : 'black'} // Cambiar color del texto según el tema
      p={{ base: 2, md: 4 }}
      width={{ base: '100%', md: 'auto' }}
      overflowX="auto"
    >
      <MapComponent />
    </Box>
  );
};

export default Mapa;
