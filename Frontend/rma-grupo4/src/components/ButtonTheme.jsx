import React from 'react';
import { Button, useColorMode,useColorModeValue } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

function ButtonTheme() {
  const { colorMode, toggleColorMode } = useColorMode();
  const buttonDefaultColor = useColorModeValue('white', 'gray.900');
  const buttonHoverColor = useColorModeValue('rgb(0, 31, 63)', 'rgb(255, 130, 37)');
  const buttonShadow = useColorModeValue("5px 5px 3px #5a5a5a, -5px -5px 3px #ffffff", "2px 2px 3px rgba(0, 0, 0, 0.3)");

  return (
    <Button
      title={colorMode === 'light' ? "Tema Oscuro" : "Tema Claro"}
      onClick={toggleColorMode} 
      variant="ghost" 
      aria-label="Toggle Theme"
      background={buttonDefaultColor}
      boxShadow={buttonShadow}
      _hover={{ 
          background: buttonHoverColor, 
          color: "lightgray"
      }}
      >
      {colorMode === 'light' ? <FaMoon /> : <FaSun />}
    </Button>
  );
}

export default ButtonTheme;
