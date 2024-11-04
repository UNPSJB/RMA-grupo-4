import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { useColorMode } from '@chakra-ui/react';

export default function Breadcrumbs() {
  const location = useLocation(); // Hook de react-router para obtener la ruta actual como un string
  const pathnames = location.pathname.split('/').filter(Boolean); // Dividimos la ruta en segmentos, eliminando cualquier cadena vacía en el arreglo resultante
  const { colorMode } = useColorMode(); // Hook de Chakra UI para el modo de color

  // Colores mejorados para estilos oscuros más intensos
  const linkColor = colorMode === 'light' ? 'gray.600' : 'gray.300';
  const hoverColor = colorMode === 'light' ? 'teal.600' : 'teal.400';
  const focusColor = colorMode === 'light' ? 'teal.700' : 'teal.500';
  const separatorColor = colorMode === 'light' ? 'gray.500' : 'gray.600';

  return (
    <Breadcrumb 
      separator=">" 
      spacing="8px" 
      fontSize="lg" 
      fontWeight="medium" 
      padding="4" 
      color={separatorColor}
    >
      {/* Primer breadcrumb para "Inicio" */}
      <BreadcrumbItem>
        <BreadcrumbLink 
          as={Link} 
          to="/" 
          _hover={{ color: hoverColor }} 
          _focus={{ boxShadow: 'none', color: focusColor }} 
          color={linkColor}
        >
          Inicio
        </BreadcrumbLink>
      </BreadcrumbItem>

      {/* Breadcrumbs intermedios */}
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <BreadcrumbItem key={to} isCurrentPage={isLast}>
            <BreadcrumbLink
              as={Link}
              to={to}
              color={isLast ? hoverColor : linkColor}
              fontWeight={isLast ? 'bold' : 'medium'}
              _hover={{ color: hoverColor }}
              _focus={{ boxShadow: 'none', color: focusColor }}
              textTransform="capitalize"
            >
              {value}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
