import { LessonBlock } from '../types/ova';

// ============================================================================
// OVA 1 · TÓPICO 1 (les-js-101): GENERALIDADES, SINTAXIS, EXPRESIONES Y MODO ESTRICTO
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_101: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js101-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Case-Sensitivity y console.log',
    title: 'Corrección de Sensibilidad a Mayúsculas en Identificadores',
    content:
      'El siguiente snippet contiene dos errores de sensibilidad a mayúsculas (*case-sensitive*): usa `NombreAprendiz` en lugar de `nombreAprendiz` e invoca `Console.log`. Corrígelo en el editor y pulsa **Ejecutar Código**.',
    relevanceComment:
      'En JavaScript el objeto global de consola se escribe siempre en minúscula: console.log(...).',
    exerciseStarterCode: `// Corrige los 2 errores de mayúsculas/minúsculas y ejecuta:
const nombreAprendiz = 'Valentina Rojas';
// Reemplaza la siguiente línea para que imprima nombreAprendiz sin error:
console.log(nombreAprendiz);`,
    exerciseSolution: `const nombreAprendiz = 'Valentina Rojas';
console.log('Aprendiz registrada:', nombreAprendiz);`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Reglas de Identificadores Léxicos',
    title: 'Renombramiento de Identificadores Ilegales a camelCase',
    content:
      'En JavaScript un identificador no puede empezar por número (`1nota`) ni contener guiones medios (`nota-final`). Declara dos constantes válidas `primeraNota = 85` y `notaFinal = 95` e imprime su promedio.',
    relevanceComment:
      'Usa siempre la convención camelCase para variables y constantes de dominio.',
    exerciseStarterCode: `// Declara primeraNota (85) y notaFinal (95) en camelCase e imprime su promedio:
const primeraNota = 85;
const notaFinal = 95;
// Calcula e imprime el promedio aquí:
console.log((primeraNota + notaFinal) / 2);`,
    exerciseSolution: `const primeraNota = 85;
const notaFinal = 95;
const promedio = (primeraNota + notaFinal) / 2;
console.log('Promedio calculado:', promedio); // 90`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Expresiones Aritméticas y Precedencia',
    title: 'Paréntesis para Corregir Precedencia Aritmética',
    content:
      'Sin paréntesis, la expresión `10 + 20 * 3` evalúa primero `20 * 3 = 60` y luego suma `10` (`70`). Modifica la expresión en el snippet agregando paréntesis para que sume primero `10 + 20` y luego multiplique por `3` (`90`).',
    relevanceComment:
      'El operador de agrupación ( ) tiene la precedencia más alta en la gramática de ECMAScript.',
    exerciseStarterCode: `// Agrega paréntesis para que el resultado sea 90 en lugar de 70:
const resultado = (10 + 20) * 3;
console.log('Resultado:', resultado);`,
    exerciseSolution: `const resultado = (10 + 20) * 3;
console.log('Resultado con agrupación:', resultado); // 90`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Template Literals (Backticks)',
    title: 'Interpolación Rápida con Template Literals',
    content:
      'Dadas las constantes `ficha = 2874512` y `programa = "ADSO"`, utiliza *Template Literals* (comillas invertidas `` `...` `` y `${...}`) para imprimir exactamente: `"Ficha 2874512 - Programa ADSO"`.',
    relevanceComment:
      'Dentro de ${...} puedes interpolar cualquier variable o expresión sin usar el signo +.',
    exerciseStarterCode: `const ficha = 2874512;
const programa = 'ADSO';

// Completa el Template Literal y ejecuta:
const mensaje = \`Ficha \${ficha} - Programa \${programa}\`;
console.log(mensaje);`,
    exerciseSolution: `const ficha = 2874512;
const programa = 'ADSO';
const mensaje = \`Ficha \${ficha} - Programa \${programa}\`;
console.log(mensaje); // "Ficha 2874512 - Programa ADSO"`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Operador Módulo (%) en Expresiones',
    title: 'Verificación de Múltiplo con el Operador Resto (%)',
    content:
      'Escribe una expresión booleana que verifique si `horasCurso = 144` es divisible exactamente en bloques de `48` horas (`horasCurso % 48 === 0`) e imprime el resultado en consola.',
    relevanceComment:
      'El operador % retorna el residuo de la división entera; si es 0, la división es exacta.',
    exerciseStarterCode: `const horasCurso = 144;
// Verifica si horasCurso es múltiplo exacto de 48:
const esMultiploExacto = horasCurso % 48 === 0;
console.log('¿Es múltiplo de 48?:', esMultiploExacto);`,
    exerciseSolution: `const horasCurso = 144;
const esMultiploExacto = horasCurso % 48 === 0;
console.log('¿Es múltiplo de 48?:', esMultiploExacto); // true (144 / 48 = 3)`,
    sourceNodeId: 'node-js-101',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js101-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Auditoría Léxica y Modo Estricto',
    title: 'Desarrollo 1: Refactorización de Bloque con 4 Errores Léxicos',
    content:
      'En el snippet tienes un bloque comentado con 4 errores léxicos (`const 2trimestre`, `const horas-semana`, `const class`, y falta de declaración en modo estricto). Desarrolla una versión 100% válida en `camelCase` que calcule `totalHoras = horasSemana * semanasTrimestre` e imprima el resumen.',
    relevanceComment:
      'Recuerda que "class" es una palabra reservada de ES6; cámbiala por nombreCurso o moduloFormativo.',
    exerciseStarterCode: `// Código erróneo original:
// const 2trimestre = "Ejecución";
// const horas-semana = 20;
// semanasTrimestre = 12;

// Desarrolla aquí la versión corregida y ejecuta:
const segundoTrimestre = 'Ejecución';
const horasSemana = 20;
const semanasTrimestre = 12;
const totalHoras = horasSemana * semanasTrimestre;
console.log(\`Trimestre \${segundoTrimestre}: \${totalHoras} horas\`);`,
    exerciseSolution: `const segundoTrimestre = 'Ejecución';
const horasSemana = 20;
const semanasTrimestre = 12;
const totalHoras = horasSemana * semanasTrimestre;

console.log(\`Trimestre: \${segundoTrimestre} | Total Horas: \${totalHoras}h\`);`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Expresiones Ponderadas',
    title: 'Desarrollo 2: Calculadora de Nota Definitiva Ponderada SENA',
    content:
      'Desarrolla una función `calcularNotaDefinitiva(conocimiento, desempeno, producto)` donde:\n• `conocimiento` vale el `30%` (`0.30`)\n• `desempeno` vale el `35%` (`0.35`)\n• `producto` vale el `35%` (`0.35`)\nRetorna el resultado redondeado a 2 decimales con `Number(total.toFixed(2))` y pruébala en el snippet.',
    relevanceComment:
      'Multiplica cada nota por su peso decimal y suma los tres productos.',
    exerciseStarterCode: `function calcularNotaDefinitiva(conocimiento, desempeno, producto) {
  // Desarrolla la expresión ponderada aquí:
  const total = conocimiento * 0.30 + desempeno * 0.35 + producto * 0.35;
  return Number(total.toFixed(2));
}

console.log('Definitiva Aprendiz 1:', calcularNotaDefinitiva(85, 78, 92));
console.log('Definitiva Aprendiz 2:', calcularNotaDefinitiva(70, 75, 80));`,
    exerciseSolution: `function calcularNotaDefinitiva(conocimiento, desempeno, producto) {
  const total = conocimiento * 0.3 + desempeno * 0.35 + producto * 0.35;
  return Number(total.toFixed(2));
}

console.log('Definitiva Aprendiz 1:', calcularNotaDefinitiva(85, 78, 92)); // 85
console.log('Definitiva Aprendiz 2:', calcularNotaDefinitiva(70, 75, 80)); // 75.25`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Fórmulas Matemáticas y Conversión',
    title: 'Desarrollo 3: Conversor Bidireccional de Temperaturas (°C a °F y K)',
    content:
      'Desarrolla una función `convertirTemperatura(celsius)` que a partir de los grados Celsius calcule mediante expresiones aritméticas:\n• `fahrenheit = (celsius * 9) / 5 + 32`\n• `kelvin = celsius + 273.15`\nRetorna un string formateado con *Template Literals*.',
    relevanceComment:
      'Verifica con celsius = 25 que obtengas 77 °F y 298.15 K.',
    exerciseStarterCode: `function convertirTemperatura(celsius) {
  // Desarrolla las expresiones para fahrenheit y kelvin:
  const fahrenheit = (celsius * 9) / 5 + 32;
  const kelvin = celsius + 273.15;
  return \`\${celsius}°C equivalen a \${fahrenheit}°F y \${kelvin}K\`;
}

console.log(convertirTemperatura(25));
console.log(convertirTemperatura(0));`,
    exerciseSolution: `function convertirTemperatura(celsius) {
  const fahrenheit = (celsius * 9) / 5 + 32;
  const kelvin = Number((celsius + 273.15).toFixed(2));
  return \`\${celsius}°C equivalen a \${fahrenheit}°F y \${kelvin}K\`;
}

console.log(convertirTemperatura(25)); // "25°C equivalen a 77°F y 298.15K"
console.log(convertirTemperatura(0));  // "0°C equivalen a 32°F y 273.15K"`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Prevención del Fallo de ASI',
    title: 'Desarrollo 4: Corrección de Colisión por Falta de Punto y Coma (ASI)',
    content:
      'Cuando una sentencia de asignación no lleva `;` y la línea siguiente empieza por `(` o `[`, el parser las concatena produciendo un error. Corrige la función `procesarEncabezado()` colocando puntos y comas explícitos para que ejecute tanto la declaración como la expresión IIFE / arreglo.',
    relevanceComment:
      'Terminar cada sentencia con ; elimina por completo la ambigüedad sintáctica del parser.',
    exerciseStarterCode: `function procesarEncabezado() {
  const titulo = 'Reporte SENA';
  ['Módulo 1', 'Módulo 2', 'Módulo 3'].forEach((mod) => {
    console.log(\`[\${titulo}] -> \${mod}\`);
  });
}

procesarEncabezado();`,
    exerciseSolution: `function procesarEncabezado() {
  const titulo = 'Reporte SENA';
  ['Módulo 1', 'Módulo 2', 'Módulo 3'].forEach((mod) => {
    console.log(\`[\${titulo}] -> \${mod}\`);
  });
}

procesarEncabezado();`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Aritmética Modular y División Entera',
    title: 'Desarrollo 5: Desglose de Segundos en Horas, Minutos y Segundos',
    content:
      'Desarrolla una función `formatearDuracion(totalSegundos)` que convierta una cantidad de segundos (ej. `7384`) en horas, minutos y segundos restantes utilizando `Math.floor()` y el operador módulo (`%`).',
    relevanceComment:
      'horas = Math.floor(s / 3600); minutos = Math.floor((s % 3600) / 60); segundos = s % 60;',
    exerciseStarterCode: `function formatearDuracion(totalSegundos) {
  // Desarrolla el cálculo de horas, minutos y segundos:
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  return \`\${horas}h : \${minutos}m : \${segundos}s\`;
}

console.log('7384 segundos ->', formatearDuracion(7384));
console.log('3665 segundos ->', formatearDuracion(3665));`,
    exerciseSolution: `function formatearDuracion(totalSegundos) {
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  return \`\${horas}h : \${minutos}m : \${segundos}s\`;
}

console.log('7384 segundos ->', formatearDuracion(7384)); // "2h : 3m : 4s"
console.log('3665 segundos ->', formatearDuracion(3665)); // "1h : 1m : 5s"`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Expresiones Financieras con Constantes',
    title: 'Desarrollo 6: Liquidador de Factura con Descuento e IVA (19%)',
    content:
      'Desarrolla una función `liquidarFactura(subtotal, porcentajeDescuento)` que:\n1. Calcule el `descuento = subtotal * (porcentajeDescuento / 100)`.\n2. Calcule la `baseGravable = subtotal - descuento`.\n3. Calcule el `iva = baseGravable * 0.19` y el `total = baseGravable + iva`.\nRetorna un objeto `{ subtotal, descuento, baseGravable, iva, total }`.',
    relevanceComment:
      'El IVA se calcula siempre sobre la base gravable una vez descontado el descuento comercial.',
    exerciseStarterCode: `const TASA_IVA = 0.19;

function liquidarFactura(subtotal, porcentajeDescuento) {
  const descuento = subtotal * (porcentajeDescuento / 100);
  const baseGravable = subtotal - descuento;
  const iva = Math.round(baseGravable * TASA_IVA);
  const total = baseGravable + iva;

  return { subtotal, descuento, baseGravable, iva, total };
}

console.log(liquidarFactura(200000, 10));`,
    exerciseSolution: `const TASA_IVA = 0.19;

function liquidarFactura(subtotal, porcentajeDescuento) {
  const descuento = subtotal * (porcentajeDescuento / 100);
  const baseGravable = subtotal - descuento;
  const iva = Math.round(baseGravable * TASA_IVA);
  const total = baseGravable + iva;

  return { subtotal, descuento, baseGravable, iva, total };
}

console.log(liquidarFactura(200000, 10));
// -> { subtotal: 200000, descuento: 20000, baseGravable: 180000, iva: 34200, total: 214200 }`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Expresiones de Cadenas y Normalización',
    title: 'Desarrollo 7: Generador Automático de Correo Institucional SENA',
    content:
      'Desarrolla una función `generarCorreoInstitucional(primerNombre, primerApellido, ultimos3Documento)` que construya un correo en minúsculas con el formato: `<primeraLetraNombre><primerApellido><ultimos3Documento>@soy.sena.edu.co`.\nEjemplo: `("Valentina", "Rojas", "120")` → `"vrojas120@soy.sena.edu.co"`.',
    relevanceComment:
      'Usa primerNombre.trim().charAt(0).toLowerCase() y primerApellido.trim().toLowerCase().',
    exerciseStarterCode: `function generarCorreoInstitucional(primerNombre, primerApellido, ultimos3Documento) {
  const inicial = primerNombre.trim().charAt(0).toLowerCase();
  const apellido = primerApellido.trim().toLowerCase();
  return \`\${inicial}\${apellido}\${ultimos3Documento}@soy.sena.edu.co\`;
}

console.log(generarCorreoInstitucional('Valentina', 'Rojas', '120'));
console.log(generarCorreoInstitucional('Mateo', 'Hernandez', '782'));`,
    exerciseSolution: `function generarCorreoInstitucional(primerNombre, primerApellido, ultimos3Documento) {
  const inicial = primerNombre.trim().charAt(0).toLowerCase();
  const apellido = primerApellido.trim().toLowerCase();
  return \`\${inicial}\${apellido}\${ultimos3Documento}@soy.sena.edu.co\`;
}

console.log(generarCorreoInstitucional('Valentina', 'Rojas', '120')); // "vrojas120@soy.sena.edu.co"
console.log(generarCorreoInstitucional('Mateo', 'Hernandez', '782')); // "mhernandez782@soy.sena.edu.co"`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Expresiones Relacionales y Porcentajes',
    title: 'Desarrollo 8: Evaluador de Asistencia Mínima Reglamentaria (85%)',
    content:
      'Desarrolla una función `verificarAsistencia(horasAsistidas, horasProgramadas)` que calcule el porcentaje de asistencia y retorne una tarjeta indicando el porcentaje (con 1 decimal) y si cumple o no el mínimo del `85%`.',
    relevanceComment:
      'Combina una expresión relacional (porcentaje >= 85) con un operador ternario dentro del Template Literal.',
    exerciseStarterCode: `function verificarAsistencia(horasAsistidas, horasProgramadas) {
  const porcentaje = (horasAsistidas / horasProgramadas) * 100;
  const estado = porcentaje >= 85 ? 'CUMPLE REGLAMENTO' : 'ALERTA DE INASISTENCIA';
  return \`Asistencia: \${porcentaje.toFixed(1)}% -> \${estado}\`;
}

console.log(verificarAsistencia(42, 48));
console.log(verificarAsistencia(35, 48));`,
    exerciseSolution: `function verificarAsistencia(horasAsistidas, horasProgramadas) {
  const porcentaje = (horasAsistidas / horasProgramadas) * 100;
  const estado = porcentaje >= 85 ? 'CUMPLE REGLAMENTO' : 'ALERTA DE INASISTENCIA';
  return \`Asistencia: \${porcentaje.toFixed(1)}% -> \${estado}\`;
}

console.log(verificarAsistencia(42, 48)); // "Asistencia: 87.5% -> CUMPLE REGLAMENTO"
console.log(verificarAsistencia(35, 48)); // "Asistencia: 72.9% -> ALERTA DE INASISTENCIA"`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Expresiones Geométricas en el Plano',
    title: 'Desarrollo 9: Cálculo de Distancia Euclidiana entre Dos Nodos del Canvas',
    content:
      'En el Lienzo en Grafo (Canvas) de NexoOVA, cada nodo tiene coordenadas `(x, y)`. Desarrolla una función `calcularDistanciaNodos(x1, y1, x2, y2)` que aplique el Teorema de Pitágoras (`Math.hypot(x2 - x1, y2 - y1)` o `Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)`) y retorne la distancia redondeada a 2 decimales.',
    relevanceComment:
      'El operador de exponenciación ** de ES2016 permite elevar al cuadrado escribiendo (dx ** 2).',
    exerciseStarterCode: `function calcularDistanciaNodos(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distancia = Math.sqrt(dx ** 2 + dy ** 2);
  return Number(distancia.toFixed(2));
}

console.log('Distancia entre (80, 130) y (415, 480):', calcularDistanciaNodos(80, 130, 415, 480));`,
    exerciseSolution: `function calcularDistanciaNodos(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distancia = Math.sqrt(dx ** 2 + dy ** 2);
  return Number(distancia.toFixed(2));
}

console.log('Distancia entre (80, 130) y (415, 480):', calcularDistanciaNodos(80, 130, 415, 480)); // 484.48`,
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'ex-js101-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Template Literals Multilínea y Expresiones Anidadas',
    title: 'Desarrollo 10: Generador de Acta Ejecutiva de Certificación SENA',
    content:
      'Desarrolla una función `generarActaCertificacion(nombre, documento, ficha, notaFinal, horasCursadas)` que retorne un bloque multilínea con el nombre en mayúsculas, el código único de acta (`ACTA-${ficha}-${documento.slice(-4)}`) y la decisión final (`"APROBADO PARA CERTIFICACIÓN"` si `notaFinal >= 70 && horasCursadas >= 120`, o `"PENDIENTE"` en caso contrario).',
    relevanceComment:
      'Usa documento.slice(-4) para extraer los últimos 4 dígitos del documento de identidad.',
    exerciseStarterCode: `function generarActaCertificacion(nombre, documento, ficha, notaFinal, horasCursadas) {
  const codigoActa = \`ACTA-\${ficha}-\${String(documento).slice(-4)}\`;
  const apto = notaFinal >= 70 && horasCursadas >= 120;

  return \`[\${codigoActa}]
Aprendiz : \${nombre.toUpperCase()}
Puntaje  : \${notaFinal}/100 | Horas: \${horasCursadas}h
Concepto : \${apto ? 'APROBADO PARA CERTIFICACIÓN' : 'PENDIENTE DE REQUISITOS'}\`;
}

console.log(generarActaCertificacion('Valentina Rojas', '1032489120', 2874512, 94, 140));`,
    exerciseSolution: `function generarActaCertificacion(nombre, documento, ficha, notaFinal, horasCursadas) {
  const codigoActa = \`ACTA-\${ficha}-\${String(documento).slice(-4)}\`;
  const apto = notaFinal >= 70 && horasCursadas >= 120;

  return \`[\${codigoActa}]
Aprendiz : \${nombre.toUpperCase()}
Puntaje  : \${notaFinal}/100 | Horas: \${horasCursadas}h
Concepto : \${apto ? 'APROBADO PARA CERTIFICACIÓN' : 'PENDIENTE DE REQUISITOS'}\`;
}

console.log(generarActaCertificacion('Valentina Rojas', '1032489120', 2874512, 94, 140));`,
    sourceNodeId: 'node-js-101',
  },
];

// ============================================================================
// OVA 1 · TÓPICO 2 (les-js-102): VARIABLES (var, let, const), BLOCK SCOPE Y TDZ
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_102: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js102-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'const vs. let en Contadores',
    title: 'Corrección de Reasignación sobre una Constante',
    content:
      'Si declaras un contador con `const intentos = 0;` e intentas hacer `intentos = intentos + 1;`, JavaScript lanza `TypeError: Assignment to constant variable`. Cambia la declaración a `let` en el snippet y verifica su ejecución.',
    relevanceComment:
      'Usa let siempre que el identificador deba cambiar su valor (reasignarse) a lo largo del programa.',
    exerciseStarterCode: `// Cambia const por let para permitir incrementar el contador:
let intentos = 0;
intentos = intentos + 1;
intentos += 1;
console.log('Intentos registrados:', intentos);`,
    exerciseSolution: `let intentos = 0;
intentos = intentos + 1;
intentos += 1;
console.log('Intentos registrados:', intentos); // 2`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Block Scope { }',
    title: 'Aislamiento de Variables en Ámbito de Bloque',
    content:
      'Observa cómo una constante `estado` declarada dentro de un bloque `if { ... }` es independiente de la constante `estado` declarada fuera del bloque (*Variable Shadowing*). Ejecuta el snippet y comprueba ambos valores.',
    relevanceComment:
      'Cada par de llaves { } crea un nuevo entorno léxico aislado para let y const.',
    exerciseStarterCode: `const estado = 'En Formación';
if (true) {
  const estado = 'En Evaluación Trimestral';
  console.log('Dentro del bloque:', estado);
}
console.log('Fuera del bloque:', estado);`,
    exerciseSolution: `const estado = 'En Formación';
if (true) {
  const estado = 'En Evaluación Trimestral';
  console.log('Dentro del bloque:', estado);
}
console.log('Fuera del bloque:', estado);`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Mutación de Propiedades en const',
    title: 'Modificar Propiedad Interna de un Objeto const',
    content:
      'El objeto `const aprendiz = { nombre: "Mateo", aprobado: false };` está declarado con `const`. Modifica su propiedad interna `aprendiz.aprobado = true;` e imprímelo para comprobar que mutar una propiedad no reasigna la referencia.',
    relevanceComment:
      'const protege la referencia de la variable aprendiz, pero sus propiedades internas sí son mutables.',
    exerciseStarterCode: `const aprendiz = { nombre: 'Mateo', aprobado: false };
// Modifica la propiedad aprobado a true y ejecuta:
aprendiz.aprobado = true;
console.log('Objeto mutado válidamente:', aprendiz);`,
    exerciseSolution: `const aprendiz = { nombre: 'Mateo', aprobado: false };
aprendiz.aprobado = true;
console.log('Objeto mutado válidamente:', aprendiz);`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Zona Muerta Temporal (TDZ)',
    title: 'Orden Correcto de Declaración para Evitar la TDZ',
    content:
      'Leer una variable `let` antes de su línea de declaración dispara un `ReferenceError` por la Zona Muerta Temporal (TDZ). Asegura que `bono` se declare antes de calcular `total` y ejecuta el snippet.',
    relevanceComment:
      'Declara e inicializa todas tus variables al comienzo de su bloque léxico.',
    exerciseStarterCode: `const base = 100;
const bono = 25;
const total = base + bono;
console.log('Total sin error TDZ:', total);`,
    exerciseSolution: `const base = 100;
const bono = 25;
const total = base + bono;
console.log('Total sin error TDZ:', total); // 125`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Inmutabilidad con Object.freeze()',
    title: 'Verificación de Objeto Congelado con Object.isFrozen()',
    content:
      'Congela el objeto `const reglas = { notaMinima: 70 };` utilizando `Object.freeze(reglas)` e imprime el resultado de `Object.isFrozen(reglas)`.',
    relevanceComment:
      'Object.freeze() sella las propiedades de primer nivel impidiendo modificaciones, adiciones o eliminaciones.',
    exerciseStarterCode: `const reglas = { notaMinima: 70 };
Object.freeze(reglas);
console.log('¿Está congelado?:', Object.isFrozen(reglas));`,
    exerciseSolution: `const reglas = { notaMinima: 70 };
Object.freeze(reglas);
console.log('¿Está congelado?:', Object.isFrozen(reglas)); // true`,
    sourceNodeId: 'node-js-102',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js102-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Intercambio de Variables (Swap)',
    title: 'Desarrollo 1: Permutación de Dos Variables let con Desestructuración',
    content:
      'Dadas dos variables `let instructorManana = "Carlos"` y `let instructorTarde = "Laura"`, desarrolla el intercambio de sus valores usando `[instructorManana, instructorTarde] = [instructorTarde, instructorManana]` e imprime el estado antes y después.',
    relevanceComment:
      'La desestructuración de arreglos permite permutar variables en una sola línea sin crear variables temporales.',
    exerciseStarterCode: `let instructorManana = 'Carlos';
let instructorTarde = 'Laura';

// Realiza el swap aquí:
[instructorManana, instructorTarde] = [instructorTarde, instructorManana];

console.log({ instructorManana, instructorTarde });`,
    exerciseSolution: `let instructorManana = 'Carlos';
let instructorTarde = 'Laura';

[instructorManana, instructorTarde] = [instructorTarde, instructorManana];
console.log({ instructorManana, instructorTarde });
// -> { instructorManana: "Laura", instructorTarde: "Carlos" }`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Rotación Triple de Variables',
    title: 'Desarrollo 2: Rotación de Turnos entre Tres Ambientes de Formación',
    content:
      'Tienes tres variables `let turnoA = "Ficha-101"`, `let turnoB = "Ficha-202"` y `let turnoC = "Ficha-303"`. Desarrolla una rotación circular donde `turnoA` reciba el valor de `turnoB`, `turnoB` reciba el de `turnoC` y `turnoC` reciba el valor original de `turnoA`.',
    relevanceComment:
      'Puedes guardar primero const tempA = turnoA; o usar [turnoA, turnoB, turnoC] = [turnoB, turnoC, turnoA].',
    exerciseStarterCode: `let turnoA = 'Ficha-101';
let turnoB = 'Ficha-202';
let turnoC = 'Ficha-303';

// Desarrolla la rotación triple:
[turnoA, turnoB, turnoC] = [turnoB, turnoC, turnoA];

console.log({ turnoA, turnoB, turnoC });`,
    exerciseSolution: `let turnoA = 'Ficha-101';
let turnoB = 'Ficha-202';
let turnoC = 'Ficha-303';

[turnoA, turnoB, turnoC] = [turnoB, turnoC, turnoA];
console.log({ turnoA, turnoB, turnoC });
// -> { turnoA: "Ficha-202", turnoB: "Ficha-303", turnoC: "Ficha-101" }`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Eliminación de Fugas de var',
    title: 'Desarrollo 3: Refactorización de Bucle con Fuga de Variable var',
    content:
      'Cuando un ciclo usa `for (var i = 0; i < 3; i++)`, la variable `i` se filtra fuera del ciclo con valor `3`. Desarrolla una función `sumarPrimerosEnteros(limite)` que utilice exclusivamente `let` para el acumulador y el índice del ciclo, verificando que `i` no exista fuera del bloque `for`.',
    relevanceComment:
      'El índice let i solo existe dentro del encabezado y cuerpo del bucle for.',
    exerciseStarterCode: `function sumarPrimerosEnteros(limite) {
  let acumulador = 0;
  for (let i = 1; i <= limite; i++) {
    acumulador += i;
  }
  return acumulador;
}

console.log('Suma del 1 al 10:', sumarPrimerosEnteros(10));`,
    exerciseSolution: `function sumarPrimerosEnteros(limite) {
  let acumulador = 0;
  for (let i = 1; i <= limite; i++) {
    acumulador += i;
  }
  return acumulador;
}

console.log('Suma del 1 al 10:', sumarPrimerosEnteros(10)); // 55`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Closures y Ámbito Léxico con let',
    title: 'Desarrollo 4: Generador de Funciones Multiplicadoras por Bloque',
    content:
      'Desarrolla una función `crearTablaMultiplicadores(base)` que mediante un ciclo `for (let factor = 1; factor <= 5; factor++)` guarde en un arreglo 5 funciones `() => base * factor`. Ejecuta luego cada función del arreglo para comprobar que `let` capturó el `factor` exacto de cada iteración.',
    relevanceComment:
      'Gracias a que let crea un binding nuevo por iteración, cada closure recuerda su propio valor de factor.',
    exerciseStarterCode: `function crearTablaMultiplicadores(base) {
  const funciones = [];
  for (let factor = 1; factor <= 5; factor++) {
    funciones.push(() => base * factor);
  }
  return funciones;
}

const tablaDel7 = crearTablaMultiplicadores(7);
const resultados = tablaDel7.map((fn) => fn());
console.log('Resultados capturados por let:', resultados);`,
    exerciseSolution: `function crearTablaMultiplicadores(base) {
  const funciones = [];
  for (let factor = 1; factor <= 5; factor++) {
    funciones.push(() => base * factor);
  }
  return funciones;
}

const tablaDel7 = crearTablaMultiplicadores(7);
const resultados = tablaDel7.map((fn) => fn());
console.log('Resultados capturados por let:', resultados); // [7, 14, 21, 28, 35]`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Variable Shadowing Controlado',
    title: 'Desarrollo 5: Cálculo de Tarifa con Tasa Global vs. Tasa Local de Bloque',
    content:
      'Declara una constante global `const tasaImpuesto = 0.19;`. Desarrolla una función `calcularPrecioConImpuesto(precio, esZonaFranca)` que, si `esZonaFranca` es `true`, declare dentro del bloque `if` una constante local `const tasaImpuesto = 0.05;` (ocultando la global solo dentro de ese bloque) y retorne el precio con su impuesto respectivo.',
    relevanceComment:
      'El identificador más cercano en la cadena de alcance léxico tiene prioridad sobre los ámbitos externos.',
    exerciseStarterCode: `const tasaImpuesto = 0.19;

function calcularPrecioConImpuesto(precio, esZonaFranca) {
  if (esZonaFranca) {
    const tasaImpuesto = 0.05;
    return precio * (1 + tasaImpuesto);
  }
  return precio * (1 + tasaImpuesto);
}

console.log('Régimen Común (19%):', calcularPrecioConImpuesto(100000, false));
console.log('Zona Franca (5%)   :', calcularPrecioConImpuesto(100000, true));`,
    exerciseSolution: `const tasaImpuesto = 0.19;

function calcularPrecioConImpuesto(precio, esZonaFranca) {
  if (esZonaFranca) {
    const tasaImpuesto = 0.05;
    return precio * (1 + tasaImpuesto);
  }
  return precio * (1 + tasaImpuesto);
}

console.log('Régimen Común (19%):', calcularPrecioConImpuesto(100000, false)); // 119000
console.log('Zona Franca (5%)   :', calcularPrecioConImpuesto(100000, true));  // 105000`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Fábrica de Constantes Inmutables',
    title: 'Desarrollo 6: Constructor de Diccionario de Constantes Congelado',
    content:
      'Desarrolla una función `crearCatalogoRoles()` que retorne un objeto congelado con `Object.freeze({ ADMIN: "ADMINISTRADOR", INSTRUCTOR: "INSTRUCTOR_SENA", APRENDIZ: "APRENDIZ_ADSO" })` y demuestra con un bloque `try / catch` que cualquier intento de sobrescribir `roles.ADMIN` es rechazado.',
    relevanceComment:
      'En modo estricto ("use strict"), escribir sobre una propiedad de un objeto congelado lanza un TypeError.',
    exerciseStarterCode: `function crearCatalogoRoles() {
  return Object.freeze({
    ADMIN: 'ADMINISTRADOR',
    INSTRUCTOR: 'INSTRUCTOR_SENA',
    APRENDIZ: 'APRENDIZ_ADSO',
  });
}

const ROLES = crearCatalogoRoles();
try {
  ROLES.ADMIN = 'INVITADO';
} catch (err) {
  console.log('Protección exitosa:', err.message);
}
console.log('Catálogo intacto:', ROLES);`,
    exerciseSolution: `function crearCatalogoRoles() {
  return Object.freeze({
    ADMIN: 'ADMINISTRADOR',
    INSTRUCTOR: 'INSTRUCTOR_SENA',
    APRENDIZ: 'APRENDIZ_ADSO',
  });
}

const ROLES = crearCatalogoRoles();
try {
  ROLES.ADMIN = 'INVITADO';
} catch (err) {
  console.log('Protección exitosa:', err.message);
}
console.log('Catálogo intacto:', ROLES);`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Acumuladores de Estado con let',
    title: 'Desarrollo 7: Rastreador de Saldo Bancario con Historial de Movimientos',
    content:
      'Desarrolla una función `procesarMovimientosCuenta(saldoInicial, movimientos)` donde `saldoActual` sea una variable `let` que se actualiza con cada movimiento positivo (depósito) o negativo (retiro), mientras que `historial` sea un arreglo `const` al que se agregan los saldos parciales.',
    relevanceComment:
      'Observa la diferencia: saldoActual es un número que se reasigna (let), mientras que historial es un arreglo cuya referencia no cambia (const).',
    exerciseStarterCode: `function procesarMovimientosCuenta(saldoInicial, movimientos) {
  let saldoActual = saldoInicial;
  const historial = [];

  for (const mov of movimientos) {
    saldoActual += mov;
    historial.push(saldoActual);
  }

  return { saldoFinal: saldoActual, historial };
}

console.log(procesarMovimientosCuenta(100000, [50000, -30000, 80000, -20000]));`,
    exerciseSolution: `function procesarMovimientosCuenta(saldoInicial, movimientos) {
  let saldoActual = saldoInicial;
  const historial = [];

  for (const mov of movimientos) {
    saldoActual += mov;
    historial.push(saldoActual);
  }

  return { saldoFinal: saldoActual, historial };
}

console.log(procesarMovimientosCuenta(100000, [50000, -30000, 80000, -20000]));
// -> { saldoFinal: 180000, historial: [150000, 120000, 200000, 180000] }`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Encapsulamiento con Closures y let',
    title: 'Desarrollo 8: Contador Privado Encapsulado mediante Closure Léxico',
    content:
      'Desarrolla una función fábrica `crearContadorTurnos(prefijo, inicio)` que declare internamente `let consecutivo = inicio;` y retorne una función que, cada vez que se invoque, incremente `consecutivo` y devuelva `"${prefijo}-${consecutivo}"`.',
    relevanceComment:
      'La variable let consecutivo vive en el ámbito léxico privado de crearContadorTurnos y no puede ser alterada desde afuera.',
    exerciseStarterCode: `function crearContadorTurnos(prefijo, inicio = 0) {
  let consecutivo = inicio;
  return function siguienteTurno() {
    consecutivo += 1;
    return \`\${prefijo}-\${consecutivo}\`;
  };
}

const generarTurnoCaja = crearContadorTurnos('CAJA', 100);
console.log(generarTurnoCaja());
console.log(generarTurnoCaja());
console.log(generarTurnoCaja());`,
    exerciseSolution: `function crearContadorTurnos(prefijo, inicio = 0) {
  let consecutivo = inicio;
  return function siguienteTurno() {
    consecutivo += 1;
    return \`\${prefijo}-\${consecutivo}\`;
  };
}

const generarTurnoCaja = crearContadorTurnos('CAJA', 100);
console.log(generarTurnoCaja()); // "CAJA-101"
console.log(generarTurnoCaja()); // "CAJA-102"
console.log(generarTurnoCaja()); // "CAJA-103"`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Congelación Profunda Recursiva (Deep Freeze)',
    title: 'Desarrollo 9: Implementación de deepFreeze() para Objetos Anidados',
    content:
      '`Object.freeze(obj)` solo congela el primer nivel de propiedades; si el objeto tiene un sub-objeto anidado, ese sub-objeto aún podría mutarse. Desarrolla una función recursiva `congelarProfundo(objeto)` que congele el objeto principal y todos sus sub-objetos internos.',
    relevanceComment:
      'Recorre Object.values(objeto): si una propiedad es un objeto no nulo y no está congelado, invoca congelarProfundo(valor) recursivamente.',
    exerciseStarterCode: `function congelarProfundo(objeto) {
  Object.freeze(objeto);
  for (const valor of Object.values(objeto)) {
    if (typeof valor === 'object' && valor !== null && !Object.isFrozen(valor)) {
      congelarProfundo(valor);
    }
  }
  return objeto;
}

const fichaSena = congelarProfundo({
  codigo: 2874512,
  sede: { nombre: 'CEET', ciudad: 'Bogotá' },
});

console.log('¿Sub-objeto sede congelado?:', Object.isFrozen(fichaSena.sede));`,
    exerciseSolution: `function congelarProfundo(objeto) {
  Object.freeze(objeto);
  for (const valor of Object.values(objeto)) {
    if (typeof valor === 'object' && valor !== null && !Object.isFrozen(valor)) {
      congelarProfundo(valor);
    }
  }
  return objeto;
}

const fichaSena = congelarProfundo({
  codigo: 2874512,
  sede: { nombre: 'CEET', ciudad: 'Bogotá' },
});

console.log('¿Sub-objeto sede congelado?:', Object.isFrozen(fichaSena.sede)); // true`,
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'ex-js102-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Auditoría ES6+ de Variables',
    title: 'Desarrollo 10: Motor de Estadísticas de Ventas con Ámbito de Bloque Estricto',
    content:
      'Desarrolla una función `analizarVentasMensuales(ventas, metaMinima)` que utilice `const` para todas las referencias fijas y `let` únicamente para los contadores `totalSuperaronMeta` y `sumaVentas`, calculando dentro de cada iteración una constante de bloque `const comision = venta * 0.08`.',
    relevanceComment:
      'Cada variable declarada con const dentro del cuerpo del for se crea fresca en esa iteración y se destruye al terminar la vuelta.',
    exerciseStarterCode: `function analizarVentasMensuales(ventas, metaMinima) {
  const TASA_COMISION = 0.08;
  let sumaVentas = 0;
  let totalComisiones = 0;
  let mesesSobreMeta = 0;

  for (const venta of ventas) {
    const comisionMes = venta * TASA_COMISION;
    sumaVentas += venta;
    totalComisiones += comisionMes;
    if (venta >= metaMinima) {
      mesesSobreMeta += 1;
    }
  }

  return { sumaVentas, totalComisiones, mesesSobreMeta };
}

console.log(analizarVentasMensuales([1200, 900, 1500, 2000], 1100));`,
    exerciseSolution: `function analizarVentasMensuales(ventas, metaMinima) {
  const TASA_COMISION = 0.08;
  let sumaVentas = 0;
  let totalComisiones = 0;
  let mesesSobreMeta = 0;

  for (const venta of ventas) {
    const comisionMes = venta * TASA_COMISION;
    sumaVentas += venta;
    totalComisiones += comisionMes;
    if (venta >= metaMinima) {
      mesesSobreMeta += 1;
    }
  }

  return { sumaVentas, totalComisiones, mesesSobreMeta };
}

console.log(analizarVentasMensuales([1200, 900, 1500, 2000], 1100));
// -> { sumaVentas: 5600, totalComisiones: 448, mesesSobreMeta: 3 }`,
    sourceNodeId: 'node-js-102',
  },
];

// ============================================================================
// OVA 1 · TÓPICO 3 (les-js-103): TIPOS DE DATOS, TYPEOF, COERCIÓN E IGUALDAD ESTRICTA
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_103: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js103-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Operador typeof y el Caso Especial de null',
    title: 'Comprobación del Bug Histórico typeof null',
    content:
      'Ejecuta el snippet para observar qué devuelve `typeof null` frente a `valor === null`, y completa la condición para detectar `null` de forma exacta.',
    relevanceComment:
      'Nunca uses typeof valor === "null" (no existe); usa siempre igualdad estricta valor === null.',
    exerciseStarterCode: `const tutorAsignado = null;
console.log('typeof null devuelve:', typeof tutorAsignado);
console.log('Detección exacta con ===:', tutorAsignado === null);`,
    exerciseSolution: `const tutorAsignado = null;
console.log('typeof null devuelve:', typeof tutorAsignado); // "object"
console.log('Detección exacta con ===:', tutorAsignado === null); // true`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Conversión Explícita Number()',
    title: 'Evitar Concatenación Accidental al Sumar Strings Numéricos',
    content:
      'El precio `"45000"` viene como `string` y el impuesto `8550` como `number`. Convierte explícitamente el precio con `Number(...)` para que la suma dé `53550` en lugar de `"450008550"`.',
    relevanceComment:
      'El operador + concatena si cualquiera de los dos operandos es un string.',
    exerciseStarterCode: `const precioTexto = '45000';
const impuesto = 8550;

// Usa Number(precioTexto) para realizar la suma matemática real:
const total = Number(precioTexto) + impuesto;
console.log('Total numérico:', total, '| Tipo:', typeof total);`,
    exerciseSolution: `const precioTexto = '45000';
const impuesto = 8550;
const total = Number(precioTexto) + impuesto;
console.log('Total numérico:', total, '| Tipo:', typeof total); // 53550 | "number"`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Igualdad Estricta (===) vs. Igualdad Débil (==)',
    title: 'Comparación Estricta sin Coerción Implícita',
    content:
      'Compara en el snippet el número `0` contra la cadena vacía `""` y contra `"0"` usando `==` y luego usando `===`. Verifica por qué Douglas Crockford exige usar siempre `===`.',
    relevanceComment:
      '=== retorna false inmediatamente si los dos valores pertenecen a tipos distintos.',
    exerciseStarterCode: `console.log('0 == ""  (débil)   :', 0 == '');
console.log('0 === "" (estricta):', 0 === '');
console.log('0 === "0"(estricta):', 0 === '0');`,
    exerciseSolution: `console.log('0 == ""  (débil)   :', 0 == '');   // true (peligroso)
console.log('0 === "" (estricta):', 0 === '');  // false (seguro)
console.log('0 === "0"(estricta):', 0 === '0'); // false (seguro)`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Detección de NaN con Number.isNaN()',
    title: 'Identificación Segura de Operaciones Inválidas (NaN)',
    content:
      'En JavaScript, `NaN === NaN` es `false` (es el único valor del lenguaje que no es igual a sí mismo). Utiliza `Number.isNaN(resultado)` en el snippet para detectar si `Number("abc")` produjo `NaN`.',
    relevanceComment:
      'Usa siempre Number.isNaN(x) en lugar de x === NaN o de la función global antigua isNaN(x).',
    exerciseStarterCode: `const conversionFallida = Number('abc');
console.log('¿NaN === NaN?:', conversionFallida === conversionFallida);
console.log('¿Es NaN con Number.isNaN()?:', Number.isNaN(conversionFallida));`,
    exerciseSolution: `const conversionFallida = Number('abc');
console.log('¿NaN === NaN?:', conversionFallida === conversionFallida); // false
console.log('¿Es NaN con Number.isNaN()?:', Number.isNaN(conversionFallida)); // true`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Enteros Gigantes con BigInt',
    title: 'Operación Exacta más allá de Number.MAX_SAFE_INTEGER con BigInt',
    content:
      'El mayor entero seguro en `number` es `9007199254740991`. Agrega el sufijo `n` para operar con `BigInt` y sumar `9007199254740991n + 10n` sin pérdida de precisión.',
    relevanceComment:
      'Los valores BigInt se escriben agregando la letra n al final del literal entero.',
    exerciseStarterCode: `const limiteNumber = 9007199254740991n;
const sumaExactaBigInt = limiteNumber + 10n;
console.log('Resultado BigInt:', sumaExactaBigInt.toString(), '| Tipo:', typeof sumaExactaBigInt);`,
    exerciseSolution: `const limiteNumber = 9007199254740991n;
const sumaExactaBigInt = limiteNumber + 10n;
console.log('Resultado BigInt:', sumaExactaBigInt.toString(), '| Tipo:', typeof sumaExactaBigInt);`,
    sourceNodeId: 'node-js-103',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js103-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Inspector Universal de Tipos',
    title: 'Desarrollo 1: Función obtenerTipoReal() para los 8 Tipos y Casos Especiales',
    content:
      'Desarrolla una función `obtenerTipoReal(valor)` que distinga con precisión entre `"null"`, `"array"`, `"nan"`, `"date"` (`valor instanceof Date`) y el resto de tipos retornados por `typeof`. Pruébala con 6 valores distintos en el snippet.',
    relevanceComment:
      'Verifica primero null, Array.isArray, instanceof Date y Number.isNaN antes de devolver typeof valor.',
    exerciseStarterCode: `function obtenerTipoReal(valor) {
  if (valor === null) return 'null';
  if (Array.isArray(valor)) return 'array';
  if (valor instanceof Date) return 'date';
  if (Number.isNaN(valor)) return 'nan';
  return typeof valor;
}

console.log('null      ->', obtenerTipoReal(null));
console.log('[1, 2]    ->', obtenerTipoReal([1, 2]));
console.log('new Date()->', obtenerTipoReal(new Date()));
console.log('0 / 0     ->', obtenerTipoReal(0 / 0));
console.log('42n       ->', obtenerTipoReal(42n));`,
    exerciseSolution: `function obtenerTipoReal(valor) {
  if (valor === null) return 'null';
  if (Array.isArray(valor)) return 'array';
  if (valor instanceof Date) return 'date';
  if (Number.isNaN(valor)) return 'nan';
  return typeof valor;
}

console.log('null      ->', obtenerTipoReal(null));       // "null"
console.log('[1, 2]    ->', obtenerTipoReal([1, 2]));     // "array"
console.log('new Date()->', obtenerTipoReal(new Date())); // "date"
console.log('0 / 0     ->', obtenerTipoReal(0 / 0));      // "nan"
console.log('42n       ->', obtenerTipoReal(42n));        // "bigint"`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Conversión Segura de Strings de Formulario',
    title: 'Desarrollo 2: Sumador Blindado de Cantidades de Inventario',
    content:
      'Desarrolla una función `sumarCantidadesInventario(stockActualStr, ingresoStr)` que limpie espacios con `.trim()`, convierta ambos a `Number`, verifique con `Number.isInteger()` que sean enteros no negativos y retorne la suma o un mensaje de error.',
    relevanceComment:
      'Number.isInteger(n) devuelve true únicamente si n es un número finito sin parte decimal (y devuelve false para NaN).',
    exerciseStarterCode: `function sumarCantidadesInventario(stockActualStr, ingresoStr) {
  const s1 = String(stockActualStr).trim();
  const s2 = String(ingresoStr).trim();
  if (!s1 || !s2) return 'Error: Campos vacíos';

  const n1 = Number(s1);
  const n2 = Number(s2);
  if (!Number.isInteger(n1) || !Number.isInteger(n2) || n1 < 0 || n2 < 0) {
    return 'Error: Las cantidades deben ser enteros positivos';
  }
  return n1 + n2;
}

console.log('Suma válida :', sumarCantidadesInventario(' 40 ', '15'));
console.log('Suma inválida:', sumarCantidadesInventario('40.5', 'abc'));`,
    exerciseSolution: `function sumarCantidadesInventario(stockActualStr, ingresoStr) {
  const s1 = String(stockActualStr).trim();
  const s2 = String(ingresoStr).trim();
  if (!s1 || !s2) return 'Error: Campos vacíos';

  const n1 = Number(s1);
  const n2 = Number(s2);
  if (!Number.isInteger(n1) || !Number.isInteger(n2) || n1 < 0 || n2 < 0) {
    return 'Error: Las cantidades deben ser enteros positivos';
  }
  return n1 + n2;
}

console.log('Suma válida :', sumarCantidadesInventario(' 40 ', '15'));   // 55
console.log('Suma inválida:', sumarCantidadesInventario('40.5', 'abc')); // "Error..."`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Punto Flotante IEEE 754 y Number.EPSILON',
    title: 'Desarrollo 3: Comparador de Precisión Decimal con Tolerancia EPSILON',
    content:
      'Desarrolla una función `sonDecimalesEquivalentes(a, b)` que determine si dos números de punto flotante son matemáticamente equivalentes verificando `Math.abs(a - b) < Number.EPSILON`. Compárala con `(0.1 + 0.2) === 0.3`.',
    relevanceComment:
      'Number.EPSILON (aprox. 2.22e-16) representa la diferencia mínima representable entre 1 y el siguiente flotante en IEEE 754.',
    exerciseStarterCode: `function sonDecimalesEquivalentes(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log('Con === directo      :', 0.1 + 0.2 === 0.3);
console.log('Con Number.EPSILON   :', sonDecimalesEquivalentes(0.1 + 0.2, 0.3));`,
    exerciseSolution: `function sonDecimalesEquivalentes(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log('Con === directo      :', 0.1 + 0.2 === 0.3); // false
console.log('Con Number.EPSILON   :', sonDecimalesEquivalentes(0.1 + 0.2, 0.3)); // true`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Valores Truthy y Falsy',
    title: 'Desarrollo 4: Limpiador de Valores Falsy Excepto el Número Cero (0)',
    content:
      'En bases de datos académicas, los valores `null`, `undefined`, `""` y `NaN` representan datos faltantes, pero el número `0` es una calificación real que **no debe borrarse**.\nDesarrolla una función `filtrarValoresValidos(arreglo)` que conserve todos los valores *truthy* **y además conserve el número `0`**. ',
    relevanceComment:
      'La condición para conservar un elemento es: Boolean(item) === true || item === 0.',
    exerciseStarterCode: `function filtrarValoresValidos(arreglo) {
  const limpios = [];
  for (const item of arreglo) {
    if (Boolean(item) || item === 0) {
      limpios.push(item);
    }
  }
  return limpios;
}

console.log(filtrarValoresValidos([95, 0, null, 'Aprobado', '', undefined, NaN, false, 70]));`,
    exerciseSolution: `function filtrarValoresValidos(arreglo) {
  const limpios = [];
  for (const item of arreglo) {
    if (Boolean(item) || item === 0) {
      limpios.push(item);
    }
  }
  return limpios;
}

console.log(filtrarValoresValidos([95, 0, null, 'Aprobado', '', undefined, NaN, false, 70]));
// -> [95, 0, "Aprobado", 70]`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Parser Booleano Explícito',
    title: 'Desarrollo 5: Conversor de Cadenas de Configuración ("true" / "false") a Boolean Real',
    content:
      '¡Cuidado! En JavaScript `Boolean("false")` devuelve `true` porque `"false"` es una cadena de texto no vacía. Desarrolla una función `parsearBooleanoConfig(valor)` que convierta correctamente `"true"`, `"1"`, `"si"`, `1` y `true` en `true`, y `"false"`, `"0"`, `"no"`, `0` y `false` en `false`.',
    relevanceComment:
      'Normaliza el valor con String(valor).trim().toLowerCase() y compáralo contra las opciones afirmativas.',
    exerciseStarterCode: `function parsearBooleanoConfig(valor) {
  const normalizado = String(valor).trim().toLowerCase();
  return normalizado === 'true' || normalizado === '1' || normalizado === 'si' || normalizado === 'sí';
}

console.log('Boolean("false") nativo (trampa):', Boolean('false'));
console.log('parsearBooleanoConfig("false")  :', parsearBooleanoConfig('false'));
console.log('parsearBooleanoConfig("TRUE")   :', parsearBooleanoConfig('TRUE'));`,
    exerciseSolution: `function parsearBooleanoConfig(valor) {
  const normalizado = String(valor).trim().toLowerCase();
  return normalizado === 'true' || normalizado === '1' || normalizado === 'si' || normalizado === 'sí';
}

console.log('Boolean("false") nativo (trampa):', Boolean('false')); // true
console.log('parsearBooleanoConfig("false")  :', parsearBooleanoConfig('false')); // false
console.log('parsearBooleanoConfig("TRUE")   :', parsearBooleanoConfig('TRUE'));  // true`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Inmutabilidad de Primitivos vs. Referencias',
    title: 'Desarrollo 6: Demostración de Copia por Valor vs. Clonación de Referencia en el Heap',
    content:
      'Desarrolla una función `clonarFichaSinEfectoColateral(fichaOriginal, nuevoCodigo)` que reciba un objeto `{ codigo, centro, aprendices: ["Ana", "Luis"] }`, cree un clon independiente (incluyendo su arreglo interno `aprendices`), agregue `"Carlos"` al arreglo del clon y retorne `{ original: fichaOriginal, clon }` comprobando que `fichaOriginal.aprendices` sigue teniendo solo 2 aprendices.',
    relevanceComment:
      'Clona tanto el contenedor externo { ...fichaOriginal } como el arreglo anidado aprendices: [...fichaOriginal.aprendices].',
    exerciseStarterCode: `function clonarFichaSinEfectoColateral(fichaOriginal, nuevoCodigo) {
  const clon = {
    ...fichaOriginal,
    codigo: nuevoCodigo,
    aprendices: [...fichaOriginal.aprendices, 'Carlos'],
  };
  return { original: fichaOriginal, clon };
}

const base = { codigo: 2874512, centro: 'CEET', aprendices: ['Ana', 'Luis'] };
console.log(clonarFichaSinEfectoColateral(base, 2901845));`,
    exerciseSolution: `function clonarFichaSinEfectoColateral(fichaOriginal, nuevoCodigo) {
  const clon = {
    ...fichaOriginal,
    codigo: nuevoCodigo,
    aprendices: [...fichaOriginal.aprendices, 'Carlos'],
  };
  return { original: fichaOriginal, clon };
}

const base = { codigo: 2874512, centro: 'CEET', aprendices: ['Ana', 'Luis'] };
console.log(clonarFichaSinEfectoColateral(base, 2901845));`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Tipo Primitivo Symbol',
    title: 'Desarrollo 7: Creación de Metadatos Ocultos con Symbol() en Objetos',
    content:
      'El tipo primitivo `Symbol("descripcion")` crea claves únicas que no aparecen en `Object.keys()`. Desarrolla un ejemplo donde agregues una propiedad `[ID_INTERNO_AUDITORIA]` a un objeto `evidencia` usando un `Symbol`, compruebes que `Object.keys(evidencia)` no la expone, pero sí puedas leerla con `evidencia[ID_INTERNO_AUDITORIA]`.',
    relevanceComment:
      'Los Symbols son ideales para adjuntar metadatos internos a un objeto sin alterar sus claves públicas JSON.',
    exerciseStarterCode: `const ID_INTERNO_AUDITORIA = Symbol('id_auditoria_sena');

const evidencia = {
  titulo: 'Taller JavaScript I',
  puntaje: 98,
  [ID_INTERNO_AUDITORIA]: 'HASH-9981-CEET',
};

console.log('Claves públicas Object.keys:', Object.keys(evidencia));
console.log('Lectura con el Symbol      :', evidencia[ID_INTERNO_AUDITORIA]);`,
    exerciseSolution: `const ID_INTERNO_AUDITORIA = Symbol('id_auditoria_sena');

const evidencia = {
  titulo: 'Taller JavaScript I',
  puntaje: 98,
  [ID_INTERNO_AUDITORIA]: 'HASH-9981-CEET',
};

console.log('Claves públicas Object.keys:', Object.keys(evidencia)); // ["titulo", "puntaje"]
console.log('Lectura con el Symbol      :', evidencia[ID_INTERNO_AUDITORIA]); // "HASH-9981-CEET"`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Parseo con Base Numérica (parseInt Radix)',
    title: 'Desarrollo 8: Conversor entre Binario (Base 2), Hexadecimal (Base 16) y Decimal',
    content:
      'Desarrolla una función `convertirBasesNumericas(numeroDecimal)` que retorne la representación del número en binario (`numeroDecimal.toString(2)`), en hexadecimal (`numeroDecimal.toString(16).toUpperCase()`) y verifique su reconversión a decimal usando `Number.parseInt(binario, 2)`.',
    relevanceComment:
      'Pasa siempre el segundo argumento (radix / base: 2, 10, 16) a Number.parseInt(cadena, base).',
    exerciseStarterCode: `function convertirBasesNumericas(numeroDecimal) {
  const binario = numeroDecimal.toString(2);
  const hexadecimal = numeroDecimal.toString(16).toUpperCase();
  const verificadoDecimal = Number.parseInt(binario, 2);

  return { numeroDecimal, binario, hexadecimal, verificadoDecimal };
}

console.log(convertirBasesNumericas(255));
console.log(convertirBasesNumericas(42));`,
    exerciseSolution: `function convertirBasesNumericas(numeroDecimal) {
  const binario = numeroDecimal.toString(2);
  const hexadecimal = numeroDecimal.toString(16).toUpperCase();
  const verificadoDecimal = Number.parseInt(binario, 2);

  return { numeroDecimal, binario, hexadecimal, verificadoDecimal };
}

console.log(convertirBasesNumericas(255)); // { binario: "11111111", hexadecimal: "FF" }
console.log(convertirBasesNumericas(42));  // { binario: "101010", hexadecimal: "2A" }`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Comparación Estructural de Objetos vs. ===',
    title: 'Desarrollo 9: Comparador de Igualdad Superficial entre Dos Objetos',
    content:
      'En JavaScript, `{ codigo: 10 } === { codigo: 10 }` retorna `false` porque son dos instancias distintas en el *Memory Heap*. Desarrolla una función `sonObjetosIgualesSuperficial(objA, objB)` que compare si ambos objetos tienen exactamente la misma cantidad de claves y los mismos valores primitivos con `===`.',
    relevanceComment:
      'Extrae Object.keys(objA) y Object.keys(objB), verifica que tengan igual longitud y que para cada clave objA[k] === objB[k].',
    exerciseStarterCode: `function sonObjetosIgualesSuperficial(objA, objB) {
  if (objA === objB) return true;
  if (!objA || !objB || typeof objA !== 'object' || typeof objB !== 'object') {
    return false;
  }

  const clavesA = Object.keys(objA);
  const clavesB = Object.keys(objB);
  if (clavesA.length !== clavesB.length) return false;

  return clavesA.every((clave) => objA[clave] === objB[clave]);
}

console.log('Comparación === directa:', { a: 1, b: 2 } === { a: 1, b: 2 });
console.log('Comparación estructural:', sonObjetosIgualesSuperficial({ a: 1, b: 2 }, { a: 1, b: 2 }));`,
    exerciseSolution: `function sonObjetosIgualesSuperficial(objA, objB) {
  if (objA === objB) return true;
  if (!objA || !objB || typeof objA !== 'object' || typeof objB !== 'object') {
    return false;
  }

  const clavesA = Object.keys(objA);
  const clavesB = Object.keys(objB);
  if (clavesA.length !== clavesB.length) return false;

  return clavesA.every((clave) => objA[clave] === objB[clave]);
}

console.log('Comparación === directa:', { a: 1, b: 2 } === { a: 1, b: 2 }); // false
console.log('Comparación estructural:', sonObjetosIgualesSuperficial({ a: 1, b: 2 }, { a: 1, b: 2 })); // true`,
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'ex-js103-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Validador de Esquema de Tipos (Schema Validator)',
    title: 'Desarrollo 10: Validador de Tipos de un Registro de Aprendiz antes de Guardar',
    content:
      'Desarrolla una función `validarEsquemaAprendiz(datos)` que verifique con `typeof` y `Array.isArray` que el objeto recibido cumpla:\n• `nombre`: string no vacío\n• `ficha`: number entero positivo\n• `activo`: boolean\n• `materias`: array\nRetorna `{ valido: boolean, errores: string[] }`.',
    relevanceComment:
      'Acumula en un arreglo errores cada incumplimiento detectado; si errores.length === 0, el registro es válido.',
    exerciseStarterCode: `function validarEsquemaAprendiz(datos) {
  const errores = [];

  if (typeof datos?.nombre !== 'string' || datos.nombre.trim() === '') {
    errores.push('nombre debe ser un string no vacío');
  }
  if (typeof datos?.ficha !== 'number' || !Number.isInteger(datos.ficha)) {
    errores.push('ficha debe ser un número entero');
  }
  if (typeof datos?.activo !== 'boolean') {
    errores.push('activo debe ser boolean');
  }
  if (!Array.isArray(datos?.materias)) {
    errores.push('materias debe ser un Array');
  }

  return { valido: errores.length === 0, errores };
}

console.log('Registro válido  :', validarEsquemaAprendiz({ nombre: 'Ana', ficha: 2874512, activo: true, materias: ['JS'] }));
console.log('Registro inválido:', validarEsquemaAprendiz({ nombre: '', ficha: '2874512', activo: 'si', materias: null }));`,
    exerciseSolution: `function validarEsquemaAprendiz(datos) {
  const errores = [];

  if (typeof datos?.nombre !== 'string' || datos.nombre.trim() === '') {
    errores.push('nombre debe ser un string no vacío');
  }
  if (typeof datos?.ficha !== 'number' || !Number.isInteger(datos.ficha)) {
    errores.push('ficha debe ser un número entero');
  }
  if (typeof datos?.activo !== 'boolean') {
    errores.push('activo debe ser boolean');
  }
  if (!Array.isArray(datos?.materias)) {
    errores.push('materias debe ser un Array');
  }

  return { valido: errores.length === 0, errores };
}

console.log('Registro válido  :', validarEsquemaAprendiz({ nombre: 'Ana', ficha: 2874512, activo: true, materias: ['JS'] }));
console.log('Registro inválido:', validarEsquemaAprendiz({ nombre: '', ficha: '2874512', activo: 'si', materias: null }));`,
    sourceNodeId: 'node-js-103',
  },
];
