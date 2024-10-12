import React from 'react';
import { Button, useColorMode } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

function ButtonTheme() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode} variant="ghost" aria-label="Toggle Theme">
      {colorMode === 'light' ? <FaMoon /> : <FaSun />}
    </Button>
  );
}

export default ButtonTheme;
