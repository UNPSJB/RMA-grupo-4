import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box, Fade, useColorMode, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Button } from '@chakra-ui/react';
import 'leaflet/dist/leaflet.css';

function MapaNodo({ onMapClick }) {
  const markerPosition = [-43.518, -66.0423]; // Nueva posición en la región especificada
  const [showAttribution, setShowAttribution] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Para controlar la apertura del AlertDialog
  const cancelRef = useRef();
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
          setIsAlertOpen(true); // Abre el AlertDialog si fuera de los límites
        }
      },
    });
    return null;
  }

  const handleConfirm = () => {
    setIsAlertOpen(false);
    // Aquí podrías agregar cualquier acción para cuando se confirme la selección
  };

  const handleCancel = () => {
    setIsAlertOpen(false);
  };

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

      {/* AlertDialog para confirmar la acción */}
      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={handleCancel}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Coordenadas fuera de los límites
            </AlertDialogHeader>
            <AlertDialogBody>
              Las coordenadas seleccionadas están fuera de Argentina.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={handleConfirm}
                 ml={3}
                 bg={colorMode === "light" ? "rgb(0, 31, 63)" : "orange.500"}
                 color={colorMode === "light" ? "gray.200" : "white"}
                 border="none"
                 p="6"
                 boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1), 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.1)"
                 _hover={{
                   bg: colorMode === "light" ? "rgb(0, 41, 83)" : "orange.600",
                   boxShadow:
                     "10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1), 6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.1)",
                   transform: "scale(1.05)",
                 }}
                 _active={{
                   bg: colorMode === "light" ? "rgb(0, 21, 43)" : "orange.700",
                   transform: "translateY(2px)",
                   boxShadow:
                     "10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1), inset 6px 6px 12px rgba(0,0,0,0.2), inset -6px -6px 12px rgba(255,255,255,0.1)",
                 }}
              >
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default MapaNodo;
