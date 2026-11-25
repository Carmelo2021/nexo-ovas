import { LessonBlock } from '../types/ova';

// ============================================================================
// OVA 3 · TÓPICO 1 (les-js-301): ARREGLOS (INDEXACIÓN, PUSH/POP/SHIFT/UNSHIFT, SLICE)
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_301: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js301-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Indexación [0] y .at(-1)',
    title: 'Lectura del Primer y Último Elemento de un Arreglo',
    content:
      'Dado el arreglo `lenguajes = ["JavaScript", "TypeScript", "Python", "SQL"]`, imprime en consola el primer elemento (`lenguajes[0]`) y el último elemento usando `.at(-1)`.',
    relevanceComment:
      'El método .at(-1) accede directamente al último elemento sin escribir lenguajes[lenguajes.length - 1].',
    exerciseStarterCode: `const lenguajes = ['JavaScript', 'TypeScript', 'Python', 'SQL'];
console.log('Primero [0]:', lenguajes[0]);
console.log('Último (-1):', lenguajes.at(-1));`,
    exerciseSolution: `const lenguajes = ['JavaScript', 'TypeScript', 'Python', 'SQL'];
console.log('Primero [0]:', lenguajes[0]);     // "JavaScript"
console.log('Último (-1):', lenguajes.at(-1)); // "SQL"`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Operaciones O(1) al Final (.push y .pop)',
    title: 'Agregar y Extraer al Final del Arreglo con .push() y .pop()',
    content:
      'Agrega `"Docker"` al final del arreglo `herramientas = ["Git", "Node.js"]` con `.push()`, luego extrae el último elemento con `.pop()` e imprime ambos resultados.',
    relevanceComment:
      '.push() retorna la nueva longitud del arreglo; .pop() retorna el elemento extraído.',
    exerciseStarterCode: `const herramientas = ['Git', 'Node.js'];
herramientas.push('Docker');
console.log('Tras push:', [...herramientas]);

const extraido = herramientas.pop();
console.log('Elemento extraído:', extraido, '| Arreglo actual:', herramientas);`,
    exerciseSolution: `const herramientas = ['Git', 'Node.js'];
herramientas.push('Docker');
console.log('Tras push:', [...herramientas]); // ["Git", "Node.js", "Docker"]

const extraido = herramientas.pop();
console.log('Elemento extraído:', extraido, '| Arreglo actual:', herramientas);`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Operaciones al Inicio (.unshift y .shift)',
    title: 'Insertar y Desenfilar en el Índice [0] con .unshift() y .shift()',
    content:
      'Inserta `"Prioritario"` al inicio de `cola = ["Normal-1", "Normal-2"]` usando `.unshift()`, y luego atiende al primero de la fila con `.shift()`.',
    relevanceComment:
      '.unshift() desplaza los elementos hacia la derecha e inserta en la posición [0].',
    exerciseStarterCode: `const cola = ['Normal-1', 'Normal-2'];
cola.unshift('Prioritario');
console.log('Cola tras unshift:', [...cola]);

const atendido = cola.shift();
console.log('Atendido:', atendido, '| Restantes:', cola);`,
    exerciseSolution: `const cola = ['Normal-1', 'Normal-2'];
cola.unshift('Prioritario');
console.log('Cola tras unshift:', [...cola]); // ["Prioritario", "Normal-1", "Normal-2"]

const atendido = cola.shift();
console.log('Atendido:', atendido, '| Restantes:', cola);`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Sub-arreglo Inmutable con .slice()',
    title: 'Extracción de Sub-arreglo sin Mutar el Original con .slice()',
    content:
      'Extrae los elementos en los índices `1` y `2` de `trimestres = ["T1", "T2", "T3", "T4"]` usando `trimestres.slice(1, 3)` y verifica que `trimestres` permanece intacto.',
    relevanceComment:
      '.slice(inicio, fin) incluye el índice inicio y se detiene justo antes del índice fin.',
    exerciseStarterCode: `const trimestres = ['T1', 'T2', 'T3', 'T4'];
const centrales = trimestres.slice(1, 3);
console.log('Sub-arreglo extraído:', centrales);
console.log('Original intacto    :', trimestres);`,
    exerciseSolution: `const trimestres = ['T1', 'T2', 'T3', 'T4'];
const centrales = trimestres.slice(1, 3);
console.log('Sub-arreglo extraído:', centrales);  // ["T2", "T3"]
console.log('Original intacto    :', trimestres); // ["T1", "T2", "T3", "T4"]`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Fusión Inmutable con Spread (...)',
    title: 'Unión de Dos Arreglos con el Operador Spread (...)',
    content:
      'Une `frontend = ["HTML", "CSS"]` y `backend = ["Node.js", "PostgreSQL"]` en un nuevo arreglo `fullstack = [...frontend, ...backend]`.',
    relevanceComment:
      'El operador Spread (...) expande los elementos de cada arreglo dentro del nuevo literal [ ].',
    exerciseStarterCode: `const frontend = ['HTML', 'CSS'];
const backend = ['Node.js', 'PostgreSQL'];

const fullstack = [...frontend, ...backend];
console.log('Stack completo:', fullstack);`,
    exerciseSolution: `const frontend = ['HTML', 'CSS'];
const backend = ['Node.js', 'PostgreSQL'];

const fullstack = [...frontend, ...backend];
console.log('Stack completo:', fullstack); // ["HTML", "CSS", "Node.js", "PostgreSQL"]`,
    sourceNodeId: 'node-js-301',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js301-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Cola FIFO con .push() y .shift()',
    title: 'Desarrollo 1: Gestor de Cola de Impresión de Certificados (FIFO)',
    content:
      'Desarrolla una función `procesarColaImpresion(colaInicial, nuevosTrabajos, cantidadImprimir)` que agregue `nuevosTrabajos` al final de una copia de `colaInicial` y extraiga del frente (`shift`) hasta `cantidadImprimir` trabajos, retornando `{ impresos, enEspera }`.',
    relevanceComment:
      'Clona primero const cola = [...colaInicial] para mantener la función pura.',
    exerciseStarterCode: `function procesarColaImpresion(colaInicial, nuevosTrabajos, cantidadImprimir) {
  const cola = [...colaInicial, ...nuevosTrabajos];
  const impresos = [];

  for (let i = 0; i < cantidadImprimir && cola.length > 0; i++) {
    impresos.push(cola.shift());
  }

  return { impresos, enEspera: cola };
}

console.log(
  procesarColaImpresion(['CERT-01', 'CERT-02'], ['CERT-03', 'CERT-04'], 3)
);`,
    exerciseSolution: `function procesarColaImpresion(colaInicial, nuevosTrabajos, cantidadImprimir) {
  const cola = [...colaInicial, ...nuevosTrabajos];
  const impresos = [];

  for (let i = 0; i < cantidadImprimir && cola.length > 0; i++) {
    impresos.push(cola.shift());
  }

  return { impresos, enEspera: cola };
}

console.log(
  procesarColaImpresion(['CERT-01', 'CERT-02'], ['CERT-03', 'CERT-04'], 3)
);
// -> { impresos: ["CERT-01", "CERT-02", "CERT-03"], enEspera: ["CERT-04"] }`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Pila LIFO con .push() y .pop()',
    title: 'Desarrollo 2: Historial de Deshacer (Undo Stack) en un Editor de OVAs',
    content:
      'Desarrolla una función `simularDeshacerAcciones(acciones, cantidadDeshacer)` que apile cada acción con `.push()` y luego desapile las últimas `cantidadDeshacer` acciones con `.pop()`, retornando `{ deshechas, estadoActualPila }`.',
    relevanceComment:
      'Una pila LIFO (Last-In, First-Out) extrae siempre la acción más reciente con .pop().',
    exerciseStarterCode: `function simularDeshacerAcciones(acciones, cantidadDeshacer) {
  const pila = [];
  for (const acc of acciones) {
    pila.push(acc);
  }

  const deshechas = [];
  for (let i = 0; i < cantidadDeshacer && pila.length > 0; i++) {
    deshechas.push(pila.pop());
  }

  return { deshechas, estadoActualPila: pila };
}

console.log(
  simularDeshacerAcciones(['Crear Título', 'Agregar Código', 'Agregar Video', 'Borrar Texto'], 2)
);`,
    exerciseSolution: `function simularDeshacerAcciones(acciones, cantidadDeshacer) {
  const pila = [];
  for (const acc of acciones) {
    pila.push(acc);
  }

  const deshechas = [];
  for (let i = 0; i < cantidadDeshacer && pila.length > 0; i++) {
    deshechas.push(pila.pop());
  }

  return { deshechas, estadoActualPila: pila };
}

console.log(
  simularDeshacerAcciones(['Crear Título', 'Agregar Código', 'Agregar Video', 'Borrar Texto'], 2)
);`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Rotación Circular Inmutable con .slice()',
    title: 'Desarrollo 3: Rotador Circular de Turnos K Posiciones a la Derecha',
    content:
      'Desarrolla `rotarDerecha(arr, k)` que rote circularmente los elementos `k` posiciones a la derecha usando `arr.slice(-pasos)` y `arr.slice(0, -pasos)` (donde `pasos = k % arr.length`).',
    relevanceComment:
      'Usar k % arr.length garantiza que funcione incluso si k es mayor que la longitud del arreglo.',
    exerciseStarterCode: `function rotarDerecha(arr, k) {
  if (arr.length === 0) return [];
  const pasos = k % arr.length;
  if (pasos === 0) return [...arr];
  return [...arr.slice(-pasos), ...arr.slice(0, -pasos)];
}

console.log(rotarDerecha(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], 2));`,
    exerciseSolution: `function rotarDerecha(arr, k) {
  if (arr.length === 0) return [];
  const pasos = k % arr.length;
  if (pasos === 0) return [...arr];
  return [...arr.slice(-pasos), ...arr.slice(0, -pasos)];
}

console.log(rotarDerecha(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], 2));
// -> ["Jueves", "Viernes", "Lunes", "Martes", "Miércoles"]`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Deduplicación Preservando Orden',
    title: 'Desarrollo 4: Eliminador de Duplicados Comparando .includes() vs. Set',
    content:
      'Desarrolla una función `obtenerElementosUnicos(lista)` que retorne un nuevo arreglo sin elementos repetidos manteniendo el orden original de aparición.',
    relevanceComment:
      'Tanto [...new Set(lista)] como un bucle con !unicos.includes(item) preservan el orden de la primera aparición.',
    exerciseStarterCode: `function obtenerElementosUnicos(lista) {
  return [...new Set(lista)];
}

console.log(obtenerElementosUnicos(['JS', 'SQL', 'JS', 'Node', 'SQL', 'React']));`,
    exerciseSolution: `function obtenerElementosUnicos(lista) {
  return [...new Set(lista)];
}

console.log(obtenerElementosUnicos(['JS', 'SQL', 'JS', 'Node', 'SQL', 'React']));
// -> ["JS", "SQL", "Node", "React"]`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Paginación y Chunking con .slice()',
    title: 'Desarrollo 5: Particionador de Listado de Aprendices en Páginas (Chunks)',
    content:
      'Desarrolla `paginarListado(items, tamanoPagina)` que divida un arreglo en sub-arreglos de máximo `tamanoPagina` elementos usando un bucle `for (let i = 0; i < items.length; i += tamanoPagina)` y `items.slice(i, i + tamanoPagina)`.',
    relevanceComment:
      'Si el último bloque tiene menos elementos que tamanoPagina, .slice() toma automáticamente solo los restantes.',
    exerciseStarterCode: `function paginarListado(items, tamanoPagina) {
  if (tamanoPagina <= 0) return [];
  const paginas = [];
  for (let i = 0; i < items.length; i += tamanoPagina) {
    paginas.push(items.slice(i, i + tamanoPagina));
  }
  return paginas;
}

console.log(paginarListado(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'], 3));`,
    exerciseSolution: `function paginarListado(items, tamanoPagina) {
  if (tamanoPagina <= 0) return [];
  const paginas = [];
  for (let i = 0; i < items.length; i += tamanoPagina) {
    paginas.push(items.slice(i, i + tamanoPagina));
  }
  return paginas;
}

console.log(paginarListado(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'], 3));
// -> [["A1", "A2", "A3"], ["A4", "A5", "A6"], ["A7"]]`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Inserción y Reemplazo Inmutable sin Mutar con .splice()',
    title: 'Desarrollo 6: Reemplazo de un Elemento en el Índice K sin Mutar el Original',
    content:
      'Desarrolla una función `reemplazarEnIndiceInmutable(arr, indice, nuevoValor)` que retorne una copia del arreglo con `nuevoValor` en la posición `indice` utilizando `[...arr.slice(0, indice), nuevoValor, ...arr.slice(indice + 1)]`.',
    relevanceComment:
      'Este patrón evita mutar el arreglo original (o puedes usar el moderno arr.with(indice, nuevoValor) de ES2023).',
    exerciseStarterCode: `function reemplazarEnIndiceInmutable(arr, indice, nuevoValor) {
  if (indice < 0 || indice >= arr.length) return [...arr];
  return [...arr.slice(0, indice), nuevoValor, ...arr.slice(indice + 1)];
}

const original = ['Borrador', 'En Revisión', 'Pendiente'];
const actualizado = reemplazarEnIndiceInmutable(original, 2, 'Publicado');
console.log('Original   :', original);
console.log('Actualizado:', actualizado);`,
    exerciseSolution: `function reemplazarEnIndiceInmutable(arr, indice, nuevoValor) {
  if (indice < 0 || indice >= arr.length) return [...arr];
  return [...arr.slice(0, indice), nuevoValor, ...arr.slice(indice + 1)];
}

const original = ['Borrador', 'En Revisión', 'Pendiente'];
const actualizado = reemplazarEnIndiceInmutable(original, 2, 'Publicado');
console.log('Original   :', original);    // ["Borrador", "En Revisión", "Pendiente"]
console.log('Actualizado:', actualizado); // ["Borrador", "En Revisión", "Publicado"]`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Intercalado (Zip / Merge) de Dos Arreglos',
    title: 'Desarrollo 7: Intercalador Alternado de Dos Arreglos',
    content:
      'Desarrolla `intercalarArreglos(arrA, arrB)` que combine dos arreglos alternando sus elementos uno a uno (`[a0, b0, a1, b1, ...]`), agregando al final los elementos sobrantes si uno de los arreglos es más largo.',
    relevanceComment:
      'Itera hasta Math.max(arrA.length, arrB.length) y agrega arrA[i] si i < arrA.length y arrB[i] si i < arrB.length.',
    exerciseStarterCode: `function intercalarArreglos(arrA, arrB) {
  const resultado = [];
  const maxLen = Math.max(arrA.length, arrB.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < arrA.length) resultado.push(arrA[i]);
    if (i < arrB.length) resultado.push(arrB[i]);
  }
  return resultado;
}

console.log(intercalarArreglos(['T1', 'T2', 'T3'], ['E1', 'E2', 'E3', 'E4']));`,
    exerciseSolution: `function intercalarArreglos(arrA, arrB) {
  const resultado = [];
  const maxLen = Math.max(arrA.length, arrB.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < arrA.length) resultado.push(arrA[i]);
    if (i < arrB.length) resultado.push(arrB[i]);
  }
  return resultado;
}

console.log(intercalarArreglos(['T1', 'T2', 'T3'], ['E1', 'E2', 'E3', 'E4']));
// -> ["T1", "E1", "T2", "E2", "T3", "E3", "E4"]`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Inversión In-Place con Dos Punteros',
    title: 'Desarrollo 8: Inversión Algorítmica de un Arreglo con Dos Punteros Extremos',
    content:
      'Sin usar `.reverse()`, desarrolla `invertirConDosPunteros(arreglo)` que clone el arreglo y utilice dos punteros (`izq = 0` y `der = copia.length - 1`) intercambiando `[copia[izq], copia[der]] = [copia[der], copia[izq]]` mientras `izq < der`.',
    relevanceComment:
      'Este algoritmo realiza exactamente Math.floor(n / 2) intercambios.',
    exerciseStarterCode: `function invertirConDosPunteros(arreglo) {
  const copia = [...arreglo];
  let izq = 0;
  let der = copia.length - 1;

  while (izq < der) {
    [copia[izq], copia[der]] = [copia[der], copia[izq]];
    izq++;
    der--;
  }
  return copia;
}

console.log(invertirConDosPunteros([10, 20, 30, 40, 50]));`,
    exerciseSolution: `function invertirConDosPunteros(arreglo) {
  const copia = [...arreglo];
  let izq = 0;
  let der = copia.length - 1;

  while (izq < der) {
    [copia[izq], copia[der]] = [copia[der], copia[izq]];
    izq++;
    der--;
  }
  return copia;
}

console.log(invertirConDosPunteros([10, 20, 30, 40, 50])); // [50, 40, 30, 20, 10]`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Aplanamiento de Arreglos Anidados (.flat y Recursión)',
    title: 'Desarrollo 9: Aplanador de Matriz Multinivel de Nodos a Lista Lineal',
    content:
      'Dado un arreglo con sub-arreglos anidados a varios niveles `[[1, 2], [3, [4, 5]], 6]`, desarrolla una función `aplanarArreglo(arr)` que retorne un único arreglo plano `[1, 2, 3, 4, 5, 6]`.',
    relevanceComment:
      'Puedes resolverlo recursivamente con Array.isArray(item) o con el método nativo arr.flat(Infinity).',
    exerciseStarterCode: `function aplanarArreglo(arr) {
  const plano = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      plano.push(...aplanarArreglo(item));
    } else {
      plano.push(item);
    }
  }
  return plano;
}

console.log(aplanarArreglo([['OVA-1', 'OVA-2'], ['OVA-3', ['Lección 1', 'Lección 2']]]));`,
    exerciseSolution: `function aplanarArreglo(arr) {
  const plano = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      plano.push(...aplanarArreglo(item));
    } else {
      plano.push(item);
    }
  }
  return plano;
}

console.log(aplanarArreglo([['OVA-1', 'OVA-2'], ['OVA-3', ['Lección 1', 'Lección 2']]]));`,
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'ex-js301-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Validador Sintáctico con Pila (Stack LIFO)',
    title: 'Desarrollo 10: Verificador de Delimitadores (), [] y {} Balanceados',
    content:
      'Desarrolla la función `verificarBalanceParentesis(expresion)` utilizando un arreglo como Pila (`.push()` al abrir `(`, `[`, `{` y `.pop()` al cerrar `)`, `]`, `}`), retornando `true` si todos los delimitadores cierran en el orden correcto y la pila termina vacía.',
    relevanceComment:
      'Si al encontrar un cierre la pila está vacía o el tope no coincide con su apertura correspondiente, retorna false de inmediato.',
    exerciseStarterCode: `function verificarBalanceParentesis(expresion) {
  const pila = [];
  const mapaApertura = { ')': '(', ']': '[', '}': '{' };

  for (const char of expresion) {
    if (char === '(' || char === '[' || char === '{') {
      pila.push(char);
    } else if (char === ')' || char === ']' || char === '}') {
      if (pila.pop() !== mapaApertura[char]) return false;
    }
  }
  return pila.length === 0;
}

console.log('Expresión 1:', verificarBalanceParentesis('const a = [{ id: (1 + 2) }];'));
console.log('Expresión 2:', verificarBalanceParentesis('const a = [{ id: (1 + 2 }];'));`,
    exerciseSolution: `function verificarBalanceParentesis(expresion) {
  const pila = [];
  const mapaApertura = { ')': '(', ']': '[', '}': '{' };

  for (const char of expresion) {
    if (char === '(' || char === '[' || char === '{') {
      pila.push(char);
    } else if (char === ')' || char === ']' || char === '}') {
      if (pila.pop() !== mapaApertura[char]) return false;
    }
  }
  return pila.length === 0;
}

console.log('Expresión 1:', verificarBalanceParentesis('const a = [{ id: (1 + 2) }];')); // true
console.log('Expresión 2:', verificarBalanceParentesis('const a = [{ id: (1 + 2 }];'));  // false`,
    sourceNodeId: 'node-js-301',
  },
];

// ============================================================================
// OVA 3 · TÓPICO 2 (les-js-302): MÉTODOS FUNCIONALES (.map, .filter, .find, .reduce)
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_302: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js302-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Proyección con .map()',
    title: 'Aplicar Bonificación de +5 Puntos a Todas las Notas con .map()',
    content:
      'Utiliza `.map((n) => n + 5)` sobre `notas = [70, 82, 90]` para generar un nuevo arreglo con las notas bonificadas.',
    relevanceComment:
      '.map() transforma cada elemento 1 a 1 y retorna un nuevo arreglo de igual longitud.',
    exerciseStarterCode: `const notas = [70, 82, 90];
const notasConBono = notas.map((n) => n + 5);
console.log('Notas bonificadas:', notasConBono);`,
    exerciseSolution: `const notas = [70, 82, 90];
const notasConBono = notas.map((n) => n + 5);
console.log('Notas bonificadas:', notasConBono); // [75, 87, 95]`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Selección con .filter()',
    title: 'Filtrar Únicamente Puntajes Aprobados (>= 70) con .filter()',
    content:
      'Utiliza `.filter((n) => n >= 70)` sobre `puntajes = [55, 78, 92, 64, 88]` para obtener solo los aprobados.',
    relevanceComment:
      '.filter() incluye en el nuevo arreglo solo los elementos cuyo callback retorne true.',
    exerciseStarterCode: `const puntajes = [55, 78, 92, 64, 88];
const aprobados = puntajes.filter((n) => n >= 70);
console.log('Aprobados:', aprobados);`,
    exerciseSolution: `const puntajes = [55, 78, 92, 64, 88];
const aprobados = puntajes.filter((n) => n >= 70);
console.log('Aprobados:', aprobados); // [78, 92, 88]`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Búsqueda con .find()',
    title: 'Localizar el Primer Aprendiz con Puntaje de Excelencia (> 95) con .find()',
    content:
      'Utiliza `.find((a) => a.nota > 95)` para obtener el primer objeto aprendiz que supere 95 puntos.',
    relevanceComment:
      'A diferencia de .filter() (que retorna un array), .find() retorna el primer elemento coincidente o undefined.',
    exerciseStarterCode: `const aprendices = [
  { nombre: 'Mateo', nota: 84 },
  { nombre: 'Valentina', nota: 98 },
  { nombre: 'Laura', nota: 96 },
];

const excelencia = aprendices.find((a) => a.nota > 95);
console.log('Primer aprendiz > 95:', excelencia);`,
    exerciseSolution: `const aprendices = [
  { nombre: 'Mateo', nota: 84 },
  { nombre: 'Valentina', nota: 98 },
  { nombre: 'Laura', nota: 96 },
];

const excelencia = aprendices.find((a) => a.nota > 95);
console.log('Primer aprendiz > 95:', excelencia); // { nombre: "Valentina", nota: 98 }`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Acumulación con .reduce()',
    title: 'Sumar el Total de Horas de un OVA con .reduce()',
    content:
      'Usa `.reduce((acc, h) => acc + h, 0)` para sumar todas las duraciones de `horasLecciones = [12, 18, 24]`.',
    relevanceComment:
      'El segundo argumento 0 de .reduce(callback, 0) define el valor inicial del acumulador.',
    exerciseStarterCode: `const horasLecciones = [12, 18, 24];
const totalHoras = horasLecciones.reduce((acc, h) => acc + h, 0);
console.log('Total horas acumuladas:', totalHoras);`,
    exerciseSolution: `const horasLecciones = [12, 18, 24];
const totalHoras = horasLecciones.reduce((acc, h) => acc + h, 0);
console.log('Total horas acumuladas:', totalHoras); // 54`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Cuantificadores .some() y .every()',
    title: 'Verificación Booleana Rápida con .every() y .some()',
    content:
      'Comprueba con `.every((n) => n >= 70)` si todos aprobaron en `grupo = [75, 88, 92]`, y con `.some((n) => n >= 90)` si al menos uno obtuvo 90 o más.',
    relevanceComment:
      '.every() equivale al operador lógico AND sobre toda la colección; .some() equivale al operador OR.',
    exerciseStarterCode: `const grupo = [75, 88, 92];
console.log('¿Todos aprobaron (>=70)?:', grupo.every((n) => n >= 70));
console.log('¿Alguno sacó >=90?     :', grupo.some((n) => n >= 90));`,
    exerciseSolution: `const grupo = [75, 88, 92];
console.log('¿Todos aprobaron (>=70)?:', grupo.every((n) => n >= 70)); // true
console.log('¿Alguno sacó >=90?     :', grupo.some((n) => n >= 90));  // true`,
    sourceNodeId: 'node-js-302',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js302-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Transformación de Objetos con .map()',
    title: 'Desarrollo 1: Proyección de Catálogo con Cálculo de IVA y Formato con .map()',
    content:
      'Desarrolla una función `proyectarPreciosConIva(productos)` que use `.map()` para retornar un nuevo arreglo donde cada producto tenga `{ codigo, nombre: nombre.trim().toUpperCase(), precioBase, iva: Math.round(precioBase * 0.19), precioTotal: Math.round(precioBase * 1.19) }`.',
    relevanceComment:
      'Al retornar un objeto literal desde una arrow function, envuélvelo en paréntesis: (p) => ({ ... }).',
    exerciseStarterCode: `function proyectarPreciosConIva(productos) {
  return productos.map((p) => {
    const iva = Math.round(p.precioBase * 0.19);
    return {
      codigo: p.codigo,
      nombre: p.nombre.trim().toUpperCase(),
      precioBase: p.precioBase,
      iva,
      precioTotal: p.precioBase + iva,
    };
  });
}

console.log(
  proyectarPreciosConIva([
    { codigo: 'HW-01', nombre: ' Portátil Dev ', precioBase: 2500000 },
    { codigo: 'HW-02', nombre: 'Mouse Óptico', precioBase: 60000 },
  ])
);`,
    exerciseSolution: `function proyectarPreciosConIva(productos) {
  return productos.map((p) => {
    const iva = Math.round(p.precioBase * 0.19);
    return {
      codigo: p.codigo,
      nombre: p.nombre.trim().toUpperCase(),
      precioBase: p.precioBase,
      iva,
      precioTotal: p.precioBase + iva,
    };
  });
}

console.log(
  proyectarPreciosConIva([
    { codigo: 'HW-01', nombre: ' Portátil Dev ', precioBase: 2500000 },
    { codigo: 'HW-02', nombre: 'Mouse Óptico', precioBase: 60000 },
  ])
);`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Filtrado Compuesto con .filter()',
    title: 'Desarrollo 2: Filtro Multicriterio de Evidencias Entregadas a Tiempo',
    content:
      'Desarrolla `filtrarEvidenciasValidas(entregas)` que retorne con `.filter()` solo aquellas entregas que cumplan: `entregada === true`, `puntaje >= 70` y `diasRetraso === 0`.',
    relevanceComment:
      'Combina las tres condiciones booleanas con && dentro del predicado de .filter().',
    exerciseStarterCode: `function filtrarEvidenciasValidas(entregas) {
  return entregas.filter(
    (e) => e.entregada === true && e.puntaje >= 70 && e.diasRetraso === 0
  );
}

const listaEntregas = [
  { aprendiz: 'Valentina', entregada: true, puntaje: 95, diasRetraso: 0 },
  { aprendiz: 'Mateo', entregada: true, puntaje: 82, diasRetraso: 2 },
  { aprendiz: 'Laura', entregada: true, puntaje: 88, diasRetraso: 0 },
];

console.log(filtrarEvidenciasValidas(listaEntregas));`,
    exerciseSolution: `function filtrarEvidenciasValidas(entregas) {
  return entregas.filter(
    (e) => e.entregada === true && e.puntaje >= 70 && e.diasRetraso === 0
  );
}

const listaEntregas = [
  { aprendiz: 'Valentina', entregada: true, puntaje: 95, diasRetraso: 0 },
  { aprendiz: 'Mateo', entregada: true, puntaje: 82, diasRetraso: 2 },
  { aprendiz: 'Laura', entregada: true, puntaje: 88, diasRetraso: 0 },
];

console.log(filtrarEvidenciasValidas(listaEntregas));`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Encadenamiento .filter() + .map()',
    title: 'Desarrollo 3: Generador de Correos para Aprendices en Plan de Mejoramiento',
    content:
      'Desarrolla una función `notificarPlanMejoramiento(aprendices)` que encadene `.filter((a) => a.nota < 70)` seguido de `.map((a) => ...)` para retornar un arreglo de mensajes personalizados dirigidos únicamente a quienes deben presentar plan de mejoramiento.',
    relevanceComment:
      'El encadenamiento funcional evita crear variables intermedias innecesarias.',
    exerciseStarterCode: `function notificarPlanMejoramiento(aprendices) {
  return aprendices
    .filter((a) => a.nota < 70)
    .map(
      (a) =>
        \`Citatorio para \${a.nombre} (Nota: \${a.nota}): Presentar plan de mejoramiento.\`
    );
}

console.log(
  notificarPlanMejoramiento([
    { nombre: 'Valentina', nota: 94 },
    { nombre: 'Carlos', nota: 58 },
    { nombre: 'Andrés', nota: 64 },
  ])
);`,
    exerciseSolution: `function notificarPlanMejoramiento(aprendices) {
  return aprendices
    .filter((a) => a.nota < 70)
    .map(
      (a) =>
        \`Citatorio para \${a.nombre} (Nota: \${a.nota}): Presentar plan de mejoramiento.\`
    );
}

console.log(
  notificarPlanMejoramiento([
    { nombre: 'Valentina', nota: 94 },
    { nombre: 'Carlos', nota: 58 },
    { nombre: 'Andrés', nota: 64 },
  ])
);`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Agrupación con .reduce()',
    title: 'Desarrollo 4: Agrupador de Conteo de Aprendices por Estado Académico con .reduce()',
    content:
      'Desarrolla `contarPorEstado(aprendices)` que utilice `.reduce((acc, item) => ..., {})` para contar cuántos aprendices hay en cada `estado` (`"CERTIFICADO"`, `"EN_FORMACION"`, `"APLAZADO"`).',
    relevanceComment:
      'Inicializa cada clave dinámica con acc[item.estado] = (acc[item.estado] ?? 0) + 1.',
    exerciseStarterCode: `function contarPorEstado(aprendices) {
  return aprendices.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] ?? 0) + 1;
    return acc;
  }, {});
}

console.log(
  contarPorEstado([
    { nombre: 'A1', estado: 'EN_FORMACION' },
    { nombre: 'A2', estado: 'CERTIFICADO' },
    { nombre: 'A3', estado: 'EN_FORMACION' },
    { nombre: 'A4', estado: 'APLAZADO' },
    { nombre: 'A5', estado: 'EN_FORMACION' },
  ])
);`,
    exerciseSolution: `function contarPorEstado(aprendices) {
  return aprendices.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] ?? 0) + 1;
    return acc;
  }, {});
}

console.log(
  contarPorEstado([
    { nombre: 'A1', estado: 'EN_FORMACION' },
    { nombre: 'A2', estado: 'CERTIFICADO' },
    { nombre: 'A3', estado: 'EN_FORMACION' },
    { nombre: 'A4', estado: 'APLAZADO' },
    { nombre: 'A5', estado: 'EN_FORMACION' },
  ])
);
// -> { EN_FORMACION: 3, CERTIFICADO: 1, APLAZADO: 1 }`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Cálculo de Carrito de Compras con .reduce()',
    title: 'Desarrollo 5: Liquidador de Carrito de Compras (Cantidad x Precio - Descuento)',
    content:
      'Desarrolla `calcularTotalCarrito(items)` usando `.reduce()` donde cada ítem tiene `{ producto, cantidad, precioUnitario, descuentoPorcentaje }`. Calcula el total neto a pagar sumando `cantidad * precioUnitario * (1 - descuentoPorcentaje / 100)` de cada línea.',
    relevanceComment:
      'Retorna en cada vuelta del reduce el acumulador más el subtotal neto de la línea actual.',
    exerciseStarterCode: `function calcularTotalCarrito(items) {
  return items.reduce((total, item) => {
    const bruto = item.cantidad * item.precioUnitario;
    const neto = bruto * (1 - (item.descuentoPorcentaje ?? 0) / 100);
    return total + neto;
  }, 0);
}

console.log(
  'Total neto carrito:',
  calcularTotalCarrito([
    { producto: 'SSD 1TB', cantidad: 2, precioUnitario: 300000, descuentoPorcentaje: 10 },
    { producto: 'RAM 16GB', cantidad: 1, precioUnitario: 200000, descuentoPorcentaje: 0 },
  ])
);`,
    exerciseSolution: `function calcularTotalCarrito(items) {
  return items.reduce((total, item) => {
    const bruto = item.cantidad * item.precioUnitario;
    const neto = bruto * (1 - (item.descuentoPorcentaje ?? 0) / 100);
    return total + neto;
  }, 0);
}

console.log(
  'Total neto carrito:',
  calcularTotalCarrito([
    { producto: 'SSD 1TB', cantidad: 2, precioUnitario: 300000, descuentoPorcentaje: 10 },
    { producto: 'RAM 16GB', cantidad: 1, precioUnitario: 200000, descuentoPorcentaje: 0 },
  ])
); // 740000`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Búsqueda y Actualización Inmutable con .findIndex()',
    title: 'Desarrollo 6: Actualizador de Puntaje por ID de Aprendiz con .findIndex() y .map()',
    content:
      'Desarrolla `actualizarNotaPorId(aprendices, idBuscado, nuevaNota)` que primero verifique con `.some((a) => a.id === idBuscado)` si existe, y retorne un nuevo arreglo con `.map()` reemplazando únicamente la nota del aprendiz coincidente.',
    relevanceComment:
      'En el callback de .map(): a.id === idBuscado ? { ...a, nota: nuevaNota } : a.',
    exerciseStarterCode: `function actualizarNotaPorId(aprendices, idBuscado, nuevaNota) {
  const existe = aprendices.some((a) => a.id === idBuscado);
  if (!existe) return { actualizado: false, lista: aprendices };

  const nuevaLista = aprendices.map((a) =>
    a.id === idBuscado ? { ...a, nota: nuevaNota } : a
  );
  return { actualizado: true, lista: nuevaLista };
}

const grupo = [
  { id: 101, nombre: 'Valentina', nota: 88 },
  { id: 102, nombre: 'Mateo', nota: 65 },
];
console.log(actualizarNotaPorId(grupo, 102, 80));`,
    exerciseSolution: `function actualizarNotaPorId(aprendices, idBuscado, nuevaNota) {
  const existe = aprendices.some((a) => a.id === idBuscado);
  if (!existe) return { actualizado: false, lista: aprendices };

  const nuevaLista = aprendices.map((a) =>
    a.id === idBuscado ? { ...a, nota: nuevaNota } : a
  );
  return { actualizado: true, lista: nuevaLista };
}

const grupo = [
  { id: 101, nombre: 'Valentina', nota: 88 },
  { id: 102, nombre: 'Mateo', nota: 65 },
];
console.log(actualizarNotaPorId(grupo, 102, 80));`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Mapeo y Aplanamiento con .flatMap()',
    title: 'Desarrollo 7: Extractor Único de Etiquetas (Tags) de Todos los Nodos con .flatMap()',
    content:
      'Cada nodo del Canvas tiene un arreglo `tags` (ej. `{ titulo: "Nodo 1", tags: ["JS", "Sintaxis"] }`). Desarrolla `extraerTagsUnicos(nodos)` que utilice `nodos.flatMap((n) => n.tags)` combinado con `new Set(...)` para obtener todas las etiquetas únicas sin repetición.',
    relevanceComment:
      '.flatMap(fn) equivale a ejecutar .map(fn) seguido de .flat(1) en un solo paso eficiente.',
    exerciseStarterCode: `function extraerTagsUnicos(nodos) {
  const todosLosTags = nodos.flatMap((n) => n.tags);
  return [...new Set(todosLosTags)];
}

console.log(
  extraerTagsUnicos([
    { id: 1, tags: ['JavaScript', 'Variables', 'ES6'] },
    { id: 2, tags: ['Ciclos', 'JavaScript', 'Algoritmia'] },
    { id: 3, tags: ['Arrays', 'ES6'] },
  ])
);`,
    exerciseSolution: `function extraerTagsUnicos(nodos) {
  const todosLosTags = nodos.flatMap((n) => n.tags);
  return [...new Set(todosLosTags)];
}

console.log(
  extraerTagsUnicos([
    { id: 1, tags: ['JavaScript', 'Variables', 'ES6'] },
    { id: 2, tags: ['Ciclos', 'JavaScript', 'Algoritmia'] },
    { id: 3, tags: ['Arrays', 'ES6'] },
  ])
); // ["JavaScript", "Variables", "ES6", "Ciclos", "Algoritmia", "Arrays"]`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Ordenamiento Inmutable Multicriterio',
    title: 'Desarrollo 8: Ordenamiento de Aprendices por Promedio Descendente y Nombre Alfabético',
    content:
      'Desarrolla `ordenarRankingAprendices(lista)` que clone el arreglo (`[...lista]`) y lo ordene con `.sort((a, b) => ...)`: primero de mayor a menor `promedio` (`b.promedio - a.promedio`), y en caso de empate en promedio, alfabéticamente por `nombre` usando `a.nombre.localeCompare(b.nombre)`.',
    relevanceComment:
      'Como .sort() muta el arreglo in-place, clónalo siempre primero con [...lista].sort(...).',
    exerciseStarterCode: `function ordenarRankingAprendices(lista) {
  return [...lista].sort((a, b) => {
    if (b.promedio !== a.promedio) {
      return b.promedio - a.promedio;
    }
    return a.nombre.localeCompare(b.nombre);
  });
}

console.log(
  ordenarRankingAprendices([
    { nombre: 'Mateo', promedio: 92 },
    { nombre: 'Valentina', promedio: 96 },
    { nombre: 'Ana', promedio: 92 },
  ])
);`,
    exerciseSolution: `function ordenarRankingAprendices(lista) {
  return [...lista].sort((a, b) => {
    if (b.promedio !== a.promedio) {
      return b.promedio - a.promedio;
    }
    return a.nombre.localeCompare(b.nombre);
  });
}

console.log(
  ordenarRankingAprendices([
    { nombre: 'Mateo', promedio: 92 },
    { nombre: 'Valentina', promedio: 96 },
    { nombre: 'Ana', promedio: 92 },
  ])
);
// -> 1. Valentina (96), 2. Ana (92), 3. Mateo (92)`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Partición en Dos Grupos con .reduce()',
    title: 'Desarrollo 9: Función partition() Funcional (Aprobados vs. Reprobados en Un Solo Paso)',
    content:
      'En lugar de recorrer un arreglo dos veces con dos `.filter()`, desarrolla una función de orden superior `particionarColeccion(arreglo, predicadoFn)` que use un único `.reduce()` para separar los elementos en `{ cumplen: [...], noCumplen: [...] }`.',
    relevanceComment:
      'El valor inicial del reduce es { cumplen: [], noCumplen: [] }.',
    exerciseStarterCode: `function particionarColeccion(arreglo, predicadoFn) {
  return arreglo.reduce(
    (acc, item) => {
      if (predicadoFn(item)) {
        acc.cumplen.push(item);
      } else {
        acc.noCumplen.push(item);
      }
      return acc;
    },
    { cumplen: [], noCumplen: [] }
  );
}

console.log(particionarColeccion([95, 62, 84, 50, 71], (nota) => nota >= 70));`,
    exerciseSolution: `function particionarColeccion(arreglo, predicadoFn) {
  return arreglo.reduce(
    (acc, item) => {
      if (predicadoFn(item)) {
        acc.cumplen.push(item);
      } else {
        acc.noCumplen.push(item);
      }
      return acc;
    },
    { cumplen: [], noCumplen: [] }
  );
}

console.log(particionarColeccion([95, 62, 84, 50, 71], (nota) => nota >= 70));
// -> { cumplen: [95, 84, 71], noCumplen: [62, 50] }`,
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'ex-js302-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Composición de Funciones (Pipe Funcional) con .reduce()',
    title: 'Desarrollo 10: Motor de Tubería Funcional pipe(...funciones) Implementado con .reduce()',
    content:
      'En programación funcional, `pipe(fn1, fn2, fn3)(valorInicial)` pasa el valor por una secuencia de funciones donde la salida de cada una es la entrada de la siguiente. Desarrolla `crearPipe(...funciones)` usando `funciones.reduce((valorActual, fn) => fn(valorActual), valorInicial)` y pruébalo normalizando un texto.',
    relevanceComment:
      'Esta implementación de pipe en 2 líneas con .reduce() es una de las joyas de la programación funcional en JavaScript.',
    exerciseStarterCode: `function crearPipe(...funciones) {
  return (valorInicial) =>
    funciones.reduce((valorActual, fn) => fn(valorActual), valorInicial);
}

const generarSlugUrl = crearPipe(
  (texto) => texto.trim(),
  (texto) => texto.toLowerCase(),
  (texto) => texto.replace(/\\s+/g, '-')
);

console.log('Slug generado:', generarSlugUrl('  OVA 03 Arreglos y Objetos JS  '));`,
    exerciseSolution: `function crearPipe(...funciones) {
  return (valorInicial) =>
    funciones.reduce((valorActual, fn) => fn(valorActual), valorInicial);
}

const generarSlugUrl = crearPipe(
  (texto) => texto.trim(),
  (texto) => texto.toLowerCase(),
  (texto) => texto.replace(/\\s+/g, '-')
);

console.log('Slug generado:', generarSlugUrl('  OVA 03 Arreglos y Objetos JS  '));
// -> "ova-03-arreglos-y-objetos-js"`,
    sourceNodeId: 'node-js-302',
  },
];

// ============================================================================
// OVA 3 · TÓPICO 3 (les-js-303): OBJETOS CLAVE-VALOR, DESESTRUCTURACIÓN Y JSON
// 5 Ejercicios Propuestos Cortos + 10 Ejercicios Similares para Desarrollar
// ============================================================================

export const EXERCISES_JS_303: LessonBlock[] = [
  // --- 5 EJERCICIOS PROPUESTOS CORTOS ---
  {
    id: 'ex-js303-c1',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Notación de Punto vs. Corchetes Dinámicos',
    title: 'Acceso Dinámico a Propiedad mediante Variable entre Corchetes',
    content:
      'Dado `const curso = { codigo: "ADSO", duracionMeses: 27 };` y la variable `campoSolicitado = "duracionMeses"`, lee el valor usando `curso[campoSolicitado]` y ejecútalo.',
    relevanceComment:
      'Cuando el nombre de la clave está guardado en una variable, debes usar obligatoriamente corchetes obj[variable].',
    exerciseStarterCode: `const curso = { codigo: 'ADSO', duracionMeses: 27 };
const campoSolicitado = 'duracionMeses';

console.log('Valor leído dinámicamente:', curso[campoSolicitado]);`,
    exerciseSolution: `const curso = { codigo: 'ADSO', duracionMeses: 27 };
const campoSolicitado = 'duracionMeses';

console.log('Valor leído dinámicamente:', curso[campoSolicitado]); // 27`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-c2',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Desestructuración con Valor por Defecto',
    title: 'Desestructuración Rápida de Propiedades con Respaldo (=)',
    content:
      'Extrae `{ titulo, horas = 12 }` del objeto `const ova = { titulo: "JavaScript III" };` y verifica en consola que `horas` toma el valor por defecto `12`.',
    relevanceComment:
      'El valor por defecto en la desestructuración se activa cuando la propiedad es undefined.',
    exerciseStarterCode: `const ova = { titulo: 'JavaScript III' };
const { titulo, horas = 12 } = ova;

console.log({ titulo, horas });`,
    exerciseSolution: `const ova = { titulo: 'JavaScript III' };
const { titulo, horas = 12 } = ova;

console.log({ titulo, horas }); // { titulo: "JavaScript III", horas: 12 }`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-c3',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Clonación y Fusión con Spread (...)',
    title: 'Actualización Inmutable de Objeto con Operador Spread',
    content:
      'Crea un nuevo objeto `aprendizActualizado` copiando `aprendiz = { nombre: "Laura", trimestre: 4 }` con `{ ...aprendiz, trimestre: 5 }` y verifica que el original conserva `trimestre: 4`.',
    relevanceComment:
      'En { ...obj, propiedad: nuevoValor }, la propiedad escrita a la derecha sobrescribe a la copiada por el spread.',
    exerciseStarterCode: `const aprendiz = { nombre: 'Laura', trimestre: 4 };
const aprendizActualizado = { ...aprendiz, trimestre: 5 };

console.log('Original   :', aprendiz);
console.log('Actualizado:', aprendizActualizado);`,
    exerciseSolution: `const aprendiz = { nombre: 'Laura', trimestre: 4 };
const aprendizActualizado = { ...aprendiz, trimestre: 5 };

console.log('Original   :', aprendiz);            // { nombre: "Laura", trimestre: 4 }
console.log('Actualizado:', aprendizActualizado); // { nombre: "Laura", trimestre: 5 }`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-c4',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Introspección con Object.keys() y Object.values()',
    title: 'Extracción de Arreglos de Claves y Valores de un Objeto',
    content:
      'Imprime el arreglo de claves con `Object.keys(puntajes)` y el arreglo de valores con `Object.values(puntajes)` para `puntajes = { js: 95, sql: 88, git: 92 }`.',
    relevanceComment:
      'Object.values(obj) permite sumar rápidamente todos los valores de un objeto con .reduce().',
    exerciseStarterCode: `const puntajes = { js: 95, sql: 88, git: 92 };
console.log('Claves :', Object.keys(puntajes));
console.log('Valores:', Object.values(puntajes));`,
    exerciseSolution: `const puntajes = { js: 95, sql: 88, git: 92 };
console.log('Claves :', Object.keys(puntajes));   // ["js", "sql", "git"]
console.log('Valores:', Object.values(puntajes)); // [95, 88, 92]`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-c5',
    type: 'exercise',
    exerciseCategory: 'corto',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Serialización JSON.stringify() y JSON.parse()',
    title: 'Conversión de Objeto a Texto JSON y Reconstrucción',
    content:
      'Convierte `const ficha = { codigo: 2874512, activa: true };` a texto JSON con `JSON.stringify(ficha)` y vuelve a reconstruir un objeto con `JSON.parse(...)`.',
    relevanceComment:
      'JSON.stringify(JSON.parse(...)) realiza una copia profunda rápida para datos compatibles con JSON.',
    exerciseStarterCode: `const ficha = { codigo: 2874512, activa: true };
const textoJson = JSON.stringify(ficha);
const reconstruido = JSON.parse(textoJson);

console.log('String JSON :', textoJson, '| Tipo:', typeof textoJson);
console.log('Reconstruido:', reconstruido);`,
    exerciseSolution: `const ficha = { codigo: 2874512, activa: true };
const textoJson = JSON.stringify(ficha);
const reconstruido = JSON.parse(textoJson);

console.log('String JSON :', textoJson, '| Tipo:', typeof textoJson);
console.log('Reconstruido:', reconstruido);`,
    sourceNodeId: 'node-js-303',
  },

  // --- 10 EJERCICIOS SIMILARES PARA DESARROLLAR ---
  {
    id: 'ex-js303-d1',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Desestructuración Anidada y Alias',
    title: 'Desarrollo 1: Formateador de Perfil con Desestructuración Anidada y Renombramiento',
    content:
      'Desarrolla `extraerResumenInstructor(perfil)` que desestructure de `{ nombreCompleto, especialidad = "Ingeniería de Software", sede: { centro, regional } }`, renombrando `nombreCompleto` a `nombre`, y retorne `"${nombre} [${especialidad}] - ${centro} (${regional})"`.',
    relevanceComment:
      'Usa la sintaxis { nombreCompleto: nombre, sede: { centro, regional } = {} } = perfil.',
    exerciseStarterCode: `function extraerResumenInstructor(perfil) {
  const {
    nombreCompleto: nombre,
    especialidad = 'Ingeniería de Software',
    sede: { centro = 'CEET', regional = 'Distrito Capital' } = {},
  } = perfil;

  return \`\${nombre} [\${especialidad}] - \${centro} (\${regional})\`;
}

console.log(
  extraerResumenInstructor({
    nombreCompleto: 'Ing. Carlos Mendoza',
    sede: { centro: 'CEET', regional: 'Bogotá D.C.' },
  })
);`,
    exerciseSolution: `function extraerResumenInstructor(perfil) {
  const {
    nombreCompleto: nombre,
    especialidad = 'Ingeniería de Software',
    sede: { centro = 'CEET', regional = 'Distrito Capital' } = {},
  } = perfil;

  return \`\${nombre} [\${especialidad}] - \${centro} (\${regional})\`;
}

console.log(
  extraerResumenInstructor({
    nombreCompleto: 'Ing. Carlos Mendoza',
    sede: { centro: 'CEET', regional: 'Bogotá D.C.' },
  })
);`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d2',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Básico',
    exerciseTopic: 'Propiedades Computadas Dinámicas ([clave])',
    title: 'Desarrollo 2: Constructor Dinámico de Parches de Estado para Formularios',
    content:
      'Desarrolla una función `aplicarCambioFormulario(estadoFormulario, nombreCampo, valorCampo)` que retorne un nuevo objeto con el campo `[nombreCampo]` actualizado en limpio (`.trim()` si es string) y una propiedad booleana `modificado: true`.',
    relevanceComment:
      'La sintaxis [nombreCampo]: valorLimpio evalúa la variable nombreCampo como clave del objeto.',
    exerciseStarterCode: `function aplicarCambioFormulario(estadoFormulario, nombreCampo, valorCampo) {
  const valorLimpio =
    typeof valorCampo === 'string' ? valorCampo.trim() : valorCampo;

  return {
    ...estadoFormulario,
    [nombreCampo]: valorLimpio,
    modificado: true,
  };
}

const formInicial = { titulo: 'OVA Borrador', horas: 10, modificado: false };
console.log(aplicarCambioFormulario(formInicial, 'titulo', '  OVA JavaScript III  '));`,
    exerciseSolution: `function aplicarCambioFormulario(estadoFormulario, nombreCampo, valorCampo) {
  const valorLimpio =
    typeof valorCampo === 'string' ? valorCampo.trim() : valorCampo;

  return {
    ...estadoFormulario,
    [nombreCampo]: valorLimpio,
    modificado: true,
  };
}

const formInicial = { titulo: 'OVA Borrador', horas: 10, modificado: false };
console.log(aplicarCambioFormulario(formInicial, 'titulo', '  OVA JavaScript III  '));`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d3',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Indexación O(1) con Object.fromEntries()',
    title: 'Desarrollo 3: Convertidor de Lista de OVAs a Diccionario Indexado por Código',
    content:
      'Desarrolla `indexarOvasPorCodigo(listaOvas)` que convierta un arreglo de objetos OVA en un diccionario cuyas claves sean `ova.code` usando `Object.fromEntries(listaOvas.map((o) => [o.code, o]))`.',
    relevanceComment:
      'Con un diccionario indexado, buscar una OVA por su código pasa de O(n) a O(1) instantáneo.',
    exerciseStarterCode: `function indexarOvasPorCodigo(listaOvas) {
  return Object.fromEntries(listaOvas.map((ova) => [ova.code, ova]));
}

const mapaOvas = indexarOvasPorCodigo([
  { code: 'OVA-JS-01', titulo: 'Fundamentos JS' },
  { code: 'OVA-JS-02', titulo: 'Estructuras de Control' },
  { code: 'OVA-JS-03', titulo: 'Arreglos y Objetos' },
]);

console.log('Acceso directo O(1) a OVA-JS-02:', mapaOvas['OVA-JS-02']);`,
    exerciseSolution: `function indexarOvasPorCodigo(listaOvas) {
  return Object.fromEntries(listaOvas.map((ova) => [ova.code, ova]));
}

const mapaOvas = indexarOvasPorCodigo([
  { code: 'OVA-JS-01', titulo: 'Fundamentos JS' },
  { code: 'OVA-JS-02', titulo: 'Estructuras de Control' },
  { code: 'OVA-JS-03', titulo: 'Arreglos y Objetos' },
]);

console.log('Acceso directo O(1) a OVA-JS-02:', mapaOvas['OVA-JS-02']);`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d4',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Filtrado de Propiedades de un Objeto',
    title: 'Desarrollo 4: Eliminador Inmutable de Campos Nulos o Vacíos de un Objeto',
    content:
      'Antes de enviar una petición HTTP a una API, es buena práctica omitir los campos del filtro que estén en `null`, `undefined` o `""`. Desarrolla `limpiarFiltrosVacios(filtrosObj)` usando `Object.entries()`, `.filter()` y `Object.fromEntries()`.',
    relevanceComment:
      'Conserva el par [clave, valor] únicamente si valor !== null && valor !== undefined && valor !== "".',
    exerciseStarterCode: `function limpiarFiltrosVacios(filtrosObj) {
  return Object.fromEntries(
    Object.entries(filtrosObj).filter(
      ([, valor]) => valor !== null && valor !== undefined && valor !== ''
    )
  );
}

console.log(
  limpiarFiltrosVacios({
    ficha: 2874512,
    busqueda: '',
    estado: 'PUBLICADO',
    tutor: null,
    pagina: 0,
  })
);`,
    exerciseSolution: `function limpiarFiltrosVacios(filtrosObj) {
  return Object.fromEntries(
    Object.entries(filtrosObj).filter(
      ([, valor]) => valor !== null && valor !== undefined && valor !== ''
    )
  );
}

console.log(
  limpiarFiltrosVacios({
    ficha: 2874512,
    busqueda: '',
    estado: 'PUBLICADO',
    tutor: null,
    pagina: 0,
  })
);
// -> { ficha: 2874512, estado: "PUBLICADO", pagina: 0 }`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d5',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Inversión de Claves y Valores en un Diccionario',
    title: 'Desarrollo 5: Inversor de Diccionario (Clave <-> Valor) con Object.entries()',
    content:
      'Desarrolla una función `invertirDiccionario(obj)` que intercambie las claves por los valores (`{ A: "Excelente", B: "Bueno" }` → `{ Excelente: "A", Bueno: "B" }`).',
    relevanceComment:
      'Mapea cada par ([clave, valor]) => [valor, clave] antes de pasarlo a Object.fromEntries().',
    exerciseStarterCode: `function invertirDiccionario(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([clave, valor]) => [valor, clave])
  );
}

console.log(invertirDiccionario({ A: 'Aprobado', D: 'Deficiente', P: 'Pendiente' }));`,
    exerciseSolution: `function invertirDiccionario(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([clave, valor]) => [valor, clave])
  );
}

console.log(invertirDiccionario({ A: 'Aprobado', D: 'Deficiente', P: 'Pendiente' }));
// -> { Aprobado: "A", Deficiente: "D", Pendiente: "P" }`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d6',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Métodos de Objeto y Contexto this',
    title: 'Desarrollo 6: Carrito de Compras Orientado a Objetos con Métodos y this',
    content:
      'Desarrolla una función fábrica `crearGestorFicha(codigoFicha)` que retorne un objeto con la propiedad `aprendices: []` y dos métodos que usen `this`: `matricular(nombre, nota)` y `obtenerResumen()` que retorne la cantidad de matriculados y su promedio.',
    relevanceComment:
      'Para que this apunte al objeto receptor, define los métodos con sintaxis de método abreviada matricular(nombre, nota) { ... }, no con arrow functions.',
    exerciseStarterCode: `function crearGestorFicha(codigoFicha) {
  return {
    codigoFicha,
    aprendices: [],
    matricular(nombre, nota) {
      this.aprendices.push({ nombre, nota });
    },
    obtenerResumen() {
      const total = this.aprendices.length;
      const suma = this.aprendices.reduce((acc, a) => acc + a.nota, 0);
      return {
        ficha: this.codigoFicha,
        matriculados: total,
        promedio: total > 0 ? Number((suma / total).toFixed(1)) : 0,
      };
    },
  };
}

const ficha287 = crearGestorFicha(2874512);
ficha287.matricular('Valentina', 96);
ficha287.matricular('Mateo', 84);
console.log(ficha287.obtenerResumen());`,
    exerciseSolution: `function crearGestorFicha(codigoFicha) {
  return {
    codigoFicha,
    aprendices: [],
    matricular(nombre, nota) {
      this.aprendices.push({ nombre, nota });
    },
    obtenerResumen() {
      const total = this.aprendices.length;
      const suma = this.aprendices.reduce((acc, a) => acc + a.nota, 0);
      return {
        ficha: this.codigoFicha,
        matriculados: total,
        promedio: total > 0 ? Number((suma / total).toFixed(1)) : 0,
      };
    },
  };
}

const ficha287 = crearGestorFicha(2874512);
ficha287.matricular('Valentina', 96);
ficha287.matricular('Mateo', 84);
console.log(ficha287.obtenerResumen());`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d7',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'Selección y Omisión de Propiedades (pick y omit)',
    title: 'Desarrollo 7: Utilidades Funcionales pick(obj, claves) y omit(obj, claves)',
    content:
      'En librerías como Lodash o TypeScript (`Pick<T, K>` y `Omit<T, K>`), es común proyectar un subconjunto de propiedades de un objeto. Desarrolla la función `seleccionarCampos(obj, camposPermitidos)` que retorne un nuevo objeto únicamente con las claves incluidas en el arreglo `camposPermitidos`.',
    relevanceComment:
      'Filtra Object.entries(obj) conservando solo las claves donde camposPermitidos.includes(clave).',
    exerciseStarterCode: `function seleccionarCampos(obj, camposPermitidos) {
  return Object.fromEntries(
    Object.entries(obj).filter(([clave]) => camposPermitidos.includes(clave))
  );
}

const usuarioBD = {
  id: 1,
  nombre: 'Valentina Rojas',
  correo: 'vrojas@soy.sena.edu.co',
  passwordHash: 'xyz123',
  ipUltimoAcceso: '192.168.1.10',
};

console.log(seleccionarCampos(usuarioBD, ['id', 'nombre', 'correo']));`,
    exerciseSolution: `function seleccionarCampos(obj, camposPermitidos) {
  return Object.fromEntries(
    Object.entries(obj).filter(([clave]) => camposPermitidos.includes(clave))
  );
}

const usuarioBD = {
  id: 1,
  nombre: 'Valentina Rojas',
  correo: 'vrojas@soy.sena.edu.co',
  passwordHash: 'xyz123',
  ipUltimoAcceso: '192.168.1.10',
};

console.log(seleccionarCampos(usuarioBD, ['id', 'nombre', 'correo']));
// -> { id: 1, nombre: "Valentina Rojas", correo: "vrojas@soy.sena.edu.co" }`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d8',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Intermedio',
    exerciseTopic: 'JSON.stringify con Función Replacer de Seguridad',
    title: 'Desarrollo 8: Exportador JSON con Enmascaramiento de Credenciales',
    content:
      'Desarrolla `serializarConAuditoria(objeto)` usando el segundo parámetro *replacer* de `JSON.stringify(objeto, (clave, valor) => ..., 2)` para que cualquier clave que incluya `"password"` o `"token"` reemplace su valor por `"[CONFIDENCIAL]"`.',
    relevanceComment:
      'El replacer se invoca para cada par clave-valor durante la serialización a JSON.',
    exerciseStarterCode: `function serializarConAuditoria(objeto) {
  return JSON.stringify(
    objeto,
    (clave, valor) => {
      const k = clave.toLowerCase();
      if (k.includes('password') || k.includes('token')) {
        return '[CONFIDENCIAL]';
      }
      return valor;
    },
    2
  );
}

console.log(
  serializarConAuditoria({
    usuario: 'instructor.sena',
    passwordDocente: 'sena2026',
    apiToken: 'abc-999',
    activo: true,
  })
);`,
    exerciseSolution: `function serializarConAuditoria(objeto) {
  return JSON.stringify(
    objeto,
    (clave, valor) => {
      const k = clave.toLowerCase();
      if (k.includes('password') || k.includes('token')) {
        return '[CONFIDENCIAL]';
      }
      return valor;
    },
    2
  );
}

console.log(
  serializarConAuditoria({
    usuario: 'instructor.sena',
    passwordDocente: 'sena2026',
    apiToken: 'abc-999',
    activo: true,
  })
);`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d9',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Fusión Profunda (Deep Merge) de Objetos de Configuración',
    title: 'Desarrollo 9: Algoritmo de Fusión Profunda (Deep Merge) de Dos Objetos',
    content:
      'El operador Spread `{ ...base, ...personalizado }` sobrescribe por completo los sub-objetos anidados. Desarrolla una función recursiva `fusionarObjetosProfundo(base, personalizado)` que combine también las propiedades de los sub-objetos internos.',
    relevanceComment:
      'Si tanto base[k] como personalizado[k] son objetos planos (no null ni Array), invoca fusionarObjetosProfundo(base[k], personalizado[k]).',
    exerciseStarterCode: `function esObjetoPlano(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function fusionarObjetosProfundo(base, personalizado) {
  const resultado = { ...base };
  for (const [clave, valor] of Object.entries(personalizado)) {
    if (esObjetoPlano(valor) && esObjetoPlano(resultado[clave])) {
      resultado[clave] = fusionarObjetosProfundo(resultado[clave], valor);
    } else {
      resultado[clave] = valor;
    }
  }
  return resultado;
}

const configDefecto = { tema: { color: 'azul', fuente: 'sans' }, notificaciones: true };
const configUsuario = { tema: { color: 'esmeralda' } };

console.log(fusionarObjetosProfundo(configDefecto, configUsuario));`,
    exerciseSolution: `function esObjetoPlano(val) {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function fusionarObjetosProfundo(base, personalizado) {
  const resultado = { ...base };
  for (const [clave, valor] of Object.entries(personalizado)) {
    if (esObjetoPlano(valor) && esObjetoPlano(resultado[clave])) {
      resultado[clave] = fusionarObjetosProfundo(resultado[clave], valor);
    } else {
      resultado[clave] = valor;
    }
  }
  return resultado;
}

const configDefecto = { tema: { color: 'azul', fuente: 'sans' }, notificaciones: true };
const configUsuario = { tema: { color: 'esmeralda' } };

console.log(fusionarObjetosProfundo(configDefecto, configUsuario));
// -> { tema: { color: "esmeralda", fuente: "sans" }, notificaciones: true }`,
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'ex-js303-d10',
    type: 'exercise',
    exerciseCategory: 'desarrollo',
    exerciseDifficulty: 'Avanzado',
    exerciseTopic: 'Detector de Diferencias (Object Diff) para Control de Cambios',
    title: 'Desarrollo 10: Auditor de Cambios (Diff) entre Dos Versiones de un Objeto OVA',
    content:
      'Desarrolla una función `detectarCambiosObjeto(versionAnterior, versionNueva)` que compare ambos objetos y retorne un diccionario únicamente con las propiedades cuyo valor haya cambiado, indicando `{ antes, despues }`.',
    relevanceComment:
      'Une todas las claves con new Set([...Object.keys(versionAnterior), ...Object.keys(versionNueva)]) y compara los valores con !==.',
    exerciseStarterCode: `function detectarCambiosObjeto(versionAnterior, versionNueva) {
  const todasLasClaves = new Set([
    ...Object.keys(versionAnterior),
    ...Object.keys(versionNueva),
  ]);
  const cambios = {};

  for (const clave of todasLasClaves) {
    if (versionAnterior[clave] !== versionNueva[clave]) {
      cambios[clave] = {
        antes: versionAnterior[clave],
        despues: versionNueva[clave],
      };
    }
  }
  return cambios;
}

const ovaV1 = { titulo: 'JavaScript III', horas: 20, estado: 'draft' };
const ovaV2 = { titulo: 'JavaScript III', horas: 30, estado: 'published' };

console.log('Diferencias detectadas:', detectarCambiosObjeto(ovaV1, ovaV2));`,
    exerciseSolution: `function detectarCambiosObjeto(versionAnterior, versionNueva) {
  const todasLasClaves = new Set([
    ...Object.keys(versionAnterior),
    ...Object.keys(versionNueva),
  ]);
  const cambios = {};

  for (const clave of todasLasClaves) {
    if (versionAnterior[clave] !== versionNueva[clave]) {
      cambios[clave] = {
        antes: versionAnterior[clave],
        despues: versionNueva[clave],
      };
    }
  }
  return cambios;
}

const ovaV1 = { titulo: 'JavaScript III', horas: 20, estado: 'draft' };
const ovaV2 = { titulo: 'JavaScript III', horas: 30, estado: 'published' };

console.log('Diferencias detectadas:', detectarCambiosObjeto(ovaV1, ovaV2));
// -> { horas: { antes: 20, despues: 30 }, estado: { antes: "draft", despues: "published" } }`,
    sourceNodeId: 'node-js-303',
  },
];
