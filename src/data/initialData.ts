import {
  GraphEdge,
  GraphNode,
  GraphRegion,
  InstructorCredentials,
  Learner,
  LessonBlock,
  OVA,
  ReminderTemplate,
  SentReminderLog,
} from '../types/ova';

export const DEFAULT_INSTRUCTOR: InstructorCredentials = {
  username: 'instructor.sena',
  password: 'sena2026',
  instructorName: 'Ing. Carlos Andrés Mendoza',
  centerName: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
  regionalName: 'Regional Distrito Capital — SENA',
  email: 'cmendoza@sena.edu.co',
};

// ============================================================================
// BLOQUES DE CONTENIDO DE LAS 3 OVAS DE JAVASCRIPT (COMPARTIDOS ENTRE CANVAS Y OVAS)
// ============================================================================

const BLOCKS_JS_101: LessonBlock[] = [
  {
    id: 'blk-js101-1',
    type: 'heading',
    title: '1. ¿Qué es JavaScript y cómo se ejecuta?',
    content: '1. ¿Qué es JavaScript y cómo se ejecuta?',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-2',
    type: 'text',
    content:
      'JavaScript (estandarizado bajo **ECMAScript**) es un lenguaje de programación multiparadigma, de **tipado dinámico** e interpretado/compilado al vuelo (**JIT - Just-In-Time**) por motores como **V8** (Chrome y Node.js) o **SpiderMonkey** (Firefox). Consulta la guía oficial en [MDN JavaScript Guide](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide "Documentación oficial de Mozilla con la referencia completa de sintaxis y estándares ECMAScript.") para explorar su evolución desde ES6+.',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-3',
    type: 'callout',
    calloutTone: 'info',
    title: 'Reglas Esenciales de Sintaxis en JavaScript',
    content:
      '• Case-Sensitive: Distingue mayúsculas y minúsculas (`aprendiz` ≠ `Aprendiz`).\n• Sentencias y Expresiones: Cada instrucción se cierra con punto y coma (`;`) por buena práctica.\n• Comentarios: Usa `//` para una línea y `/* ... */` para bloques.\n• Modo Estricto: Declarar `"use strict";` al inicio previene el uso de variables no declaradas.',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '01_generalidades_sintaxis.js',
    content: `'use strict';

// 1. Comentario de una sola línea: Sentencia de salida en consola
console.log('Iniciando módulo de Fundamentos JavaScript — SENA');

/* 2. Diferencia entre Expresión (produce un valor) y Sentencia (ejecuta una acción) */
const horasTeoria = 12;
const horasPractica = 18;
const totalHorasOva = horasTeoria + horasPractica; // Expresión aritmética -> 30

// 3. Sensibilidad a mayúsculas (Case-Sensitive)
const codigoFicha = '2874512';
const CodigoFicha = '2901845';
console.log('Ficha A:', codigoFicha, '| Ficha B:', CodigoFicha);`,
    relevanceComment:
      'Observa el uso de "use strict" en la primera línea para obligar a escribir código limpio y seguro.',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-5',
    type: 'heading',
    title: '2. Ejercicios Prácticos y Resueltos — Tema: Sintaxis',
    content: '2. Ejercicios Prácticos y Resueltos — Tema: Sintaxis',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejercicios_tema1_sintaxis.js',
    content: `// EJERCICIO 1 (Resuelto): Identifica y corrige los 3 errores de sintaxis
// Código con errores:
// const 1nombre = "Carlos"
// Console.log(1nombre)

// SOLUCIÓN CORRECTA:
// 1) Un identificador no puede iniciar con número.
// 2) el objeto global es 'console' en minúscula.
const nombreInstructor = 'Carlos';
console.log('Instructor:', nombreInstructor);

// EJERCICIO 2 (Propuesto):
// Escribe una expresión que calcule el porcentaje de asistencia de un aprendiz
// que asistió a 18 sesiones de un total de 20 y muéstralo con console.log().
const sesionesAsistidas = 18;
const totalSesiones = 20;
const porcentajeAsistencia = (sesionesAsistidas / totalSesiones) * 100;
console.log('Asistencia:', porcentajeAsistencia + '%'); // 90%`,
    relevanceComment:
      'Ejercicios aplicados para dominar las reglas léxicas y de identificadores en JavaScript.',
    sourceNodeId: 'node-js-101',
  },
];

const BLOCKS_JS_102: LessonBlock[] = [
  {
    id: 'blk-js102-1',
    type: 'heading',
    title: '1. Declaración de Variables: var vs let vs const',
    content: '1. Declaración de Variables: var vs let vs const',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-2',
    type: 'text',
    content:
      'En JavaScript moderno (ES6+) contamos con tres palabras reservadas para declarar variables: **`const`** (referencia constante de ámbito de bloque, usada por defecto), **`let`** (variable reasignable de ámbito de bloque) y **`var`** (declaración heredada con ámbito de función y *hoisting*, que debe evitarse en proyectos nuevos).',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-3',
    type: 'diagram',
    diagramKind: 'var_let_const',
    title: 'Comparativa Visual: Ámbito (Scope) y Mutabilidad de var, let y const',
    content:
      'Tanto let como const respetan los bloques delimitados por llaves { }, evitando fugas de variables fuera de condicionales o ciclos.',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '02_variables_y_scope.js',
    content: `// 1. const: Para valores cuya referencia no cambiará (Convención UPPER_SNAKE_CASE o camelCase)
const NOTA_MINIMA_APROBACION = 70;
const centroFormacion = 'CEET - SENA';

// 2. let: Para variables cuyo valor se reasigna (contadores, acumuladores, estado)
let intentosRealizados = 0;
intentosRealizados = intentosRealizados + 1;

// 3. Ámbito de Bloque (Block Scope)
if (intentosRealizados === 1) {
  let mensajeTemporal = 'Primer intento registrado';
  console.log(mensajeTemporal); // Funciona dentro del bloque { }
}
// console.log(mensajeTemporal); // ReferenceError: mensajeTemporal is not defined`,
    relevanceComment:
      'Regla de oro en JS moderno: declara todo con const por defecto, y cambia a let únicamente cuando necesites reasignar la variable.',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-5',
    type: 'heading',
    title: '2. Ejercicios por Tema: Ámbito y Reasignación',
    content: '2. Ejercicios por Tema: Ámbito y Reasignación',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejercicios_tema2_variables.js',
    content: `// EJERCICIO 1 (Resuelto): ¿Por qué el siguiente código con const NO lanza error?
const configOva = { version: 1, publicado: false };
configOva.publicado = true; // ✓ Válido: muta una propiedad interna, no reasigna la referencia
console.log(configOva);

// EJERCICIO 2 (Resuelto): Intercambio de valores entre dos variables let
let turnoManana = 'Ficha 2874512';
let turnoTarde = 'Ficha 2901845';

// Intercambio usando desestructuración o variable auxiliar:
const auxiliar = turnoManana;
turnoManana = turnoTarde;
turnoTarde = auxiliar;
console.log({ turnoManana, turnoTarde });`,
    relevanceComment:
      'Comprende la diferencia entre reasignar una variable (=) y mutar una propiedad interna.',
    sourceNodeId: 'node-js-102',
  },
];

const BLOCKS_JS_103: LessonBlock[] = [
  {
    id: 'blk-js103-1',
    type: 'heading',
    title: '1. Tipos de Datos Primitivos vs Tipos de Referencia',
    content: '1. Tipos de Datos Primitivos vs Tipos de Referencia',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-2',
    type: 'text',
    content:
      'JavaScript clasifica todos los valores en dos grandes familias: **7 Tipos Primitivos** (que se copian por valor directo y son inmutables) y **Tipos de Referencia u Objetos** (que se almacenan en el *Heap* de memoria y se manipulan mediante referencias). Revisa la tabla oficial en [MDN Estructuras y Tipos de Datos](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures "Especificación detallada de los 7 tipos primitivos, el operador typeof y el comportamiento de null y NaN.").',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-3',
    type: 'diagram',
    diagramKind: 'data_types',
    title: 'Esquema de Memoria: 7 Tipos Primitivos (Valor) vs Objetos (Referencia)',
    content:
      'Usa siempre el operador de igualdad estricta (===) para comparar tanto el valor como el tipo de dato sin conversiones automáticas inesperadas.',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '03_tipos_datos_typeof.js',
    content: `// 1. Tipos Primitivos y operador typeof
const nombre = 'Valentina';          // typeof -> "string"
const promedio = 94.5;               // typeof -> "number"
const esEgresado = false;            // typeof -> "boolean"
let fechaGrado;                      // typeof -> "undefined"
const tutorAsignado = null;          // typeof -> "object" (peculiaridad histórica de JS)
const idUnico = Symbol('id');        // typeof -> "symbol"
const enteroGigante = 9007199254740991n; // typeof -> "bigint"

// 2. Conversión Explícita vs Coerción Implícita
const entradaFormulario = '85';
const puntosExtra = 10;
console.log(entradaFormulario + puntosExtra);         // "8510" (Concatenación string)
console.log(Number(entradaFormulario) + puntosExtra); // 95 (Suma numérica real)

// 3. Igualdad Estricta (===) vs Igualdad Débil (==)
console.log(85 === '85'); // false (distinto tipo: number vs string)
console.log(85 == '85');  // true  (coerción peligrosa, evitar ==)`,
    relevanceComment:
      'Convertir explícitamente con Number(), String() o Boolean() evita bugs silenciosos al sumar datos provenientes de formularios HTML.',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-5',
    type: 'heading',
    title: '2. Ejercicios por Tema: Verificación de Tipos y Conversión',
    content: '2. Ejercicios por Tema: Verificación de Tipos y Conversión',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejercicios_tema3_tipos.js',
    content: `// EJERCICIO 1 (Resuelto): Crea una función que sume dos valores solo si ambos son números válidos
function sumarSeguro(a, b) {
  const numA = Number(a);
  const numB = Number(b);
  if (Number.isNaN(numA) || Number.isNaN(numB)) {
    return 'Error: Uno de los argumentos no es convertible a número';
  }
  return numA + numB;
}

console.log(sumarSeguro('40', 50));     // 90
console.log(sumarSeguro('abc', 50));    // "Error: Uno de los argumentos no es convertible a número"`,
    relevanceComment:
      'Number.isNaN() verifica de forma segura si una conversión numérica falló.',
    sourceNodeId: 'node-js-103',
  },
];

// ============================================================================
// OVA 2: ESTRUCTURAS DE CONTROL, EXPLICACIONES CON IMÁGENES Y EJERCICIOS RESUELTOS
// ============================================================================

const BLOCKS_JS_201: LessonBlock[] = [
  {
    id: 'blk-js201-1',
    type: 'heading',
    title: '1. Estructuras Condicionales: if / else if / else, Ternario y switch',
    content: '1. Estructuras Condicionales: if / else if / else, Ternario y switch',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-2',
    type: 'text',
    content:
      'Las estructuras condicionales permiten bifurcar el flujo de ejecución de un programa evaluando expresiones booleanas (`true` o `false`). Cuando existen múltiples rangos excluyentes utilizamos la escalera **`if / else if / else`**; para asignaciones breves de dos caminos usamos el **operador ternario (`? :`)**, y para comparar una variable contra valores discretos exactos usamos **`switch / case`**.',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-3',
    type: 'diagram',
    diagramKind: 'if_else_flow',
    title: 'Imagen / Diagrama de Flujo: Toma de Decisiones con if / else if / else',
    content:
      'El motor evalúa la condición en el rombo: si resulta verdadera (true) ejecuta el bloque superior; si resulta falsa (false) toma la rama inferior hacia else if o else.',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '01_condicionales_y_switch.js',
    content: `// 1. Escalera if / else if / else para evaluar rangos numéricos
function clasificarPuntajeSena(puntaje) {
  if (puntaje >= 90) {
    return 'Aprobado con Excelencia (A+)';
  } else if (puntaje >= 70) {
    return 'Aprobado (A)';
  } else {
    return 'No Aprobado — Requiere Plan de Mejoramiento (D)';
  }
}

// 2. Operador Ternario (? :) para asignaciones directas en una línea
const puntajeAprendiz = 84;
const estadoCertificado = puntajeAprendiz >= 70 ? 'Habilitado' : 'Pendiente';

// 3. Estructura switch / case para códigos exactos
function obtenerHorarioModalidad(modalidad) {
  switch (modalidad) {
    case 'DIURNA':
      return '06:00 a.m. - 12:00 p.m.';
    case 'NOCTURNA':
      return '06:00 p.m. - 10:00 p.m.';
    case 'VIRTUAL':
      return 'Plataforma 24/7 con sesiones sincrónicas';
    default:
      return 'Modalidad no registrada';
  }
}`,
    relevanceComment:
      'No olvides colocar return o break en cada bloque case de un switch para evitar el efecto fall-through (caída al siguiente caso).',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-5',
    type: 'heading',
    title: '2. Ejercicios Resueltos Paso a Paso — Condicionales',
    content: '2. Ejercicios Resueltos Paso a Paso — Condicionales',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejercicios_resueltos_condicionales.js',
    content: `/**
 * EJERCICIO RESUELTO 1: Validador de Acceso y Rol con Cortocircuito y Nullish Coalescing (??)
 * Enunciado: Dado un usuario que puede no tener nombre configurado, asignar "Aprendiz Invitado"
 * por defecto y determinar si puede publicar un OVA.
 */
function verificarPermisoPublicacion(usuario) {
  const nombreMostrar = usuario.nombre ?? 'Aprendiz Invitado';
  if (!usuario.activo) {
    return \`Acceso denegado para \${nombreMostrar}: cuenta inactiva.\`;
  }
  if (usuario.rol === 'instructor' || usuario.rol === 'coordinador') {
    return \`Bienvenido \${nombreMostrar}: permiso de autoría concedido.\`;
  }
  return \`Hola \${nombreMostrar}: acceso en modo lectura y entrega de evidencias.\`;
}

console.log(verificarPermisoPublicacion({ nombre: null, activo: true, rol: 'aprendiz' }));
// -> "Hola Aprendiz Invitado: acceso en modo lectura y entrega de evidencias."`,
    relevanceComment:
      'El operador ?? (Nullish Coalescing) solo reemplaza valores null o undefined, respetando cadenas vacías o el número 0.',
    sourceNodeId: 'node-js-201',
  },
];

const BLOCKS_JS_202: LessonBlock[] = [
  {
    id: 'blk-js202-1',
    type: 'heading',
    title: '1. Estructuras Repetitivas: Ciclos for, while y do...while',
    content: '1. Estructuras Repetitivas: Ciclos for, while y do...while',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-2',
    type: 'text',
    content:
      'Los ciclos permiten repetir un bloque de instrucciones mientras una condición lógica se mantenga verdadera. Usamos **`for`** cuando conocemos de antemano el número de iteraciones, **`while`** cuando la repetición depende de una condición dinámica evaluada al inicio, y **`do...while`** cuando necesitamos garantizar que el bloque se ejecute **al menos una vez**.',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-3',
    type: 'diagram',
    diagramKind: 'loops_flow',
    title: 'Imagen / Diagrama de Flujo: Las 4 Etapas de un Ciclo Repetitivo (for / while)',
    content:
      'En cada vuelta del ciclo se evalúa la condición (2): si es true se ejecuta el cuerpo (3) y luego el incremento (4); si es false (o se invoca break) el ciclo termina.',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '02_ciclos_for_while.js',
    content: `// 1. Ciclo for clásico con continue (saltar iteración) y break (detener ciclo)
for (let trimestre = 1; trimestre <= 6; trimestre++) {
  if (trimestre === 3) {
    continue; // Salta la impresión del trimestre 3 y pasa al 4
  }
  console.log('Cursando Trimestre Lectivo #' + trimestre);
}

// 2. Ciclo while: Búsqueda hasta cumplir condición
let cuposDisponibles = 3;
while (cuposDisponibles > 0) {
  console.log('Cupo asignado. Restantes:', cuposDisponibles - 1);
  cuposDisponibles--; // ¡Fundamental actualizar la variable para evitar un ciclo infinito!
}`,
    relevanceComment:
      'continue salta únicamente la vuelta actual del ciclo; break aborta y sale del ciclo por completo.',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-5',
    type: 'heading',
    title: '2. Ejercicios Resueltos Paso a Paso — Ciclos',
    content: '2. Ejercicios Resueltos Paso a Paso — Ciclos',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejercicios_resueltos_ciclos.js',
    content: `/**
 * EJERCICIO RESUELTO 1: Conteo de Evidencias Aprobadas y Promedio General
 * Enunciado: Dado un listado de calificaciones, calcular con un ciclo for cuántas
 * aprobaron (>= 70) y cuál es el promedio total del grupo.
 */
const calificacionesGrupo = [80, 65, 95, 72, 50, 88];
let sumaTotal = 0;
let totalAprobados = 0;

for (let i = 0; i < calificacionesGrupo.length; i++) {
  const notaActual = calificacionesGrupo[i];
  sumaTotal += notaActual;
  if (notaActual >= 70) {
    totalAprobados++;
  }
}

const promedioGrupo = (sumaTotal / calificacionesGrupo.length).toFixed(1);
console.log(\`Aprobados: \${totalAprobados} de \${calificacionesGrupo.length} | Promedio: \${promedioGrupo}\`);
// -> "Aprobados: 4 de 6 | Promedio: 75.0"`,
    relevanceComment:
      'Patrón clásico de acumulador (sumaTotal += notaActual) y contador condicional (totalAprobados++).',
    sourceNodeId: 'node-js-202',
  },
];

const BLOCKS_JS_203: LessonBlock[] = [
  {
    id: 'blk-js203-1',
    type: 'heading',
    title: '1. Iteración Moderna (for...of, for...in) y Manejo de Errores (try / catch)',
    content: '1. Iteración Moderna (for...of, for...in) y Manejo de Errores (try / catch)',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-2',
    type: 'text',
    content:
      'Para recorrer colecciones sin gestionar índices manuales, JavaScript ofrece **`for...of`** (itera directamente sobre los **valores** de un arreglo o cadena) y **`for...in`** (itera sobre las **claves/propiedades** de un objeto). Además, toda operación propensa a fallos externos (como parsear JSON o consultar una red) debe protegerse con **`try / catch / finally`**.',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-3',
    type: 'diagram',
    diagramKind: 'try_catch_flow',
    title: 'Imagen / Diagrama de Flujo: Captura de Excepciones con try / catch / finally',
    content:
      'Si ocurre un error dentro de try, la ejecución salta inmediatamente a catch sin detener la aplicación, y finalmente ejecuta finally.',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '03_for_of_try_catch_resuelto.js',
    content: `/**
 * EJERCICIO RESUELTO: Procesador Seguro de Entregas JSON con for...of y try/catch
 * Enunciado: Recorrer una lista de cadenas JSON enviadas por aprendices; si alguna
 * tiene formato inválido, capturar el error sin detener el procesamiento del resto.
 */
const enviosJson = [
  '{"aprendiz": "Valentina", "nota": 95}',
  '{JSON_CORRUPTO_SIN_COMILLAS}',
  '{"aprendiz": "Mateo", "nota": 82}',
];

for (const cadena of enviosJson) {
  try {
    const registro = JSON.parse(cadena);
    console.log('✓ Entrega procesada:', registro.aprendiz, '-> Nota:', registro.nota);
  } catch (error) {
    console.warn('⚠️ Envío descartado por sintaxis JSON inválida:', error.message);
  } finally {
    // Se ejecuta en cada iteración haya o no error
  }
}`,
    relevanceComment:
      'Observa cómo el segundo elemento falla en JSON.parse(), es capturado por catch y el ciclo continúa procesando a Mateo sin colapsar.',
    sourceNodeId: 'node-js-203',
  },
];

// ============================================================================
// OVA 3: ARREGLOS Y OBJETOS EN JAVASCRIPT (GRÁFICOS INTERACTIVOS Y MICROANIMACIONES)
// ============================================================================

const BLOCKS_JS_301: LessonBlock[] = [
  {
    id: 'blk-js301-1',
    type: 'heading',
    title: '1. Arreglos (Arrays) en JavaScript: Estructura Indexada y Mutación',
    content: '1. Arreglos (Arrays) en JavaScript: Estructura Indexada y Mutación',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-2',
    type: 'text',
    content:
      'Un **Arreglo (`Array`)** es una colección ordenada de datos donde cada elemento ocupa una posición numérica llamada **índice** que inicia siempre en **`0`**. Interactúa con el siguiente gráfico animado para experimentar cómo los métodos **`.push()`**, **`.pop()`**, **`.unshift()`** y **`.shift()`** modifican la estructura en memoria.',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-3',
    type: 'interactive',
    interactiveKind: 'array_lab',
    title: 'Gráfico Interactivo Animado: Operaciones en Memoria sobre un Array JS',
    content:
      'Escribe un elemento y pulsa .push() (final), .unshift() (inicio), .pop() o .shift() para ver cómo se desplazan los índices [0], [1], [2] con microanimaciones.',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '01_arreglos_fundamentos_y_ejercicios.js',
    content: `// 1. Declaración, acceso por índice [0] y último elemento con .at(-1)
const modulosAdso = ['Algoritmia', 'Bases de Datos', 'Frontend JS', 'Backend Node'];
console.log('Primer módulo [0]:', modulosAdso[0]);       // "Algoritmia"
console.log('Último módulo:', modulosAdso.at(-1));       // "Backend Node"

// 2. EJERCICIO RESUELTO: Gestión de Cola de Soporte de Aprendices (FIFO)
const colaSoporte = ['Valentina', 'Mateo'];
colaSoporte.push('Laura');               // Llega Laura al final -> ['Valentina', 'Mateo', 'Laura']
const atendido = colaSoporte.shift();    // Sale el primero ('Valentina')
console.log('Atendiendo a:', atendido, '| En espera:', colaSoporte);`,
    relevanceComment:
      'El método moderno .at(-1) permite leer el último elemento de cualquier arreglo sin tener que escribir arr[arr.length - 1].',
    sourceNodeId: 'node-js-301',
  },
];

const BLOCKS_JS_302: LessonBlock[] = [
  {
    id: 'blk-js302-1',
    type: 'heading',
    title: '1. Métodos Funcionales de Arreglos: map, filter, find y reduce',
    content: '1. Métodos Funcionales de Arreglos: map, filter, find y reduce',
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'blk-js302-2',
    type: 'text',
    content:
      'En el desarrollo moderno con JavaScript y React evitamos mutar los arreglos originales. En su lugar, encadenamos métodos funcionales inmutables que reciben una función *callback*: **`.map()`** para transformar, **`.filter()`** para seleccionar, **`.find()`** para localizar un elemento único y **`.reduce()`** para totalizar.',
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'blk-js302-3',
    type: 'interactive',
    interactiveKind: 'array_functional',
    title: 'Simulador Visual Animado: Pipeline Funcional (.map, .filter, .find, .reduce)',
    content:
      'Haz clic en cada método funcional para visualizar qué elementos se transforman, cuáles superan el filtro (>= 70) y cómo se calcula el acumulador.',
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'blk-js302-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '02_ejercicios_map_filter_reduce.js',
    content: `// EJERCICIO RESUELTO: Pipeline Funcional de Calificaciones SENA
const entregas = [
  { aprendiz: 'Valentina', puntaje: 95, entregada: true },
  { aprendiz: 'Mateo', puntaje: 58, entregada: true },
  { aprendiz: 'Laura', puntaje: 88, entregada: true },
  { aprendiz: 'Juan', puntaje: 0, entregada: false },
];

// 1. Filtrar solo los aprendices que aprobaron (puntaje >= 70)
const aprobados = entregas.filter((item) => item.entregada && item.puntaje >= 70);

// 2. Extraer únicamente un arreglo con los nombres en mayúsculas usando .map()
const nombresCuadroHonor = aprobados.map((item) => item.aprendiz.toUpperCase());

// 3. Calcular el puntaje promedio de los aprobados usando .reduce()
const promedioAprobados =
  aprobados.reduce((acumulador, item) => acumulador + item.puntaje, 0) /
  aprobados.length;

console.log('Cuadro de Honor:', nombresCuadroHonor); // ["VALENTINA", "LAURA"]
console.log('Promedio Aprobados:', promedioAprobados); // 91.5`,
    relevanceComment:
      'Encadenar .filter() seguido de .map() y .reduce() es el patrón más utilizado en aplicaciones web modernas.',
    sourceNodeId: 'node-js-302',
  },
];

const BLOCKS_JS_303: LessonBlock[] = [
  {
    id: 'blk-js303-1',
    type: 'heading',
    title: '1. Objetos en JavaScript: Pares Clave-Valor, Desestructuración y JSON',
    content: '1. Objetos en JavaScript: Pares Clave-Valor, Desestructuración y JSON',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-2',
    type: 'text',
    content:
      'Los **Objetos (`Object`)** permiten modelar entidades del mundo real agrupando propiedades (`clave: valor`) y comportamientos (métodos). Utiliza el siguiente inspector interactivo para experimentar con la notación de punto, notación de corchetes, desestructuración y `Object.keys()`.',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-3',
    type: 'interactive',
    interactiveKind: 'object_lab',
    title: 'Gráfico Interactivo Animado: Inspector de Objetos Clave-Valor y Desestructuración',
    content:
      'Toca cualquier propiedad del objeto o agrega una nueva clave-valor para ver cómo se accede y muta la estructura en tiempo real.',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: '03_objetos_desestructuracion_ejercicios.js',
    content: `// 1. Declaración de Objeto Literal, Desestructuración y Operador Spread (...)
const proyectoFormativo = {
  codigo: 'PRJ-ADSO-2026',
  titulo: 'Sistema de Gestión de Inventario Cloud',
  ficha: 2874512,
  tecnologias: ['JavaScript', 'Node.js', 'PostgreSQL'],
};

// Desestructuración directa de propiedades en variables independientes
const { titulo, ficha } = proyectoFormativo;

// Clonación inmutable agregando una propiedad con Spread (...)
const proyectoActualizado = {
  ...proyectoFormativo,
  estado: 'En Producción',
};

// 2. EJERCICIO RESUELTO: Recorrer claves y valores con Object.entries()
for (const [clave, valor] of Object.entries(proyectoActualizado)) {
  console.log(\`Propiedad [\${clave}] ->\`, valor);
}`,
    relevanceComment:
      'El operador Spread ({ ...objeto, nuevaPropiedad }) crea una copia superficial sin alterar el objeto original.',
    sourceNodeId: 'node-js-303',
  },
];

// ============================================================================
// CONTENEDORES GRANDES (REGIONES) Y NODOS ASOCIADOS EN EL LIENZO EN GRAFO (CANVAS)
// ============================================================================

export const INITIAL_REGIONS: GraphRegion[] = [
  {
    id: 'reg-js-1',
    title: 'Contenedor OVA 01 · Generalidades, Sintaxis, Variables y Tipos de Datos JS',
    subtitle: 'Fundamentos del motor JS, reglas léxicas, var/let/const y los 7 tipos primitivos vs referencias',
    x: 50,
    y: 50,
    width: 1030,
    height: 310,
    tone: 'amber',
    linkedOvaId: 'ova-js-1',
  },
  {
    id: 'reg-js-2',
    title: 'Contenedor OVA 02 · Estructuras de Control, Diagramas de Flujo y Ejercicios Resueltos',
    subtitle: 'Condicionales if/else/switch, ciclos for/while/do-while y manejo de errores try/catch/finally',
    x: 50,
    y: 400,
    width: 1030,
    height: 310,
    tone: 'indigo',
    linkedOvaId: 'ova-js-2',
  },
  {
    id: 'reg-js-3',
    title: 'Contenedor OVA 03 · Arreglos y Objetos en JavaScript (Gráficos Interactivos)',
    subtitle: 'Arrays indexados, métodos funcionales map/filter/reduce, objetos clave-valor y desestructuración',
    x: 50,
    y: 750,
    width: 1030,
    height: 310,
    tone: 'emerald',
    linkedOvaId: 'ova-js-3',
  },
];

export const INITIAL_NODES: GraphNode[] = [
  // Nodos asociados a Región 1 (OVA 1)
  {
    id: 'node-js-101',
    title: 'Generalidades y Reglas de Sintaxis en JavaScript',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 80,
    y: 130,
    regionId: 'reg-js-1',
    linkedOvaId: 'ova-js-1',
    linkedLessonId: 'les-js-101',
    tags: ['JavaScript', 'Sintaxis', 'OVA 1'],
    updatedAt: '2026-11-24',
    content:
      'Motor JIT V8, modo estricto "use strict", sensibilidad a mayúsculas, expresiones vs sentencias y ejercicios de sintaxis.',
    blocks: BLOCKS_JS_101,
  },
  {
    id: 'node-js-102',
    title: 'Tipos de Variables: var, let, const y Ámbito (Scope)',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 415,
    y: 130,
    regionId: 'reg-js-1',
    linkedOvaId: 'ova-js-1',
    linkedLessonId: 'les-js-102',
    tags: ['Variables', 'Scope', 'let/const'],
    updatedAt: '2026-11-24',
    content:
      'Comparativa gráfica entre var, let y const, Block Scope { }, Hoisting, Temporal Dead Zone y ejercicios prácticos.',
    blocks: BLOCKS_JS_102,
  },
  {
    id: 'node-js-103',
    title: 'Tipos de Datos Primitivos, Referencias y Coerción',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 750,
    y: 130,
    regionId: 'reg-js-1',
    linkedOvaId: 'ova-js-1',
    linkedLessonId: 'les-js-103',
    tags: ['Tipos de Datos', 'typeof', '==='],
    updatedAt: '2026-11-24',
    content:
      'Los 7 tipos primitivos en Stack vs Objetos en Heap, operador typeof, conversión explícita Number() e igualdad estricta ===.',
    blocks: BLOCKS_JS_103,
  },

  // Nodos asociados a Región 2 (OVA 2)
  {
    id: 'node-js-201',
    title: 'Condicionales: if / else, Ternario y switch (Con Diagrama)',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 80,
    y: 480,
    regionId: 'reg-js-2',
    linkedOvaId: 'ova-js-2',
    linkedLessonId: 'les-js-201',
    tags: ['Condicionales', 'Diagrama', 'OVA 2'],
    updatedAt: '2026-11-24',
    content:
      'Diagrama de flujo de decisión booleana, escaleras else-if, operador ternario, switch/case y ejercicios resueltos.',
    blocks: BLOCKS_JS_201,
  },
  {
    id: 'node-js-202',
    title: 'Ciclos Repetitivos: for, while, do...while y Ejercicios Resueltos',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 415,
    y: 480,
    regionId: 'reg-js-2',
    linkedOvaId: 'ova-js-2',
    linkedLessonId: 'les-js-202',
    tags: ['Ciclos', 'for/while', 'Resueltos'],
    updatedAt: '2026-11-24',
    content:
      'Esquema visual de las 4 etapas de un ciclo, control con break y continue, acumuladores y ejercicios resueltos paso a paso.',
    blocks: BLOCKS_JS_202,
  },
  {
    id: 'node-js-203',
    title: 'Iteración Moderna (for...of) y Excepciones (try / catch)',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 750,
    y: 480,
    regionId: 'reg-js-2',
    linkedOvaId: 'ova-js-2',
    linkedLessonId: 'les-js-203',
    tags: ['for...of', 'try/catch', 'Errores'],
    updatedAt: '2026-11-24',
    content:
      'Diagrama de flujo try/catch/finally, recorrido de valores con for...of y ejercicio resuelto de validación JSON.',
    blocks: BLOCKS_JS_203,
  },

  // Nodos asociados a Región 3 (OVA 3)
  {
    id: 'node-js-301',
    title: 'Arreglos (Arrays): Indexación y Gráfico Interactivo Animado',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 80,
    y: 830,
    regionId: 'reg-js-3',
    linkedOvaId: 'ova-js-3',
    linkedLessonId: 'les-js-301',
    tags: ['Arrays', 'Interactivo', 'OVA 3'],
    updatedAt: '2026-11-24',
    content:
      'Laboratorio visual animado de arreglos (push, pop, shift, unshift, reverse), acceso por índice [0] y ejercicios.',
    blocks: BLOCKS_JS_301,
  },
  {
    id: 'node-js-302',
    title: 'Métodos Funcionales: map, filter, find y reduce (Simulador)',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 415,
    y: 830,
    regionId: 'reg-js-3',
    linkedOvaId: 'ova-js-3',
    linkedLessonId: 'les-js-302',
    tags: ['map/filter', 'reduce', 'Animado'],
    updatedAt: '2026-11-24',
    content:
      'Simulador animado de transformación inmutable con map, filter, find y reduce aplicado a calificaciones y colecciones.',
    blocks: BLOCKS_JS_302,
  },
  {
    id: 'node-js-303',
    title: 'Objetos en JS: Clave-Valor, Desestructuración y JSON',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 750,
    y: 830,
    regionId: 'reg-js-3',
    linkedOvaId: 'ova-js-3',
    linkedLessonId: 'les-js-303',
    tags: ['Objetos', 'Destructuring', 'JSON'],
    updatedAt: '2026-11-24',
    content:
      'Inspector interactivo animado de objetos clave-valor, notación de punto/corchetes, spread (...) y ejercicios.',
    blocks: BLOCKS_JS_303,
  },
];

export const INITIAL_EDGES: GraphEdge[] = [
  {
    id: 'edge-js-1',
    sourceId: 'node-js-101',
    targetId: 'node-js-102',
    label: 'declara estado con',
  },
  {
    id: 'edge-js-2',
    sourceId: 'node-js-102',
    targetId: 'node-js-103',
    label: 'almacena tipos en',
  },
  {
    id: 'edge-js-3',
    sourceId: 'node-js-103',
    targetId: 'node-js-201',
    label: 'evalúa condiciones en',
  },
  {
    id: 'edge-js-4',
    sourceId: 'node-js-201',
    targetId: 'node-js-202',
    label: 'itera bloques con',
  },
  {
    id: 'edge-js-5',
    sourceId: 'node-js-202',
    targetId: 'node-js-203',
    label: 'protege ejecución con',
  },
  {
    id: 'edge-js-6',
    sourceId: 'node-js-202',
    targetId: 'node-js-301',
    label: 'recorre colecciones',
  },
  {
    id: 'edge-js-7',
    sourceId: 'node-js-301',
    targetId: 'node-js-302',
    label: 'transforma datos con',
  },
  {
    id: 'edge-js-8',
    sourceId: 'node-js-302',
    targetId: 'node-js-303',
    label: 'estructura entidades en',
  },
];

// ============================================================================
// LAS 3 OVAS DE JAVASCRIPT COMPLETAS
// ============================================================================

export const INITIAL_OVAS: OVA[] = [
  {
    id: 'ova-js-1',
    code: 'OVA-JS-220501096-01',
    title: 'JavaScript I: Generalidades, Sintaxis, Tipos de Variables y Tipos de Datos',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    competence: '220501096 · Desarrollar la solución de software de acuerdo con el diseño y metodologías de desarrollo',
    learningOutcome: 'RAP 01 · Codificar algoritmos en JavaScript aplicando estándares de sintaxis ECMAScript, ámbito de variables y conversión segura de tipos de datos',
    status: 'published',
    description:
      'Domina las bases del lenguaje JavaScript moderno: arquitectura del motor de ejecución, reglas de sintaxis, declaración de variables (var, let, const), ámbito de bloque, tipos de datos primitivos vs referencias, ejemplos comentados y ejercicios prácticos por cada tema.',
    estimatedHours: 18,
    updatedAt: '2026-11-24',
    lessons: [
      {
        id: 'les-js-101',
        order: 1,
        title: 'Generalidades de JavaScript, Motor de Ejecución y Reglas de Sintaxis',
        durationMinutes: 45,
        summary: 'Comprende cómo funciona JavaScript en el navegador y en Node.js, sus reglas léxicas, expresiones, sentencias y modo estricto.',
        linkedNodeIds: ['node-js-101'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_101,
        quiz: [
          {
            id: 'q-js101-1',
            question: '¿Cuál es el propósito de incluir la directiva "use strict"; al inicio de un archivo o función en JavaScript?',
            options: [
              'Activar el modo estricto de ECMAScript para impedir el uso de variables no declaradas y capturar errores silenciosos',
              'Desactivar todas las funciones matemáticas del navegador',
              'Obligar a que el código solo funcione sin conexión a internet',
            ],
            correctIndex: 0,
            explanation: 'El modo estricto convierte malas prácticas silenciosas (como asignar a una variable nunca declarada) en errores explícitos.',
          },
        ],
        activity: {
          id: 'act-js101',
          title: 'Taller Práctico Tema 1: Depuración de Sintaxis y Expresiones en JS',
          evidenceCode: 'GA7-220501096-JS1-EV01',
          evidenceType: 'Conocimiento',
          instructions:
            'Resuelve los ejercicios de corrección léxica, expresiones aritméticas y modo estricto incluidos en la Lección 1.',
          dueDate: '2026-11-28',
          deliverableFormat: 'Archivo .js o enlace a repositorio GitHub',
        },
      },
      {
        id: 'les-js-102',
        order: 2,
        title: 'Declaración y Tipos de Variables (var, let, const) y Ámbito de Bloque',
        durationMinutes: 50,
        summary: 'Diferencia con precisión el ámbito de función vs ámbito de bloque, Hoisting, Temporal Dead Zone y cuándo usar const o let.',
        linkedNodeIds: ['node-js-102'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_102,
        quiz: [
          {
            id: 'q-js102-1',
            question: '¿Qué ocurre si declaras un objeto con const (ej. const usuario = { activo: false }) e intentas modificar usuario.activo = true?',
            options: [
              'Es completamente válido porque const protege la referencia de la variable, pero permite mutar las propiedades internas del objeto',
              'Se formatea automáticamente el disco duro',
              'Borra todas las demás variables del archivo',
            ],
            correctIndex: 0,
            explanation: 'const impide reasignar la variable (usuario = otroObjeto), pero las propiedades internas de un objeto o arreglo sí pueden modificarse.',
          },
        ],
      },
      {
        id: 'les-js-103',
        order: 3,
        title: 'Tipos de Datos Primitivos y de Referencia, typeof y Conversión de Tipos',
        durationMinutes: 55,
        summary: 'Identifica los 7 tipos primitivos y los tipos de referencia, evita trampas de coerción implícita y aplica igualdad estricta (===).',
        linkedNodeIds: ['node-js-103'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_103,
        quiz: [
          {
            id: 'q-js103-1',
            question: '¿Qué valor y tipo retorna la expresión Number("45") + 10 frente a "45" + 10 en JavaScript?',
            options: [
              'Number("45") + 10 retorna el número 55, mientras que "45" + 10 concatena y retorna el string "4510"',
              'Ambas retornan undefined',
              'Ambas lanzan un SyntaxError',
            ],
            correctIndex: 0,
            explanation: 'El operador + concatena si cualquiera de los operandos es un string; Number("45") convierte explícitamente la cadena a número antes de sumar.',
          },
        ],
      },
    ],
  },
  {
    id: 'ova-js-2',
    code: 'OVA-JS-220501096-02',
    title: 'JavaScript II: Estructuras de Control, Diagramas de Flujo y Ejercicios Resueltos',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    competence: '220501096 · Desarrollar la solución de software de acuerdo con el diseño y metodologías de desarrollo',
    learningOutcome: 'RAP 02 · Implementar lógica algorítmica mediante estructuras condicionales, ciclos repetitivos y manejo de excepciones en JavaScript',
    status: 'published',
    description:
      'Aprende a controlar el flujo de ejecución en JavaScript mediante explicaciones visuales con diagramas de flujo ilustrados, estructuras condicionales (if/else, switch, ternario), bucles (for, while, do...while, for...of), captura de errores (try/catch) y ejercicios resueltos paso a paso.',
    estimatedHours: 20,
    updatedAt: '2026-11-24',
    lessons: [
      {
        id: 'les-js-201',
        order: 1,
        title: 'Estructuras Condicionales: if / else if / else, Ternario y switch',
        durationMinutes: 50,
        summary: 'Visualiza con diagramas de flujo cómo se ramifica la lógica de negocio y estudia ejercicios resueltos de clasificación y validación.',
        linkedNodeIds: ['node-js-201'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_201,
        quiz: [
          {
            id: 'q-js201-1',
            question: 'En una estructura switch(rol), ¿qué sucede si olvidas colocar la instrucción break o return al final de un bloque case coincidente?',
            options: [
              'Ocurre "fall-through": JavaScript continúa ejecutando las instrucciones del siguiente case hacia abajo',
              'El navegador cierra la pestaña automáticamente',
              'El switch se convierte en un ciclo infinito',
            ],
            correctIndex: 0,
            explanation: 'Sin break ni return, la ejecución cae (fall-through) hacia los casos subsiguientes hasta encontrar un break o terminar el switch.',
          },
        ],
      },
      {
        id: 'les-js-202',
        order: 2,
        title: 'Estructuras Repetitivas: Ciclos for, while, do...while, break y continue',
        durationMinutes: 55,
        summary: 'Domina las 4 etapas de todo ciclo repetitivo con esquemas gráficos, contadores, acumuladores y ejercicios resueltos.',
        linkedNodeIds: ['node-js-202'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_202,
        quiz: [
          {
            id: 'q-js202-1',
            question: '¿Cuál es la diferencia exacta entre las instrucciones continue y break dentro de un ciclo for?',
            options: [
              'continue salta únicamente a la siguiente iteración del ciclo, mientras que break detiene y sale del ciclo por completo',
              'Ambas hacen exactamente lo mismo',
              'continue reinicia el computador y break borra el arreglo',
            ],
            correctIndex: 0,
            explanation: 'continue omite el resto del cuerpo en la iteración actual y pasa al incremento (i++); break finaliza el bucle inmediatamente.',
          },
        ],
        activity: {
          id: 'act-js202',
          title: 'Evidencia de Desempeño: Algoritmos de Control de Flujo y Ciclos en JS',
          evidenceCode: 'GA7-220501096-JS2-EV01',
          evidenceType: 'Desempeño',
          instructions:
            'Implementa y documenta 5 algoritmos en JavaScript que combinen condicionales, switch y ciclos for/while siguiendo la guía de ejercicios resueltos.',
          dueDate: '2026-11-30',
          deliverableFormat: 'Repositorio Git con scripts .js ejecutables',
        },
      },
      {
        id: 'les-js-203',
        order: 3,
        title: 'Iteración Moderna (for...of, for...in) y Manejo de Excepciones (try / catch)',
        durationMinutes: 50,
        summary: 'Recorre colecciones de forma declarativa y blinda tus programas frente a errores en tiempo de ejecución con try, catch y finally.',
        linkedNodeIds: ['node-js-203'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_203,
        quiz: [
          {
            id: 'q-js203-1',
            question: '¿Cuándo se ejecuta el bloque finally dentro de una estructura try / catch / finally?',
            options: [
              'Siempre, tanto si el bloque try terminó con éxito como si ocurrió una excepción capturada por catch',
              'Únicamente cuando hay un error de sintaxis',
              'Solo los días lunes',
            ],
            correctIndex: 0,
            explanation: 'El bloque finally está garantizado para ejecutarse siempre al finalizar try/catch, ideal para liberar recursos o cerrar indicadores de carga.',
          },
        ],
      },
    ],
  },
  {
    id: 'ova-js-3',
    code: 'OVA-JS-220501096-03',
    title: 'JavaScript III: Arreglos y Objetos con Gráficos Interactivos y Microanimaciones',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    competence: '220501096 · Desarrollar la solución de software de acuerdo con el diseño y metodologías de desarrollo',
    learningOutcome: 'RAP 03 · Manipular colecciones de datos mediante arreglos, programación funcional (map, filter, reduce) y objetos clave-valor en JavaScript',
    status: 'published',
    description:
      'Explora visualmente cómo funcionan los Arreglos y los Objetos en JavaScript a través de laboratorios gráficos interactivos con microanimaciones en tiempo real, métodos funcionales (.map, .filter, .find, .reduce), desestructuración, operador Spread, JSON y ejercicios aplicados.',
    estimatedHours: 24,
    updatedAt: '2026-11-24',
    lessons: [
      {
        id: 'les-js-301',
        order: 1,
        title: 'Arreglos (Arrays) en JavaScript: Indexación, Mutación y Laboratorio Animado',
        durationMinutes: 50,
        summary: 'Experimenta en el gráfico interactivo cómo se indexan los arreglos en base 0 y cómo operan push, pop, shift, unshift y reverse.',
        linkedNodeIds: ['node-js-301'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_301,
        quiz: [
          {
            id: 'q-js301-1',
            question: '¿Qué método de un arreglo en JavaScript inserta un nuevo elemento al INICIO (índice 0) desplazando los demás elementos?',
            options: ['.unshift()', '.push()', '.pop()', '.shift()'],
            correctIndex: 0,
            explanation: '.unshift(elemento) inserta al principio del arreglo (índice 0), mientras que .push(elemento) agrega al final.',
          },
        ],
      },
      {
        id: 'les-js-302',
        order: 2,
        title: 'Métodos Funcionales de Arreglos: map, filter, find y reduce',
        durationMinutes: 60,
        summary: 'Domina la transformación inmutable de colecciones de datos utilizando el simulador visual animado de pipelines funcionales.',
        linkedNodeIds: ['node-js-302'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_302,
        quiz: [
          {
            id: 'q-js302-1',
            question: 'Si tienes un arreglo de 10 aprendices y quieres obtener un NUEVO arreglo únicamente con aquellos cuya nota sea >= 70, ¿qué método debes usar?',
            options: ['.filter()', '.map()', '.find()', '.forEach()'],
            correctIndex: 0,
            explanation: '.filter() evalúa una condición booleana sobre cada elemento y retorna un nuevo arreglo solo con los elementos que cumplieron la condición.',
          },
        ],
      },
      {
        id: 'les-js-303',
        order: 3,
        title: 'Objetos en JavaScript: Propiedades Clave-Valor, Desestructuración y JSON',
        durationMinutes: 55,
        summary: 'Modela entidades complejas mediante objetos literales, desestructuración, operador Spread (...) e inspección interactiva clave-valor.',
        linkedNodeIds: ['node-js-303'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_303,
        quiz: [
          {
            id: 'q-js303-1',
            question: '¿Qué retorna el método estático Object.keys(aprendiz) al aplicarlo sobre un objeto literal en JavaScript?',
            options: [
              'Un arreglo de strings con los nombres de todas las propiedades (claves) propias enumerables del objeto',
              'Un único número con la cantidad de letras del objeto',
              'Borra todas las claves del objeto',
            ],
            correctIndex: 0,
            explanation: 'Object.keys(obj) devuelve un Array con las claves del objeto, permitiendo iterarlas o transformarlas con métodos de arreglos.',
          },
        ],
        activity: {
          id: 'act-js303',
          title: 'Evidencia de Producto: Gestor de Catálogo con Arreglos de Objetos en JS',
          evidenceCode: 'GA7-220501096-JS3-EV02',
          evidenceType: 'Producto',
          instructions:
            'Construye un módulo en JavaScript que gestione un arreglo de objetos (inserción, filtrado con .filter(), transformación con .map(), cálculo de totales con .reduce() y exportación JSON).',
          dueDate: '2026-12-04',
          deliverableFormat: 'Repositorio GitHub + archivo .js documentado',
        },
      },
    ],
  },
];

export const INITIAL_LEARNERS: Learner[] = [
  {
    id: 'apr-1',
    documentNumber: '1032489120',
    name: 'Valentina Rojas Castellanos',
    email: 'vrojas287@soy.sena.edu.co',
    phone: '573142894011',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    progressByOva: {
      'ova-js-1': {
        ovaId: 'ova-js-1',
        completedLessonIds: ['les-js-101', 'les-js-102'],
        quizScores: { 'les-js-101': 100, 'les-js-102': 100 },
        submissions: {
          'les-js-101': {
            lessonId: 'les-js-101',
            activityId: 'act-js101',
            status: 'submitted',
            submittedAt: '2026-11-24',
            deliveryLinkOrNote: 'https://github.com/vrojas-sena/js-fundamentos-sena',
            score: 98,
          },
        },
        lastAccessedAt: '2026-11-24 14:30',
      },
    },
  },
  {
    id: 'apr-2',
    documentNumber: '1019045782',
    name: 'Mateo Hernández Quiroga',
    email: 'mhernandez19@soy.sena.edu.co',
    phone: '573108451290',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    progressByOva: {},
  },
  {
    id: 'apr-3',
    documentNumber: '1000784319',
    name: 'Laura Sofía Pineda Gómez',
    email: 'lspineda@soy.sena.edu.co',
    phone: '573214908821',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    progressByOva: {},
  },
];

export const INITIAL_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'tpl-wa-upcoming',
    name: 'Recordatorio Preventivo WhatsApp (Evidencia JavaScript Próxima)',
    channel: 'whatsapp',
    urgency: 'upcoming',
    subject: 'Recordatorio de Evidencia JavaScript — Ficha {{ficha}}',
    bodyTemplate:
      'Hola {{aprendiz}}, cordial saludo desde formación SENA (Ficha {{ficha}}). Te recuerdo que la evidencia "{{evidencia}}" del OVA "{{ova}}" tiene fecha límite de entrega el {{fecha_limite}}. ¡Muchos éxitos con tus ejercicios de JavaScript!',
  },
  {
    id: 'tpl-wa-overdue',
    name: 'Alerta Urgente WhatsApp (Plan de Mejoramiento / Evidencia Vencida)',
    channel: 'whatsapp',
    urgency: 'overdue',
    subject: 'Evidencia Pendiente de Entrega — Ficha {{ficha}}',
    bodyTemplate:
      'Hola {{aprendiz}} (Ficha {{ficha}}). Notamos que la evidencia "{{evidencia}}" correspondiente al OVA "{{ova}}" figura pendiente de envío. Por favor registra tu entrega en el portal.',
  },
  {
    id: 'tpl-mail-formal',
    name: 'Notificación Institucional por Correo (@soy.sena.edu.co)',
    channel: 'email',
    urgency: 'upcoming',
    subject: '[SENA Ficha {{ficha}}] Recordatorio de Entrega: {{evidencia}}',
    bodyTemplate: `Estimado(a) aprendiz {{aprendiz}},

Te recordamos el compromiso académico correspondiente al Objeto Virtual de Aprendizaje "{{ova}}":
• Ficha: {{ficha}}
• Evidencia: {{evidencia}}
• Fecha límite: {{fecha_limite}}

Cordialmente,
Instructor SENA`,
  },
];

export const INITIAL_SENT_REMINDERS: SentReminderLog[] = [
  {
    id: 'log-1',
    learnerId: 'apr-2',
    learnerName: 'Mateo Hernández Quiroga',
    fichaCode: '2874512',
    ovaTitle: 'JavaScript I: Generalidades, Sintaxis, Tipos de Variables y Tipos de Datos',
    activityTitle: 'Taller Práctico Tema 1: Depuración de Sintaxis y Expresiones en JS',
    channel: 'whatsapp',
    sentAt: '2026-11-24 09:15',
    messagePreview:
      'Hola Mateo Hernández Quiroga, te recuerdo que la evidencia GA7-220501096-JS1-EV01 vence el 2026-11-28...',
  },
];
