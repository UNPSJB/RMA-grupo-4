import React, { useState, useEffect } from "react";
import {
  Box,
  useColorMode,
  useToast,
  useColorModeValue,
  Flex,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { FaPlus, FaPen, FaTrashAlt, FaEye } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import DatosNodo from "../components/DatosNodo";

const Mapa = () => {
  const [nodos, setNodos] = useState([]);
  const [nodeToEdit, setNodeToEdit] = useState(null);
  const [showDatosNodo, setShowDatosNodo] = useState(false); // Estado para controlar la visibilidad de DatosNodo
  const [selectedNodeId, setSelectedNodeId] = useState(null); // Estado para almacenar el id del nodo seleccionado
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";
  const navigate = useNavigate();

  // Cargar nodos desde la API
  const fetchNodos = async () => {
    try {
      const response = await fetch("http://localhost:8000/obtenerNodosActivos");
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

  // Función para mostrar/ocultar DatosNodo

  // Editar un nodo
  const handleEdit = (id_nodo) => {
    setNodeToEdit(id_nodo);
    navigate(`/formulario_nodo`, { state: { id_nodo } });
  };

  // Crear nuevo nodo
  const handleNew = () => {
    navigate(`/formulario_nodo`);
  };

  // Manejar la visualización de los detalles del nodo
  const handleShowDatosNodo = (id_nodo) => {
    console.log("Nodo seleccionado ID:", id_nodo); // Log para verificar el ID
    setSelectedNodeId(id_nodo); // Almacena el id del nodo seleccionado
    setShowDatosNodo(true); // Mostrar DatosNodo
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

      {/* Mostrar el componente DatosNodo solo si showDatosNodo es true */}
      {showDatosNodo && <DatosNodo idNodo={selectedNodeId} />}

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
        height="auto"
        width="100%"
        bg={colorMode === "dark" ? "gray.700" : "gray.200"}
        color={colorMode === "dark" ? "white" : "black"}
        p={{ base: 2, md: 4 }}
        borderRadius={5}
      >
        <MapContainer
          center={[-43.518, -66.0423]}
          zoom={3.7}
          style={{
            height: "60vh",
            width: "100%",
            position: "relative",
            zIndex: 0,
          }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Esri and others"
          />

          {nodos.map((nodo) => (
            <Marker
              key={nodo.id_nodo}
              position={[nodo.latitud, nodo.longitud]}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
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
                  <strong style={{ color: isLight ? "#3182ce" : "#90cdf4" }}>
                    Nodo:
                  </strong>{" "}
                  {nodo.id_nodo} <br />
                  <strong style={{ color: isLight ? "#3182ce" : "#90cdf4" }}>
                    Alias:
                  </strong>{" "}
                  {nodo.alias} <br />
                  <strong style={{ color: isLight ? "#3182ce" : "#90cdf4" }}>
                    Longitud:
                  </strong>{" "}
                  {nodo.longitud} <br />
                  <strong style={{ color: isLight ? "#3182ce" : "#90cdf4" }}>
                    Latitud:
                  </strong>{" "}
                  {nodo.latitud}
                  <Box mt={5} key={nodo.id_nodo}>
                    <Flex justify="space-evenly" align="center">
                      <IconButton
                        title="Mostrar Datos Nodo"
                        aria-label="Mostrar Datos"
                        icon={<FaEye />}
                        onClick={() => handleShowDatosNodo(nodo.id_nodo)}
                        background={buttonDefaultColor}
                        borderRadius="6px"
                        boxShadow={buttonShadow}
                        _hover={{
                          background: buttonHoverColor,
                          color: "lightgray",
                        }}
                      />
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
                    </Flex>
                  </Box>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </>
  );
};

export default Mapa;
