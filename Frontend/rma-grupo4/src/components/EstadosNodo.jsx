import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Text,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogContent,
  Button,
  useColorMode,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

const EstadoNodos = () => {
  const [nodos, setNodos] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedNodo, setSelectedNodo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nodosPorPagina] = useState(5); // Número de nodos por página
  const cancelRef = React.useRef();
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [estadoNodo, setEstadoNodo] = useState(
    selectedNodo?.estado || "ACTIVO"
  );

  const buttonDefaultColor = useColorModeValue("gray.300", "gray.600");
  const buttonHoverColor = useColorModeValue(
    "rgb(0, 31, 63)",
    "rgb(255, 130, 37)"
  );
  const buttonShadow = useColorModeValue(
    "5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff",
    "2px 2px 3px rgba(0, 0, 0, 0.3)"
  );

  const fetchNodos = async () => {
    try {
      const response = await fetch("http://localhost:8000/obtenerNodos");
      const data = await response.json();
      if (response.ok) {
        const nodosNormalizados = data.map((nodo) => ({
          ...nodo,
          estado: nodo.estado.toUpperCase(),
        }));
        setNodos(nodosNormalizados);
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

  const actualizarEstadoNodo = async (id_nodo, nuevoEstado) => {
    // Verificar si el estado ya es "FUERA_DE_SERVICIO"
    const nodo = nodos.find((nodo) => nodo.id_nodo === id_nodo);
    if (nodo && nodo.estado === "FUERA_DE_SERVICIO") {
      toast({
        title: "Error",
        description:
          "Este nodo ya está fuera de servicio y no se puede modificar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/actualizar_estado_nodo/${id_nodo}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      if (response.ok) {
        toast({
          title: "Estado actualizado.",
          description: `El estado del nodo ${id_nodo} ha sido actualizado a ${nuevoEstado}.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setNodos((prevNodos) =>
          prevNodos.map((nodo) =>
            nodo.id_nodo === id_nodo
              ? { ...nodo, estado: nuevoEstado.toUpperCase() }
              : nodo
          )
        );
      } else {
        const data = await response.json();
        toast({
          title: "Error al actualizar estado.",
          description:
            data.message || "No se pudo actualizar el estado del nodo.",
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

  const handleConfirmacion = (nodo) => {
    setSelectedNodo(nodo);
    setIsAlertOpen(true);
  };

  const handleCambioEstado = (nuevoEstado) => {
    if (selectedNodo) {
      actualizarEstadoNodo(selectedNodo.id_nodo, nuevoEstado);
      setEstadoNodo(nuevoEstado); // Actualiza el estado local
      //window.location.reload(); // Refresca la página
    }
    setIsAlertOpen(false);
  };
  useEffect(() => {
    fetchNodos();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    fetchNodos();
  }, []);

  // Calcular los nodos a mostrar según la página actual
  const startIndex = (currentPage - 1) * nodosPorPagina;
  const currentNodos = nodos.slice(startIndex, startIndex + nodosPorPagina);
  const totalPages = Math.ceil(nodos.length / nodosPorPagina);

  return (
    <Box
      bg={colorMode === "light" ? "gray.100" : "gray.900"}
      color={colorMode === "light" ? "black" : "white"}
      borderRadius="md"
      boxShadow="md"
      width="100%"
      p={6}
    >
      <Heading as="h1" m={2} textAlign="center">
        Estado Nodo
      </Heading>
      <Box
        bg={colorMode === "light" ? "gray.300" : "gray.800"}
        p={4}
        borderRadius="md"
        boxShadow="lg"
      >
        <Box
          overflowX="auto"
          bg={colorMode === "light" ? "gray.100" : "gray.700"}
          borderRadius="md"
          p={2}
        >
          <Table
            variant="simple"
            colorScheme={colorMode === "light" ? "blackAlpha" : "whiteAlpha"}
          >
            <Thead>
              <Tr>
                <Th
                  textAlign={"center"}
                  color={colorMode === "light" ? "black" : "white"}
                >
                  Nodo
                </Th>
                <Th
                  textAlign={"center"}
                  color={colorMode === "light" ? "black" : "white"}
                >
                  Alias
                </Th>
                <Th
                  textAlign={"center"}
                  color={colorMode === "light" ? "black" : "white"}
                >
                  Estado Actual
                </Th>
                <Th
                  textAlign={"center"}
                  color={colorMode === "light" ? "black" : "white"}
                >
                  Actualizar Estado
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentNodos.map((nodo) => (
                <Tr textAlign="center" key={nodo.id_nodo}>
                  <Td textAlign="center">{nodo.id_nodo}</Td>
                  <Td textAlign="center">{nodo.alias}</Td>
                  <Td textAlign="center">{nodo.estado}</Td>
                  <Td textAlign="center">
                    {nodo.estado !== "FUERA DE SERVICIO" ? (
                      <Select
                        defaultValue={nodo.estado}
                        onChange={(e) =>
                          e.target.value === "FUERA DE SERVICIO"
                            ? handleConfirmacion(nodo)
                            : actualizarEstadoNodo(nodo.id_nodo, e.target.value)
                        }
                      >
                        <option value="ACTIVO">Activo</option>
                        <option value="MANTENIMIENTO">Mantenimiento</option>
                        <option value="FUERA DE SERVICIO">
                          Fuera de Servicio
                        </option>
                      </Select>
                    ) : (
                      <Text fontStyle="italic" color="red.500">
                        Fuera de Servicio
                      </Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        {/* Paginación con botones de texto */}
        <Stack
          direction="row"
          justify="center"
          align="center"
          spacing={4}
          mt={4}
        >
          <Button
            onClick={handlePrevPage}
            isDisabled={currentPage === 1}
            bg={buttonDefaultColor}
            _hover={{ bg: buttonHoverColor }}
            boxShadow={buttonShadow}
          >
            Anterior
          </Button>
          <Text>{`Página ${currentPage} de ${totalPages}`}</Text>
          <Button
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            bg={buttonDefaultColor}
            _hover={{ bg: buttonHoverColor }}
            boxShadow={buttonShadow}
          >
            Siguiente
          </Button>
        </Stack>
      </Box>

      {/* AlertDialog de confirmación */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              bg={colorMode === "light" ? "gray.200" : "gray.800"}
              color={colorMode === "light" ? "black" : "white"}
            >
              Confirmar Cambio de Estado
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas cambiar el estado de este nodo a
              "Fuera de Servicio"? No podrás cambiar su estado en el futuro.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() => handleCambioEstado("FUERA_DE_SERVICIO")}
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
                Confirmar
              </Button>
              <Button
                ref={cancelRef}
                onClick={() => setIsAlertOpen(false)} // Solo cierra el alert sin cambiar el estado
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
  );
};

export default EstadoNodos;
