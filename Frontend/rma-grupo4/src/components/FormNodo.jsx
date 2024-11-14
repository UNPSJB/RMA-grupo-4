import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Heading,
  FormLabel,
  Input,
  Textarea,
  useToast,
  VStack,
  HStack,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom"; // Importa useNavigate
import MapaNodo from "../analisis/MapaNodo";

const CrearNodo = () => {
  const [formData, setFormData] = useState({
    id_nodo: "",
    alias: "",
    longitud: "",
    latitud: "",
    descripcion: "",
  });
  const [editingNodeId, setEditingNodeId] = useState(null); // Nodo en edición
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";
  const navigate = useNavigate(); // Hook para navegación
  const location = useLocation();

  useEffect(() => {
    const { id_nodo } = location.state || {}; // Obtener la ID del nodo desde state
    if (id_nodo != null) {
      setEditingNodeId(id_nodo); // Establecer el nodo en modo edición
      fetchNodeData(id_nodo); // Cargar los datos del nodo para edición
    }
  }, [location.state]);

  const fetchNodeData = async (id_nodo) => {
    try {
      const response = await fetch(
        `http://localhost:8000/obtenerNodo/${id_nodo}`
      );
      const data = await response.json();
      if (response.ok) {
        setFormData(data); // Llenar el formulario con los datos del nodo
      } else {
        toast({
          title: "Error al cargar el nodo",
          description:
            data.detail || "Hubo un error al cargar los datos del nodo.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description:
          "No se pudo conectar con la API para obtener los datos del nodo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Maneja los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyDown = (e) => {
    // Permitir solo números, punto decimal y el signo negativo
    const allowedCharacters = /[0-9.-]/;
    if (
      !allowedCharacters.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Enter" &&
      e.key !== "Tab"
    ) {
      e.preventDefault(); // Evitar la entrada
    }
  };

  const handleAliasKeyDown = (e) => {
    // Lista de caracteres especiales que quieres bloquear
    const specialCharacters = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~¡]/;

    // Evitar caracteres especiales
    if (
      specialCharacters.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Enter" &&
      e.key !== "Tab"
    ) {
      e.preventDefault(); // Evitar la entrada
    }
  };

  const handleMapClick = (lat, lng) => {
    setFormData((prevData) => ({
      ...prevData,
      latitud: lat,
      longitud: lng,
    }));
  };

  // Maneja el envío del formulario (crear/modificar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingNodeId ? "PUT" : "POST";
      const endpoint = editingNodeId
        ? `http://localhost:8000/modificar_datos_nodo/${editingNodeId}`
        : "http://localhost:8000/CrearNodo";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Asegúrate de que formData contiene los campos correctos
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: editingNodeId ? "Nodo modificado." : "Nodo creado.",
          description: editingNodeId
            ? "El nodo se ha modificado correctamente."
            : "El nodo se ha creado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setEditingNodeId(null); // Resetear el estado de edición
        navigate("/gestion_nodos"); // Redirigir a la página de gestión de nodos
      } else {
        // Mostrar el mensaje de error directamente del backend
        toast({
          title: "Error.",
          description: data.detail || "Hubo un error al procesar el nodo.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error.",
        description: "No se pudo conectar con la API.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setFormData({
      id_nodo: "",
      alias: "",
      longitud: "",
      latitud: "",
      descripcion: "",
    });
  };

  const handleCancel = () => {
    navigate(`/gestion_nodos`); // Redirigir al cancelar
  };

  return (
    <VStack
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="20vh"
      spacing={1}
      p={20}
      bg={colorMode === "light" ? "white" : "gray.800"}
      color={colorMode === "light" ? "black" : "white"}
    >
      <HStack spacing={1} flexDirection={{ base: "column", md: "row" }}>
        <Box
          height="auto"
          maxW={{ base: "100%", sm: "100%", md: "600px" }}
          p={5}
          borderColor={isLight ? "black" : "gray.500"}
          borderWidth="1px"
          borderRadius="lg"
          bg={isLight ? "white" : "gray.800"}
        >
          <Heading textAlign="center">
            {editingNodeId != null ? "Editar Nodo" : "Agregar Nodo"}
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired mt={2}>
              <FormLabel color={isLight ? "black" : "white"}>Id Nodo</FormLabel>
              <Input
                name="id_nodo"
                type="number"
                step={1}
                value={formData.id_nodo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ingrese el Id del Nodo"
                color={isLight ? "black" : "white"}
                borderColor={isLight ? "black" : "white"}
              />
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel color={isLight ? "black" : "white"}>Alias</FormLabel>
              <Input
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                onKeyDown={handleAliasKeyDown}
                placeholder="Ingrese el alias"
                color={isLight ? "black" : "white"}
                borderColor={isLight ? "black" : "white"}
              />
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel color={isLight ? "black" : "white"}>
                Longitud
              </FormLabel>
              <Input
                name="longitud"
                type="number"
                step="any"
                value={formData.longitud}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ingrese la longitud"
                color={isLight ? "black" : "white"}
                borderColor={isLight ? "black" : "white"}
              />
            </FormControl>
            <FormControl isRequired mt={2}>
              <FormLabel color={isLight ? "black" : "white"}>Latitud</FormLabel>
              <Input
                name="latitud"
                type="number"
                step="any"
                value={formData.latitud}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ingrese la latitud"
                color={isLight ? "black" : "white"}
                borderColor={isLight ? "black" : "white"}
              />
            </FormControl>
            <FormControl mt={2}>
              <FormLabel color={isLight ? "black" : "white"}>
                Descripción
              </FormLabel>
              <Textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Ingrese una descripción"
                color={isLight ? "black" : "white"}
                borderColor={isLight ? "black" : "white"}
                resize="none"
              />
            </FormControl>
            <HStack
              mt={8}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                type="submit"
                ml={2}
                bg={colorMode === "light" ? "rgb(0, 31, 63)" : "orange.500"}
                color={colorMode === "light" ? "gray.200" : "white"}
                border="none"
                p="4"
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
                {editingNodeId != null ? "Guardar" : "Crear"}
              </Button>
              <Button
                onClick={handleCancel}
                ml={1}
                bg="grey.500"
                border="none"
                p="4"
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
            </HStack>
          </form>
        </Box>

        {/* Componente de Mapa */}
        <Box
          height={{ base: "300px", md: "600px" }} // Ajusta el alto según la pantalla
          width={{ base: "100%", md: "600px" }} // Ajusta el ancho para pantallas pequeñas
          p={2}
          borderColor={isLight ? "black" : "gray.500"}
          borderWidth="1px"
          borderRadius="lg"
          bg={isLight ? "white" : "gray.800"}
        >
          <MapaNodo onMapClick={handleMapClick} />
        </Box>
      </HStack>
    </VStack>
  );
};

export default CrearNodo;
