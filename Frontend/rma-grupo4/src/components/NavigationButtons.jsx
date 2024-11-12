import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Flex, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from './AuthContext';

function NavigationButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const { colorMode } = useColorMode(); 
  const { userRole } = useAuth(); 
  const menuRef = useRef(); 

  const buttonDefaultColor = useColorModeValue('gray.900', 'gray.600');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsVisible(false); 
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  // Definir permisos para cada rol
  const navItems = [
    { text: "Análisis Actual", route: "/analisis_actual", allowedRoles: ["admin"] },
    { text: "Gráficos Datos Históricos", route: "/graficos_historicos", allowedRoles: ["admin", "invitado", "universidad"] },
    { text: "Tabla Datos Históricos", route: "/tabla_historicos", allowedRoles: ["admin", "invitado", "universidad"] },
    { text: "Análisis Avanzado", route: "/analisis_avanzado", allowedRoles: ["admin", "profesional", "cooperativa"] },
    { text: "Suscripción a Alertas", route: "/suscripcion_alertas", allowedRoles: ["admin", "profesional", "cooperativa"] },
    { text: "Tabla Auditoría", route: "/tabla_auditoria", allowedRoles: ["admin"] },
    { text: "Gestión Nodos", route: "/gestion_nodos", allowedRoles: ["admin", "profesional", "cooperativa"] },
    { text: "Gestión Variables", route: "/gestionVariables", allowedRoles: ["admin"] }
  ];

  // Filtrar los items según el rol del usuario
  const filteredNavItems = navItems.filter(item => item.allowedRoles.includes(userRole));

  return (
    <Box>
      <IconButton
        position="fixed"
        top="20px"
        left="20px"
        zIndex="1000"
        icon={isVisible ? <FaTimes /> : <FaBars />}
        color= "lightgray"
        background={buttonDefaultColor}
        boxShadow={buttonShadow}
        _hover={{ 
          background: buttonHoverColor, 
          color: "lightgray"
        }}
        onClick={toggleVisibility}
        aria-label="Toggle Navigation"
      />
      
      <Flex
        ref={menuRef} 
        as="nav"
        align="center"
        justify="flex-start"
        wrap="wrap"
        bg={colorMode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(26, 32, 44, 0.9)'} 
        color={colorMode === 'light' ? 'black' : 'white'} 
        position="fixed"
        top={20}
        left={isVisible ? 0 : "-280px"}
        height="auto" 
        width="280px"
        transition="all 0.3s ease-in-out"
        flexDirection="column"
        zIndex="999"
        overflowY="auto"
        backdropFilter="blur(5px)"
        boxShadow={isVisible ? 'lg' : 'none'}
        paddingTop={4} 
        borderRadius={5}
      >
        {filteredNavItems.map((item, index) => (
          <Button
            key={index}
            as={Link}
            to={item.route}
            variant="ghost"
            color={colorMode === 'light' ? 'black' : 'white'} // Color del texto según el tema
            _hover={{ color:'white' , bg: colorMode === 'light' ? "rgb(0, 31, 63)" : "orange.500"}} // Hover según el tema
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