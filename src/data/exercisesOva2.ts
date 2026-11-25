import { LessonBlock } from '../types/ova';

// ============================================================================
// OVA 2 · TÓPICO 1 (les-js-201): ESTRUCTURAS CONDICIONALES, GUARD CLAUSES Y SWITCH
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_201: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js201-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Condicional if / else',
    title: 'Verificación Rápida de Aprobación SENA (>= 70)',
    content:
      'Completa la condición del bloque `if` para que retorne `"APROBADO"` cuando `puntaje >= 70` y `"NO APROBADO"` en caso contrario. Pulsa **Ejecutar Código**.',
    relevanceComment:
      'El operador >= evalúa si el operando izquierdo es mayor o igual al derecho.',
    exerciseStarterCode: `const puntaje = 78;
if (puntaje >= 70) {
  console.log('Resultado:', 'APROBADO');
} else {
  console.log('Resultado:', 'NO APROBADO');
}`,
    exerciseSolution: `const puntaje = 78;
if (puntaje >= 70) {
  console.log('Resultado:', 'APROBADO');
} else {
  console.log('Resultado:', 'NO APROBADO');
}`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Operador Condicional Ternario (? :)',
    title: 'Asignación en Una Línea con Operador Ternario',
    content:
      'Utiliza el operador ternario `condicion ? valorSiTrue : valorSiFalse` para asignar `"Jornada Diurna"` si `horaIngreso < 12` o `"Jornada Tarde/Noche"` en caso contrario.',
    relevanceComment:
      'El operador ternario es una expresión, por lo que su resultado puede guardarse directamente en una constante const.',
    exerciseStarterCode: `const horaIngreso = 8;
const jornada = horaIngreso < 12 ? 'Jornada Diurna' : 'Jornada Tarde/Noche';
console.log('Jornada asignada:', jornada);`,
    exerciseSolution: `const horaIngreso = 8;
const jornada = horaIngreso < 12 ? 'Jornada Diurna' : 'Jornada Tarde/Noche';
console.log('Jornada asignada:', jornada); // "Jornada Diurna"`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Coalescencia Nula (??)',
    title: 'Valor por Defecto Seguro con Nullish Coalescing (??)',
    content:
      'La variable `intentosRestantes = 0` vale cero. Usa el operador `??` para mostrar `intentosRestantes ?? 3` y comprueba en consola que conserva el `0` (a diferencia de `||` que lo reemplazaría por `3`).',
    relevanceComment:
      'A ?? B solo devuelve B cuando A es estrictamente null o undefined.',
    exerciseStarterCode: `const intentosRestantes = 0;
console.log('Con || (erróneo para 0):', intentosRestantes || 3);
console.log('Con ?? (correcto)      :', intentosRestantes ?? 3);`,
    exerciseSolution: `const intentosRestantes = 0;
console.log('Con || (erróneo para 0):', intentosRestantes || 3); // 3
console.log('Con ?? (correcto)      :', intentosRestantes ?? 3); // 0`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Prevención de Fall-Through en switch',
    title: 'Corrección de Caída Accidental (Fall-Through) en switch',
    content:
      'Agrega las sentencias `break;` faltantes en la estructura `switch` del snippet para que el código `"B"` imprima únicamente `"Nivel Intermedio"` y no caiga al caso siguiente.',
    relevanceComment:
      'Cada bloque case de un switch debe cerrar con break o return.',
    exerciseStarterCode: `const nivel = 'B';
let descripcion = '';

switch (nivel) {
  case 'A':
    descripcion = 'Nivel Básico';
    break;
  case 'B':
    descripcion = 'Nivel Intermedio';
    break;
  case 'C':
    descripcion = 'Nivel Avanzado';
    break;
  default:
    descripcion = 'Sin clasificar';
}

console.log('Descripción:', descripcion);`,
    exerciseSolution: `const nivel = 'B';
let descripcion = '';

switch (nivel) {
  case 'A':
    descripcion = 'Nivel Básico';
    break;
  case 'B':
    descripcion = 'Nivel Intermedio';
    break;
  case 'C':
    descripcion = 'Nivel Avanzado';
    break;
  default:
    descripcion = 'Sin clasificar';
}

console.log('Descripción:', descripcion); // "Nivel Intermedio"`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Cláusula de Guarda (Guard Clause)',
    title: 'Retorno Temprano ante Parámetro Inválido',
    content:
      'Escribe una cláusula de guarda en la primera línea de `calcularRaiz(n)` que retorne `"Error: número negativo"` si `n < 0`, antes de calcular `Math.sqrt(n)`.',
    relevanceComment:
      'Validar y abortar en la primera línea evita envolver todo el resto de la función en un bloque else.',
    exerciseStarterCode: `function calcularRaiz(n) {
  if (n < 0) return 'Error: número negativo';
  return Math.sqrt(n);
}

console.log('Raíz de 81 :', calcularRaiz(81));
console.log('Raíz de -9 :', calcularRaiz(-9));`,
    exerciseSolution: `function calcularRaiz(n) {
  if (n < 0) return 'Error: número negativo';
  return Math.sqrt(n);
}

console.log('Raíz de 81 :', calcularRaiz(81)); // 9
console.log('Raíz de -9 :', calcularRaiz(-9)); // "Error: número negativo"`,
    sourceNodeId: 'node-js-201',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js201-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Escalera if / else if / else',
    title: 'Desarrollo 1: Clasificador de Rango Académico SENA con Validación de Bordes',
    content:
      'Desarrolla una función `clasificarCalificacion(nota)` que:\n• Retorne `"Error: Nota fuera de rango [0-100]"` si `nota < 0` o `nota > 100`.\n• Retorne `"A+ (Excelencia)"` si `nota >= 95`.\n• Retorne `"A (Aprobado)"` si `nota >= 70`.\n• Retorne `"D (Plan de Mejoramiento)"` si `nota < 70`.',
    relevanceComment:
      'Evalúa siempre primero la cláusula de guarda de rango inválido.',
    exerciseStarterCode: `function clasificarCalificacion(nota) {
  if (typeof nota !== 'number' || nota < 0 || nota > 100) {
    return 'Error: Nota fuera de rango [0-100]';
  }
  if (nota >= 95) return 'A+ (Excelencia)';
  if (nota >= 70) return 'A (Aprobado)';
  return 'D (Plan de Mejoramiento)';
}

console.log(clasificarCalificacion(98));
console.log(clasificarCalificacion(75));
console.log(clasificarCalificacion(60));
console.log(clasificarCalificacion(115));`,
    exerciseSolution: `function clasificarCalificacion(nota) {
  if (typeof nota !== 'number' || nota < 0 || nota > 100) {
    return 'Error: Nota fuera de rango [0-100]';
  }
  if (nota >= 95) return 'A+ (Excelencia)';
  if (nota >= 70) return 'A (Aprobado)';
  return 'D (Plan de Mejoramiento)';
}

console.log(clasificarCalificacion(98));  // "A+ (Excelencia)"
console.log(clasificarCalificacion(75));  // "A (Aprobado)"
console.log(clasificarCalificacion(60));  // "D (Plan de Mejoramiento)"
console.log(clasificarCalificacion(115)); // "Error: Nota fuera de rango [0-100]"`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'switch / case y Recargos Condicionales',
    title: 'Desarrollo 2: Motor de Tarifas Logísticas por Región y Sobrepeso',
    content:
      'Desarrolla `cotizarEnvio(region, pesoKg)` usando `switch (region.toUpperCase())`:\n• `"BOGOTA"`: `$8000`\n• `"CUNDINAMARCA"`: `$14000`\n• `"NACIONAL"`: `$22000`\nSi `pesoKg > 5`, suma `$2500` por cada kilo adicional sobre 5 kg.',
    relevanceComment:
      'Usa const kilosExtra = pesoKg > 5 ? pesoKg - 5 : 0; después del switch.',
    exerciseStarterCode: `function cotizarEnvio(region, pesoKg) {
  let base = 0;
  switch (String(region).toUpperCase()) {
    case 'BOGOTA':
      base = 8000;
      break;
    case 'CUNDINAMARCA':
      base = 14000;
      break;
    case 'NACIONAL':
      base = 22000;
      break;
    default:
      return 'Región no cubierta';
  }
  const kilosExtra = pesoKg > 5 ? pesoKg - 5 : 0;
  return base + kilosExtra * 2500;
}

console.log('Bogotá 3kg  :', cotizarEnvio('bogota', 3));
console.log('Nacional 9kg:', cotizarEnvio('NACIONAL', 9));`,
    exerciseSolution: `function cotizarEnvio(region, pesoKg) {
  let base = 0;
  switch (String(region).toUpperCase()) {
    case 'BOGOTA':
      base = 8000;
      break;
    case 'CUNDINAMARCA':
      base = 14000;
      break;
    case 'NACIONAL':
      base = 22000;
      break;
    default:
      return 'Región no cubierta';
  }
  const kilosExtra = pesoKg > 5 ? pesoKg - 5 : 0;
  return base + kilosExtra * 2500;
}

console.log('Bogotá 3kg  :', cotizarEnvio('bogota', 3));   // 8000
console.log('Nacional 9kg:', cotizarEnvio('NACIONAL', 9)); // 32000`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Clean Code: Guard Clauses',
    title: 'Desarrollo 3: Aplanamiento de Validador de Retiro Bancario con Guard Clauses',
    content:
      'Desarrolla una función `autorizarRetiroCajero(cuenta, monto, pinIngresado)` sin usar ni un solo bloque `else`, validando con *Guard Clauses*:\n1. Si `!cuenta` → `"Error: Cuenta inválida"`\n2. Si `!cuenta.activa` → `"Error: Cuenta inactiva"`\n3. Si `cuenta.pin !== pinIngresado` → `"Error: PIN incorrecto"`\n4. Si `monto <= 0 || monto % 10000 !== 0` → `"Error: El monto debe ser múltiplo de $10.000"`\n5. Si `cuenta.saldo < monto` → `"Error: Saldo insuficiente"`\nSi pasa todo, retorna `{ aprobado: true, nuevoSaldo: cuenta.saldo - monto }`.',
    relevanceComment:
      'Observa cómo cada regla de negocio ocupa una sola línea independiente fácil de leer y probar.',
    exerciseStarterCode: `function autorizarRetiroCajero(cuenta, monto, pinIngresado) {
  if (!cuenta) return 'Error: Cuenta inválida';
  if (!cuenta.activa) return 'Error: Cuenta inactiva';
  if (cuenta.pin !== pinIngresado) return 'Error: PIN incorrecto';
  if (monto <= 0 || monto % 10000 !== 0) {
    return 'Error: El monto debe ser múltiplo de $10.000';
  }
  if (cuenta.saldo < monto) return 'Error: Saldo insuficiente';

  return { aprobado: true, nuevoSaldo: cuenta.saldo - monto };
}

const miCuenta = { activa: true, pin: '4812', saldo: 300000 };
console.log('Retiro exitoso:', autorizarRetiroCajero(miCuenta, 120000, '4812'));
console.log('PIN erróneo   :', autorizarRetiroCajero(miCuenta, 50000, '0000'));`,
    exerciseSolution: `function autorizarRetiroCajero(cuenta, monto, pinIngresado) {
  if (!cuenta) return 'Error: Cuenta inválida';
  if (!cuenta.activa) return 'Error: Cuenta inactiva';
  if (cuenta.pin !== pinIngresado) return 'Error: PIN incorrecto';
  if (monto <= 0 || monto % 10000 !== 0) {
    return 'Error: El monto debe ser múltiplo de $10.000';
  }
  if (cuenta.saldo < monto) return 'Error: Saldo insuficiente';

  return { aprobado: true, nuevoSaldo: cuenta.saldo - monto };
}

const miCuenta = { activa: true, pin: '4812', saldo: 300000 };
console.log('Retiro exitoso:', autorizarRetiroCajero(miCuenta, 120000, '4812'));
console.log('PIN erróneo   :', autorizarRetiroCajero(miCuenta, 50000, '0000'));`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Álgebra Booleana Compuesta',
    title: 'Desarrollo 4: Verificador de Año Bisiesto del Calendario Gregoriano',
    content:
      'Desarrolla la función `esBisiesto(anio)` que retorne `true` si el año es divisible entre `4` y NO es divisible entre `100`, o si es divisible entre `400`. Pruébala con `2024`, `2026`, `1900` y `2000`.',
    relevanceComment:
      '1900 es un caso de prueba clásico: es múltiplo de 4 y de 100, pero no de 400, por lo tanto NO fue bisiesto.',
    exerciseStarterCode: `function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
}

console.log('2024:', esBisiesto(2024));
console.log('2026:', esBisiesto(2026));
console.log('1900:', esBisiesto(1900));
console.log('2000:', esBisiesto(2000));`,
    exerciseSolution: `function esBisiesto(anio) {
  return (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;
}

console.log('2024:', esBisiesto(2024)); // true
console.log('2026:', esBisiesto(2026)); // false
console.log('1900:', esBisiesto(1900)); // false
console.log('2000:', esBisiesto(2000)); // true`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Optional Chaining (?.) y Nullish (??)',
    title: 'Desarrollo 5: Extractor Resiliente de Configuración de Entorno',
    content:
      'Desarrolla una función `obtenerConfiguracionServidor(config)` que lea de forma segura:\n• `puerto`: `config?.red?.puerto ?? 3000`\n• `reintentos`: `config?.red?.reintentos ?? 5` (conservando `0` si `reintentos` es `0`)\n• `modoDebug`: `config?.seguridad?.debug ?? false`',
    relevanceComment:
      '?. detiene la evaluación si red o seguridad no existen, devolviendo undefined para que ?? aplique el respaldo.',
    exerciseStarterCode: `function obtenerConfiguracionServidor(config) {
  return {
    puerto: config?.red?.puerto ?? 3000,
    reintentos: config?.red?.reintentos ?? 5,
    modoDebug: config?.seguridad?.debug ?? false,
  };
}

console.log('Config parcial con 0:', obtenerConfiguracionServidor({ red: { reintentos: 0 } }));
console.log('Config nula         :', obtenerConfiguracionServidor(null));`,
    exerciseSolution: `function obtenerConfiguracionServidor(config) {
  return {
    puerto: config?.red?.puerto ?? 3000,
    reintentos: config?.red?.reintentos ?? 5,
    modoDebug: config?.seguridad?.debug ?? false,
  };
}

console.log('Config parcial con 0:', obtenerConfiguracionServidor({ red: { reintentos: 0 } }));
// -> { puerto: 3000, reintentos: 0, modoDebug: false }
console.log('Config nula         :', obtenerConfiguracionServidor(null));
// -> { puerto: 3000, reintentos: 5, modoDebug: false }`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Clasificación por Tramos Progresivos',
    title: 'Desarrollo 6: Calculadora de Descuento por Volumen de Licencias',
    content:
      'Desarrolla una función `calcularTotalLicencias(cantidad, precioUnitario)` con descuento por volumen:\n• Menos de 5 licencias: `0%` de descuento\n• De 5 a 9 licencias: `10%` de descuento\n• De 10 a 24 licencias: `20%` de descuento\n• 25 o más licencias: `30%` de descuento\nRetorna `{ cantidad, porcentajeDescuento, totalPagar }`.',
    relevanceComment:
      'Ordena los bloques if / else if desde el tramo más alto (>= 25) hacia el más bajo.',
    exerciseStarterCode: `function calcularTotalLicencias(cantidad, precioUnitario) {
  let porcentajeDescuento = 0;
  if (cantidad >= 25) {
    porcentajeDescuento = 30;
  } else if (cantidad >= 10) {
    porcentajeDescuento = 20;
  } else if (cantidad >= 5) {
    porcentajeDescuento = 10;
  }

  const subtotal = cantidad * precioUnitario;
  const totalPagar = subtotal * (1 - porcentajeDescuento / 100);
  return { cantidad, porcentajeDescuento, totalPagar };
}

console.log(calcularTotalLicencias(12, 50000));`,
    exerciseSolution: `function calcularTotalLicencias(cantidad, precioUnitario) {
  let porcentajeDescuento = 0;
  if (cantidad >= 25) {
    porcentajeDescuento = 30;
  } else if (cantidad >= 10) {
    porcentajeDescuento = 20;
  } else if (cantidad >= 5) {
    porcentajeDescuento = 10;
  }

  const subtotal = cantidad * precioUnitario;
  const totalPagar = subtotal * (1 - porcentajeDescuento / 100);
  return { cantidad, porcentajeDescuento, totalPagar };
}

console.log(calcularTotalLicencias(12, 50000));
// -> { cantidad: 12, porcentajeDescuento: 20, totalPagar: 480000 }`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Control de Acceso Basado en Roles (RBAC)',
    title: 'Desarrollo 7: Matriz de Permisos por Rol y Acción en NexoOVA',
    content:
      'Desarrolla una función `tienePermisoAccion(rol, accion)` donde:\n• `"ADMIN"` puede ejecutar cualquier acción (`true`).\n• `"INSTRUCTOR"` puede `"CREAR_OVA"`, `"EDITAR_OVA"` y `"CALIFICAR"`, pero no `"BORRAR_SISTEMA"`.\n• `"APRENDIZ"` solo puede `"VER_OVA"` y `"ENVIAR_EVIDENCIA"`.',
    relevanceComment:
      'Combina switch (rol) con comparaciones o arreglos de permisos permitidos.',
    exerciseStarterCode: `function tienePermisoAccion(rol, accion) {
  switch (rol) {
    case 'ADMIN':
      return true;
    case 'INSTRUCTOR':
      return accion === 'CREAR_OVA' || accion === 'EDITAR_OVA' || accion === 'CALIFICAR';
    case 'APRENDIZ':
      return accion === 'VER_OVA' || accion === 'ENVIAR_EVIDENCIA';
    default:
      return false;
  }
}

console.log('Instructor calificar:', tienePermisoAccion('INSTRUCTOR', 'CALIFICAR'));
console.log('Aprendiz editar OVA :', tienePermisoAccion('APRENDIZ', 'EDITAR_OVA'));`,
    exerciseSolution: `function tienePermisoAccion(rol, accion) {
  switch (rol) {
    case 'ADMIN':
      return true;
    case 'INSTRUCTOR':
      return accion === 'CREAR_OVA' || accion === 'EDITAR_OVA' || accion === 'CALIFICAR';
    case 'APRENDIZ':
      return accion === 'VER_OVA' || accion === 'ENVIAR_EVIDENCIA';
    default:
      return false;
  }
}

console.log('Instructor calificar:', tienePermisoAccion('INSTRUCTOR', 'CALIFICAR')); // true
console.log('Aprendiz editar OVA :', tienePermisoAccion('APRENDIZ', 'EDITAR_OVA'));  // false`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Geometría y Desigualdad Triangular',
    title: 'Desarrollo 8: Clasificador Geométrico de Triángulos (Equilátero, Isósceles, Escaleno)',
    content:
      'Desarrolla `clasificarTriangulo(a, b, c)` que primero verifique con una cláusula de guarda la **desigualdad triangular** (`a + b > c && a + c > b && b + c > a`); si no se cumple, retorne `"No forma un triángulo válido"`. Si es válido, retorne `"Equilátero"` (3 lados iguales), `"Isósceles"` (2 lados iguales) o `"Escaleno"` (3 lados distintos).',
    relevanceComment:
      'Para que tres segmentos cierren un triángulo, la suma de cualesquiera dos lados debe superar al tercero.',
    exerciseStarterCode: `function clasificarTriangulo(a, b, c) {
  if (a <= 0 || b <= 0 || c <= 0 || a + b <= c || a + c <= b || b + c <= a) {
    return 'No forma un triángulo válido';
  }
  if (a === b && b === c) return 'Equilátero';
  if (a === b || a === c || b === c) return 'Isósceles';
  return 'Escaleno';
}

console.log('(5, 5, 5)  ->', clasificarTriangulo(5, 5, 5));
console.log('(5, 5, 8)  ->', clasificarTriangulo(5, 5, 8));
console.log('(3, 4, 5)  ->', clasificarTriangulo(3, 4, 5));
console.log('(1, 2, 10) ->', clasificarTriangulo(1, 2, 10));`,
    exerciseSolution: `function clasificarTriangulo(a, b, c) {
  if (a <= 0 || b <= 0 || c <= 0 || a + b <= c || a + c <= b || b + c <= a) {
    return 'No forma un triángulo válido';
  }
  if (a === b && b === c) return 'Equilátero';
  if (a === b || a === c || b === c) return 'Isósceles';
  return 'Escaleno';
}

console.log('(5, 5, 5)  ->', clasificarTriangulo(5, 5, 5));  // "Equilátero"
console.log('(5, 5, 8)  ->', clasificarTriangulo(5, 5, 8));  // "Isósceles"
console.log('(3, 4, 5)  ->', clasificarTriangulo(3, 4, 5));  // "Escaleno"
console.log('(1, 2, 10) ->', clasificarTriangulo(1, 2, 10)); // "No forma un triángulo válido"`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Máquina de Estados Finitos (FSM) con switch',
    title: 'Desarrollo 9: Máquina de Estados de una Evidencia Académica',
    content:
      'Desarrolla una función `transicionarEstadoEvidencia(estadoActual, evento)` que modele el ciclo de vida de una entrega:\n• Si está en `"PENDIENTE"` y ocurre `"ENTREGAR"` → pasa a `"EN_REVISION"`.\n• Si está en `"EN_REVISION"` y ocurre `"APROBAR"` → pasa a `"CALIFICADA_A"`.\n• Si está en `"EN_REVISION"` y ocurre `"RECHAZAR"` → pasa a `"PLAN_MEJORAMIENTO"`.\n• Si está en `"PLAN_MEJORAMIENTO"` y ocurre `"REENTREGAR"` → vuelve a `"EN_REVISION"`.\nCualquier otra combinación retorna `"Transición no permitida"`.',
    relevanceComment:
      'Las máquinas de estados finitos evitan que una entidad salte a estados incoherentes.',
    exerciseStarterCode: `function transicionarEstadoEvidencia(estadoActual, evento) {
  switch (estadoActual) {
    case 'PENDIENTE':
      return evento === 'ENTREGAR' ? 'EN_REVISION' : 'Transición no permitida';
    case 'EN_REVISION':
      if (evento === 'APROBAR') return 'CALIFICADA_A';
      if (evento === 'RECHAZAR') return 'PLAN_MEJORAMIENTO';
      return 'Transición no permitida';
    case 'PLAN_MEJORAMIENTO':
      return evento === 'REENTREGAR' ? 'EN_REVISION' : 'Transición no permitida';
    default:
      return 'Transición no permitida';
  }
}

console.log('1:', transicionarEstadoEvidencia('PENDIENTE', 'ENTREGAR'));
console.log('2:', transicionarEstadoEvidencia('EN_REVISION', 'APROBAR'));
console.log('3:', transicionarEstadoEvidencia('PENDIENTE', 'APROBAR'));`,
    exerciseSolution: `function transicionarEstadoEvidencia(estadoActual, evento) {
  switch (estadoActual) {
    case 'PENDIENTE':
      return evento === 'ENTREGAR' ? 'EN_REVISION' : 'Transición no permitida';
    case 'EN_REVISION':
      if (evento === 'APROBAR') return 'CALIFICADA_A';
      if (evento === 'RECHAZAR') return 'PLAN_MEJORAMIENTO';
      return 'Transición no permitida';
    case 'PLAN_MEJORAMIENTO':
      return evento === 'REENTREGAR' ? 'EN_REVISION' : 'Transición no permitida';
    default:
      return 'Transición no permitida';
  }
}

console.log('1:', transicionarEstadoEvidencia('PENDIENTE', 'ENTREGAR'));   // "EN_REVISION"
console.log('2:', transicionarEstadoEvidencia('EN_REVISION', 'APROBAR'));  // "CALIFICADA_A"
console.log('3:', transicionarEstadoEvidencia('PENDIENTE', 'APROBAR'));    // "Transición no permitida"`,
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'ex-js201-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Motor de Reglas de Becas y Apoyos SENA',
    title: 'Desarrollo 10: Evaluador Multicriterio de Apoyo de Sostenimiento SENA',
    content:
      'Desarrolla una función `evaluarApoyoSostenimiento(candidato)` que verifique:\n1. Debe tener `matriculaActiva === true` y `tieneContratoAprendizaje === false` (cláusula de guarda).\n2. Calcula un puntaje de priorización: si `estrato <= 2` suma `50` pts; si `promedio >= 85` suma `30` pts; si `esMonitor === true` suma `20` pts.\n3. Si el puntaje total es `>= 70`, retorna `"SELECCIONADO PRIORIDAD ALTA"`; si es `>= 50`, `"LISTA DE ELEGIBLES"`; de lo contrario, `"NO CUMPLE PUNTAJE MÍNIMO"`.',
    relevanceComment:
      'Combina cláusulas de guarda iniciales con acumuladores condicionales.',
    exerciseStarterCode: `function evaluarApoyoSostenimiento(candidato) {
  if (!candidato?.matriculaActiva) return 'No elegible: Matrícula inactiva';
  if (candidato.tieneContratoAprendizaje) {
    return 'No elegible: Ya cuenta con contrato de aprendizaje patrocinado';
  }

  let puntos = 0;
  if (candidato.estrato <= 2) puntos += 50;
  if (candidato.promedio >= 85) puntos += 30;
  if (candidato.esMonitor) puntos += 20;

  const estado =
    puntos >= 70
      ? 'SELECCIONADO PRIORIDAD ALTA'
      : puntos >= 50
      ? 'LISTA DE ELEGIBLES'
      : 'NO CUMPLE PUNTAJE MÍNIMO';

  return { puntos, estado };
}

console.log(
  evaluarApoyoSostenimiento({
    matriculaActiva: true,
    tieneContratoAprendizaje: false,
    estrato: 2,
    promedio: 91,
    esMonitor: false,
  })
);`,
    exerciseSolution: `function evaluarApoyoSostenimiento(candidato) {
  if (!candidato?.matriculaActiva) return 'No elegible: Matrícula inactiva';
  if (candidato.tieneContratoAprendizaje) {
    return 'No elegible: Ya cuenta con contrato de aprendizaje patrocinado';
  }

  let puntos = 0;
  if (candidato.estrato <= 2) puntos += 50;
  if (candidato.promedio >= 85) puntos += 30;
  if (candidato.esMonitor) puntos += 20;

  const estado =
    puntos >= 70
      ? 'SELECCIONADO PRIORIDAD ALTA'
      : puntos >= 50
      ? 'LISTA DE ELEGIBLES'
      : 'NO CUMPLE PUNTAJE MÍNIMO';

  return { puntos, estado };
}

console.log(
  evaluarApoyoSostenimiento({
    matriculaActiva: true,
    tieneContratoAprendizaje: false,
    estrato: 2,
    promedio: 91,
    esMonitor: false,
  })
);
// -> { puntos: 80, estado: "SELECCIONADO PRIORIDAD ALTA" }`,
    sourceNodeId: 'node-js-201',
  },
];

// ============================================================================
// OVA 2 · TÓPICO 2 (les-js-202): CICLOS (for, while, do...while, break, continue)
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_202: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js202-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Ciclo for con Paso Personalizado',
    title: 'Generación de Números Pares del 2 al 10 con for',
    content:
      'Ejecuta el ciclo `for (let n = 2; n <= 10; n += 2)` para almacenar en el arreglo `pares` los números pares del 2 al 10 e imprimirlos.',
    relevanceComment:
      'El tercer componente del encabezado for puede incrementar de 2 en 2 usando n += 2.',
    exerciseStarterCode: `const pares = [];
for (let n = 2; n <= 10; n += 2) {
  pares.push(n);
}
console.log('Pares generados:', pares);`,
    exerciseSolution: `const pares = [];
for (let n = 2; n <= 10; n += 2) {
  pares.push(n);
}
console.log('Pares generados:', pares); // [2, 4, 6, 8, 10]`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Salto de Iteración con continue',
    title: 'Omitir Números Negativos usando continue',
    content:
      'El siguiente ciclo suma únicamente los valores positivos de `datos = [10, -5, 20, -8, 30]`. Usa `if (valor < 0) continue;` para saltar los negativos.',
    relevanceComment:
      'continue ignora el resto del cuerpo en la iteración actual y pasa al siguiente elemento.',
    exerciseStarterCode: `const datos = [10, -5, 20, -8, 30];
let sumaPositivos = 0;

for (let i = 0; i < datos.length; i++) {
  if (datos[i] < 0) continue;
  sumaPositivos += datos[i];
}

console.log('Suma de positivos:', sumaPositivos);`,
    exerciseSolution: `const datos = [10, -5, 20, -8, 30];
let sumaPositivos = 0;

for (let i = 0; i < datos.length; i++) {
  if (datos[i] < 0) continue;
  sumaPositivos += datos[i];
}

console.log('Suma de positivos:', sumaPositivos); // 60`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Parada Temprana con break',
    title: 'Detener Búsqueda al Encontrar el Primer Error con break',
    content:
      'Recorre el arreglo `estados = ["OK", "OK", "FALLO", "OK"]` y detén el ciclo inmediatamente con `break` cuando encuentres `"FALLO"`, guardando su posición en `indiceFallo`.',
    relevanceComment:
      'break finaliza el bucle por completo ahorrando iteraciones innecesarias.',
    exerciseStarterCode: `const estados = ['OK', 'OK', 'FALLO', 'OK'];
let indiceFallo = -1;

for (let i = 0; i < estados.length; i++) {
  if (estados[i] === 'FALLO') {
    indiceFallo = i;
    break;
  }
}

console.log('Fallo detectado en el índice:', indiceFallo);`,
    exerciseSolution: `const estados = ['OK', 'OK', 'FALLO', 'OK'];
let indiceFallo = -1;

for (let i = 0; i < estados.length; i++) {
  if (estados[i] === 'FALLO') {
    indiceFallo = i;
    break;
  }
}

console.log('Fallo detectado en el índice:', indiceFallo); // 2`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Ciclo while y Divisiones Sucesivas',
    title: 'Contar Cuántas Veces se Puede Dividir entre 2 un Número',
    content:
      'Utiliza un ciclo `while (n > 1)` que divida `n = 64` entre `2` en cada vuelta e incremente `pasos++` para calcular `log2(64)`.',
    relevanceComment:
      '64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1 (6 divisiones exactas).',
    exerciseStarterCode: `let n = 64;
let pasos = 0;

while (n > 1) {
  n = n / 2;
  pasos++;
}

console.log('Total de divisiones entre 2:', pasos);`,
    exerciseSolution: `let n = 64;
let pasos = 0;

while (n > 1) {
  n = n / 2;
  pasos++;
}

console.log('Total de divisiones entre 2:', pasos); // 6`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Garantía de Primera Ejecución con do...while',
    title: 'Ejecución Mínima de Una Vez con do...while',
    content:
      'Comprueba cómo un bloque `do { ... } while (condicionFalsa)` ejecuta su cuerpo exactamente 1 vez aunque la condición sea `false` desde el inicio.',
    relevanceComment:
      'En do...while la condición se evalúa al cierre de la iteración, no a la entrada.',
    exerciseStarterCode: `let ejecuciones = 0;
const condicionActiva = false;

do {
  ejecuciones++;
} while (condicionActiva);

console.log('Veces que se ejecutó el bloque do:', ejecuciones);`,
    exerciseSolution: `let ejecuciones = 0;
const condicionActiva = false;

do {
  ejecuciones++;
} while (condicionActiva);

console.log('Veces que se ejecutó el bloque do:', ejecuciones); // 1`,
    sourceNodeId: 'node-js-202',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js202-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Productoria con Ciclo for',
    title: 'Desarrollo 1: Calculadora de Factorial Iterativo (n!)',
    content:
      'El factorial de un entero no negativo `n` (`n!`) es el producto de todos los enteros desde `1` hasta `n` (con `0! = 1`, `5! = 120`). Desarrolla la función `calcularFactorial(n)` usando un ciclo `for` con un acumulador multiplicativo inicializado en `1`.',
    relevanceComment:
      'En una productoria el acumulador debe inicializarse siempre en 1 (elemento neutro de la multiplicación), nunca en 0.',
    exerciseStarterCode: `function calcularFactorial(n) {
  if (n < 0) return null;
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}

console.log('0! =', calcularFactorial(0));
console.log('5! =', calcularFactorial(5));
console.log('7! =', calcularFactorial(7));`,
    exerciseSolution: `function calcularFactorial(n) {
  if (n < 0) return null;
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}

console.log('0! =', calcularFactorial(0)); // 1
console.log('5! =', calcularFactorial(5)); // 120
console.log('7! =', calcularFactorial(7)); // 5040`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Sucesiones con Ciclo for',
    title: 'Desarrollo 2: Generador de los Primeros N Términos de Fibonacci',
    content:
      'Desarrolla una función `serieFibonacci(n)` que retorne un arreglo con los primeros `n` números de Fibonacci (`[0, 1, 1, 2, 3, 5, 8, 13...]`), donde cada nuevo elemento en la posición `i` es `serie[i - 1] + serie[i - 2]`.',
    relevanceComment:
      'Maneja los casos base n <= 0 (-> []) y n === 1 (-> [0]) antes del ciclo for.',
    exerciseStarterCode: `function serieFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const serie = [0, 1];
  for (let i = 2; i < n; i++) {
    serie.push(serie[i - 1] + serie[i - 2]);
  }
  return serie;
}

console.log('Fibonacci (8):', serieFibonacci(8));`,
    exerciseSolution: `function serieFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];

  const serie = [0, 1];
  for (let i = 2; i < n; i++) {
    serie.push(serie[i - 1] + serie[i - 2]);
  }
  return serie;
}

console.log('Fibonacci (8):', serieFibonacci(8)); // [0, 1, 1, 2, 3, 5, 8, 13]`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Aritmética Modular con while',
    title: 'Desarrollo 3: Inversión y Suma de Dígitos de un Entero sin Usar Strings',
    content:
      'Desarrolla `invertirYSumarDigitos(numero)` usando un bucle `while (restante > 0)` que extraiga el último dígito con `restante % 10`, lo sume a `sumaDigitos`, construya el número `invertido = invertido * 10 + digito` y reduzca `restante = Math.floor(restante / 10)`.',
    relevanceComment:
      'Este algoritmo clásico opera puramente en la ALU matemática sin crear cadenas en memoria.',
    exerciseStarterCode: `function invertirYSumarDigitos(numero) {
  let restante = Math.abs(Math.trunc(numero));
  let invertido = 0;
  let sumaDigitos = 0;

  while (restante > 0) {
    const digito = restante % 10;
    sumaDigitos += digito;
    invertido = invertido * 10 + digito;
    restante = Math.floor(restante / 10);
  }

  return { invertido, sumaDigitos };
}

console.log(invertirYSumarDigitos(12345));`,
    exerciseSolution: `function invertirYSumarDigitos(numero) {
  let restante = Math.abs(Math.trunc(numero));
  let invertido = 0;
  let sumaDigitos = 0;

  while (restante > 0) {
    const digito = restante % 10;
    sumaDigitos += digito;
    invertido = invertido * 10 + digito;
    restante = Math.floor(restante / 10);
  }

  return { invertido, sumaDigitos };
}

console.log(invertirYSumarDigitos(12345)); // { invertido: 54321, sumaDigitos: 15 }`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Conjetura de Collatz con while',
    title: 'Desarrollo 4: Generador de la Secuencia 3n + 1 (Conjetura de Collatz)',
    content:
      'Dado un entero positivo `n`, la secuencia de Collatz repite en un ciclo `while (n !== 1)`:\n• Si `n` es par, `n = n / 2`.\n• Si `n` es impar, `n = 3 * n + 1`.\nDesarrolla `secuenciaCollatz(n)` que retorne el arreglo con toda la trayectoria hasta llegar a `1`.',
    relevanceComment:
      'Para n = 6, la trayectoria debe ser [6, 3, 10, 5, 16, 8, 4, 2, 1].',
    exerciseStarterCode: `function secuenciaCollatz(n) {
  const pasos = [n];
  while (n > 1) {
    if (n % 2 === 0) {
      n = n / 2;
    } else {
      n = 3 * n + 1;
    }
    pasos.push(n);
  }
  return pasos;
}

console.log('Collatz de 6:', secuenciaCollatz(6));`,
    exerciseSolution: `function secuenciaCollatz(n) {
  const pasos = [n];
  while (n > 1) {
    if (n % 2 === 0) {
      n = n / 2;
    } else {
      n = 3 * n + 1;
    }
    pasos.push(n);
  }
  return pasos;
}

console.log('Collatz de 6:', secuenciaCollatz(6));
// -> [6, 3, 10, 5, 16, 8, 4, 2, 1]`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Primalidad O(√n) con for',
    title: 'Desarrollo 5: Buscador de Números Primos en un Rango [inicio, fin]',
    content:
      'Desarrolla una función `listarPrimosEnRango(inicio, fin)` que utilice un ciclo externo para recorrer cada número y un ciclo interno hasta `d * d <= num` con `break` para descartar números compuestos.',
    relevanceComment:
      'Probar divisores solo hasta d * d <= num reduce drásticamente el tiempo de cómputo.',
    exerciseStarterCode: `function listarPrimosEnRango(inicio, fin) {
  const primos = [];

  for (let num = Math.max(2, inicio); num <= fin; num++) {
    let esPrimo = true;
    for (let d = 2; d * d <= num; d++) {
      if (num % d === 0) {
        esPrimo = false;
        break;
      }
    }
    if (esPrimo) primos.push(num);
  }

  return primos;
}

console.log('Primos entre 10 y 40:', listarPrimosEnRango(10, 40));`,
    exerciseSolution: `function listarPrimosEnRango(inicio, fin) {
  const primos = [];

  for (let num = Math.max(2, inicio); num <= fin; num++) {
    let esPrimo = true;
    for (let d = 2; d * d <= num; d++) {
      if (num % d === 0) {
        esPrimo = false;
        break;
      }
    }
    if (esPrimo) primos.push(num);
  }

  return primos;
}

console.log('Primos entre 10 y 40:', listarPrimosEnRango(10, 40));
// -> [11, 13, 17, 19, 23, 29, 31, 37]`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Algoritmo de Euclides con while',
    title: 'Desarrollo 6: Cálculo del Máximo Común Divisor (MCD) con el Algoritmo de Euclides',
    content:
      'El algoritmo clásico de Euclides calcula el Máximo Común Divisor de dos enteros `a` y `b` repitiendo en un ciclo `while (b !== 0)` la asignación `[a, b] = [b, a % b]`. Desarrolla la función `calcularMCD(a, b)` y úsala además para hallar el Mínimo Común Múltiplo (`mcm = (a * b) / mcd`).',
    relevanceComment:
      'Cuando b llega a 0 en el ciclo de Euclides, el valor acumulado en a es exactamente el MCD.',
    exerciseStarterCode: `function calcularMcdYMcm(x, y) {
  let a = Math.abs(x);
  let b = Math.abs(y);

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  const mcd = a;
  const mcm = Math.abs(x * y) / mcd;
  return { mcd, mcm };
}

console.log('MCD y MCM de 48 y 18:', calcularMcdYMcm(48, 18));`,
    exerciseSolution: `function calcularMcdYMcm(x, y) {
  let a = Math.abs(x);
  let b = Math.abs(y);

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  const mcd = a;
  const mcm = Math.abs(x * y) / mcd;
  return { mcd, mcm };
}

console.log('MCD y MCM de 48 y 18:', calcularMcdYMcm(48, 18));
// -> { mcd: 6, mcm: 144 }`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Simulación Financiera con while',
    title: 'Desarrollo 7: Simulador de Amortización de Préstamo Mes a Mes',
    content:
      'Desarrolla una función `simularPagoPrestamo(deudaInicial, cuotaMensual)` que use un bucle `while (saldo > 0)` para descontar mes a mes la cuota hasta llegar a `0`, contando cuántos meses toma saldar la deuda y cuánto fue el último pago.',
    relevanceComment:
      'En el último mes, si el saldo pendiente es menor que la cuotaMensual, el pago final es igual al saldo pendiente.',
    exerciseStarterCode: `function simularPagoPrestamo(deudaInicial, cuotaMensual) {
  let saldo = deudaInicial;
  let meses = 0;
  let ultimoPago = 0;

  while (saldo > 0) {
    meses++;
    ultimoPago = saldo >= cuotaMensual ? cuotaMensual : saldo;
    saldo -= ultimoPago;
  }

  return { mesesTotales: meses, ultimoPago, saldoFinal: saldo };
}

console.log(simularPagoPrestamo(1000000, 300000));`,
    exerciseSolution: `function simularPagoPrestamo(deudaInicial, cuotaMensual) {
  let saldo = deudaInicial;
  let meses = 0;
  let ultimoPago = 0;

  while (saldo > 0) {
    meses++;
    ultimoPago = saldo >= cuotaMensual ? cuotaMensual : saldo;
    saldo -= ultimoPago;
  }

  return { mesesTotales: meses, ultimoPago, saldoFinal: saldo };
}

console.log(simularPagoPrestamo(1000000, 300000));
// -> { mesesTotales: 4, ultimoPago: 100000, saldoFinal: 0 }`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Búsqueda Binaria O(log n) con while',
    title: 'Desarrollo 8: Algoritmo de Búsqueda Binaria sobre un Arreglo Ordenado',
    content:
      'En un arreglo ordenado ascendentemente, la **Búsqueda Binaria** encuentra un elemento en tiempo logarítmico `O(log n)` manteniendo dos punteros `izquierda = 0` y `derecha = arr.length - 1` en un ciclo `while (izquierda <= derecha)`. Desarrolla `busquedaBinaria(arr, objetivo)` que retorne `{ indice, iteraciones }`.',
    relevanceComment:
      'En cada paso calcula medio = Math.floor((izquierda + derecha) / 2); si arr[medio] < objetivo mueve izquierda = medio + 1, si es mayor mueve derecha = medio - 1.',
    exerciseStarterCode: `function busquedaBinaria(arr, objetivo) {
  let izquierda = 0;
  let derecha = arr.length - 1;
  let iteraciones = 0;

  while (izquierda <= derecha) {
    iteraciones++;
    const medio = Math.floor((izquierda + derecha) / 2);
    if (arr[medio] === objetivo) {
      return { indice: medio, iteraciones };
    }
    if (arr[medio] < objetivo) {
      izquierda = medio + 1;
    } else {
      derecha = medio - 1;
    }
  }

  return { indice: -1, iteraciones };
}

const fichasOrdenadas = [2100100, 2350200, 2500400, 2758100, 2874512, 2901845, 3010900];
console.log(busquedaBinaria(fichasOrdenadas, 2874512));`,
    exerciseSolution: `function busquedaBinaria(arr, objetivo) {
  let izquierda = 0;
  let derecha = arr.length - 1;
  let iteraciones = 0;

  while (izquierda <= derecha) {
    iteraciones++;
    const medio = Math.floor((izquierda + derecha) / 2);
    if (arr[medio] === objetivo) {
      return { indice: medio, iteraciones };
    }
    if (arr[medio] < objetivo) {
      izquierda = medio + 1;
    } else {
      derecha = medio - 1;
    }
  }

  return { indice: -1, iteraciones };
}

const fichasOrdenadas = [2100100, 2350200, 2500400, 2758100, 2874512, 2901845, 3010900];
console.log(busquedaBinaria(fichasOrdenadas, 2874512)); // { indice: 4, iteraciones: 2 }`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Ciclos Anidados y Matrices',
    title: 'Desarrollo 9: Generador de Matriz de Multiplicación NxN con Ciclos for Anidados',
    content:
      'Desarrolla una función `generarMatrizMultiplicacion(n)` que mediante dos ciclos `for` anidados (`fila` de `1` a `n` y `columna` de `1` a `n`) construya y retorne una matriz bidimensional `n x n` donde cada celda contenga `fila * columna`.',
    relevanceComment:
      'El ciclo externo crea cada arreglo filaActual = [] y el ciclo interno empuja fila * col.',
    exerciseStarterCode: `function generarMatrizMultiplicacion(n) {
  const matriz = [];
  for (let fila = 1; fila <= n; fila++) {
    const filaActual = [];
    for (let col = 1; col <= n; col++) {
      filaActual.push(fila * col);
    }
    matriz.push(filaActual);
  }
  return matriz;
}

console.log('Matriz 4x4:', generarMatrizMultiplicacion(4));`,
    exerciseSolution: `function generarMatrizMultiplicacion(n) {
  const matriz = [];
  for (let fila = 1; fila <= n; fila++) {
    const filaActual = [];
    for (let col = 1; col <= n; col++) {
      filaActual.push(fila * col);
    }
    matriz.push(filaActual);
  }
  return matriz;
}

console.log('Matriz 4x4:', generarMatrizMultiplicacion(4));`,
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'ex-js202-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Compresión Run-Length Encoding (RLE) con for',
    title: 'Desarrollo 10: Algoritmo de Compresión de Cadenas RLE (Run-Length Encoding)',
    content:
      'El algoritmo de compresión **RLE** reemplaza caracteres repetidos consecutivos por el carácter seguido de su conteo (por ejemplo, `"AAABBBCCDAA"` se comprime como `"A3B3C2D1A2"`). Desarrolla la función `comprimirRLE(texto)` utilizando un ciclo `for`.',
    relevanceComment:
      'Compara texto[i] con texto[i + 1]: si son iguales incrementa contador++; si son distintos concatena texto[i] + contador y reinicia contador = 1.',
    exerciseStarterCode: `function comprimirRLE(texto) {
  if (!texto) return '';
  let resultado = '';
  let contador = 1;

  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === texto[i + 1]) {
      contador++;
    } else {
      resultado += texto[i] + contador;
      contador = 1;
    }
  }

  return resultado;
}

console.log('RLE de "AAABBBCCDAA":', comprimirRLE('AAABBBCCDAA'));`,
    exerciseSolution: `function comprimirRLE(texto) {
  if (!texto) return '';
  let resultado = '';
  let contador = 1;

  for (let i = 0; i < texto.length; i++) {
    if (texto[i] === texto[i + 1]) {
      contador++;
    } else {
      resultado += texto[i] + contador;
      contador = 1;
    }
  }

  return resultado;
}

console.log('RLE de "AAABBBCCDAA":', comprimirRLE('AAABBBCCDAA')); // "A3B3C2D1A2"`,
    sourceNodeId: 'node-js-202',
  },
];

// ============================================================================
// OVA 2 · TÓPICO 3 (les-js-203): ITERACIÓN MODERNA (for...of) Y EXCEPCIONES (try/catch)
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_203: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js203-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Bucle Declarativo for...of',
    title: 'Suma Directa de Valores con for...of sin Índices',
    content:
      'Recorre el arreglo `creditos = [4, 3, 5, 2]` utilizando `for (const c of creditos)` para sumar todos sus valores en `totalCreditos`.',
    relevanceComment:
      'for...of entrega directamente cada valor del arreglo sin tener que escribir creditos[i].',
    exerciseStarterCode: `const creditos = [4, 3, 5, 2];
let totalCreditos = 0;

for (const c of creditos) {
  totalCreditos += c;
}

console.log('Total créditos:', totalCreditos);`,
    exerciseSolution: `const creditos = [4, 3, 5, 2];
let totalCreditos = 0;

for (const c of creditos) {
  totalCreditos += c;
}

console.log('Total créditos:', totalCreditos); // 14`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Iteración de Strings con for...of',
    title: 'Conteo de Apariciones de una Letra con for...of',
    content:
      'Cuenta cuántas veces aparece la letra `"a"` (mayúscula o minúscula) en `"Plataforma NexoOVA SENA"` recorriendo el string con `for...of`.',
    relevanceComment:
      'Un string es un iterable; for (const letra of texto.toLowerCase()) visita cada carácter.',
    exerciseStarterCode: `const texto = 'Plataforma NexoOVA SENA';
let contadorA = 0;

for (const letra of texto.toLowerCase()) {
  if (letra === 'a') contadorA++;
}

console.log('Total de letras "a":', contadorA);`,
    exerciseSolution: `const texto = 'Plataforma NexoOVA SENA';
let contadorA = 0;

for (const letra of texto.toLowerCase()) {
  if (letra === 'a') contadorA++;
}

console.log('Total de letras "a":', contadorA); // 5`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Captura de Excepciones con try / catch',
    title: 'Interceptar Error de JSON.parse() sin Colapsar el Programa',
    content:
      'Ejecuta el snippet para comprobar cómo `try / catch` intercepta el `SyntaxError` al intentar parsear `"{json_invalido}"` y permite que el programa continúe normalmente.',
    relevanceComment:
      'Dentro del bloque catch (error), error.message contiene la descripción del fallo.',
    exerciseStarterCode: `try {
  const datos = JSON.parse('{json_invalido}');
  console.log(datos);
} catch (error) {
  console.warn('Error capturado con éxito:', error.name);
}
console.log('El programa continúa ejecutándose sin colapsar.');`,
    exerciseSolution: `try {
  const datos = JSON.parse('{json_invalido}');
  console.log(datos);
} catch (error) {
  console.warn('Error capturado con éxito:', error.name);
}
console.log('El programa continúa ejecutándose sin colapsar.');`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Lanzamiento de Error con throw',
    title: 'Lanzar Excepción Personalizada ante División por Cero',
    content:
      'En la función `dividir(a, b)`, si `b === 0` lanza `throw new Error("No es posible dividir entre cero")` y captúralo en el `try / catch`.',
    relevanceComment:
      'throw detiene inmediatamente la función actual y transfiere el control al bloque catch más cercano.',
    exerciseStarterCode: `function dividir(a, b) {
  if (b === 0) {
    throw new Error('No es posible dividir entre cero');
  }
  return a / b;
}

try {
  console.log('100 / 4 =', dividir(100, 4));
  console.log('100 / 0 =', dividir(100, 0));
} catch (err) {
  console.error('Excepción:', err.message);
}`,
    exerciseSolution: `function dividir(a, b) {
  if (b === 0) {
    throw new Error('No es posible dividir entre cero');
  }
  return a / b;
}

try {
  console.log('100 / 4 =', dividir(100, 4));
  console.log('100 / 0 =', dividir(100, 0));
} catch (err) {
  console.error('Excepción:', err.message);
}`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Bloque finally Garantizado',
    title: 'Limpieza Garantizada de Estado en el Bloque finally',
    content:
      'Verifica en el snippet cómo la variable `cargando = true` pasa siempre a `cargando = false` dentro del bloque `finally`, incluso después de ocurrir un error.',
    relevanceComment:
      'finally se ejecuta siempre al terminar try o catch.',
    exerciseStarterCode: `let cargando = true;
try {
  throw new Error('Tiempo de espera agotado');
} catch (e) {
  console.warn('Aviso:', e.message);
} finally {
  cargando = false;
}
console.log('¿Sigue cargando?:', cargando);`,
    exerciseSolution: `let cargando = true;
try {
  throw new Error('Tiempo de espera agotado');
} catch (e) {
  console.warn('Aviso:', e.message);
} finally {
  cargando = false;
}
console.log('¿Sigue cargando?:', cargando); // false`,
    sourceNodeId: 'node-js-203',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js203-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'for...of con .entries()',
    title: 'Desarrollo 1: Enumerador de Módulos con Índice y Valor usando .entries()',
    content:
      'Desarrolla una función `enumerarModulos(listaModulos)` que recorra `for (const [indice, nombre] of listaModulos.entries())` y retorne un arreglo de etiquetas numeradas desde `1` (`"01. Nombre"`).',
    relevanceComment:
      'lista.entries() devuelve un iterador de pares [indiceBaseCero, valor].',
    exerciseStarterCode: `function enumerarModulos(listaModulos) {
  const resultado = [];
  for (const [indice, nombre] of listaModulos.entries()) {
    const num = String(indice + 1).padStart(2, '0');
    resultado.push(\`\${num}. \${nombre}\`);
  }
  return resultado;
}

console.log(enumerarModulos(['Fundamentos JS', 'Estructuras de Control', 'Arreglos y Objetos']));`,
    exerciseSolution: `function enumerarModulos(listaModulos) {
  const resultado = [];
  for (const [indice, nombre] of listaModulos.entries()) {
    const num = String(indice + 1).padStart(2, '0');
    resultado.push(\`\${num}. \${nombre}\`);
  }
  return resultado;
}

console.log(enumerarModulos(['Fundamentos JS', 'Estructuras de Control', 'Arreglos y Objetos']));`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'for...of con Estructura Map / Object.entries',
    title: 'Desarrollo 2: Totalizador de Presupuesto por Rubro con Object.entries()',
    content:
      'Dado un objeto `presupuesto = { servidores: 4500, licencias: 1800, capacitacion: 3200 }`, desarrolla una función `resumirPresupuesto(obj)` que lo recorra con `for (const [rubro, valor] of Object.entries(obj))` y determine el total y el rubro más costoso.',
    relevanceComment:
      'Guarda rubroMayor y valorMayor actualizándolos cada vez que valor > valorMayor.',
    exerciseStarterCode: `function resumirPresupuesto(obj) {
  let total = 0;
  let rubroMayor = '';
  let valorMayor = -Infinity;

  for (const [rubro, valor] of Object.entries(obj)) {
    total += valor;
    if (valor > valorMayor) {
      valorMayor = valor;
      rubroMayor = rubro;
    }
  }

  return { total, rubroMayor, valorMayor };
}

console.log(resumirPresupuesto({ servidores: 4500, licencias: 1800, capacitacion: 3200 }));`,
    exerciseSolution: `function resumirPresupuesto(obj) {
  let total = 0;
  let rubroMayor = '';
  let valorMayor = -Infinity;

  for (const [rubro, valor] of Object.entries(obj)) {
    total += valor;
    if (valor > valorMayor) {
      valorMayor = valor;
      rubroMayor = rubro;
    }
  }

  return { total, rubroMayor, valorMayor };
}

console.log(resumirPresupuesto({ servidores: 4500, licencias: 1800, capacitacion: 3200 }));
// -> { total: 9500, rubroMayor: "servidores", valorMayor: 4500 }`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'for...in con Object.hasOwn()',
    title: 'Desarrollo 3: Inspector Seguro de Propiedades Propias con for...in y Object.hasOwn',
    content:
      'Cuando se usa `for (const clave in objeto)`, el bucle también visita propiedades heredadas del prototipo. Desarrolla una función `extraerClavesPropias(objeto)` que filtre dentro del `for...in` únicamente las propiedades propias usando `Object.hasOwn(objeto, clave)`.',
    relevanceComment:
      'Object.hasOwn(obj, clave) (ES2022) reemplaza de forma segura al antiguo obj.hasOwnProperty(clave).',
    exerciseStarterCode: `const prototipoCentro = { pais: 'Colombia', institucion: 'SENA' };
const ambiente = Object.create(prototipoCentro);
ambiente.codigo = 'AMB-301';
ambiente.capacidad = 30;

function extraerClavesPropias(objeto) {
  const propias = [];
  for (const clave in objeto) {
    if (Object.hasOwn(objeto, clave)) {
      propias.push(clave);
    }
  }
  return propias;
}

console.log('Solo propiedades propias:', extraerClavesPropias(ambiente));`,
    exerciseSolution: `const prototipoCentro = { pais: 'Colombia', institucion: 'SENA' };
const ambiente = Object.create(prototipoCentro);
ambiente.codigo = 'AMB-301';
ambiente.capacidad = 30;

function extraerClavesPropias(objeto) {
  const propias = [];
  for (const clave in objeto) {
    if (Object.hasOwn(objeto, clave)) {
      propias.push(clave);
    }
  }
  return propias;
}

console.log('Solo propiedades propias:', extraerClavesPropias(ambiente)); // ["codigo", "capacidad"]`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Procesamiento Tolerante a Fallos en Lotes',
    title: 'Desarrollo 4: Procesador de Lote JSON que Aísla Registros Corruptos',
    content:
      'Desarrolla `procesarLoteJson(cadenas)` que recorra un arreglo de strings JSON con `for...of`. Dentro del ciclo, usa `try / catch` para que los JSON válidos se agreguen a `exitosos` y los corruptos se registren en `fallidos` sin abortar el resto del lote.',
    relevanceComment:
      'Colocar el bloque try/catch DENTRO del bucle for...of permite que el bucle continúe tras un error.',
    exerciseStarterCode: `function procesarLoteJson(cadenas) {
  const exitosos = [];
  const fallidos = [];

  for (const raw of cadenas) {
    try {
      exitosos.push(JSON.parse(raw));
    } catch (err) {
      fallidos.push({ entrada: raw, error: err.name });
    }
  }

  return { exitosos, fallidos };
}

console.log(
  procesarLoteJson([
    '{"id": 1, "ok": true}',
    '{corrupto}',
    '{"id": 2, "ok": true}',
  ])
);`,
    exerciseSolution: `function procesarLoteJson(cadenas) {
  const exitosos = [];
  const fallidos = [];

  for (const raw of cadenas) {
    try {
      exitosos.push(JSON.parse(raw));
    } catch (err) {
      fallidos.push({ entrada: raw, error: err.name });
    }
  }

  return { exitosos, fallidos };
}

console.log(
  procesarLoteJson([
    '{"id": 1, "ok": true}',
    '{corrupto}',
    '{"id": 2, "ok": true}',
  ])
);`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Excepciones Tipadas (TypeError y RangeError)',
    title: 'Desarrollo 5: Validador de Calificación con Lanzamiento de TypeError y RangeError',
    content:
      'Desarrolla `registrarNotaSegura(aprendiz, nota)` que:\n• Lance `new TypeError("El nombre debe ser string y la nota numérica")` si los tipos son incorrectos.\n• Lance `new RangeError("La nota debe estar entre 0 y 100")` si `nota < 0 || nota > 100`.\n• Pruebe su comportamiento capturando el error con `try / catch`.',
    relevanceComment:
      'Distingue en el catch el tipo de error consultando error.name.',
    exerciseStarterCode: `function registrarNotaSegura(aprendiz, nota) {
  if (typeof aprendiz !== 'string' || typeof nota !== 'number' || Number.isNaN(nota)) {
    throw new TypeError('El nombre debe ser string y la nota numérica');
  }
  if (nota < 0 || nota > 100) {
    throw new RangeError('La nota debe estar entre 0 y 100');
  }
  return { aprendiz, nota, estado: nota >= 70 ? 'A' : 'D' };
}

for (const prueba of [
  ['Valentina', 95],
  ['Mateo', 130],
  [null, '80'],
]) {
  try {
    console.log('✓ Registro:', registrarNotaSegura(prueba[0], prueba[1]));
  } catch (err) {
    console.warn(\`✗ [\${err.name}]: \${err.message}\`);
  }
}`,
    exerciseSolution: `function registrarNotaSegura(aprendiz, nota) {
  if (typeof aprendiz !== 'string' || typeof nota !== 'number' || Number.isNaN(nota)) {
    throw new TypeError('El nombre debe ser string y la nota numérica');
  }
  if (nota < 0 || nota > 100) {
    throw new RangeError('La nota debe estar entre 0 y 100');
  }
  return { aprendiz, nota, estado: nota >= 70 ? 'A' : 'D' };
}

for (const prueba of [
  ['Valentina', 95],
  ['Mateo', 130],
  [null, '80'],
]) {
  try {
    console.log('✓ Registro:', registrarNotaSegura(prueba[0], prueba[1]));
  } catch (err) {
    console.warn(\`✗ [\${err.name}]: \${err.message}\`);
  }
}`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Iteración sobre Conjuntos (Set) con for...of',
    title: 'Desarrollo 6: Detector de Competencias Comunes entre Dos Fichas con Set y for...of',
    content:
      'Dadas dos listas de competencias `fichaA` y `fichaB`, convierte `fichaB` en un `new Set(fichaB)` y recorre `fichaA` con `for...of` para encontrar la intersección (competencias presentes en ambas fichas).',
    relevanceComment:
      'setB.has(elemento) verifica pertenencia en tiempo constante O(1).',
    exerciseStarterCode: `function hallarCompetenciasComunes(fichaA, fichaB) {
  const setB = new Set(fichaB);
  const comunes = [];

  for (const comp of fichaA) {
    if (setB.has(comp)) {
      comunes.push(comp);
    }
  }
  return comunes;
}

console.log(
  hallarCompetenciasComunes(
    ['Algoritmia', 'SQL', 'JavaScript', 'Ética'],
    ['Inglés', 'JavaScript', 'Docker', 'SQL']
  )
);`,
    exerciseSolution: `function hallarCompetenciasComunes(fichaA, fichaB) {
  const setB = new Set(fichaB);
  const comunes = [];

  for (const comp of fichaA) {
    if (setB.has(comp)) {
      comunes.push(comp);
    }
  }
  return comunes;
}

console.log(
  hallarCompetenciasComunes(
    ['Algoritmia', 'SQL', 'JavaScript', 'Ética'],
    ['Inglés', 'JavaScript', 'Docker', 'SQL']
  )
); // ["SQL", "JavaScript"]`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Reintentos con Captura de Excepciones',
    title: 'Desarrollo 7: Ejecutor de Operación con Reintentos Automáticos en try/catch',
    content:
      'Desarrolla una función `ejecutarConReintentos(operacionFn, maxIntentos)` que invoque `operacionFn(intento)` dentro de un ciclo `for` protegido por `try / catch`. Si la función tiene éxito, retorna inmediatamente el resultado; si falla en todos los intentos, lanza el último error capturado.',
    relevanceComment:
      'Este patrón (Retry Pattern) es estándar en clientes HTTP y microservicios.',
    exerciseStarterCode: `function ejecutarConReintentos(operacionFn, maxIntentos) {
  let ultimoError = null;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      const resultado = operacionFn(intento);
      return { exitoEnIntento: intento, resultado };
    } catch (err) {
      ultimoError = err;
      console.warn(\`Intento #\${intento} falló: \${err.message}\`);
    }
  }

  throw ultimoError;
}

// Simula una operación que falla en los intentos 1 y 2, y triunfa en el 3:
const respuesta = ejecutarConReintentos((n) => {
  if (n < 3) throw new Error('Timeout de red');
  return 'Datos sincronizados con éxito';
}, 4);

console.log('Resultado final:', respuesta);`,
    exerciseSolution: `function ejecutarConReintentos(operacionFn, maxIntentos) {
  let ultimoError = null;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      const resultado = operacionFn(intento);
      return { exitoEnIntento: intento, resultado };
    } catch (err) {
      ultimoError = err;
      console.warn(\`Intento #\${intento} falló: \${err.message}\`);
    }
  }

  throw ultimoError;
}

const respuesta = ejecutarConReintentos((n) => {
  if (n < 3) throw new Error('Timeout de red');
  return 'Datos sincronizados con éxito';
}, 4);

console.log('Resultado final:', respuesta);`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Auditoría de Recursos con finally',
    title: 'Desarrollo 8: Gestor de Bloqueo de Archivo (Mutex Lock) con Liberación en finally',
    content:
      'Desarrolla una función `procesarConCandado(recurso, tareaFn)` que active `recurso.bloqueado = true` antes del `try`, ejecute `tareaFn()` y garantice en el bloque `finally` que `recurso.bloqueado` vuelva siempre a `false` aunque `tareaFn` lance una excepción.',
    relevanceComment:
      'Si un candado (lock) no se libera en finally, un error dejaría el recurso bloqueado permanentemente (deadlock).',
    exerciseStarterCode: `function procesarConCandado(recurso, tareaFn) {
  recurso.bloqueado = true;
  try {
    return tareaFn();
  } catch (err) {
    console.warn('Error durante la tarea:', err.message);
    return null;
  } finally {
    recurso.bloqueado = false;
  }
}

const archivoActa = { nombre: 'acta_2874512.pdf', bloqueado: false };
procesarConCandado(archivoActa, () => {
  console.log('¿Bloqueado durante ejecución?:', archivoActa.bloqueado);
  throw new Error('Fallo de escritura en disco');
});
console.log('¿Bloqueado después del error?:', archivoActa.bloqueado);`,
    exerciseSolution: `function procesarConCandado(recurso, tareaFn) {
  recurso.bloqueado = true;
  try {
    return tareaFn();
  } catch (err) {
    console.warn('Error durante la tarea:', err.message);
    return null;
  } finally {
    recurso.bloqueado = false;
  }
}

const archivoActa = { nombre: 'acta_2874512.pdf', bloqueado: false };
procesarConCandado(archivoActa, () => {
  console.log('¿Bloqueado durante ejecución?:', archivoActa.bloqueado); // true
  throw new Error('Fallo de escritura en disco');
});
console.log('¿Bloqueado después del error?:', archivoActa.bloqueado); // false`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Evaluador de Expresiones Postfijas con Excepciones',
    title: 'Desarrollo 9: Calculadora Segura con Validación de Operadores y Operandos',
    content:
      'Desarrolla una función `evaluarOperacionSegura(a, operador, b)` que valide que `a` y `b` sean números finitos (`Number.isFinite`), soporte `"+"`, `"-"`, `"*"`, `"/"` (lanzando error si `b === 0`) y lance un `Error` si el operador no es reconocido.',
    relevanceComment:
      'Number.isFinite(n) descarta tanto NaN como Infinity y tipos no numéricos.',
    exerciseStarterCode: `function evaluarOperacionSegura(a, operador, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('Los operandos deben ser números finitos');
  }
  switch (operador) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw new RangeError('División por cero no permitida');
      return a / b;
    default:
      throw new Error(\`Operador desconocido: \${operador}\`);
  }
}

try {
  console.log('15 * 4 =', evaluarOperacionSegura(15, '*', 4));
  console.log('15 $ 4 =', evaluarOperacionSegura(15, '$', 4));
} catch (e) {
  console.error(\`[\${e.name}] \${e.message}\`);
}`,
    exerciseSolution: `function evaluarOperacionSegura(a, operador, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('Los operandos deben ser números finitos');
  }
  switch (operador) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw new RangeError('División por cero no permitida');
      return a / b;
    default:
      throw new Error(\`Operador desconocido: \${operador}\`);
  }
}

try {
  console.log('15 * 4 =', evaluarOperacionSegura(15, '*', 4));
  console.log('15 $ 4 =', evaluarOperacionSegura(15, '$', 4));
} catch (e) {
  console.error(\`[\${e.name}] \${e.message}\`);
}`,
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'ex-js203-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Frecuencia de Palabras con Map y for...of',
    title: 'Desarrollo 10: Analizador de Frecuencia de Palabras con for...of',
    content:
      'Desarrolla una función `contarFrecuenciaPalabras(parrafo)` que limpie signos de puntuación, divida el texto en palabras y utilice un ciclo `for (const palabra of palabras)` para construir un diccionario con el número de apariciones de cada palabra.',
    relevanceComment:
      'Usa diccionario[palabra] = (diccionario[palabra] ?? 0) + 1 en cada iteración del for...of.',
    exerciseStarterCode: `function contarFrecuenciaPalabras(parrafo) {
  const palabras = parrafo
    .toLowerCase()
    .replace(/[.,;:]/g, '')
    .split(/\\s+/)
    .filter(Boolean);

  const frecuencias = {};
  for (const palabra of palabras) {
    frecuencias[palabra] = (frecuencias[palabra] ?? 0) + 1;
  }

  return frecuencias;
}

console.log(
  contarFrecuenciaPalabras('JavaScript es rápido, JavaScript es versátil y SENA enseña JavaScript.')
);`,
    exerciseSolution: `function contarFrecuenciaPalabras(parrafo) {
  const palabras = parrafo
    .toLowerCase()
    .replace(/[.,;:]/g, '')
    .split(/\\s+/)
    .filter(Boolean);

  const frecuencias = {};
  for (const palabra of palabras) {
    frecuencias[palabra] = (frecuencias[palabra] ?? 0) + 1;
  }

  return frecuencias;
}

console.log(
  contarFrecuenciaPalabras('JavaScript es rápido, JavaScript es versátil y SENA enseña JavaScript.')
);`,
    sourceNodeId: 'node-js-203',
  },
];
