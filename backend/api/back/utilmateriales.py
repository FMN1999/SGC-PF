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
        if not area.is_compatible_with(ureg.m**2):
            return None
        area_m2 = area.to(ureg.m**2)
        cantidad = area_m2.magnitude * self.cantidad_m2 * 1.05
        if self.discreto:
            return int(math.ceil(cantidad))
        return cantidad * self.unidad_medida


class Ladrillo:
    def __init__(self, nombre='Ladrillo común', largo=23*ureg.cm, alto=5*ureg.cm, ancho=11*ureg.cm):
        self.nombre = nombre
        self.largo = largo
        self.alto = alto
        self.ancho = ancho

    def cantidad_m2(self, espesor_mortero=1.5*ureg.cm):
        return math.ceil(ureg.m**2/((self.largo + espesor_mortero) * (self.alto + espesor_mortero)))

    def cantidad_mortero_m2(self, espesor_mortero=1.5*ureg.cm):
        volumen_pared_m2 = ureg.m**2 * self.ancho
        volumen_ladrillos = self.cantidad_m2(espesor_mortero) * (self.largo * self.alto * self.ancho)
        return ((volumen_pared_m2 - volumen_ladrillos)/ureg.m**2).to_base_units()


class Ladrillon(Ladrillo):
    def __init__(self):
        super().__init__(nombre='Ladrillón', largo=30*ureg.cm, alto=10*ureg.cm, ancho=15*ureg.cm)


class Pared:
    def __init__(self, ladrillo, mortero, espesor_mortero=1.5*ureg.cm):
        self.ladrillo = ladrillo
        self.mortero = mortero
        self.espesor_mortero = espesor_mortero

    def calcular_cantidad_ladrillos(self, area):
        return area * self.ladrillo.cantidad_m2(self.espesor_mortero)

    def calcular_cantidad_mortero(self, area):
        return area * self.ladrillo.cantidad_mortero_m2(self.espesor_mortero)

    def calcular_materiales_mortero(self, area):
        cantidad_mortero = self.calcular_cantidad_mortero()
        return self.mortero.calcular_cantidades(cantidad_mortero)


class Contrapiso:
    def __init__(self, mortero, espesor):
        self.mortero = mortero
        self.espesor = espesor

    def calcular_cantidad_mortero(self, area):
        return area * self.espesor


"""items_estimables = {
    'piso': {
        'contrapiso': None,  # --> mortero?
        'carpeta': None  # --> mortero?
    },
    'pared': {
        'ladrillo': None,  # --> mortero
        'revoque': {
            'grueso': None, # --> mortero
            'fino': None # --> mortero
        }
    },
    'techo': {
    }
}"""

# coeficientes y otros items basados en https://www.frro.utn.edu.ar/repositorio/catedras/civil/1_anio/civil1/files/IC%20I-Morteros%20y%20hormigones.pdf

class MaterialCompuesto:
    def __init__(self, nombre, composicion):
        self.nombre = nombre
        self.composicion = list(composicion)  # iterable de tuplas (MaterialComponente, cantidad)
        self.densidad = None
        self._volumen_real_mezcla = None
        self._masa_total_mezcla = None
        self._inicializar_parametros()

    def calcular_cantidades(self, cantidad_mezcla):
        if cantidad_mezcla.is_compatible_with(ureg.kg):  # es masa
            cantidad_mezcla /= self.densidad  # convertir a unidades de volumen
        if cantidad_mezcla.is_compatible_with(ureg.m**3):  # es volumen
            cantidades = []
            for mat, cant in self.composicion:
                cantidades.append((mat, cant * cantidad_mezcla))
            return cantidades
        else:
            raise Exception('cantidad de material no es volumen ni masa')

    def _calcular_volumen_material(self, material, cantidad):
        mat.volumen_aparente(cant)

    def _inicializar_parametros(self):
        volumen_real_mezcla = 0
        masa_total_mezcla = 0
        for mat, cant in self.composicion:
            volumen_real_mezcla += mat.volumen_real(cant)
            masa_total_mezcla += mat.masa(cant)
        self.densidad = (masa_total_mezcla/volumen_real_mezcla).to_base_units()
        for i in range(len(self.composicion)):  # convertir cantidades a las necesarias por m3
            mat, cant = self.composicion[i]
            cant = (mat.volumen_aparente(cant)/volumen_real_mezcla).to_base_units()
            self.composicion[i] = mat, cant


class MaterialComponente:
    def __init__(self, nombre, densidad, aporte, unidad_medida):
        self.nombre = nombre
        self.aporte = aporte  # se usa para calcular el aporte al volumen real de una mezcla
        self.densidad = densidad  # para materiales en polvo es su densidad aparente
        self.unidad_medida = unidad_medida  # unidad de medida natural

    def masa(self, cantidad):
        if cantidad.is_compatible_with(ureg.kg):  # ya es masa:
            return cantidad
        elif cantidad.is_compatible_with(ureg.m**3):  # es volumen:
            return cantidad * self.densidad
        raise Exception('cantidad de material no es masa ni volumen')

    def volumen_aparente(self, cantidad):
        if cantidad.is_compatible_with(ureg.m**3):  # ya es volumen
            return cantidad
        elif cantidad.is_compatible_with(ureg.kg):  # es masa:
            return cantidad/self.densidad
        raise Exception('cantidad de material no es volumen ni masa')

    def volumen_real(self, cantidad):
        return self.volumen_aparente(cantidad) * self.aporte

    def cantidad_unidad_medida(self, cantidad):
        if cantidad.is_compatible_with(self.unidad_medida):
            return cantidad.to(self.unidad_medida)
        if self.unidad_medida.is_compatible_with(ureg.kg):  # se mide como masa
            return self.masa(cantidad).to(self.unidad_medida)
        elif self.unidad_medida.is_compatible_with(ureg.m**3):  # se mide volumen
            return self.volumen_aparente(cantidad).to(self.unidad_medida)
        raise Exception('cantidad de material incompatible')


arena_gruesa = MaterialComponente('Arena gruesa', 1600*ureg.kg/ureg.m**3, 0.63, ureg.m**3)
arena_mediana = MaterialComponente('Arena mediana', 1500*ureg.kg/ureg.m**3, 0.60, ureg.m**3)
arena_fina = MaterialComponente('Arena fina', 1400*ureg.kg/ureg.m**3, 0.54, ureg.m**3)
cal = MaterialComponente('Cal hidratada en polvo', 500*ureg.kg/ureg.m**3, 0.45, ureg.kg)
cascote = MaterialComponente('Cascote de ladrillo', 1300*ureg.kg/ureg.m**3, 0.60, ureg.kg)
cemento = MaterialComponente('Cemento Portland', 1300*ureg.kg/ureg.m**3, 0.47, ureg.kg)
#yeso = MaterialComponente('Yeso', 1200*ureg.kg/ureg.m**3, 1.40, ureg.kg)
agua = MaterialComponente('Agua', 1000*ureg.kg/ureg.m**3, 1.0, ureg.L)

mortero_ladrillo = MaterialCompuesto('Mortero 1:1/2:3', (
    (cal, 1*ureg.m**3),
    (cemento, 0.5*ureg.m**3),
    (arena_gruesa, 3*ureg.m**3),
    (agua, 4.5*0.09*ureg.m**3),
))
mortero_contrapiso = MaterialCompuesto('Mortero 1:1/8:4:8', (
    (cal, 1*ureg.m**3),
    (cemento, 0.5*ureg.m**3),
    (arena_gruesa, 4*ureg.m**3),
    (cascote, 8*ureg.m**3),
    (agua, 13.5*0.09*ureg.m**3),
))
mortero_carpeta = MaterialCompuesto('Mortero 1:3', (
    (cemento, 1*ureg.m**3),
    (arena_fina, 3*ureg.m**3),
    (agua, 4*0.09*ureg.m**3),
))
revoque_grueso = MaterialCompuesto('Revoque grueso', (
    (cal, 1*ureg.m**3),
    (cemento, 0.25*ureg.m**3),
    (arena_mediana, 3*ureg.m**3),
    (agua, 4.25*0.09*ureg.m**3),
))
revoque_fino = MaterialCompuesto('Revoque fino', (
    (cal, 1*ureg.m**3),
    (cemento, 0.125*ureg.m**3),
    (arena_fina, 2*ureg.m**3),
    (agua, 3.125*0.09*ureg.m**3),
))


# Puertas por piso -> 5 (averiguar dimensiones aproximadas)
# Ventanas por piso -> 3 (averiguar dimensiones aproximadas)


class RepositorioMateriales:
    def __init__(self):
        # materiales hardcodeados para el sistema de recomendación
        self.MATERIALES = [
            Material(
                'Ladrillo común',
                ('ladrillo comun', 'ladrillo comu', 'ladrillo'),
                'un',
                60,
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
