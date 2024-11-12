import React from 'react';
import { Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useColorMode } from '@chakra-ui/react';

const UsoAyuda = (userRole) => {
  const { colorMode } = useColorMode(); 

  const ayudas = {
    profesional: [
      { label: 'Ayuda para Gráficos de Análisis Actual', descripcion: 'Descripción de cómo usar los gráficos de análisis actual' },
      { label: 'Ayuda para Alertas', descripcion: 'Descripción de cómo configurar y ver las alertas' },
      { label: 'Ayuda para Gestión de Nodos', descripcion: 'Descripción de cómo gestionar nodos en la aplicación' }
    ],
    cooperativa: [
      { label: 'Ayuda para Gráficos de Análisis Actual', descripcion: 'Descripción de cómo usar los gráficos de análisis actual' },
      { label: 'Ayuda para Alertas', descripcion: 'Descripción de cómo configurar y ver las alertas' },
      { label: 'Ayuda para Gestión de Nodos', descripcion: 'Descripción de cómo gestionar nodos en la aplicación' }
    ],
    invitado: [
      { label: 'Ayuda para Gráficos Históricos', descripcion: 'Descripción de cómo usar los gráficos históricos' },
      { label: 'Ayuda para Tabla Historicos', descripcion: 'Descripción de cómo usar la sección de tabla historicos' }
    ],
    universidad: [
        { label: 'Ayuda para Gráficos Históricos', descripcion: 'Descripción de cómo usar los gráficos históricos' },
        { label: 'Ayuda para Tabla Historicos', descripcion: 'Descripción de cómo usar la sección de tabla historicos' }
      ],
    admin: [
      { label: 'Ayuda para Gráficos de Análisis Actual', descripcion: 'Descripción de cómo usar los gráficos de análisis actual' },
      { label: 'Ayuda para Alertas', descripcion: 'Descripción de cómo configurar y ver las alertas' },
      { label: 'Ayuda para Gestión de Nodos', descripcion: 'Descripción de cómo gestionar nodos en la aplicación' },
      { label: 'Ayuda para Gráficos Históricos', descripcion: 'Descripción de cómo usar los gráficos históricos' },
      { label: 'Ayuda para Tabla Historicos', descripcion: 'Descripción de cómo usar la sección de tabla historicos' }
    ]
  };

  // Obtener las ayudas correspondientes al rol actual
  const userAyudas = ayudas[userRole] || [];

  return (
    <Box p={4}>
      <Accordion allowToggle>
        {userAyudas.map((ayuda, index) => (
          <AccordionItem 
            key={index} 
            mb={4} 
            borderRadius="md" 
            overflow="hidden"
            border="1px" 
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
          >
            <h2>
              <AccordionButton
                _hover={{ bg: index % 2 === 0 ? 'blue.100' : 'teal.100' }}
                _expanded={{ bg: index % 2 === 0 ? 'blue.200' : 'teal.200', color: 'white' }}
                transition="all 0.3s ease"
                p={4}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {ayuda.label}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel
              bg={colorMode === 'light' ? 'gray.50' : 'gray.700'}
              p={4}
              color={colorMode === 'light' ? 'black' : 'white'}
              borderBottomRadius="md"
              borderTop="1px"
              borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
              transition="background 0.3s ease"
            >
              <Text fontSize="lg">
                {ayuda.descripcion}
              </Text>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default UsoAyuda;
