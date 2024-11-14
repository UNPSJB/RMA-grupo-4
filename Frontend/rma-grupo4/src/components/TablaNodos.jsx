import React from "react";
import { Box, useColorMode } from "@chakra-ui/react";
import Mapa from "../analisis/Mapa";

const TablaNodo = () => {
  const { colorMode } = useColorMode(); // Obtener el valor de colorMode

  return (
    <Box
      p={4}
      bg={colorMode === "light" ? "white" : "gray.900"}
      color={colorMode === "light" ? "black" : "white"}
    >
      <Mapa />
    </Box>
  );
};

export default TablaNodo;
