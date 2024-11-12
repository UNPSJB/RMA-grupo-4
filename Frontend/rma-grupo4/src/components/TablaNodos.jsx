import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  useColorMode,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useColorModeValue,
  TableContainer,
} from "@chakra-ui/react";
import { FaTrashAlt, FaPen, FaPlus, FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TablaNodo = () => {
  const [nodos, setNodos] = useState([]);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [nodeToEdite, setEditNodo] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isLight = colorMode === "light";
  const navigate = useNavigate();

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

  const handleEdit = (id_nodo) => {
    setEditNodo(id_nodo);
    navigate(`/form_nodo`, { state: { id_nodo } });
  };

  const handleNew = () => {
    navigate(`/form_nodo`);
  };

  const handleDelete = (alias) => {
    setNodeToDelete(alias);
    setDeleteModalOpen(true);
  };

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
    <Box p={4} bg={colorMode === 'light' ? 'white' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'}>
      <Heading
        as="h1"
        textAlign="center"
        color={isLight ? "black" : "white"}
        m={7}
      >
        Gestión de Nodos
      </Heading>
      <Box width="100%" bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={2} borderRadius="md">
        <Box
          maxW="100%" // Tamaño máximo de la caja
          mx="auto" // Centra horizontalmente
          p={10}
          color={isLight ? "black" : "white"}
          borderRadius="lg"
          bg={isLight ? "gray.100" : "gray.700"}
        >
          <Box textAlign="right" mb={4}>
            <IconButton
              FaPencilAlt title = "Agregar Nodo"
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
          <TableContainer overflowX="auto">
            <Table variant="simple" colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"}>
              <Thead>
                <Tr>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Nodo</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Alias</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Latitud</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Longitud</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {nodos.map((nodo) => (
                  <Tr 
                    key={nodo.id_nodo}
                    bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                    color={colorMode === 'light' ? 'black' : 'white'}
                    _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }}
                  >
                    <Td textAlign="center">{nodo.id_nodo}</Td>
                    <Td textAlign="center">{nodo.alias}</Td>
                    <Td textAlign="center">{nodo.latitud}</Td>
                    <Td textAlign="center">{nodo.longitud}</Td>
                    <Td textAlign="center">
                      <IconButton
                        FaPencilAlt title = "Editar Nodo"
                        aria-label="Editar"
                        icon={<FaPen />}
                        onClick={() => handleEdit(nodo.id_nodo)}
                        mr={2}
                        background={buttonDefaultColor}
                        borderRadius="6px"
                        boxShadow={buttonShadow}
                        _hover={{
                          background: buttonHoverColor,
                          color: "lightgray",
                        }}
                      />
                      <IconButton
                        FaPencilAlt title = "Eliminar Nodo"
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
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Modal de confirmación para eliminar */}
          <AlertDialog
            isOpen={isDeleteModalOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setDeleteModalOpen(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader 
                  bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
                  color={colorMode === 'light' ? 'black' : 'white'}
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
      </Box>
    </Box>
  );
};

export default TablaNodo;
