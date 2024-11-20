import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Text, Badge, 
  useToast, IconButton, useColorMode, Button, useColorModeValue, 
  Flex, Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";

const PreferenciasTabla = () => {
  const { token, userId, userRole } = useAuth();
  const [preferencias, setPreferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [tipoFiltro, setTipoFiltro] = useState("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variables, setVariables] = useState([]);
  const [loadingVariables, setLoadingVariables] = useState(false);
  const [formData, setFormData] = useState({
    variableId: '',
    color: ''
  });

  const colores = [
    { value: 'verde', label: 'Verde' },
    { value: 'amarillo', label: 'Amarillo' },
    { value: 'naranja', label: 'Naranja' },
    { value: 'rojo', label: 'Rojo' },
  ];

  const buttonDefaultColor = useColorModeValue('gray.300', 'gray.600');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

  const cargarPreferencias = useCallback(async () => {
    if (!token) return;
    try {
      setError(null);
      const res = await fetch(`http://localhost:8000/preferencias/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error(`Error en la respuesta del servidor: ${res.statusText}`);
      }
      const data = await res.json();
      setPreferencias(data.sort((a, b) => (a.estado ? -1 : 1)));
    } catch (error) {
      setError(error);
      console.error("Error al cargar las preferencias:", error);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  const cargarVariables = async () => {
    try {
      setLoadingVariables(true);
  
      // Obtener variables desde el backend
      const response = await fetch('http://localhost:8000/obtener_variables', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error('Error al obtener variables');
      }
  
      const data = await response.json();


      // Filtrar las variables según el rol
      let variablesFiltradas = data;
      if (userRole === 'cooperativa') {
        variablesFiltradas = data.filter((variable) => variable.nombre !== 'Bateria');
      } else if (userRole === 'profesional') {
        variablesFiltradas = data.filter((variable) => variable.nombre !== 'Nivel de agua');
      }
  
      setVariables(variablesFiltradas);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error al cargar variables',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoadingVariables(false);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
    cargarVariables();
    setFormData({ variableId: '', color: '' });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({ variableId: '', color: '' });
  };

  const handleSubmit = async () => {
    if (!formData.variableId || !formData.color) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/crear_preferencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_usuario: userId,
          id_variable: formData.variableId,
          alerta: formData.color,
          estado: 1,
        }),
      });
      if (!response.ok) {
        throw new Error('Error al guardar la preferencia');
      }

      toast({
        title: 'Preferencia guardada',
        status: 'success',
        duration: 3000,
      });

      handleModalClose();
      cargarPreferencias();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error al guardar la preferencia',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const toggleEstadoPreferencia = async (idPreferencia, estadoActual) => {
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:8000/modificar_preferencia/${idPreferencia}`,
        { estado: !estadoActual, id_usuario: userId }, 
        { headers: { Authorization: `Bearer ${token}` } }
    );

      setPreferencias((prevPreferencias) =>
        prevPreferencias.map((pref) =>
          pref.id === idPreferencia ? { ...pref, estado: !estadoActual } : pref
        )
      );

      toast({
        title: `Preferencia ${!estadoActual ? 'activada' : 'desactivada'} con Exito`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      toast({
        title: 'Error al cambiar el estado de la preferencia',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    cargarPreferencias();
    cargarVariables();
  }, [cargarPreferencias]);

  const preferenciasFiltradas = preferencias.filter((pref) => {
    if (tipoFiltro === "activas") return pref.estado;
    if (tipoFiltro === "inactivas") return !pref.estado;
    return true;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const preferenciasPaginadas = preferenciasFiltradas.slice(startIndex, endIndex);
  const totalPaginas = Math.ceil(preferencias.length / pageSize);

  const nextPage = () => {
    if (currentPage < totalPaginas && totalPaginas > 0) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Box bg={colorMode === 'light' ? 'gray.100' : 'gray.900'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="md" width="100%" p={4}>
      <Heading as="h1" mb={7} textAlign="center">Mis Preferencias</Heading>
      <Flex justify="center" mb={8} align="center" gap={4}>
        <Text fontWeight="bold" fontSize="18px">
          Filtrar por estado:
        </Text>
        <Select
          id="tipo-filtro"
          onChange={(e) => setTipoFiltro(e.target.value)}
          value={tipoFiltro}
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          color={colorMode === 'light' ? 'black' : 'white'}
          width="auto"
        >
          <option value="todas">Todas</option>
          <option value="activas">Activas</option>
          <option value="inactivas">Inactivas</option>
        </Select>
      </Flex>
      <Box bg={colorMode === 'light' ? 'gray.300' : 'gray.800'} p={{ base: 2, md: 4 }} borderRadius="md" boxShadow="lg">
        <Box overflowX="auto" bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} color={colorMode === 'light' ? 'black' : 'white'} borderRadius="md" boxShadow="lg" p={7}>
          <Box textAlign="right" mb={4} mr={16}>
            <IconButton 
              title="Agregar Preferencia"
              icon={<FaPlus />} 
              aria-label="Agregar Preferencia"
              onClick={handleModalOpen}
              background={buttonDefaultColor}
              borderRadius="6px"
              boxShadow={buttonShadow}
              _hover={{ 
                background: buttonHoverColor, 
                color: "lightgray"
              }}
              mr={2}
            />
          </Box>
          {loading ? (
            <Text textAlign="center">Cargando preferencias...</Text>
          ) : error ? (
            <Text color="red.500" textAlign="center">
              Error al cargar las preferencias
            </Text>
          ) : preferencias.length === 0 ? (
            <Text textAlign="center" color="gray.500">
              No hay preferencias
            </Text>
          ) : (
            <Table variant="simple" colorScheme={colorMode === 'light' ? "blackAlpha" : "whiteAlpha"}>
              <Thead>
                <Tr>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Variable</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Alerta</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Estado</Th>
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {preferenciasPaginadas.map((pref) => (
                  <Tr 
                    key={pref.id}
                    bg={colorMode === 'light' ? 'white' : 'gray.700'} 
                    color={colorMode === 'light' ? 'black' : 'white'}
                    _hover={{ backgroundColor: colorMode === 'light' ? "gray.100" : "gray.700" }}
                  >
                    <Td textAlign="center">
                      {variables.find((variable) => variable.id === pref.id_variable)?.nombre || "Nombre no encontrado"}
                    </Td>
                    <Td textAlign="center">{pref.alerta}</Td>
                    <Td textAlign="center">
                      <Badge colorScheme={pref.estado ? 'green' : 'red'}>
                        {pref.estado ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        icon={pref.estado ? <CloseIcon /> : <CheckIcon />}
                        onClick={() => toggleEstadoPreferencia(pref.id, pref.estado)}
                        aria-label={pref.estado ? "Desactivar preferencia" : "Activar preferencia"}
                        background={buttonDefaultColor}
                        _hover={{ background: buttonHoverColor }}
                        borderRadius="6px"
                        boxShadow={buttonShadow}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          <Box display="flex" justifyContent="center" mt={4}>
            <Button 
              onClick={prevPage}
              disabled={currentPage === 1 || totalPaginas === 0}
              size="sm"
              ml={2}
              backgroundColor={(currentPage === 1 || totalPaginas === 0) ? 'gray.500' : buttonDefaultColor}
              color={(currentPage === 1 || totalPaginas === 0) ? 'gray.200' : (colorMode === 'light' ? 'black' : 'white')}
              borderRadius="6px"
              boxShadow={(currentPage === 1 || totalPaginas === 0) ? "none" : buttonShadow}
              _hover={(currentPage === 1 || totalPaginas === 0) ? {} : { backgroundColor: buttonHoverColor, color: "lightgray" }}
            >
              Anterior
            </Button>
            <Text mx={4}>Pagina {currentPage} de {totalPaginas}</Text>
            <Button 
              onClick={nextPage}
              disabled={currentPage === totalPaginas || totalPaginas === 0}
              size="sm"
              ml={2}
              backgroundColor={(currentPage === totalPaginas || totalPaginas === 0) ? 'gray.500' : buttonDefaultColor}
              color={(currentPage === totalPaginas || totalPaginas === 0) ? 'gray.200' : (colorMode === 'light' ? 'black' : 'white')}
              borderRadius="6px"
              boxShadow={(currentPage === totalPaginas || totalPaginas === 0) ? "none" : buttonShadow}
              _hover={(currentPage === totalPaginas || totalPaginas === 0) ? {} : { backgroundColor: buttonHoverColor, color: "lightgray" }}
            >
              Siguiente
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Modal para agregar preferencia */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'black' : 'white'}
        >
          <ModalHeader>Crear Preferencia</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Variable</FormLabel>
              <Select
                placeholder="Seleccione una variable"
                value={formData.variableId}
                onChange={(e) => setFormData({ ...formData, variableId: e.target.value })}
                isDisabled={loadingVariables}
              >
                {variables.map((variable) => (
                  <option key={variable.id} value={variable.id}>
                    {variable.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Color</FormLabel>
              <Select
                placeholder="Seleccione un color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              >
                {colores.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleSubmit}
              isLoading={loadingVariables}
            >
              Guardar
            </Button>
            <Button onClick={handleModalClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PreferenciasTabla;