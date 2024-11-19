import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Text, Badge, 
  useToast, IconButton, useColorMode, Button, useColorModeValue, 
  Flex, Select 
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const PreferenciasTabla = () => {
  const { token, userId } = useAuth();
  const [preferencias, setPreferencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const toast = useToast();
  const { colorMode } = useColorMode();
  const [tipoFiltro, setTipoFiltro] = useState("todas");

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

  const toggleEstadoPreferencia = async (idPreferencia, estadoActual) => {
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:8000/modificar_preferencia/${idPreferencia}`,
        { estado: !estadoActual },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPreferencias((prevPreferencias) =>
        prevPreferencias.map((pref) =>
          pref.id === idPreferencia ? { ...pref, estado: !estadoActual } : pref
        )
      );

      toast({
        title: `Preferencia ${!estadoActual ? 'activada' : 'desactivada'} con éxito`,
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

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

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
                  <Th textAlign="center" color={colorMode === 'light' ? 'black' : 'white'}>Preferencia</Th>
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
                    <Td textAlign="center">{pref.nombre}</Td>
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
            <Text mx={4}>Página {currentPage} de {totalPaginas}</Text>
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
    </Box>
  );
};

export default PreferenciasTabla;