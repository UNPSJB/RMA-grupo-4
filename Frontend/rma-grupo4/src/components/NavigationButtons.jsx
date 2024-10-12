import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, IconButton, useColorMode } from "@chakra-ui/react";
import { FaBars, FaTimes } from 'react-icons/fa';

function NavigationButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const { colorMode } = useColorMode(); // Obtener el estado del color mode

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const navItems = [
    { text: "Datos Históricos", route: "/historicos" },
  ];

  return (
    <Box>
      <IconButton
        position="fixed"
        top="20px"
        left="20px"
        zIndex="1000"
        icon={isVisible ? <FaTimes /> : <FaBars />}
        colorScheme="gray"
        bg={colorMode === 'light' ? 'gray.800' : 'gray.600'} // Cambiar fondo según el tema
        color="white"
        _hover={{ bg: colorMode === 'light' ? 'gray.700' : 'gray.500' }}
        onClick={toggleVisibility}
        aria-label="Toggle Navigation"
      />
      
      <Flex
        as="nav"
        align="center"
        justify="flex-start"
        wrap="wrap"
        bg={colorMode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)'} // Fondo del nav
        color={colorMode === 'light' ? 'black' : 'white'} // Color del texto
        position="fixed"
        top={20}
        left={isVisible ? 0 : "-280px"}
        height="100vh"
        width="280px"
        transition="all 0.3s ease-in-out"
        flexDirection="column"
        zIndex="999"
        overflowY="auto"
        backdropFilter="blur(5px)"
      >
        {navItems.map((item, index) => (
          <Button
            key={index}
            as={Link}
            to={item.route}
            variant="ghost"
            color={colorMode === 'light' ? 'black' : 'white'} // Color del texto según el tema
            _hover={{ bg: colorMode === 'light' ? 'gray.200' : 'gray.700' }} // Hover según el tema
            _active={{ bg: colorMode === 'light' ? 'gray.300' : 'gray.600' }} // Active según el tema
            width="100%"
            mb={3}
            fontSize="lg"
            justifyContent="flex-start"
            onClick={() => setIsVisible(false)}
          >
            {item.text}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}

export default NavigationButtons;
