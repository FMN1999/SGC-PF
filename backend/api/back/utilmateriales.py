import math
import re

import icu  # para simplificar cadenas que contienen acentos
from pint import UnitRegistry  # para trabajar con unidades de medida
ureg = UnitRegistry()

EXPRESION_UNIDADES = r'(?P<cantidad>\d+(?:\.\d+)?)?(?:\s*(?P<unidades>[a-z]+)(?P<potencia>\d+)?)?'
EXPRESION_UNIDADES_ANCHO = EXPRESION_UNIDADES
for group in 'cantidad', 'unidades', 'potencia':
    EXPRESION_UNIDADES_ANCHO = EXPRESION_UNIDADES_ANCHO.replace(group, f'ancho_{group}')
EXPRESION_UNIDADES_ALTO = EXPRESION_UNIDADES
for group in 'cantidad', 'unidades', 'potencia':
    EXPRESION_UNIDADES_ALTO = EXPRESION_UNIDADES_ALTO.replace(group, f'alto_{group}')
EXPRESION_AREA = re.compile(rf'(?P<ancho>{EXPRESION_UNIDADES_ANCHO})\s*x\s*(?P<alto>{EXPRESION_UNIDADES_ALTO})', re.IGNORECASE)
del EXPRESION_UNIDADES_ANCHO
del EXPRESION_UNIDADES_ALTO
EXPRESION_UNIDADES = re.compile(EXPRESION_UNIDADES, re.IGNORECASE)


def analizar_cantidad(cantidad=None, unidades=None, potencia=None):
    # admite devolver la unidad sola, sin cantidad
    cantidad = float(cantidad) if cantidad is not None else ''
    if unidades is None:
        unidades = ''
    elif potencia is not None:
        unidades = f'{unidades}**{potencia}'
    if unidades in ['u', 'un', 'unidad', 'unidades']:
        unidades = ''
    parser = ureg.parse_expression if cantidad != '' else ureg.parse_units
    expresion = f'{cantidad}{unidades}'
    try:
        return parser(expresion)
    except:
        return None


# función para convertir una cantidad con unidades
def procesar_cantidad(texto):
    texto = texto.lower().strip()
    expresion_unidades = True
    m_unidades = EXPRESION_UNIDADES.fullmatch(texto)
    if m_unidades is None:
        expresion_unidades = False
        m_area = EXPRESION_AREA.fullmatch(texto)
        if m_area is None:
            return None
    elif m_unidades.group('cantidad') is None and m_unidades.group('unidades') is None:
        return None
    if expresion_unidades:
        cantidad = m_unidades.group('cantidad')
        unidades = m_unidades.group('unidades')
        potencia = m_unidades.group('potencia')
        return analizar_cantidad(cantidad, unidades, potencia)
    else:
        for group in 'ancho', 'alto':
            # se admiten expresiones de cantidades con unidades sin potencia
            if m_area.group(f'{group}_cantidad') is None:
                return None
            elif m_area.group(f'{group}_unidades') is None:
                return None
            elif m_area.group(f'{group}_potencia') is not None:
                return None
        resultado = [analizar_cantidad(*m_area.group(*g)) for g in [tuple(f'{group}_{cant}' for cant in ['cantidad', 'unidades']) for group in ['ancho', 'alto']]]
        return resultado if None not in resultado else None


# función para simplificar el manejo de strings
def convertir_string(s):
    s = s.strip()
    tl = icu.Transliterator.createInstance('Latin-ASCII')
    return tl.transliterate(s).lower()


class Material:
    def __init__(self, nombre, nombres_alternativos, unidad_medida, cantidad_m2, discreto=True):
        self.nombre = nombre
        self.nombres_alternativos = nombres_alternativos
        self.unidad_medida = procesar_cantidad(unidad_medida)
        self.cantidad_m2 = cantidad_m2
        self.discreto = discreto

    def coincide(self, nombre):
        nombre = convertir_string(nombre)
        nombres = [convertir_string(nom) for nom in [self.nombre, *self.nombres_alternativos]]
        return nombre in nombres

    def calcular_cantidad(self, area):
        if isinstance(area, str):
            area = procesar_cantidad(area)
        elif not isinstance(area, ureg.Quantity):
            return None
        if not area.is_compatible_with(procesar_cantidad('m2')):
            return None
        area_m2 = area.to(ureg.m**2)
        cantidad = (area_m2 * self.cantidad_m2).magnitude * 1.05
        if self.discreto:
            return int(math.ceil(cantidad))
        return cantidad * self.unidad_medida


class RepositorioMateriales:
    def __init__(self):
        # materiales hardcodeados para el sistema de recomendación
        self.MATERIALES = [
            Material(
                'Ladrillo común',
                ('ladrillo comun', 'ladrillo comu', 'ladrillo'),
                'un',
                40,
            ),
            Material(
                'Ladrillón',
                ('ladrillon', 'ladrillo grande'),
                'un',
                30,
            ),
            Material(
                'Cemento',
                ('cemento',),
                'kg',
                5,
                discreto=False,
            ),
            Material(
                'Agua',
                ('agua',),
                'l',
                5,
                discreto=False,
            ),
            Material(
                'Arena',
                ('arena',),
                'kg',
                20,
                discreto=False,
            ),
        ]
        # Índice de búsqueda rápida
        self._indice = {}
        for idx, mat in enumerate(self.MATERIALES):
            for nombre in [mat.nombre, *mat.nombres_alternativos]:
                self._indice[convertir_string(nombre)] = idx

    def buscar(self, nombre):
        return self._indice.get(convertir_string(nombre), -1)

    def __getitem__(self, index):
        return self.MATERIALES[index]

    def __setitem__(self, index, value):
        self.MATERIALES[index] = value

    def __len__(self):
        return len(self.MATERIALES)

    def __iter__(self):
        return iter(self.MATERIALES)

repo_materiales = RepositorioMateriales()


# modelo matemático simplificado
def estimar_area_total_paredes(area_edificada, pisos, altura_piso=2.4, paredes_internas_promedio=1.5):
    rectangulo = False  # si no es rectángular suponemos un área cuadrada
    if isinstance(area_edificada, str):
        area_edificada = procesar_cantidad(area_edificada)
    if area_edificada is None:
        return None
    elif not isinstance(area_edificada, ureg.Quantity):
        ancho, alto = area_edificada
        rectangulo = True
    if not isinstance(altura_piso, ureg.Quantity):
        altura_piso = altura_piso * ureg.m

    if rectangulo:
        # paredes de un rectángulo
        long_paredes = ancho * 2 + alto * 2
    else:
        # paredes de un cuadrado
        long_paredes = area_edificada ** 0.5 * 4
    area_total_paredes = long_paredes * altura_piso * pisos

    # incluir paredes internas según cantidad promedio total
    if paredes_internas_promedio > 0:
        area_total_paredes += paredes_internas_promedio * long_paredes/4 * altura_piso * pisos
    return area_total_paredes


def estimar_cantidad_material_paredes(material, area_edificada, pisos, altura_piso=2.4, paredes_internas_promedio=1.5):
    if isinstance(material, str):
        idx = repo_materiales.buscar(material)
        if idx is None:
            return None
        material = repo_materiales[idx]
    area_paredes = estimar_area_total_paredes(
        area_edificada, pisos, altura_piso=altura_piso,
        paredes_internas_promedio=paredes_internas_promedio
    )
    return material.calcular_cantidad(area_paredes)
