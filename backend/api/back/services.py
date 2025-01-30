from datetime import datetime
import requests
import urllib3
urllib3.disable_warnings()  # por el uso de verify=False


class ReferenciaBCRA:
    BASE_URL = 'https://api.bcra.gob.ar'
    ENDPOINT = '/estadisticas/v3.0/Monetarias/4'  # tipo de cambio minorista - promedio para la venta

    @classmethod
    def get(cls):
        url = cls.BASE_URL + cls.ENDPOINT
        res = requests.get(url, verify=False)  # el servidor tiene mal configurado el TLS/SSL
        if not res.ok:
            return None
        data = res.json()
        return {
            'valor': data['results'][0]['valor'],
            'fecha': data['results'][0]['fecha'],
        }


class DolarAPICom:
    BASE_URL = 'https://dolarapi.com/v1/dolares'
    ENDPOINT_OFICIAL = '/oficial'
    ENDPOINT_BLUE = '/blue'
    ENDPOINT_BOLSA = '/bolsa'
    ENDPOINT_CCL = '/contadoconliqui'

    @classmethod
    def get_oficial(cls):
        return cls._get(cls.ENDPOINT_OFICIAL)

    @classmethod
    def get_blue(cls):
        return cls._get(cls.ENDPOINT_BLUE)

    @classmethod
    def get_bolsa(cls):
        return cls._get(cls.ENDPOINT_BOLSA)

    @classmethod
    def get_ccl(cls):
        return cls._get(cls.ENDPOINT_CCL)

    @classmethod
    def _get(cls, endpoint):
        url = cls.BASE_URL + endpoint
        res = requests.get(url)
        if not res.ok:
            return None
        data = res.json()
        fecha = datetime.fromisoformat(data['fechaActualizacion']).date()
        return {
            'valor': data['venta'],
            'fecha': fecha.isoformat(),
        }
