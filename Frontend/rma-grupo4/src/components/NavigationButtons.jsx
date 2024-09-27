import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { FaBars, FaTimes } from 'react-icons/fa';

function NavigationButtons() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const navItems = [
    { text: "Datos en Tabla", route: "/tabla" },
    { text: "Datos en Gráficos", route: "/graficos" },
    { text: "Datos Históricos", route: "/historicos" },
    { text: "Datos por Variable", route: "/variables" },
    { text: "Combinaciones de Variables", route: "/combinaciones" }
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
        bg="gray.800"
        color="white"
        _hover={{ bg: "gray.700" }}
        onClick={toggleVisibility}
        aria-label="Toggle Navigation"
      />
      
      <Flex
        as="nav"
        align="center"
        justify="flex-start"
        wrap="wrap"
        bg="rgba(26, 32, 44, 0.9)"
        color="white"
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
            color="white"
            _hover={{ bg: "gray.700" }}
            _active={{ bg: "gray.600" }}
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