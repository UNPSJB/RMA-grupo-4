import sys
import time
import random
import threading
import paho.mqtt.client as paho
from typing import Optional
from datetime import datetime
from dataclasses import dataclass
from pydantic import BaseModel
from mqtt import TipoMensaje
from mqtt.config import config
from dotenv import load_dotenv


class Mensaje(BaseModel):
    id: int
    type: str
    data: str
    time: str


@dataclass
class Nodo:
    id: int
    stop_event: threading.Event
    cliente: paho.Client = paho.Client()
    frecuencia: int = 10  # tiempo entre mensajes (segundos)
    mensajes_enviados: int = 0

    def __post_init__(self) -> None:
        self.setear_manejadores_de_eventos()

    def setear_manejadores_de_eventos(self) -> None:

        def on_connect(_, obj, flags, reason_code) -> None:
            if self.cliente.is_connected():
                print("Publicador conectado!")

        self.cliente.enable_logger()
        self.cliente.on_connect = on_connect

    def publicar(
        self,
        topic: str,
        tipo: TipoMensaje,
        message: str = "",
        qos: int = 1,
    ) -> None:
        if not self.cliente.is_connected():
            self.conectar()

        while not self.stop_event.is_set():
            if len(message) == 0:
                message = str(
                    random.uniform(22.0, 23.0)
                )  # temperatura random entre 22 y 23°C

            mensaje = self.formatear_mensaje(
                topic,
                tipo,
                message,
            )

            res = self.cliente.publish(
                topic,
                mensaje,
                qos,
            )

            try:
                res.wait_for_publish()
                if res.is_published():
                    self.cliente.logger.warn(f"{res.mid} - {mensaje}")
                    self.mensajes_enviados += 1
                else:
                    print(f"El mensaje n° {res.mid} no fue publicado.")
            except RuntimeError as re:
                print(f"El cliente se ha desconectado con el mensaje: {res.rc}.")
                break

            message = ""
            time.sleep(self.frecuencia)

        self.cliente.loop_stop()
        self.desconectar()

    def conectar(self) -> None:
        if self.cliente.connect(config.host, config.port, config.keepalive) != 0:
            print("Ha ocurrido un error al conectar al broker MQTT")
        print("Conectado al broker MQTT!")
        self.cliente.loop_start()

    def desconectar(self):
        self.cliente.disconnect()
        print(f"Desconectado! - mensajes enviados: {self.mensajes_enviados}")
        sys.exit(0)

    def formatear_mensaje(self, topic: str, tipo: TipoMensaje, mensaje: str) -> str:
        mensaje = Mensaje(
            id=self.id, type=tipo, data=str(mensaje), time=str(datetime.now())
        ).model_dump()
        return str(mensaje)
