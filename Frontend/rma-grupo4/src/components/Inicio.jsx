import React from 'react';
import { Box, Heading, Slider, Text } from '@chakra-ui/react';
import Sidebar from './Sidebar';

export default function Inicio() {
  return (
    <Box textAlign="center" mt={10} p={6}>
        <Text fontSize="xl">
            Bienvenido a tu página de inicio.
        </Text>
    </Box>
  );
}
