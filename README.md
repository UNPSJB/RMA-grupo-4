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

#### Puede que requiera de una instalacion adicional :

* Backend:
  - Para la generacion de QR:
    ```bash
    pip install qrcode[pil]
    ```
  - Para utilizacion del bot de telegram:
    ```bash
    pip install python-telegram-bot
    ```