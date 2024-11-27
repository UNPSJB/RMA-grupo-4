import React from 'react';
import { Box, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, useColorMode } from '@chakra-ui/react';

const UsoAyuda = ( userRole ) => {
  const { colorMode } = useColorMode();

  const ayudas = {
    profesional: [
      { 
        label: 'Gráficos de análisis actual', 
        descripcion: [
          { title: 'Conversion de unidades', text: 'En la tabla de datos actualizados, puedes notar íconos junto a ciertos títulos, como temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm). Al hacer clic en estos íconos, puedes convertir las unidades de las columnas respectivas.' },
          { title: 'Ajuste de sensor y periodo', text: 'Usa los selectores de nodo y rango de tiempo para ajustar el sensor y período de análisis, respectivamente.' },
          { title: 'Navegación', text: 'puedes navegar entre páginas de la tabla usando los botones "Anterior" y "Siguiente.' },
          { title: 'Descarga de graficos', text: 'Para guardar los gráficos, haz clic en el botón de descarga' }
        ]
      },
      { 
        label: 'Suscripcion de Alertas', 
        descripcion: [
          { title: 'Suscripcion a alertas', text: 'En la sección de alertas, puedes configurar notificaciones para recibir actualizaciones en tiempo real. Para suscribirte, escanea el código QR proporcionado, que te conectará a un canal de Telegram donde recibirás alertas sobre los eventos monitoreados.' },
          { title: 'Requisitos para la suscripcion', text: 'Asegúrate de tener la aplicación de Telegram instalada y una cuenta activa para completar la suscripción.' } 
        ]
      },
      { 
        label: 'Gestion de nodos', 
        descripcion: [
          { title: 'Operaciones básicas', text: 'En la sección de gestión de nodos, puedes realizar operaciones básicas como agregar, editar o eliminar nodos y traer los ultimos datos tomados por el nodo.' },
          { title: 'Agregar nodo', text: 'Usa el botón "+" situado a la derecha superior del mapa para agregar un nuevo nodo ingresando los datos correspondientes. Pueden cargar los campos de longitud y latitud haciendo click en el mapa' },
          {title: 'Importante' , text: 'Al seleccionar un nodo en el mapa se habilitan las acciones eliminar y modificar o ver datos del nodo, tener en cuenta que se debe seleccionar el nodo sobre el cual se desea realizar alguna de las siguientes acciones'},
          { title: 'Editar nodo', text: 'El ícono del "lápiz" te permite editar la información de nodos existentes.' },
          { title: 'Eliminar nodo', text: 'El ícono del "tacho" elimina un nodo seleccionado de la lista.' },
          { title: 'Ver datos nodo', text: 'El ícono del "ojito" te permite ver la ultima informacion obtenida por el nodo seleccionado.' },
          { title: 'Detalle del nodo', text: 'Usa el boton "una vez seleccionado el nodo, puedes utilizar el boton "detalle" para ver los datos actualizados de ese nodo con sus respectivos graficos' }
        ]
      },
      { 
        label: 'Notificaciones', 
        descripcion: [
          { title: 'Acceder a las notificaciones', text: 'verás un ícono de bandeja en la esquina superior. Al hacer clic podras ver las notificaciones' },
          { title: 'Ver mas', text: 'Al seleccionar ver mas, podras ver todas las notificaciones recibidas y filtrarlas por estado: "leidas", "no leidas" o " todas "'},
          { title: 'Navegar por páginas', text: 'Usar los botones "Anterior" y "Siguiente" para ver más notificaciones en páginas.' },
          { title: 'Configurar preferencias', text: 'puedes gestionar tus preferencias de notificaciones de manera sencilla. Puedes personalizar tus alertas!' }
        ]
      },
      { 
        label: 'Configurar preferencias', 
        descripcion: [
          { title: 'Visualizar tus preferencias', text: 'Puedes ver y filtrar tus preferencias actuales. Estas preferencias están organizadas por estado:Activas: Están habilitadas y funcionando. Inactivas: Están deshabilitadas. Puedes filtrar las preferencias seleccionando entre Todas, Activas, o Inactivas en el menú desplegable situado arriba de la tabla' },
          { title: 'Agregar una nueva preferencia', text: 'Haz clic en el botón + (agregar) para abrir un formulario. En el formulario: Selecciona una Variable (p. ej., Temperatura, Humedad). Elige un Color de Alerta que deseas asignar a esta variable. Una vez completado, haz clic en Guardar para añadir la nueva preferencia.'},
          { title: 'Activar o desactivar una preferencia', text: 'Puedes activar/desactivar una preferencia haciendo clic en el ícono de accion junto a ella, esto es para activar la notificacion que deseas recibir. El icono de una "X" para desactivar, y el icono de una "tilde" para activar' },
          { title: 'Navegar por páginas', text: 'Usar los botones "Anterior" y "Siguiente" para ver más notificaciones en páginas.'  }
        ]
      },
    ],
    cooperativa: [
      { 
        label: 'Gráficos de análisis actual', 
        descripcion: [
          { title: 'Conversion de unidades', text: 'En la tabla de datos actualizados, puedes notar íconos junto a ciertos títulos, como temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm). Al hacer clic en estos íconos, puedes convertir las unidades de las columnas respectivas.' },
          { title: 'Ajuste de sensor y periodo', text: 'Usa los selectores de nodo y rango de tiempo para ajustar el sensor y período de análisis, respectivamente.' },
          { title: 'Navegación', text: 'puedes navegar entre páginas de la tabla usando los botones "Anterior" y "Siguiente.' },
          { title: 'Descarga de graficos', text: 'Para guardar los gráficos, haz clic en el botón de descarga' }
        ]
      },
      { 
        label: 'Suscripcion de Alertas', 
        descripcion: [
          { title: 'Suscripcion a alertas', text: 'En la sección de alertas, puedes configurar notificaciones para recibir actualizaciones en tiempo real. Para suscribirte, escanea el código QR proporcionado, que te conectará a un canal de Telegram donde recibirás alertas sobre los eventos monitoreados.' },
          { title: 'Requisitos para la suscripcion', text: 'Asegúrate de tener la aplicación de Telegram instalada y una cuenta activa para completar la suscripción.' } 
        ]
      },
      { 
        label: 'Gestion de nodos', 
        descripcion: [
          { title: 'Operaciones básicas', text: 'En la sección de gestión de nodos, puedes realizar operaciones básicas como agregar, editar o eliminar nodos y traer los ultimos datos tomados por el nodo.' },
          { title: 'Agregar nodo', text: 'Usa el botón "+" situado a la derecha superior del mapa para agregar un nuevo nodo ingresando los datos correspondientes. Pueden cargar los campos de longitud y latitud haciendo click en el mapa' },
          {title: 'Importante' , text: 'Al seleccionar un nodo en el mapa se habilitan las acciones eliminar y modificar o ver datos del nodo, tener en cuenta que se debe seleccionar el nodo sobre el cual se desea realizar alguna de las siguientes acciones'},
          { title: 'Editar nodo', text: 'El ícono del "lápiz" te permite editar la información de nodos existentes.' },
          { title: 'Eliminar nodo', text: 'El ícono del "tacho" elimina un nodo seleccionado de la lista.' },
          { title: 'Ver datos nodo', text: 'El ícono del "ojito" te permite ver la ultima informacion obtenida por el nodo seleccionado.' },
          { title: 'Detalle del nodo', text: 'Usa el boton "una vez seleccionado el nodo, puedes utilizar el boton "detalle" para ver los datos actualizados de ese nodo con sus respectivos graficos' }
        ]
      },
      { 
        label: 'Notificaciones', 
        descripcion: [
          { title: 'Acceder a las notificaciones', text: 'verás un ícono de bandeja en la esquina superior. Al hacer clic podras ver las notificaciones' },
          { title: 'Ver mas', text: 'Al seleccionar ver mas, podras ver todas las notificaciones recibidas y filtrarlas por estado: "leidas", "no leidas" o " todas "'},
          { title: 'Navegar por páginas', text: 'Usar los botones "Anterior" y "Siguiente" para ver más notificaciones en páginas.' },
          { title: 'Configurar preferencias', text: 'puedes gestionar tus preferencias de notificaciones de manera sencilla. Puedes personalizar tus alertas!' }
        ]
      },
      { 
        label: 'Configurar preferencias', 
        descripcion: [
          { title: 'Visualizar tus preferencias', text: 'Puedes ver y filtrar tus preferencias actuales. Estas preferencias están organizadas por estado:Activas: Están habilitadas y funcionando. Inactivas: Están deshabilitadas. Puedes filtrar las preferencias seleccionando entre Todas, Activas, o Inactivas en el menú desplegable situado arriba de la tabla' },
          { title: 'Agregar una nueva preferencia', text: 'Haz clic en el botón + (agregar) para abrir un formulario. En el formulario: Selecciona una Variable (p. ej., Temperatura, Humedad). Elige un Color de Alerta que deseas asignar a esta variable. Una vez completado, haz clic en Guardar para añadir la nueva preferencia.'},
          { title: 'Activar o desactivar una preferencia', text: 'Puedes activar/desactivar una preferencia haciendo clic en el ícono de accion junto a ella, esto es para activar la notificacion que deseas recibir. El icono de una "X" para desactivar, y el icono de una "tilde" para activar' },
          { title: 'Navegar por páginas', text: 'Usar los botones "Anterior" y "Siguiente" para ver más notificaciones en páginas.'  }
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
        label: 'Gestion de usuarios', 
        descripcion: [
          { title: 'Ver lista de usuarios', text: 'En la tabla de usuarios se muestran todos los usuarios registrados, incluyendo su nombre, correo electrónico, edad y el rol asignado actualmente. Que por defecto recibe el de "invitado" ' },
          { title: 'Modificar roles', text: 'Al lado de cada usuario, encontrarás un botón con el ícono de un "lápiz"; Haz clic en este botón para abrir el selector de roles. Podrás asignar uno de los siguientes roles al usuario: Invitado (Es el rol por defecto al registrarse. Tiene acceso limitado) Universitario ( Acceso a funcionalidades específicas para estudiantes, trabaja con datos historicos). Profesional: (Acceso completo a las herramientas de análisis y datos actuales.) Cooperativa: (Acceso a funcionalidades diseñadas para grupos de trabajo.) Admin: (Acceso total al sistema, incluyendo la gestión de usuarios, gestion de variables).' },
          { title: 'Importante', text: 'El rol asignado determina qué páginas y funcionalidades estarán disponibles para ese usuario.' },
          { title: 'Eliminar usuario', text: 'Al lado de cada usuario, encontrarás un botón con el ícono de un "tachito". Al hacer clic, podrás eliminar al usuario seleccionado. Precaución: Esta acción es permanente y no se puede deshacer.' }
        ]
      },
      { 
        label: 'Gráficos de análisis actual', 
        descripcion: [
          { title: 'Conversion de unidades', text: 'En la tabla de datos actualizados, puedes notar íconos junto a ciertos títulos, como temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm). Al hacer clic en estos íconos, puedes convertir las unidades de las columnas respectivas.' },
          { title: 'Ajuste de sensor y periodo', text: 'Usa los selectores de nodo y rango de tiempo para ajustar el sensor y período de análisis, respectivamente.' },
          { title: 'Navegación', text: 'puedes navegar entre páginas de la tabla usando los botones "Anterior" y "Siguiente.' },
          { title: 'Descarga de graficos', text: 'Para guardar los gráficos, haz clic en el botón de descarga' }
        ]
      },
      { 
        label: 'Suscripcion de Alertas', 
        descripcion: [
          { title: 'Suscripcion a alertas', text: 'En la sección de alertas, puedes configurar notificaciones para recibir actualizaciones en tiempo real. Para suscribirte, escanea el código QR proporcionado, que te conectará a un canal de Telegram donde recibirás alertas sobre los eventos monitoreados.' },
          { title: 'Requisitos para la suscripcion', text: 'Asegúrate de tener la aplicación de Telegram instalada y una cuenta activa para completar la suscripción.' } 
        ]
      },
      { 
        label: 'Gestion de nodos', 
        descripcion: [
          { title: 'Operaciones básicas', text: 'En la sección de gestión de nodos, puedes realizar operaciones básicas como agregar, editar o eliminar nodos y traer los ultimos datos tomados por el nodo.' },
          { title: 'Agregar nodo', text: 'Usa el botón "+" situado a la derecha superior del mapa para agregar un nuevo nodo ingresando los datos correspondientes. Pueden cargar los campos de longitud y latitud haciendo click en el mapa' },
          {title: 'Importante' , text: 'Al seleccionar un nodo en el mapa se habilitan las acciones eliminar y modificar o ver datos del nodo, tener en cuenta que se debe seleccionar el nodo sobre el cual se desea realizar alguna de las siguientes acciones'},
          { title: 'Editar nodo', text: 'El ícono del "lápiz" te permite editar la información de nodos existentes.' },
          { title: 'Eliminar nodo', text: 'El ícono del "tacho" elimina un nodo seleccionado de la lista.' },
          { title: 'Ver datos nodo', text: 'El ícono del "ojito" te permite ver la ultima informacion obtenida por el nodo seleccionado.' },
          { title: 'Detalle del nodo', text: 'Usa el boton "una vez seleccionado el nodo, puedes utilizar el boton "detalle" para ver los datos actualizados de ese nodo con sus respectivos graficos' }
        ]
      },
      { 
        label: 'Graficos historicos', 
        descripcion: [
          { title: 'Seccion de variable y fecha', text: 'En la sección de gráficos históricos, puedes elegir una variable y una fecha específica para visualizar sus datos en el gráfico.' },
          { title: 'Actualizacion automatica', text: 'Al seleccionar una variable (como temperatura, humedad, etc.) y una fecha, el gráfico se actualizará automáticamente para mostrar la información correspondiente.' },
          { title: 'Tabla de datos', text: 'Además, se generará una tabla debajo del gráfico con los datos detallados del período seleccionado.' }
        ]
      },
      { 
        label: 'Tabla historicos', 
        descripcion: [
          { title: 'Seccion de rango de fechas', text: 'En la sección de tabla históricos, puedes seleccionar un rango de fechas para visualizar los datos registrados en ese período.' },
          { title: 'Conversion de unidades', text: 'La tabla incluye opciones de conversión de unidades en las columnas de temperatura (°C/°F), presión (hPa), viento (m/s o km/h) y precipitación (mm o cm); solo debes hacer clic en los íconos junto a cada título para cambiar las unidades.' },
          { title: 'Descarga de datos', text: 'También puedes descargar los datos mostrados en formato CSV utilizando el botón de descarga.' },
          { title: 'Navegacion entre paginas', text: ' Usa los botones de paginación ("Anterior" y "Siguiente") para navegar entre diferentes páginas de la tabla.' }
        ]
      },
      { 
        label: 'Tabla auditoria', 
        descripcion: [
          { title: 'Filtrar por tipo de mensaje', text: 'Seleccionar entre "Correctos", "Duplicados" o "Incorrectos" para ver los mensajes de un tipo específico.' },
          { title: 'Filtrar por nodo', text: 'Elegir un nodo en particular para ver solo los mensajes relacionados con ese nodo.' },
          { title: 'Filtrar por variable', text: 'Seleccionar la variable (como temperatura, humedad, etc.) para ver los mensajes de esa variable específica.' },
          { title: 'Navegar por páginas', text: 'Usar los botones "Anterior" y "Siguiente" para ver más mensajes en páginas de 10 mensajes por vez.' },
          { title: 'Ordenar por columna', text: ' Hacer clic en los encabezados de las columnas para ordenar los mensajes por "Nodo", "Valor", "Variable", "Tipo", "Fecha" u "Hora".' }
        ]
      },
      { 
        label: 'Gestion variables', 
        descripcion: [
          { title: 'Agregar una nueva variable', text: 'Haz clic en el ícono "+", ubicado en la parte superior derecha. Esto abrirá un modal donde podrás completar los campos necesarios para agregar una nueva variable y crearla.' },
          { title: 'Editar una variable existente', text: ' Utiliza el ícono del "lápiz" para modificar los datos de una variable.' },
          { title: 'Eliminar una variable', text: 'Haz clic en el ícono del "tachito" para eliminar la variable seleccionada.' },
          { title: 'Gestión de Rangos', text: ' En la parte superior derecha, encontrarás un ícono de engranajes que te permite acceder a la opción de "Gestión de Rangos".En esta sección, puedes modificar los valores mínimos y máximos de cada variable para los diferentes rangos: Verde ( valor optimo ), amarillo ( precaución ), Naranja ( advertencia ), Rojo ( peligro ). Para mas informacion, ver en "ayuda: Rangos variables"' }
        ]
      },
      { 
        label: 'Rangos variables', 
        descripcion: [
          { title: 'Visualización de las Variables', text: 'Cada fila muestra una variable y sus valores mínimos y máximos para los diferentes rangos: verde, amarillo, naranja y rojo.' },
          { title: 'Editar los Rangos', text: 'Si deseas modificar un rango, haz clic en el ícono de edición (lápiz) al lado de la variable.Se abrirá un modal donde podrás ajustar los valores para cada rango de color (verde, amarillo, naranja, rojo)'},
          { title: 'Guardar los Cambios', text: 'Después de editar los rangos, haz clic en el botón "Guardar" para aplicar los cambios. Si los valores que ingresas se solapan (por ejemplo, el valor máximo de verde es mayor que el valor mínimo de amarillo), aparecerá un mensaje de error informándote del problema.' },
          { title: 'Estado de Carga', text: 'Mientras se cargan los datos, verás un mensaje de "Cargando..." en pantalla. Esto significa que el sistema está obteniendo las variables y sus rangos.' }
        ]
      },
      { 
        label: 'Notificaciones', 
        descripcion: [
          { title: 'Acceder a las notificaciones', text: 'verás un ícono de bandeja en la esquina superior. Al hacer clic podras ver las notificaciones' },
          { title: 'Ver mas', text: 'Al seleccionar ver mas, podras ver todas las notificaciones recibidas y filtrarlas por estado: "leidas", "no leidas" o " todas "'},
          { title: 'Navegar por páginas', text: 'Usar los botones "Anterior" y "Siguiente" para ver más notificaciones en páginas.' },
          { title: 'Configurar preferencias', text: 'puedes gestionar tus preferencias de notificaciones de manera sencilla. Puedes personalizar tus alertas!' }
        ]
      },
      { 
        label: 'Configurar preferencias', 
        descripcion: [
          { title: 'Visualizar tus preferencias', text: 'Puedes ver y filtrar tus preferencias actuales. Estas preferencias están organizadas por estado:Activas: Están habilitadas y funcionando. Inactivas: Están deshabilitadas. Puedes filtrar las preferencias seleccionando entre Todas, Activas, o Inactivas en el menú desplegable situado arriba de la tabla' },
          { title: 'Agregar una nueva preferencia', text: 'Haz clic en el botón + (agregar) para abrir un formulario. En el formulario: Selecciona una Variable (p. ej., Temperatura, Humedad). Elige un Color de Alerta que deseas asignar a esta variable. Una vez completado, haz clic en Guardar para añadir la nueva preferencia.'},
          { title: 'Activar o desactivar una preferencia', text: 'Puedes activar/desactivar una preferencia haciendo clic en el ícono de accion junto a ella, esto es para activar la notificacion que deseas recibir. El icono de una "X" para desactivar, y el icono de una "tilde" para activar' },
          { title: 'Navegar por páginas', text: 'Usar los botones "Anterior" y "Siguiente" para ver más notificaciones en páginas.'  }
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
