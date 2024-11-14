import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  useColorMode,
  useToast,
  useColorModeValue,
  Flex,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Heading,
} from "@chakra-ui/react";
import { FaPlus, FaPen, FaTrashAlt } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const Mapa = () => {
  const [nodos, setNodos] = useState([]);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [nodeToEdit, setNodeToEdit] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";
  const navigate = useNavigate();

  // Cargar nodos desde la API
  const fetchNodos = async () => {
    try {
      const response = await fetch("http://localhost:8000/obtenerNodos");
      const data = await response.json();
      if (response.ok) {
        setNodos(data);
      } else {
        toast({
          title: "Error al cargar nodos.",
          description: data.message || "No se pudieron cargar los nodos.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión.",
        description: "No se pudo conectar con la API.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchNodos();
  }, []);

  // Editar un nodo
  const handleEdit = (id_nodo) => {
    setNodeToEdit(id_nodo);
    navigate(`/form_nodo`, { state: { id_nodo } });
  };

  // Crear nuevo nodo
  const handleNew = () => {
    navigate(`/form_nodo`);
  };
  const handleClick = () => {
    navigate(`/analisis_actual`);
  };
  // Eliminar un nodo
  const handleDelete = (alias) => {
    setNodeToDelete(alias);
    setDeleteModalOpen(true);
  };

  // Confirmar eliminación de nodo
  const confirmDelete = async () => {
    setDeleteModalOpen(false);
    try {
      const response = await fetch(
        `http://localhost:8000/eliminar_nodo/${nodeToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        toast({
          render: () => (
            <Box
              color="white"
              bg="red.600"
              borderRadius="md"
              p={5}
              mb={4}
              boxShadow="md"
              fontSize="lg"
            >
              El nodo ha sido eliminado correctamente.
            </Box>
          ),
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setNodos(nodos.filter((nodo) => nodo.alias !== nodeToDelete));
      } else {
        toast({
          render: () => (
            <Box
              color="white"
              bg="red.600"
              borderRadius="md"
              p={5}
              mb={4}
              boxShadow="md"
              fontSize="lg"
            >
              Error: No se pudo eliminar el nodo.
            </Box>
          ),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        render: () => (
          <Box
            color="white"
            bg="red.600"
            borderRadius="md"
            p={5}
            mb={4}
            boxShadow="md"
            fontSize="lg"
          >
            Error: No se pudo conectar con la API.
          </Box>
        ),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const buttonDefaultColor = useColorModeValue("gray.300", "gray.600");
  const buttonHoverColor = useColorModeValue(
    "rgb(0, 31, 63)",
    "rgb(255, 130, 37)"
  );
  const buttonShadow = useColorModeValue(
    "5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff",
    "2px 2px 3px rgba(0, 0, 0, 0.3)"
  );

  return (
    <>
      <Heading as="h1" m={2} textAlign="center">
        Gestión Nodos
      </Heading>
      <Box textAlign="right" mr={10} mb={2}>
        <IconButton
          FaPencilAlt
          title="Agregar Nodo"
          icon={<FaPlus />}
          aria-label="Agregar Nodo"
          background={buttonDefaultColor}
          borderRadius="6px"
          boxShadow={buttonShadow}
          _hover={{
            background: buttonHoverColor,
            color: "lightgray",
          }}
          onClick={handleNew}
        />
      </Box>
      <Box
        height="auto" // Ajusta el alto al contenido
        width="100%" // Ancho completo
        bg={colorMode === "dark" ? "gray.700" : "gray.200"}
        color={colorMode === "dark" ? "white" : "black"}
        p={{ base: 2, md: 4 }}
        borderRadius={5}
      >
        {/* Mapa con nodos */}
        <MapContainer
          center={[-43.518, -66.0423]}
          zoom={7}
          style={{
            height: "60vh", // Reduce la altura vertical del mapa
            width: "100%",
            position: "relative",
            zIndex: 0,
          }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
          />

          {nodos.map((nodo) => (
            <Marker
              key={nodo.id_nodo}
              position={[nodo.latitud, nodo.longitud]}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                click: () => handleClick(),
              }}
            >
              <Popup>
                <Box
                  bg={colorMode === "dark" ? "gray.800" : "white"}
                  color={colorMode === "dark" ? "white" : "black"}
                  p="2"
                  borderRadius="md"
                  boxShadow="lg"
                  fontSize="sm"
                  fontWeight="bold"
                  lineHeight="1.5"
                  maxWidth="200px"
                >
                  <strong
                    style={{
                      color: colorMode === "dark" ? "#90cdf4" : "#3182ce",
                    }}
                  >
                    Nodo:
                  </strong>{" "}
                  {nodo.id_nodo} <br />
                  <strong
                    style={{
                      color: colorMode === "dark" ? "#90cdf4" : "#3182ce",
                    }}
                  >
                    Alias:
                  </strong>{" "}
                  {nodo.alias} <br />
                  <strong
                    style={{
                      color: colorMode === "dark" ? "#90cdf4" : "#3182ce",
                    }}
                  >
                    Longitud:
                  </strong>{" "}
                  {nodo.longitud} <br />
                  <strong
                    style={{
                      color: colorMode === "dark" ? "#90cdf4" : "#3182ce",
                    }}
                  >
                    Latitud:
                  </strong>{" "}
                  {nodo.latitud}
                  <Box mt={10}>
                    <Flex justify="space-evenly" align="center">
                      <IconButton
                        title="Editar Nodo"
                        aria-label="Editar"
                        icon={<FaPen />}
                        onClick={() => handleEdit(nodo.id_nodo)}
                        background={buttonDefaultColor}
                        borderRadius="6px"
                        boxShadow={buttonShadow}
                        _hover={{
                          background: buttonHoverColor,
                          color: "lightgray",
                        }}
                      />
                      <IconButton
                        title="Eliminar Nodo"
                        icon={<FaTrashAlt />}
                        onClick={() => handleDelete(nodo.alias)}
                        aria-label="Eliminar"
                        background={buttonDefaultColor}
                        borderRadius="6px"
                        boxShadow={buttonShadow}
                        _hover={{
                          background: buttonHoverColor,
                          color: "lightgray",
                        }}
                      />
                    </Flex>
                  </Box>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <AlertDialog
          isOpen={isDeleteModalOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setDeleteModalOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader
                bg={colorMode === "light" ? "gray.200" : "gray.800"}
                color={colorMode === "light" ? "black" : "white"}
              >
                Confirmar eliminación
              </AlertDialogHeader>
              <AlertDialogBody>
                ¿Estás seguro de que deseas eliminar el nodo con alias "
                {nodeToDelete}"?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  colorScheme="red"
                  onClick={confirmDelete}
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
                  Eliminar
                </Button>
                <Button
                  ref={cancelRef}
                  onClick={() => setDeleteModalOpen(false)}
                  ml={3}
                  bg="grey.500"
                  border="none"
                  p="6"
                  boxShadow="10px 10px 30px rgba(0, 0, 0, 0.4), -10px -10px 30px rgba(255, 255, 255, 0.1), 4px 4px 10px rgba(0,0,0,0.3), -4px -4px 10px rgba(255,255,255,0.1)"
                  _hover={{
                    bg: "grey.600",
                    boxShadow:
                      "10px 10px 35px rgba(0, 0, 0, 0.5), -10px -10px 35px rgba(255, 255, 255, 0.1), 6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.1)",
                    transform: "scale(1.05)",
                  }}
                  _active={{
                    bg: "grey.700",
                    transform: "translateY(2px)",
                    boxShadow:
                      "10px 10px 30px rgba(0, 0, 0, 0.5), -10px -10px 30px rgba(255, 255, 255, 0.1), inset 6px 6px 12px rgba(0,0,0,0.2), inset -6px -6px 12px rgba(255,255,255,0.1)",
                  }}
                >
                  Cancelar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </>
  );
};

export default Mapa;
