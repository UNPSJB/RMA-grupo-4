# Red de Monitoreo Ambiental - Grupo 4

### Integrantes:
* Mauro Gaspar San Pedro.
* Florencia Seidnitzer.
* Francisco Terrón.
* Maximiliano Ruiz.
* Gonzalo Bustamante.

-------------------------------------------------------------------------------------

### Tecnologias Utilizadas :

### Backend
 . Python 3.12.
 . Sqlite.
 . Fastapi.

### Frontend
  . ReactJS
  . Vite 


### Dependencias Instaladas Backend :
  - python = "^3.12"
  - fastapi = "^0.115.0"
  - sqlalchemy = "^2.0.35"
  - python-dotenv = "^1.0.1"
  - pytest = "^8.3.3"
  - httpx = "^0.27.2"
  - ipdb = "^0.13.13"
  - pendulum = "^3.0.0"
  - uvicorn = "^0.30.6"
  - bcrypt = "^4.2.0"
  - pyjwt = "^2.9.0"
  - paho-mqtt = "^2.1.0"
  - pydantic = "^2.9.2"
  - asyncio-mqtt = "^0.16.2"

### Dependencias Instaladas Frontend :
 - "@chakra-ui/react": "^2.8.2",
 - "@emotion/react": "^11.13.3",
 - "@emotion/styled": "^11.13.0",
 - "axios": "^1.7.7",
 - "chart.js": "^4.4.4",
 - "framer-motion": "^11.5.6",
 - "jwt-decode": "^4.0.0",
 - "prop-types": "^15.8.1",
 - "react": "^18.3.1",
 - "react-chartjs-2": "^5.2.0",
 - "react-dom": "^18.3.1",
 - "react-icons": "^5.3.0",
 - "react-router-dom": "^6.26.2"
  


### Instalacion rapida :

* Backend:
  - Si ya tienes el proyecto configurado, y estas parado sobre la carpeta Backend, simplemente ejecuta:
    
    ```bash
    poetry install
    ```
  - Esto instalará todas las dependencias y podrás correr el servidor con:
    
    ```bash
    fastapi dev src/main.py
    ```
* Frontend: 
  - Si ya tienes el proyecto configurado, y estas parado sobre la carpeta Frontend, simplemente ejecuta:
    
    ```bash
    npm install
    ```
  - Esto instalará todas las dependencias y podrás iniciar el servidor con:
    
    ```bash
    npm run dev
    ```