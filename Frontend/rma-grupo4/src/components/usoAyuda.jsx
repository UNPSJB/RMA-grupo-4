import React from 'react';
import { Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useColorMode } from '@chakra-ui/react';

const UsoAyuda = ( userRole ) => {
  const { colorMode } = useColorMode();

  const ayudas = {
    profesional: [
      { 
        label: 'Ayuda para Gráficos de Análisis Actual', 
        descripcion: [
          { title: 'Conversion de unidades', text: 'En la tabla de datos actualizados, puedes notar íconos junto a ciertos títulos, como temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm). Al hacer clic en estos íconos, puedes convertir las unidades de las columnas respectivas.' },
          { title: 'Ajuste de sensor y periodo', text: 'Usa los selectores de nodo y rango de tiempo para ajustar el sensor y período de análisis, respectivamente.' },
          { title: 'Navegación', text: 'puedes navegar entre páginas de la tabla usando los botones "Anterior" y "Siguiente.' },
          { title: 'Descarga de graficos', text: 'Para guardar los gráficos, haz clic en el botón de descarga' }
        ]
      },
      { 
        label: 'Ayuda para Alertas', 
        descripcion: [
          { title: 'Suscripcion a alertas', text: 'En la sección de alertas, puedes configurar notificaciones para recibir actualizaciones en tiempo real. Para suscribirte, escanea el código QR proporcionado, que te conectará a un canal de Telegram donde recibirás alertas sobre los eventos monitoreados.' },
          { title: 'Requisitos para la suscripcion', text: 'Asegúrate de tener la aplicación de Telegram instalada y una cuenta activa para completar la suscripción.' } 
        ]
      },
      { 
        label: 'Ayuda para gestion de nodos', 
        descripcion: [
          { title: 'Operaciones básicas', text: 'En la sección de gestión de nodos, puedes realizar operaciones básicas como agregar, editar o eliminar nodos.' },
          { title: 'Agregar nodo', text: 'Usa el botón "+" para agregar un nuevo nodo ingresando los datos correspondientes.' },
          { title: 'Editar nodo', text: 'El ícono del "lápiz" te permite editar la información de nodos existentes.' },
          { title: 'Eliminar nodo', text: 'El ícono del "tacho" elimina un nodo seleccionado de la lista.' }
        ]
      },
    ],
    cooperativa: [
      { 
        label: 'Ayuda para Gráficos de Análisis Actual', 
        descripcion: [
          { title: 'Conversion de unidades', text: 'En la tabla de datos actualizados, puedes notar íconos junto a ciertos títulos, como temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm). Al hacer clic en estos íconos, puedes convertir las unidades de las columnas respectivas.' },
          { title: 'Ajuste de sensor y periodo', text: 'Usa los selectores de nodo y rango de tiempo para ajustar el sensor y período de análisis, respectivamente.' },
          { title: 'Navegación', text: 'puedes navegar entre páginas de la tabla usando los botones "Anterior" y "Siguiente.' },
          { title: 'Descarga de graficos', text: 'Para guardar los gráficos, haz clic en el botón de descarga' }
        ]
      },
      { 
        label: 'Ayuda para Alertas', 
        descripcion: [
          { title: 'Suscripcion a alertas', text: 'En la sección de alertas, puedes configurar notificaciones para recibir actualizaciones en tiempo real. Para suscribirte, escanea el código QR proporcionado, que te conectará a un canal de Telegram donde recibirás alertas sobre los eventos monitoreados.' },
          { title: 'Requisitos para la suscripcion', text: 'Asegúrate de tener la aplicación de Telegram instalada y una cuenta activa para completar la suscripción.' } 
        ]
      },
      { 
        label: 'Ayuda para gestion de nodos', 
        descripcion: [
          { title: 'Operaciones básicas', text: 'En la sección de gestión de nodos, puedes realizar operaciones básicas como agregar, editar o eliminar nodos.' },
          { title: 'Agregar nodo', text: 'Usa el botón "+" para agregar un nuevo nodo ingresando los datos correspondientes.' },
          { title: 'Editar nodo', text: 'El ícono del "lápiz" te permite editar la información de nodos existentes.' },
          { title: 'Eliminar nodo', text: 'El ícono del "tacho" elimina un nodo seleccionado de la lista.' }
        ]
      },
    ],
    invitado: [
      { 
        label: 'Ayuda para graficos historicos', 
        descripcion: [
          { title: 'Seccion de variable y fecha', text: 'En la sección de gráficos históricos, puedes elegir una variable y una fecha específica para visualizar sus datos en el gráfico.' },
          { title: 'Actualizacion automatica', text: 'Al seleccionar una variable (como temperatura, humedad, etc.) y una fecha, el gráfico se actualizará automáticamente para mostrar la información correspondiente.' },
          { title: 'Tabla de datos', text: 'Además, se generará una tabla debajo del gráfico con los datos detallados del período seleccionado.' }
        ]
      },
      { 
        label: 'Ayuda para tabla historicos', 
        descripcion: [
          { title: 'Seccion de rango de fechas', text: 'En la sección de tabla históricos, puedes seleccionar un rango de fechas para visualizar los datos registrados en ese período.' },
          { title: 'Conversion de unidades', text: 'La tabla incluye opciones de conversión de unidades en las columnas de temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm); solo debes hacer clic en los íconos junto a cada título para cambiar las unidades.' },
          { title: 'Descarga de datos', text: 'También puedes descargar los datos mostrados en formato CSV utilizando el botón de descarga.' },
          { title: 'Navegacion entre paginas', text: ' Usa los botones de paginación ("Anterior" y "Siguiente") para navegar entre diferentes páginas de la tabla.' }
        ]
      },
    ],
    universidad: [
      { 
        label: 'Ayuda para graficos historicos', 
        descripcion: [
          { title: 'Seccion de variable y fecha', text: 'En la sección de gráficos históricos, puedes elegir una variable y una fecha específica para visualizar sus datos en el gráfico.' },
          { title: 'Actualizacion automatica', text: 'Al seleccionar una variable (como temperatura, humedad, etc.) y una fecha, el gráfico se actualizará automáticamente para mostrar la información correspondiente.' },
          { title: 'Tabla de datos', text: 'Además, se generará una tabla debajo del gráfico con los datos detallados del período seleccionado.' }
        ]
      },
      { 
        label: 'Ayuda para tabla historicos', 
        descripcion: [
          { title: 'Seccion de rango de fechas', text: 'En la sección de tabla históricos, puedes seleccionar un rango de fechas para visualizar los datos registrados en ese período.' },
          { title: 'Conversion de unidades', text: 'La tabla incluye opciones de conversión de unidades en las columnas de temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm); solo debes hacer clic en los íconos junto a cada título para cambiar las unidades.' },
          { title: 'Descarga de datos', text: 'También puedes descargar los datos mostrados en formato CSV utilizando el botón de descarga.' },
          { title: 'Navegacion entre paginas', text: ' Usa los botones de paginación ("Anterior" y "Siguiente") para navegar entre diferentes páginas de la tabla.' }
        ]
      },
    ],
    admin: [
      { 
        label: 'Ayuda para Gráficos de Análisis Actual', 
        descripcion: [
          { title: 'Conversion de unidades', text: 'En la tabla de datos actualizados, puedes notar íconos junto a ciertos títulos, como temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm). Al hacer clic en estos íconos, puedes convertir las unidades de las columnas respectivas.' },
          { title: 'Ajuste de sensor y periodo', text: 'Usa los selectores de nodo y rango de tiempo para ajustar el sensor y período de análisis, respectivamente.' },
          { title: 'Navegación', text: 'puedes navegar entre páginas de la tabla usando los botones "Anterior" y "Siguiente.' },
          { title: 'Descarga de graficos', text: 'Para guardar los gráficos, haz clic en el botón de descarga' }
        ]
      },
      { 
        label: 'Ayuda para Alertas', 
        descripcion: [
          { title: 'Suscripcion a alertas', text: 'En la sección de alertas, puedes configurar notificaciones para recibir actualizaciones en tiempo real. Para suscribirte, escanea el código QR proporcionado, que te conectará a un canal de Telegram donde recibirás alertas sobre los eventos monitoreados.' },
          { title: 'Requisitos para la suscripcion', text: 'Asegúrate de tener la aplicación de Telegram instalada y una cuenta activa para completar la suscripción.' } 
        ]
      },
      { 
        label: 'Ayuda para gestion de nodos', 
        descripcion: [
          { title: 'Operaciones básicas', text: 'En la sección de gestión de nodos, puedes realizar operaciones básicas como agregar, editar o eliminar nodos.' },
          { title: 'Agregar nodo', text: 'Usa el botón "+" para agregar un nuevo nodo ingresando los datos correspondientes.' },
          { title: 'Editar nodo', text: 'El ícono del "lápiz" te permite editar la información de nodos existentes.' },
          { title: 'Eliminar nodo', text: 'El ícono del "tacho" elimina un nodo seleccionado de la lista.' }
        ]
      },
      { 
        label: 'Ayuda para graficos historicos', 
        descripcion: [
          { title: 'Seccion de variable y fecha', text: 'En la sección de gráficos históricos, puedes elegir una variable y una fecha específica para visualizar sus datos en el gráfico.' },
          { title: 'Actualizacion automatica', text: 'Al seleccionar una variable (como temperatura, humedad, etc.) y una fecha, el gráfico se actualizará automáticamente para mostrar la información correspondiente.' },
          { title: 'Tabla de datos', text: 'Además, se generará una tabla debajo del gráfico con los datos detallados del período seleccionado.' }
        ]
      },
      { 
        label: 'Ayuda para tabla historicos', 
        descripcion: [
          { title: 'Seccion de rango de fechas', text: 'En la sección de tabla históricos, puedes seleccionar un rango de fechas para visualizar los datos registrados en ese período.' },
          { title: 'Conversion de unidades', text: 'La tabla incluye opciones de conversión de unidades en las columnas de temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm); solo debes hacer clic en los íconos junto a cada título para cambiar las unidades.' },
          { title: 'Descarga de datos', text: 'También puedes descargar los datos mostrados en formato CSV utilizando el botón de descarga.' },
          { title: 'Navegacion entre paginas', text: ' Usa los botones de paginación ("Anterior" y "Siguiente") para navegar entre diferentes páginas de la tabla.' }
        ]
      },
    ],
  };

  // Verificar que el rol tenga ayuda asociada, si no, mostrar ayuda predeterminada
  const userAyudas = ayudas[userRole] || [
    { 
      label: 'Ayuda general',
      descripcion: [
        { title: 'Descripción', text: 'Esta sección proporciona ayuda general.' },
        { title: 'Instrucciones', text: 'Usa las opciones disponibles para navegar y operar la plataforma.' }
      ]
    }
  ];

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
                _hover={{ color:'white' , bg: colorMode === 'light' ? "rgb(0, 31, 63)" : "orange.500"}}
                _expanded={{ bg: colorMode === 'light' ? "rgb(0, 31, 63)" : "orange.500", color: 'white' }}
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
              {ayuda.descripcion.map((section, idx) => (
                <Box key={idx} mb={3}>
                  <Text fontWeight="bold" mb={1}>{section.title}</Text>
                  <Text fontSize="lg">{section.text}</Text>
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};

export default UsoAyuda;
