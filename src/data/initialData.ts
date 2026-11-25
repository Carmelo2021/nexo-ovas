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
import {
  EXERCISES_JS_101,
  EXERCISES_JS_102,
  EXERCISES_JS_103,
} from './exercisesOva1';
import {
  EXERCISES_JS_201,
  EXERCISES_JS_202,
  EXERCISES_JS_203,
} from './exercisesOva2';
import {
  EXERCISES_JS_301,
  EXERCISES_JS_302,
  EXERCISES_JS_303,
} from './exercisesOva3';

export const DEFAULT_INSTRUCTOR: InstructorCredentials = {
  username: 'instructor.sena',
  password: 'sena2026',
  instructorName: 'Ing. Carlos Andrés Mendoza',
  centerName: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
  regionalName: 'Regional Distrito Capital — SENA',
  email: 'cmendoza@sena.edu.co',
};

// ============================================================================
// OVA 1: GENERALIDADES, SINTAXIS, TIPOS DE VARIABLES Y TIPOS DE DATOS
// (Teoría Extensa + Citas de Libros + 5 Ejercicios Cortos + 10 para Desarrollar por Tópico = 45 Ejercicios)
// ============================================================================

const BLOCKS_JS_101: LessonBlock[] = [
  {
    id: 'blk-js101-1',
    type: 'heading',
    title: '1. Naturaleza Histórica, Estandarización ECMAScript y Arquitectura JIT',
    content: '1. Naturaleza Histórica, Estandarización ECMAScript y Arquitectura JIT',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-2',
    type: 'text',
    content:
      'Creado originalmente en 1995 por **Brendan Eich** en Netscape y estandarizado desde 1997 por **Ecma International** bajo la especificación técnica **ECMA-262 (ECMAScript)**, JavaScript ha evolucionado desde un lenguaje de scripting ligero para el navegador hasta convertirse en la columna vertebral del desarrollo de software moderno (Frontend Web, Backend con Node.js/Deno/Bun, aplicaciones móviles híbridas y servicios Cloud Serverless).\n\nA diferencia de la creencia popular de que JavaScript es un lenguaje "puramente interpretado línea por línea", los motores industriales modernos como **V8** (Google Chrome y Node.js), **SpiderMonkey** (Mozilla Firefox) y **JavaScriptCore** (Apple Safari) implementan una arquitectura híbrida de **Compilación Justo a Tiempo (JIT — Just-In-Time Compilation)** en múltiples etapas:\n\n1. **Análisis Léxico y Sintáctico (Parser → AST):** El código fuente se descompila en *tokens* léxicos y se transforma en un **Árbol de Sintaxis Abstracta (AST)**, verificando en esta fase previa cualquier error gramatical (`SyntaxError`) antes de ejecutar una sola instrucción.\n2. **Intérprete de Bytecode (Ignition en V8):** El AST se traduce rápidamente a *bytecode* intermedio para arrancar la ejecución con latencia mínima.\n3. **Compilador Optimizador (TurboFan / Maglev en V8):** Mientras el programa corre, un *profiler* identifica las funciones "calientes" (*hot functions*) que se invocan repetidamente y las compila directamente a **código máquina nativo optimizado** para la arquitectura del procesador (x86_64 o ARM64). Consulta la guía oficial en [MDN JavaScript Guide](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide "Documentación oficial de Mozilla con la referencia completa de gramática léxica, motores y estándares ECMAScript.").',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-q1',
    type: 'quote',
    title: 'You Don’t Know JS Yet: Get Started (2.ª Edición, Cap. 1: What Is JavaScript?)',
    quoteAuthor: 'Kyle Simpson · Leanpub / O’Reilly (2020)',
    content:
      'JavaScript no es un lenguaje interpretado en el sentido tradicional; es un lenguaje compilado. El motor de JS analiza todo el código fuente antes de ejecutarlo, lo que significa que los errores de sintaxis estáticos se detectan durante la fase de compilación inicial, mucho antes de que comience la ejecución de la primera línea.',
    relevanceComment:
      'Esta distinción de Kyle Simpson explica por qué un error de escritura en la línea 200 de un archivo impide que se ejecute siquiera la línea 1: el motor compila y valida el árbol sintáctico completo (AST) como primer paso obligatorio.',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-3',
    type: 'heading',
    title: '2. Gramática Léxica, Expresiones vs. Sentencias y Modo Estricto',
    content: '2. Gramática Léxica, Expresiones vs. Sentencias y Modo Estricto',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-4',
    type: 'text',
    content:
      'Para escribir software robusto en JavaScript es indispensable dominar su **gramática léxica**. El lenguaje está codificado en **Unicode (UTF-16)** y es estrictamente **sensible a mayúsculas y minúsculas (*case-sensitive*)**: los identificadores `tasaInteres`, `TasaInteres` y `TASAINTERES` representan tres ubicaciones de memoria completamente distintas.\n\nAsimismo, la literatura técnica distingue dos unidades constructivas fundamentales en todo programa:\n\n• **Expresiones (*Expressions*):** Cualquier fragmento de código que se evalúa y **produce un valor**. Por ejemplo, `45 + 15`, `aprendiz.activo && nota >= 70` o una llamada `Math.max(10, 20)` son expresiones porque el motor las reduce a un valor concreto (`60`, `true`, `20`).\n• **Sentencias (*Statements*):** Instrucciones completas que realizan una **acción o efecto secundario** en el programa (declarar una variable, ramificar el flujo con `if`, iterar con `for` o retornar con `return`). Toda sentencia debe finalizar explícitamente con punto y coma (`;`) para no depender del mecanismo de **Inserción Automática de Punto y Coma (ASI)**, el cual puede provocar errores sutiles cuando una línea siguiente comienza con `(`, `[` o `` ` ``.',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-q2',
    type: 'quote',
    title: 'Eloquent JavaScript (4.ª Edición, Cap. 2: Program Structure)',
    quoteAuthor: 'Marijn Haverbeke · No Starch Press (2024)',
    content:
      'Un fragmento de código que produce un valor se denomina expresión. Una sentencia completa equivale a una oración en el lenguaje humano, y un programa no es más que una lista secuencial de sentencias que transforman el estado interno del mundo digital.',
    relevanceComment:
      'En React y JavaScript funcional moderno, saber qué es una expresión es vital: dentro de las llaves `{ ... }` de una plantilla o un Template Literal (`${...}`) solo puedes colocar expresiones (como el operador ternario), nunca sentencias crudas (como un bloque if/else).',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-5',
    type: 'callout',
    calloutTone: 'info',
    title: 'Estándares de Codificación Industrial y Modo Estricto ("use strict")',
    content:
      '• Directiva "use strict": Introducida en ECMAScript 5 y activada por defecto en todos los módulos ES6 (`import`/`export`) y clases (`class`), prohíbe crear variables globales accidentales por omisión de palabra reservada, bloquea parámetros duplicados y lanza errores cuando se intenta sobrescribir propiedades de solo lectura.\n• Convenciones de Nomenclatura: Usa `camelCase` para variables y funciones (`calcularPromedioFinal`), `PascalCase` para clases y componentes (`GestorCertificados`), y `UPPER_SNAKE_CASE` para constantes globales inmutables (`IVA_COLOMBIA = 0.19`).',
    sourceNodeId: 'node-js-101',
  },
  {
    id: 'blk-js101-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_01_arquitectura_lexica_y_expresiones.js',
    content: `'use strict';

/**
 * Ejemplo demostrativo de Gramática Léxica, Expresiones vs. Sentencias
 * y interpolación mediante Template Literals (Backticks).
 */

// 1. Constantes de configuración global (UPPER_SNAKE_CASE)
const HORAS_CREDITO_SENA = 48;
const PORCENTAJE_MINIMO_ASISTENCIA = 0.85;

// 2. Variables de dominio (camelCase)
const nombrePrograma = 'Tecnólogo en Análisis y Desarrollo de Software';
const creditosMatriculados = 4;

// 3. Expresión aritmética compuesta (se evalúa y reduce al valor numérico 192)
const totalHorasTrimestre = creditosMatriculados * HORAS_CREDITO_SENA;

// 4. Expresión relacional y booleana
const horasAsistidasAprendiz = 172;
const cumpleRequisitoAsistencia =
  horasAsistidasAprendiz >= totalHorasTrimestre * PORCENTAJE_MINIMO_ASISTENCIA;

// 5. Template Literal con expresiones embebidas dentro de \${ ... }
const reporteEjecutivo = \`[SENA - \${nombrePrograma}]
• Horas exigidas en el trimestre: \${totalHorasTrimestre} h
• Horas registradas por el aprendiz: \${horasAsistidasAprendiz} h (\${((horasAsistidasAprendiz / totalHorasTrimestre) * 100).toFixed(1)}%)
• Estado de habilitación: \${cumpleRequisitoAsistencia ? 'HABILITADO' : 'EN RIESGO ACADÉMICO'}\`;

console.log(reporteEjecutivo);`,
    relevanceComment:
      'Observa cómo dentro de ${ ... } en el Template Literal podemos anidar tanto llamadas a métodos (.toFixed(1)) como expresiones condicionales ternarias.',
    sourceNodeId: 'node-js-101',
  },
  ...EXERCISES_JS_101,
];

const BLOCKS_JS_102: LessonBlock[] = [
  {
    id: 'blk-js102-1',
    type: 'heading',
    title: '1. Evolución del Enlace de Variables: De var (ES5) a let y const (ES6+)',
    content: '1. Evolución del Enlace de Variables: De var (ES5) a let y const (ES6+)',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-2',
    type: 'text',
    content:
      'En la literatura académica de ciencias de la computación, una **variable** (también denominada **enlace** o *binding* por Marijn Haverbeke) es una asociación simbólica entre un identificador en el entorno léxico (*Lexical Environment*) y un valor almacenado en memoria.\n\nDurante los primeros 20 años de JavaScript (ECMAScript 1 hasta ECMAScript 5), la única forma de declarar variables era la palabra reservada **`var`**. Sin embargo, `var` presentaba tres comportamientos arquitectónicos problemáticos para proyectos de gran escala:\n\n1. **Ámbito de Función (*Function Scope*) en lugar de Ámbito de Bloque:** Una variable declarada con `var` dentro de un bloque `if { ... }` o dentro de un ciclo `for (var i = 0; ...)` **se escapa fuera de las llaves `{ }`** y contamina toda la función contenedora (o el objeto global).\n2. **Elevación (*Hoisting*) con inicialización implícita a `undefined`:** El motor registra las declaraciones `var` al principio de la función y les asigna `undefined`, permitiendo leer una variable antes de la línea donde fue declarada sin lanzar error, lo que oculta defectos lógicos.\n3. **Re-declaración silenciosa permitida:** Declarar dos veces `var total = 10; var total = 20;` en el mismo ámbito sobrescribe el enlace sin advertir al programador.\n\nPara solucionar definitivamente estos defectos, el comité **TC39** introdujo en **ECMAScript 2015 (ES6)** las declaraciones de ámbito de bloque **`let`** y **`const`**.',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-q1',
    type: 'quote',
    title: 'Understanding ECMAScript 6 (Cap. 1: Block Bindings)',
    quoteAuthor: 'Nicholas C. Zakas · No Starch Press (2016)',
    content:
      'Las declaraciones de variables utilizando var son tratadas como si estuvieran en la parte superior de la función (o en el ámbito global, si están fuera de una función) sin importar dónde ocurra realmente la declaración. Las declaraciones de bloque con let y const introducen el alcance léxico predecible que los ingenieros esperan de lenguajes como C, Java o C#.',
    relevanceComment:
      'Nicholas C. Zakas (creador de ESLint) destaca que el cambio de var a const/let fue la mejora más importante de ES6 para eliminar errores de colisión de variables en ciclos y condicionales.',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-3',
    type: 'diagram',
    diagramKind: 'var_let_const',
    title: 'Esquema Comparativo de Memoria y Ámbito: var vs. let vs. const',
    content:
      'Observa cómo let y const quedan estrictamente confinadas dentro de cualquier par de llaves { } (Block Scope) y están protegidas por la Zona Muerta Temporal (TDZ).',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-4',
    type: 'heading',
    title: '2. La Zona Muerta Temporal (TDZ) y la Diferencia entre Reasignación y Mutación',
    content: '2. La Zona Muerta Temporal (TDZ) y la Diferencia entre Reasignación y Mutación',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-5',
    type: 'text',
    content:
      'Cuando el motor de JavaScript entra en un bloque `{ ... }`, registra en memoria los identificadores declarados con `let` y `const`, pero **no los inicializa** hasta que la ejecución alcanza físicamente la línea de declaración. El intervalo entre el inicio del bloque y la línea donde se declara la variable se denomina **Zona Muerta Temporal (*Temporal Dead Zone — TDZ*)**. Cualquier intento de acceder a la variable dentro de su TDZ lanza inmediatamente un `ReferenceError: Cannot access variable before initialization`.\n\nPor otra parte, uno de los conceptos más malinterpretados por quienes inician en JavaScript es el significado exacto de **`const`**:\n\n• **`const` garantiza inmutabilidad de la REFERENCIA (el enlace), NO inmutabilidad profunda del valor apuntado.**\n• Si declaras un valor primitivo (`const TASA = 0.19;`), no puedes cambiarlo porque los primitivos son inmutables y la única forma de cambiarlo sería reasignar la variable (`TASA = 0.21` → `TypeError: Assignment to constant variable`).\n• Pero si declaras un objeto o un arreglo (`const aprendiz = { nota: 80 };`), la variable `aprendiz` guarda la **dirección de memoria** del objeto. Modificar una propiedad interna (`aprendiz.nota = 95;`) **sí está permitido** porque la dirección de memoria del objeto no cambió; lo que está prohibido es apuntar la variable a otro objeto nuevo (`aprendiz = { nota: 95 };`). Si deseas congelar también las propiedades superficiales del objeto, debes invocar **`Object.freeze(aprendiz)`**.',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-q2',
    type: 'quote',
    title: 'JavaScript: The Definitive Guide (7.ª Edición, Cap. 3: Types, Values, and Variables)',
    quoteAuthor: 'David Flanagan · O’Reilly Media (2020)',
    content:
      'Existe una escuela de pensamiento ampliamente adoptada en la ingeniería de JavaScript moderno que sostiene que debemos usar const por defecto para todas las declaraciones, reservando let exclusivamente para aquellas variables cuyo enlace sabemos de antemano que deberá reasignarse en el transcurso del algoritmo.',
    relevanceComment:
      'Al leer un archivo donde el 95% de las declaraciones son const, cualquier declaración let actúa como una señal visual inmediata para el lector: "¡Atención! Esta variable va a cambiar de valor más abajo".',
    sourceNodeId: 'node-js-102',
  },
  {
    id: 'blk-js102-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_02_block_scope_tdz_y_freeze.js',
    content: `'use strict';

// 1. Uso por defecto de const para referencias fijas
const CENTRO_SENA = 'CEET - Distrito Capital';

// 2. Uso intencional de let para estado que se reasigna (acumuladores y contadores)
let cuposInscritos = 28;
cuposInscritos += 2; // Reasignación válida -> 30

// 3. Demostración de Ámbito de Bloque (Block Scope) y Ocultamiento (Shadowing)
const estadoGlobal = 'ACTIVO';
if (cuposInscritos === 30) {
  // Esta constante 'estadoGlobal' existe SOLO dentro de este bloque if (Shadowing)
  const estadoGlobal = 'GRUPO COMPLETO (30/30)';
  const mensajeInterno = 'Cierre de inscripciones ejecutado';
  console.log('Dentro del bloque:', estadoGlobal, '|', mensajeInterno);
}
console.log('Fuera del bloque:', estadoGlobal); // Sigue siendo "ACTIVO"

// 4. const con Objetos: Mutación de propiedades vs. Object.freeze()
const configuracionEvaluacion = {
  notaMinima: 70,
  intentosMaximos: 3,
};
configuracionEvaluacion.intentosMaximos = 4; // ✓ Mutación interna permitida

// Si congelamos el objeto con Object.freeze(), impedimos también la mutación interna:
Object.freeze(configuracionEvaluacion);
// configuracionEvaluacion.notaMinima = 50; // ✗ Lanza TypeError en "use strict"`,
    relevanceComment:
      'Combina const + Object.freeze() cuando necesites que un diccionario de configuración sea verdaderamente inmutable tanto en su referencia como en sus propiedades.',
    sourceNodeId: 'node-js-102',
  },
  ...EXERCISES_JS_102,
];

const BLOCKS_JS_103: LessonBlock[] = [
  {
    id: 'blk-js103-1',
    type: 'heading',
    title: '1. Taxonomía Oficial de Tipos en ECMAScript: 7 Primitivos y Tipos de Referencia',
    content: '1. Taxonomía Oficial de Tipos en ECMAScript: 7 Primitivos y Tipos de Referencia',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-2',
    type: 'text',
    content:
      'En JavaScript, **las variables no tienen tipo; los valores sí tienen tipo**. Una misma variable declarada con `let` puede apuntar en un instante a un número y más adelante a una cadena de texto. Según la sección 6 de la especificación **ECMA-262**, todo valor en JavaScript pertenece exactamente a uno de los siguientes **8 tipos oficiales** (divididos en 7 tipos primitivos inmutables y la familia de Objetos/Referencias):\n\n1. **`number` (Numérico IEEE 754 de doble precisión - 64 bits):** Representa tanto enteros como números de punto flotante (hasta el límite entero seguro `Number.MAX_SAFE_INTEGER = 9007199254740991`), además de tres valores simbólicos especiales: `Infinity`, `-Infinity` y `NaN` (*Not-a-Number*).\n2. **`bigint` (Enteros de precisión arbitraria):** Escritos con el sufijo `n` (ej. `900719925474099912345n`), permiten operar con enteros astronómicos o criptográficos sin pérdida de precisión.\n3. **`string` (Cadena de caracteres UTF-16 inmutable):** Secuencia indexada de caracteres textuales. Una vez creado un string en memoria, ninguno de sus caracteres puede mutarse in-situ; métodos como `.toUpperCase()` o `.trim()` siempre devuelven un string nuevo.\n4. **`boolean` (Lógico Booleano):** Únicamente `true` o `false`.\n5. **`undefined` (No definido):** Tipo con un único valor (`undefined`) que el motor asigna automáticamente a las variables declaradas pero aún no inicializadas, a los parámetros omitidos y a las propiedades inexistentes.\n6. **`null` (Nulo intencional):** Tipo primitivo cuyo único valor (`null`) representa la ausencia intencional de cualquier referencia a objeto. Por un famoso accidente histórico de la primera versión de JavaScript en 1995 (donde las etiquetas de tipo de objeto eran `000` en binario y el puntero nulo también era `0x00`), el operador `typeof null` retorna `"object"`, aunque `null` es un tipo primitivo.\n7. **`symbol` (Símbolo único e irrepetible):** Creado mediante `Symbol("descripcion")`, genera identificadores garantizados como únicos para evitar colisiones de claves en objetos.\n8. **`object` (Tipos de Referencia en el Memory Heap):** Incluye objetos literales (`{}`), arreglos indexados (`[]`), funciones ejecutables (`function`), fechas (`Date`), mapas (`Map`), conjuntos (`Set`) y expresiones regulares (`RegExp`). Consulta la especificación en [MDN Estructuras y Tipos de Datos](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures "Documentación completa sobre los 7 tipos primitivos, el Heap de objetos y la tabla del operador typeof.").',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-q1',
    type: 'quote',
    title: 'You Don’t Know JS: Types & Grammar (Cap. 1: Types)',
    quoteAuthor: 'Kyle Simpson · O’Reilly Media',
    content:
      'Las variables en JavaScript no tienen tipos; los valores son los que tienen tipos. Las variables pueden contener cualquier valor, en cualquier momento. Comprender cómo un valor se convierte de un tipo a otro —ya sea de forma explícita por el desarrollador o de forma implícita mediante las reglas abstractas de coerción del motor— es la diferencia entre dominar el lenguaje o sufrir errores inexplicables.',
    relevanceComment:
      'Kyle Simpson recalca que el operador typeof no pregunta "¿cuál es el tipo de esta variable?", sino "¿cuál es el tipo del valor que está almacenado actualmente dentro de esta variable?".',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-3',
    type: 'diagram',
    diagramKind: 'data_types',
    title: 'Arquitectura de Memoria: Copia por Valor (Stack) vs. Copia por Referencia (Heap)',
    content:
      'Los 7 tipos primitivos se copian creando un valor independiente; los objetos y arreglos almacenan un puntero a la dirección del Heap, por lo que copiar la variable sin clonar el objeto hace que ambas variables apunten a la misma estructura.',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-4',
    type: 'heading',
    title: '2. Coerción de Tipos, Valores Falsy/Truthy e Igualdad Estricta (===)',
    content: '2. Coerción de Tipos, Valores Falsy/Truthy e Igualdad Estricta (===)',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-5',
    type: 'text',
    content:
      'Cuando aplicamos un operador a valores de tipos diferentes, el motor ejecuta operaciones internas de conversión llamadas **Coerción de Tipos (*Type Coercion*)**:\n\n• **La sobrecarga del operador `+`:** Si **cualquiera** de los dos operandos de `a + b` es un `string` (o se convierte a primitivo string), JavaScript prioriza la **concatenación textual** sobre la suma matemática (`"100" + 25` produce `"10025"`). Por el contrario, los operadores `-`, `*`, `/` y `%` son exclusivamente matemáticos y convierten ambos operandos a `number` (`"100" - 25` produce `75`).\n• **Los 8 Valores *Falsy* Exactos:** Al convertirse a `boolean` (por ejemplo, dentro de la condición de un `if (valor)`), existen exactamente **8 valores en todo JavaScript que se evalúan como `false`**: `false`, `0`, `-0`, `0n` (BigInt cero), `""` (cadena vacía), `null`, `undefined` y `NaN`. **Absolutamente cualquier otro valor** (incluyendo un arreglo vacío `[]`, un objeto vacío `{}` y la cadena `"0"` o `"false"`) es **`truthy` (verdadero)**.\n• **Igualdad Estricta (`===`) vs. Igualdad Abstracta (`==`):** El operador `==` intenta igualar los tipos mediante reglas complejas (por ejemplo, `0 == ""` es `true` y `false == "0"` es `true`). El operador **`===`** compara tipo y valor directamente sin ninguna conversión implícita.',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-q2',
    type: 'quote',
    title: 'JavaScript: The Good Parts (Apéndice A: Awful Parts)',
    quoteAuthor: 'Douglas Crockford · O’Reilly Media',
    content:
      'JavaScript tiene dos conjuntos de operadores de igualdad: === y !==, y sus gemelos malvados == y !=. Los operadores == y != realizan coerción de tipos antes de comparar, lo que carece de transitividad y produce resultados contraintuitivos. Mi consejo es no utilizar jamás los gemelos malvados; usa siempre === y !==.',
    relevanceComment:
      'Esta cita clásica de Douglas Crockford (creador del formato JSON) dio origen a la regla eqeqeq en ESLint, estándar obligatorio hoy en la industria.',
    sourceNodeId: 'node-js-103',
  },
  {
    id: 'blk-js103-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_03_tipos_coercion_y_referencias.js',
    content: `'use strict';

// 1. Verificación precisa de tipos (resolviendo el caso especial de null y arrays)
function obtenerTipoExacto(valor) {
  if (valor === null) return 'null';
  if (Array.isArray(valor)) return 'array';
  return typeof valor;
}

console.log(obtenerTipoExacto(null));        // "null" (evita el bug histórico de typeof null === "object")
console.log(obtenerTipoExacto([10, 20]));    // "array"
console.log(obtenerTipoExacto(95.4));        // "number"

// 2. La anomalía de punto flotante IEEE 754 (0.1 + 0.2 !== 0.3)
const sumaDecimal = 0.1 + 0.2; // 0.30000000000000004
const sonIgualesConTolerancia = Math.abs(sumaDecimal - 0.3) < Number.EPSILON;
console.log('¿0.1 + 0.2 equivale a 0.3 con Number.EPSILON?:', sonIgualesConTolerancia); // true

// 3. Diferencia entre Copia por Valor (Primitivos) y Copia por Referencia (Objetos)
let notaOriginal = 80;
let notaCopia = notaOriginal;
notaCopia = 100;
console.log('Primitivos independientes:', { notaOriginal, notaCopia }); // 80 y 100

const fichaOriginal = { codigo: 2874512, jornada: 'Diurna' };
const fichaClonInmutable = { ...fichaOriginal, jornada: 'Nocturna' }; // Copia independiente con Spread
console.log('Original intacto:', fichaOriginal.jornada, '| Clon:', fichaClonInmutable.jornada);`,
    relevanceComment:
      'Observa la función obtenerTipoExacto(valor): mejora el operador nativo typeof distinguiendo correctamente entre null, array y object.',
    sourceNodeId: 'node-js-103',
  },
  ...EXERCISES_JS_103,
];

// ============================================================================
// OVA 2: ESTRUCTURAS DE CONTROL, EXPLICACIONES CON IMÁGENES Y EJERCICIOS RESUELTOS
// (Teoría Extensa + Diagramas SVG + Citas de Libros + 45 Ejercicios Ejecutables)
// ============================================================================

const BLOCKS_JS_201: LessonBlock[] = [
  {
    id: 'blk-js201-1',
    type: 'heading',
    title: '1. Teoría del Control de Flujo Ramificado y Álgebra Booleana de Cortocircuito',
    content: '1. Teoría del Control de Flujo Ramificado y Álgebra Booleana de Cortocircuito',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-2',
    type: 'text',
    content:
      'Un programa sin estructuras de control se ejecuta de forma estrictamente lineal (de arriba hacia abajo), como una receta estática incapaz de reaccionar ante los datos. Las **estructuras de control condicionales** dotan al software de capacidad de decisión, permitiendo que el flujo de ejecución se bifurque en distintas rutas según el valor de verdad (*truthiness*) de una condición lógica.\n\nEn JavaScript moderno disponemos de cuatro mecanismos complementarios para expresar decisiones:\n\n1. **Bifurcación `if / else if / else`:** Evalúa predicados booleanos arbitrarios (rangos numéricos, combinaciones lógicas con `&&`, `||`, `!`). Tan pronto como una rama se evalúa como `true`, su bloque `{ ... }` se ejecuta y todas las demás ramas `else if / else` se descartan.\n2. **Cláusulas de Guarda (*Guard Clauses* o Retorno Temprano):** En lugar de anidar múltiples bloques `if` uno dentro de otro (antipatrón conocido como *Arrow Anti-Pattern* o *Pirámide de la Perdición*), la ingeniería de software limpia valida primero los casos inválidos o bordes al inicio de la función y retorna de inmediato (`if (!valido) return;`), dejando el flujo principal plano y legible.\n3. **Operador Condicional Ternario (`condicion ? valorSiTrue : valorSiFalse`):** Es el único operador de JavaScript que recibe tres operandos. A diferencia de `if` (que es una sentencia), el ternario **es una expresión**, por lo que puede asignarse a una constante `const` o incrustarse dentro de plantillas.\n4. **Despacho Multicamino `switch / case`:** Compara una expresión discriminante contra múltiples etiquetas `case` utilizando **igualdad estricta (`===`)**.',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-q1',
    type: 'quote',
    title: 'Eloquent JavaScript (4.ª Edición, Cap. 2: Control Flow — Conditional Execution)',
    quoteAuthor: 'Marijn Haverbeke · No Starch Press (2024)',
    content:
      'Un programa en ejecución no siempre es un camino recto. Con frecuencia necesitamos crear una carretera ramificada, donde el programa toma el ramal adecuado dependiendo de las condiciones de los datos que encuentra en tiempo de ejecución.',
    relevanceComment:
      'La metáfora de la carretera ramificada de Haverbeke se visualiza directamente en el diagrama de flujo inferior: cada rombo de decisión divide el camino en dos rutas mutuamente excluyentes.',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-3',
    type: 'diagram',
    diagramKind: 'if_else_flow',
    title: 'Imagen / Diagrama de Flujo: Arquitectura de Decisión Booleana (if / else if / else)',
    content:
      'El rombo amarillo representa el predicado lógico: si su evaluación resulta verdadera (true) el flujo toma el ramal verde superior; si resulta falsa (false) desciende al ramal rojo alternativo hasta converger al final.',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-q2',
    type: 'quote',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship (Cap. 3: Functions & Guard Clauses)',
    quoteAuthor: 'Robert C. Martin (Uncle Bob) · Prentice Hall',
    content:
      'Las estructuras if/else y switch no deberían tener más de uno o dos niveles de anidamiento. Cuando una función valida precondiciones mediante cláusulas de guarda con retorno temprano al inicio, la complejidad ciclomática disminuye drásticamente y el propósito principal del algoritmo queda expuesto con total claridad.',
    relevanceComment:
      'Aplicar Guard Clauses en JavaScript evita tener 4 niveles de llaves anidadas (if { if { if { ... } } }) que dificultan el mantenimiento y las pruebas unitarias.',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-4',
    type: 'text',
    content:
      'Además de las sentencias condicionales clásicas, ECMAScript moderno (ES2020+) incorpora tres operadores de **evaluación de cortocircuito (*Short-Circuit Evaluation*)** indispensables en código profesional:\n\n• **AND lógico (`A && B`):** Si `A` es *falsy*, detiene la evaluación y retorna `A` sin ejecutar `B`; si `A` es *truthy*, retorna `B`.\n• **OR lógico (`A || B`):** Si `A` es *truthy*, retorna `A` inmediatamente; si `A` es *falsy* (incluyendo `0` o `""`), retorna el valor de respaldo `B`.\n• **Coalescencia Nula (`A ?? B` — *Nullish Coalescing*):** Retorna el respaldo `B` **únicamente si `A` es `null` o `undefined`**. Esto es vital cuando `0` o `""` son valores válidos (por ejemplo, una calificación `0` o un descuento del `0%`).',
    sourceNodeId: 'node-js-201',
  },
  {
    id: 'blk-js201-5',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_04_guard_clauses_switch_y_nullish.js',
    content: `'use strict';

// 1. Patrón Profesional: Guard Clauses (Retorno Temprano sin anidamiento profundo)
function autorizarPresentacionPrueba(aprendiz) {
  if (!aprendiz) return 'Error: Registro de aprendiz no suministrado.';
  if (!aprendiz.matriculaActiva) return 'Bloqueado: La matrícula no se encuentra activa.';
  if (aprendiz.porcentajeAsistencia < 80) {
    return \`Bloqueado: Asistencia insuficiente (\${aprendiz.porcentajeAsistencia}%). Mínimo 80%.\`;
  }

  // Camino feliz (Happy Path) plano y sin llaves anidadas
  const turno = aprendiz.promedio >= 90 ? 'Prioritario' : 'Estándar';
  return \`✓ Aprendiz \${aprendiz.nombre} autorizado en turno \${turno}.\`;
}

// 2. Diferencia crítica entre || (OR) y ?? (Nullish Coalescing) con el número 0
const notaRegistrada = 0; // El aprendiz sacó 0, ¡no es que falte la nota!
console.log('Con OR (||) erróneo :', notaRegistrada || 'Sin calificar'); // "Sin calificar" (¡Bug! 0 es falsy)
console.log('Con Nullish (??) ok :', notaRegistrada ?? 'Sin calificar'); // 0 (Respeta el 0 porque no es null/undefined)`,
    relevanceComment:
      'Observa cómo las 3 cláusulas de guarda iniciales descartan inmediatamente los estados inválidos sin necesidad de un solo bloque else.',
    sourceNodeId: 'node-js-201',
  },
  ...EXERCISES_JS_201,
];

const BLOCKS_JS_202: LessonBlock[] = [
  {
    id: 'blk-js202-1',
    type: 'heading',
    title: '1. Anatomía de las Estructuras Repetitivas: Invariantes, Terminación y Complejidad',
    content: '1. Anatomía de las Estructuras Repetitivas: Invariantes, Terminación y Complejidad',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-2',
    type: 'text',
    content:
      'La verdadera potencia de un computador radica en su capacidad para ejecutar millones de operaciones repetitivas por segundo sin fatiga. En algoritmia, un **ciclo o bucle (*loop*)** es una estructura de control que repite la ejecución de un bloque de sentencias mientras un predicado booleano (la **condición de permanencia**) se evalúe como `true`.\n\nTodo ciclo bien diseñado en ingeniería de software debe satisfacer tres propiedades formales:\n\n1. **Estado Inicial (*Initialization*):** Establece las variables de control (contadores, punteros o acumuladores) antes de la primera iteración.\n2. **Condición de Guardia (*Continuation Condition*):** Predicado evaluado antes de cada iteración (en `for` y `while`) o al final de cada iteración (en `do...while`).\n3. **Progreso hacia la Terminación (*Step / Mutation*):** Modificación del estado en cada vuelta (`i++`, `n = Math.floor(n / 2)`, `intentos--`) que garantiza matemáticamente que la condición llegará a ser `false` en un número finito de pasos. Si el estado nunca avanza hacia la condición de parada, se produce un **ciclo infinito (*Infinite Loop*)** que congela el hilo principal de ejecución (*Event Loop*).',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-q1',
    type: 'quote',
    title: 'JavaScript: The Definitive Guide (7.ª Edición, Cap. 5: Statements — Loops)',
    quoteAuthor: 'David Flanagan · O’Reilly Media (2020)',
    content:
      'La sentencia for condensa en su encabezado las tres manipulaciones cruciales de casi todo bucle: la inicialización de la variable contadora, la prueba booleana que determina si el bucle continúa y la actualización de la variable al cierre de cada iteración, haciendo explícita de un vistazo la ley que gobierna la repetición.',
    relevanceComment:
      'Como señala Flanagan, agrupar (inicialización; condición; actualización) en la primera línea del ciclo for reduce drásticamente el riesgo de olvidar incrementar el contador.',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-3',
    type: 'diagram',
    diagramKind: 'loops_flow',
    title: 'Imagen / Diagrama de Flujo: Ciclo de Vida en 4 Etapas de un Bucle (for / while)',
    content:
      'Observa el lazo de retroalimentación superior: tras ejecutar el cuerpo del ciclo (etapa 3), el flujo pasa obligatoriamente por el paso de actualización i++ (etapa 4) antes de reevaluar la condición en el rombo (etapa 2).',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-4',
    type: 'heading',
    title: '2. Cuándo Elegir for, while o do...while y Control Fino con break y continue',
    content: '2. Cuándo Elegir for, while o do...while y Control Fino con break y continue',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-5',
    type: 'text',
    content:
      'Aunque cualquier algoritmo iterativo puede expresarse con cualquiera de los tres bucles, la claridad semántica exige elegir la estructura adecuada:\n\n• **Ciclo `for (let i = 0; i < n; i++)`:** Ideal para **iteración definida**, cuando conocemos de antemano el límite de repeticiones o necesitamos el índice numérico `i`.\n• **Ciclo `while (condicion)`:** Ideal para **iteración indefinida**, cuando el número de vueltas no se conoce a priori y depende de una convergencia dinámica (búsqueda binaria, lectura de colas, división sucesiva de dígitos).\n• **Ciclo `do { ... } while (condicion)`:** Evalúa la condición **después** de ejecutar el cuerpo, garantizando que el bloque se ejecute **como mínimo una vez**.\n• **Control de salto interno:** La sentencia **`continue`** aborta únicamente la iteración actual y salta de inmediato a la etapa de actualización (`i++`) para comenzar la siguiente vuelta; la sentencia **`break`** detiene y abandona el bucle por completo.',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-q2',
    type: 'quote',
    title: 'Eloquent JavaScript (4.ª Edición, Cap. 2: While and Do Loops)',
    quoteAuthor: 'Marijn Haverbeke · No Starch Press (2024)',
    content:
      'Un bucle do es una estructura de control similar a un bucle while. Se diferencia únicamente en un punto: un bucle do ejecuta siempre su cuerpo al menos una vez, y solo comienza a comprobar si debe detenerse después de esa primera ejecución.',
    relevanceComment:
      'El bucle do...while es el patrón estándar para menús interactivos, reintentos de conexión inicial o generación de códigos aleatorios que deben validarse tras ser generados.',
    sourceNodeId: 'node-js-202',
  },
  {
    id: 'blk-js202-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_05_patrones_acumulador_y_busqueda_ciclos.js',
    content: `'use strict';

// 1. Patrón de Búsqueda Temprana con 'for' y 'break' + salto con 'continue'
const registrosServidor = [
  { id: 101, estado: 'OK', latenciaMs: 45 },
  { id: 102, estado: 'MANTENIMIENTO', latenciaMs: 0 },
  { id: 103, estado: 'OK', latenciaMs: 62 },
  { id: 104, estado: 'CRITICO', latenciaMs: 1850 },
  { id: 105, estado: 'OK', latenciaMs: 38 },
];

for (let i = 0; i < registrosServidor.length; i++) {
  const nodo = registrosServidor[i];

  if (nodo.estado === 'MANTENIMIENTO') {
    continue; // Ignora nodos en mantenimiento y pasa al siguiente índice
  }

  if (nodo.estado === 'CRITICO') {
    console.log(\`🚨 Alerta crítica detectada en nodo #\${nodo.id} (\${nodo.latenciaMs}ms). Deteniendo escaneo.\`);
    break; // Sale del ciclo inmediatamente sin revisar el nodo 105
  }

  console.log(\`✓ Nodo #\${nodo.id} operativo (\${nodo.latenciaMs}ms)\`);
}`,
    relevanceComment:
      'Usar break tan pronto como encontramos el elemento buscado ahorra ciclos de CPU innecesarios en arreglos de miles de registros.',
    sourceNodeId: 'node-js-202',
  },
  ...EXERCISES_JS_202,
];

const BLOCKS_JS_203: LessonBlock[] = [
  {
    id: 'blk-js203-1',
    type: 'heading',
    title: '1. Protocolo Iterable en ES6+: Diferencia Estructural entre for...of y for...in',
    content: '1. Protocolo Iterable en ES6+: Diferencia Estructural entre for...of y for...in',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-2',
    type: 'text',
    content:
      'Gran parte de los errores de índice fuera de rango (*Off-by-One Errors*) en programación tradicional provienen de administrar manualmente variables contadoras `i` cuando solo necesitamos procesar los elementos de una colección. Para eliminar esa fricción, ECMAScript 2015 introdujo el **Protocolo de Iteración (`[Symbol.iterator]`)** y el bucle declarativo **`for...of`**:\n\n• **`for (const elemento of coleccion)`:** Recorre directamente los **valores** de cualquier objeto iterable (`Array`, `String`, `Map`, `Set`, `NodeList` del DOM). Permite usar `const` en el encabezado porque se crea un enlace nuevo en cada paso y soporta `break`, `continue` y `return` (a diferencia de `.forEach()`, donde `break` es ilegal).\n• **`for (const clave in objeto)`:** Recorre los **nombres de las propiedades enumerables (claves string)** de un objeto, incluyendo las heredadas por su cadena de prototipos. Por ello, **nunca debe usarse `for...in` para recorrer arreglos**, y en objetos modernos se prefiere combinar `for (const [clave, valor] of Object.entries(objeto))`.',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-q1',
    type: 'quote',
    title: 'Exploring JavaScript (ES2024 Edition, Cap. 21: Synchronous Iteration)',
    quoteAuthor: 'Dr. Axel Rauschmayer · ExploringJS Books (2024)',
    content:
      'El bucle for-of combina lo mejor de dos mundos: la concisión declarativa de los métodos de arreglos sin variables de índice manuales, y la flexibilidad total de las estructuras de control imperativas para interrumpir la iteración con break o retornar directamente desde la función contenedora.',
    relevanceComment:
      'Dr. Axel Rauschmayer destaca una ventaja clave de for...of frente a .forEach(): dentro de un for...of también puedes utilizar await para operaciones asíncronas secuenciales.',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-3',
    type: 'heading',
    title: '2. Arquitectura de Tolerancia a Fallos: Excepciones, throw y try / catch / finally',
    content: '2. Arquitectura de Tolerancia a Fallos: Excepciones, throw y try / catch / finally',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-4',
    type: 'text',
    content:
      'En entornos reales de producción, las aplicaciones interactúan con sistemas externos impredecibles: el usuario ingresa un archivo JSON malformado, una petición HTTP pierde conexión o una base de datos rechaza una llave duplicada. Si ocurre un error en tiempo de ejecución y no es interceptado, la pila de llamadas (*Call Stack*) se desenrolla abruptamente y **el programa entero colapsa**.\n\nJavaScript implementa el manejo estructurado de excepciones mediante cuatro componentes:\n\n1. **Instanciación y lanzamiento (`throw new Error("mensaje")`):** Permite que nuestras propias funciones señalicen violaciones de reglas de negocio creando un objeto `Error` (o subclases como `TypeError`, `RangeError`, `SyntaxError`) que captura automáticamente la traza de la pila (*stack trace*).\n2. **Bloque supervisado (`try { ... }`):** Envuelve las operaciones críticas que podrían fallar.\n3. **Bloque receptor (`catch (error) { ... }`):** Se activa únicamente si dentro de `try` se lanza una excepción. Recibe el objeto `error` con sus propiedades `error.name`, `error.message` y `error.stack` para registrar el incidente o recuperar el estado.\n4. **Bloque de cierre garantizado (`finally { ... }`):** Se ejecuta **siempre**, sin importar si el bloque `try` finalizó con éxito, si entró al `catch` o incluso si hubo un `return` dentro de ellos. Es indispensable para liberar conexiones, cerrar transacciones o apagar indicadores de carga (*spinners*).',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-5',
    type: 'diagram',
    diagramKind: 'try_catch_flow',
    title: 'Imagen / Diagrama de Flujo: Ciclo de Captura y Recuperación con try / catch / finally',
    content:
      'Tanto la ruta de excepción (2A: catch) como la ruta de éxito sin errores (2B) desembocan obligatoriamente en el bloque 3 (finally) antes de continuar el programa.',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-q2',
    type: 'quote',
    title: 'Eloquent JavaScript (4.ª Edición, Cap. 8: Bugs and Errors — Exceptions)',
    quoteAuthor: 'Marijn Haverbeke · No Starch Press (2024)',
    content:
      'El manejo de excepciones es un mecanismo que permite que el código que detecta un problema lance (throw) una excepción, la cual salta fuera de todas las funciones activas en la pila de llamadas hasta aterrizar en el primer bloque try/catch que sepa cómo resolver o informar el incidente con elegancia.',
    relevanceComment:
      'Gracias a que las excepciones suben por la pila de llamadas (Call Stack Propagation), puedes lanzar un error en una función auxiliar profunda y capturarlo limpiamente en el controlador principal.',
    sourceNodeId: 'node-js-203',
  },
  {
    id: 'blk-js203-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_06_for_of_y_manejo_robusto_excepciones.js',
    content: `'use strict';

// Ejemplo integral: Validador de Lote de Entregas JSON con for...of y try/catch/finally
function procesarLoteEvidencias(loteJsonStrings) {
  const procesadas = [];
  const errores = [];

  for (const [indice, cadenaJson] of loteJsonStrings.entries()) {
    try {
      const data = JSON.parse(cadenaJson);

      if (!data.aprendiz || typeof data.nota !== 'number') {
        throw new TypeError('Faltan campos obligatorios (aprendiz o nota numérica)');
      }
      if (data.nota < 0 || data.nota > 100) {
        throw new RangeError(\`Nota fuera de rango [0-100]: \${data.nota}\`);
      }

      procesadas.push({ indice, aprendiz: data.aprendiz, nota: data.nota });
    } catch (error) {
      errores.push({
        indice,
        tipoError: error.name,
        detalle: error.message,
      });
    } finally {
      // Auditoría garantizada por cada registro del lote
    }
  }

  return { totalExitosas: procesadas.length, procesadas, errores };
}

const lotePrueba = [
  '{"aprendiz": "Valentina Rojas", "nota": 96}',
  '{JSON_MALFORMADO}',
  '{"aprendiz": "Mateo Hernández", "nota": 140}',
  '{"aprendiz": "Laura Pineda", "nota": 88}',
];

console.log(procesarLoteEvidencias(lotePrueba));`,
    relevanceComment:
      'Observa cómo usamos .entries() en el for...of para obtener tanto el índice como el valor, y cómo distinguimos SyntaxError, TypeError y RangeError.',
    sourceNodeId: 'node-js-203',
  },
  ...EXERCISES_JS_203,
];

// ============================================================================
// OVA 3: ARREGLOS Y OBJETOS EN JAVASCRIPT (GRÁFICOS INTERACTIVOS Y MICROANIMACIONES)
// (Teoría Extensa + Simuladores Animados + Citas de Libros + 45 Ejercicios Ejecutables)
// ============================================================================

const BLOCKS_JS_301: LessonBlock[] = [
  {
    id: 'blk-js301-1',
    type: 'heading',
    title: '1. Arquitectura de los Arreglos en JavaScript: Indexación Base 0 y Complejidad Algorítmica',
    content: '1. Arquitectura de los Arreglos en JavaScript: Indexación Base 0 y Complejidad Algorítmica',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-2',
    type: 'text',
    content:
      'Un **Arreglo (`Array`)** en JavaScript es una estructura de datos ordenada y dinámica que almacena una secuencia de elementos accesibles mediante un **índice entero en base cero (`0, 1, 2, ..., length - 1`)**. Aunque a nivel de especificación ECMA-262 un `Array` es un tipo especializado de objeto cuyas claves son índices numéricos y cuya propiedad `.length` se auto-actualiza, los motores modernos como **V8** optimizan internamente los arreglos homogéneos como bloques contiguos de memoria C++ (*FixedArray / Packed Elements*).\n\nComprender cómo se almacenan los elementos en memoria explica la diferencia crítica de rendimiento (complejidad algorítmica **Big-O**) entre operar al final vs. operar al inicio de un arreglo:\n\n• **Operaciones al FINAL del arreglo (`.push(x)` y `.pop()`):** Tienen complejidad **`O(1)` (tiempo constante)**. Como agregan o retiran en la última casilla (`[length - 1]`), ninguno de los elementos anteriores cambia de posición.\n• **Operaciones al INICIO del arreglo (`.unshift(x)` y `.shift()`):** Tienen complejidad **`O(n)` (tiempo lineal)**. Insertar un elemento en el índice `[0]` obliga al motor a desplazar un puesto hacia la derecha absolutamente todos los `n` elementos existentes en memoria (`[0] → [1]`, `[1] → [2]`, etc.).\n\nInteractúa con el siguiente **laboratorio gráfico animado** para visualizar en tiempo real cómo mutan las celdas de memoria y los índices.',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-q1',
    type: 'quote',
    title: 'Eloquent JavaScript (4.ª Edición, Cap. 4: Data Structures: Objects and Arrays)',
    quoteAuthor: 'Marijn Haverbeke · No Starch Press (2024)',
    content:
      'Para representar colecciones digitales de datos necesitamos algo más que variables sueltas. JavaScript proporciona un tipo de dato específico para almacenar secuencias ordenadas de valores: el Array, donde el índice cero señala el primer elemento y cada método de pila o cola permite modelar flujos de información complejos.',
    relevanceComment:
      'Con .push() y .pop() un Array de JavaScript funciona como una Pila (Stack - LIFO: Last In, First Out); con .push() y .shift() funciona como una Cola (Queue - FIFO: First In, First Out).',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-3',
    type: 'interactive',
    interactiveKind: 'array_lab',
    title: 'Gráfico Interactivo Animado: Operaciones en Memoria sobre un Array JS',
    content:
      'Escribe un elemento y pulsa .push() (final), .unshift() (inicio), .pop(), .shift() o .reverse() para ver cómo se desplazan los índices [0], [1], [2] con microanimaciones.',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-4',
    type: 'heading',
    title: '2. Métodos Mutables vs. Inmutables (.splice vs. .slice / .toSorted) y Desestructuración',
    content: '2. Métodos Mutables vs. Inmutables (.splice vs. .slice / .toSorted) y Desestructuración',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-5',
    type: 'text',
    content:
      'Al trabajar con arreglos es fundamental distinguir qué métodos **mutan el arreglo original in-place** y cuáles **retornan una copia nueva sin alterar el original**:\n\n• **`.splice(inicio, cantidadEliminar, ...nuevosItems)` (Mutable):** Modifica directamente el arreglo original eliminando o insertando elementos en cualquier posición intermedia.\n• **`.slice(inicio, fin)` (Inmutable):** Extrae y devuelve un sub-arreglo nuevo desde `inicio` hasta `fin - 1`, dejando intacto el arreglo original.\n• **Lectura moderna con `.at(-1)`:** Permite indexar desde el final del arreglo con números negativos (`arr.at(-1)` devuelve el último elemento, `arr.at(-2)` el penúltimo).\n• **Clonación y concatenación con *Spread* (`[...arrA, ...arrB]`):** Crea un nuevo arreglo expandiendo los elementos individuales.',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-q2',
    type: 'quote',
    title: 'JavaScript: The Definitive Guide (7.ª Edición, Cap. 7: Arrays)',
    quoteAuthor: 'David Flanagan · O’Reilly Media (2020)',
    content:
      'Los arreglos de JavaScript son dinámicos: crecen o se reducen según sea necesario sin necesidad de reasignar bloques fijos manualmente, y el operador de propagación (spread ...) proporciona una sintaxis declarativa limpia para clonar y combinar secuencias sin efectos secundarios.',
    relevanceComment:
      'En frameworks reactivos como React o Vue, nunca debes mutar un arreglo de estado con .push() o .splice(); siempre debes crear una nueva referencia con [...arreglo, nuevoItem].',
    sourceNodeId: 'node-js-301',
  },
  {
    id: 'blk-js301-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_07_arreglos_indexacion_slice_y_spread.js',
    content: `'use strict';

// 1. Indexación positiva y negativa con .at()
const etapasProyecto = ['Análisis', 'Planeación', 'Ejecución', 'Evaluación'];
console.log('Primera etapa [0] :', etapasProyecto[0]);       // "Análisis"
console.log('Última etapa (-1) :', etapasProyecto.at(-1));   // "Evaluación"

// 2. Extracción inmutable con .slice() vs inserción con Spread (...)
const etapasCentrales = etapasProyecto.slice(1, 3); // ["Planeación", "Ejecución"]
const cronogramaExtendido = ['Inducción', ...etapasProyecto, 'Certificación'];

// 3. Desestructuración posicional con operador Rest (...resto)
const [primera, segunda, ...etapasRestantes] = cronogramaExtendido;
console.log({ primera, segunda, etapasRestantes });`,
    relevanceComment:
      'Observa cómo el operador ... (Rest/Spread) sirve tanto para expandir un arreglo al construir otro como para capturar los elementos sobrantes al desestructurar.',
    sourceNodeId: 'node-js-301',
  },
  ...EXERCISES_JS_301,
];

const BLOCKS_JS_302: LessonBlock[] = [
  {
    id: 'blk-js302-1',
    type: 'heading',
    title: '1. Programación Funcional sobre Arreglos: Funciones de Orden Superior e Inmutabilidad',
    content: '1. Programación Funcional sobre Arreglos: Funciones de Orden Superior e Inmutabilidad',
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'blk-js302-2',
    type: 'text',
    content:
      'En JavaScript las funciones son **ciudadanos de primera clase (*First-Class Citizens*)**: pueden almacenarse en variables, pasarse como argumentos a otras funciones y retornarse como resultado. Una función que recibe otra función (*callback*) como parámetro se denomina **Función de Orden Superior (*Higher-Order Function*)**.\n\nEl prototipo `Array.prototype` incluye un conjunto de métodos funcionales declarativos que permiten procesar colecciones de datos **sin mutar jamás el arreglo de entrada**, componiendo tuberías de transformación (*data pipelines*):\n\n1. **Proyección 1 a 1 con `.map((elemento, indice) => nuevoElemento)`:** Aplica una función transformadora a cada elemento de un arreglo de longitud `N` y retorna un **nuevo arreglo de longitud `N`** con los resultados transformados.\n2. **Selección por predicado con `.filter((elemento) => condicionBooleana)`:** Evalúa una función predicado sobre cada elemento y retorna un **nuevo arreglo (de longitud `0` hasta `N`)** que contiene únicamente aquellos elementos para los cuales el callback retornó `true`.\n3. **Localización con `.find((elemento) => condicion)` y `.findIndex(...)`:** Recorre el arreglo y detiene la búsqueda tan pronto como encuentra el **primer elemento** que cumple el predicado, retornando dicho elemento (o `undefined` si ninguno coincide).\n4. **Verificación cuantificadora con `.some(...)` y `.every(...)`:** `.some()` retorna `true` si **al menos un** elemento cumple la condición (cuantificador existencial ∃); `.every()` retorna `true` si **todos** los elementos cumplen la condición (cuantificador universal ∀).\n5. **Agregación universal con `.reduce((acumulador, elemento) => nuevoAcumulador, valorInicial)`:** Pliega o condensa todos los elementos del arreglo en un único valor de salida (un número total, un objeto agrupado, un diccionario indexado o incluso otro arreglo).',
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'blk-js302-q1',
    type: 'quote',
    title: 'Eloquent JavaScript (4.ª Edición, Cap. 5: Higher-Order Functions)',
    quoteAuthor: 'Marijn Haverbeke · No Starch Press (2024)',
    content:
      'Las funciones que operan sobre otras funciones, ya sea tomándolas como argumentos o retornándolas, se denominan funciones de orden superior. Nos permiten abstraer no solo valores, sino acciones completas: filtrar, transformar y reducir colecciones se convierten en bloques de construcción expresivos que se leen casi como lenguaje natural.',
    relevanceComment:
      'Como explica Haverbeke, expresar un algoritmo como entregas.filter(esAprobado).map(extraerNombre) comunica la intención del negocio con mucha mayor claridad que un bucle for de 15 líneas.',
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'blk-js302-3',
    type: 'interactive',
    interactiveKind: 'array_functional',
    title: 'Simulador Visual Animado: Pipeline Funcional (.map, .filter, .find, .reduce)',
    content:
      'Alterna entre los 4 métodos funcionales para observar cómo el arreglo original permanece inmutable mientras se genera la nueva colección o el valor reducido.',
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'blk-js302-q2',
    type: 'quote',
    title: 'How JavaScript Works (Cap. 12: Functional Programming & Purity)',
    quoteAuthor: 'Douglas Crockford · Virgule-Solidus (2018)',
    content:
      'La programación funcional evita la mutación de estado compartido. Cuando utilizamos map, filter y reduce con funciones puras que no alteran sus argumentos, eliminamos de raíz toda una categoría de errores de concurrencia y efectos colaterales difíciles de rastrear.',
    relevanceComment:
      'Pasa siempre el segundo argumento valorInicial a .reduce(fn, valorInicial) (por ejemplo, 0 para sumas o {} para agrupaciones) para evitar un TypeError si el arreglo llega vacío.',
    sourceNodeId: 'node-js-302',
  },
  {
    id: 'blk-js302-4',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_08_encadenamiento_funcional_map_filter_reduce.js',
    content: `'use strict';

const proyectosAdso = [
  { codigo: 'P-01', nombre: 'API Facturación Electrónica', puntaje: 94, activo: true, horas: 120 },
  { codigo: 'P-02', nombre: 'Landing Estática Legacy', puntaje: 62, activo: false, horas: 40 },
  { codigo: 'P-03', nombre: 'App Móvil Inventario QR', puntaje: 88, activo: true, horas: 95 },
  { codigo: 'P-04', nombre: 'Dashboard Analítico SENA', puntaje: 97, activo: true, horas: 140 },
];

// 1. Pipeline encadenado: Filtrar activos aprobados (>=70) -> Transformar con .map()
const proyectosDestacados = proyectosAdso
  .filter((p) => p.activo && p.puntaje >= 70)
  .map((p) => ({
    etiqueta: \`[\${p.codigo}] \${p.nombre}\`,
    calificacion: p.puntaje,
  }));

// 2. Reducción (.reduce) para calcular el total de horas de todos los proyectos activos
const totalHorasActivos = proyectosAdso
  .filter((p) => p.activo)
  .reduce((acumulador, proyecto) => acumulador + proyecto.horas, 0);

// 3. Cuantificadores booleanos .some() y .every()
const hayExcelencia = proyectosAdso.some((p) => p.puntaje >= 95); // true
const todosAprobaron = proyectosAdso.every((p) => p.puntaje >= 70); // false

console.log({ proyectosDestacados, totalHorasActivos, hayExcelencia, todosAprobaron });`,
    relevanceComment:
      'Cada eslabón de la cadena (.filter -> .map) recibe el nuevo arreglo retornado por el paso anterior sin modificar jamás proyectosAdso.',
    sourceNodeId: 'node-js-302',
  },
  ...EXERCISES_JS_302,
];

const BLOCKS_JS_303: LessonBlock[] = [
  {
    id: 'blk-js303-1',
    type: 'heading',
    title: '1. Objetos en JavaScript: Diccionarios Dinámicos Clave-Valor, Métodos y Contexto this',
    content: '1. Objetos en JavaScript: Diccionarios Dinámicos Clave-Valor, Métodos y Contexto this',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-2',
    type: 'text',
    content:
      'Mientras que los arreglos indexan datos secuenciales por posición numérica (`[0], [1], [2]`), los **Objetos (`Object`)** son estructuras compuestas que permiten modelar entidades del dominio real agrupando **propiedades con nombre (`clave: valor`)** y **comportamientos (`métodos`)**.\n\nExisten dos mecanismos sintácticos complementarios para leer, crear o modificar propiedades de un objeto:\n\n• **Notación de Punto (`objeto.propiedad`):** Concisa, rápida de leer y preferida siempre que el nombre de la clave sea un identificador válido y estático conocido en tiempo de escritura.\n• **Notación de Corchetes (`objeto[expresionClave]`):** Obligatoria cuando el nombre de la propiedad es **dinámico** (proviene de una variable o parámetro en tiempo de ejecución) o cuando la clave contiene espacios, guiones o caracteres especiales (`objeto["fecha-entrega"]`).\n\nInteractúa con el siguiente **inspector gráfico animado de objetos** para experimentar con el acceso por punto, acceso por corchetes, desestructuración, adición de propiedades y `Object.keys()`.',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-q1',
    type: 'quote',
    title: 'JavaScript: The Definitive Guide (7.ª Edición, Cap. 6: Objects)',
    quoteAuthor: 'David Flanagan · O’Reilly Media (2020)',
    content:
      'Los objetos son el tipo de dato fundamental de JavaScript. Un objeto es un valor compuesto: agrupa múltiples valores (primitivos u otros objetos) y permite almacenarlos y recuperarlos por nombre. Podemos pensar en un objeto como una tabla hash dinámica de pares clave-valor.',
    relevanceComment:
      'Como explica Flanagan, dado que las propiedades de un objeto pueden contener a su vez otros objetos o arreglos, podemos representar cualquier grafo o árbol de información empresarial.',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-3',
    type: 'interactive',
    interactiveKind: 'object_lab',
    title: 'Gráfico Interactivo Animado: Inspector de Objetos Clave-Valor y Desestructuración',
    content:
      'Toca cualquier propiedad del objeto o agrega una nueva clave-valor para ver cómo se accede, desestructura y muta la estructura en tiempo real.',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-4',
    type: 'heading',
    title: '2. Desestructuración Avanzada, Introspección (Object.keys/values/entries) y JSON',
    content: '2. Desestructuración Avanzada, Introspección (Object.keys/values/entries) y JSON',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-5',
    type: 'text',
    content:
      'En el desarrollo de aplicaciones modernas con JavaScript, Node.js y React, tres herramientas sobre objetos se utilizan en prácticamente cada archivo:\n\n1. **Asignación por Desestructuración (*Object Destructuring*):** Permite extraer múltiples propiedades de un objeto en variables locales de una sola vez (`const { nombre, ficha, rol = "Aprendiz" } = usuario;`), soportando valores por defecto (`=`), renombramiento con alias (`{ nombre: nombreCompleto }`) y desestructuración anidada.\n2. **Métodos Estáticos de Introspección:**\n   • `Object.keys(obj)` → devuelve un arreglo con las claves (`["nombre", "ficha"]`).\n   • `Object.values(obj)` → devuelve un arreglo con los valores (`["Valentina", 2874512]`).\n   • `Object.entries(obj)` → devuelve un arreglo de pares `[clave, valor]`, y su inverso `Object.fromEntries(pares)` reconstruye un objeto desde una lista de pares.\n3. **Serialización y Deserialización JSON (*JavaScript Object Notation*):** Estándar universal (RFC 8259) descubierto y especificado por **Douglas Crockford**. `JSON.stringify(objeto, null, 2)` convierte un objeto en memoria a una cadena de texto transportable por red o almacenable en disco, y `JSON.parse(texto)` reconstruye el objeto en memoria.',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-q2',
    type: 'quote',
    title: 'JavaScript: The Good Parts (Cap. 3: Objects & JSON)',
    quoteAuthor: 'Douglas Crockford · O’Reilly Media',
    content:
      'La notación literal de objetos de JavaScript —rodear pares clave/valor separados por comas entre llaves { }— es tan expresiva, compacta y legible que inspiró directamente el estándar JSON, el formato universal de intercambio de datos de la web moderna.',
    relevanceComment:
      'Recuerda la diferencia sintáctica entre un Objeto Literal de JS y un texto JSON: en JSON todas las claves deben ir obligatoriamente entre comillas dobles ("clave": "valor") y no se permiten funciones ni undefined.',
    sourceNodeId: 'node-js-303',
  },
  {
    id: 'blk-js303-6',
    type: 'code',
    codeLanguage: 'javascript',
    title: 'ejemplo_09_objetos_desestructuracion_entries_y_json.js',
    content: `'use strict';

// 1. Objeto con propiedades anidadas y método que utiliza el contexto 'this'
const fichaCaracterizacion = {
  codigo: 2874512,
  programa: 'ADSO',
  sede: {
    centro: 'CEET',
    ciudad: 'Bogotá D.C.',
  },
  aprendicesMatriculados: 30,
  obtenerResumen() {
    return \`Ficha \${this.codigo} (\${this.programa}) - \${this.sede.centro} [\${this.aprendicesMatriculados} aprendices]\`;
  },
};

// 2. Desestructuración con alias (:), valor por defecto (=) y objeto anidado
const {
  codigo: numeroFicha,
  modalidad = 'Presencial',
  sede: { ciudad },
} = fichaCaracterizacion;

console.log({ numeroFicha, modalidad, ciudad });

// 3. Transformación de valores de un objeto con Object.entries() y Object.fromEntries()
const puntajesBrutos = { algoritmia: 80, sql: 90, javascript: 95 };
const puntajesConBono = Object.fromEntries(
  Object.entries(puntajesBrutos).map(([materia, nota]) => [materia, Math.min(100, nota + 5)])
);

// 4. Serialización a formato JSON con indentación de 2 espacios
const jsonExportado = JSON.stringify(puntajesConBono, null, 2);
console.log(fichaCaracterizacion.obtenerResumen());
console.log('JSON Exportado:\\n', jsonExportado);`,
    relevanceComment:
      'La combinación Object.fromEntries(Object.entries(obj).map(...)) permite aplicar toda la potencia funcional de los arreglos para transformar diccionarios clave-valor.',
    sourceNodeId: 'node-js-303',
  },
  ...EXERCISES_JS_303,
];

// ============================================================================
// CONTENEDORES GRANDES (REGIONES) Y NODOS ASOCIADOS EN EL LIENZO EN GRAFO (CANVAS)
// ============================================================================

export const INITIAL_REGIONS: GraphRegion[] = [
  {
    id: 'reg-js-1',
    title: 'Contenedor OVA 01 · Generalidades, Sintaxis, Variables y Tipos de Datos JS',
    subtitle: 'Teoría extensa, citas de libros y 45 ejercicios con snippet ejecutable (15 cortos + 30 para desarrollar)',
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
    subtitle: 'Condicionales, ciclos, try/catch, citas bibliográficas y 45 ejercicios con snippet ejecutable (15 cortos + 30 desarrollo)',
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
    subtitle: 'Laboratorios animados de Arrays y Objetos, map/filter/reduce y 45 ejercicios con snippet ejecutable (15 cortos + 30 desarrollo)',
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
    title: 'Generalidades, Motor JIT V8, Gramática Léxica (5 Cortos + 10 Desarrollo)',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 80,
    y: 130,
    regionId: 'reg-js-1',
    linkedOvaId: 'ova-js-1',
    linkedLessonId: 'les-js-101',
    tags: ['JavaScript', 'Sintaxis', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      'Arquitectura JIT V8, citas de Kyle Simpson y Marijn Haverbeke, 5 ejercicios propuestos cortos y 10 ejercicios para desarrollar con consola en vivo.',
    blocks: BLOCKS_JS_101,
  },
  {
    id: 'node-js-102',
    title: 'Variables (var, let, const), TDZ, Block Scope (5 Cortos + 10 Desarrollo)',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 415,
    y: 130,
    regionId: 'reg-js-1',
    linkedOvaId: 'ova-js-1',
    linkedLessonId: 'les-js-102',
    tags: ['Variables', 'Scope', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      'Evolución de var a let/const, citas de Nicholas C. Zakas y David Flanagan, 5 ejercicios cortos y 10 ejercicios para desarrollar en el snippet.',
    blocks: BLOCKS_JS_102,
  },
  {
    id: 'node-js-103',
    title: 'Los 8 Tipos de Datos ECMA-262, Coerción y === (5 Cortos + 10 Desarrollo)',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 750,
    y: 130,
    regionId: 'reg-js-1',
    linkedOvaId: 'ova-js-1',
    linkedLessonId: 'les-js-103',
    tags: ['Tipos de Datos', 'Stack/Heap', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      '7 tipos primitivos en Stack vs Objetos en Heap, citas de Kyle Simpson y Douglas Crockford, 5 ejercicios cortos y 10 ejercicios para desarrollar.',
    blocks: BLOCKS_JS_103,
  },

  // Nodos asociados a Región 2 (OVA 2)
  {
    id: 'node-js-201',
    title: 'Condicionales, Guard Clauses y Diagrama (5 Cortos + 10 Desarrollo)',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 80,
    y: 480,
    regionId: 'reg-js-2',
    linkedOvaId: 'ova-js-2',
    linkedLessonId: 'les-js-201',
    tags: ['Condicionales', 'Clean Code', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      'Diagrama de flujo booleano, citas de Haverbeke y Robert C. Martin (Clean Code), 5 ejercicios cortos y 10 ejercicios para desarrollar.',
    blocks: BLOCKS_JS_201,
  },
  {
    id: 'node-js-202',
    title: 'Ciclos (for, while, do...while) y Complejidad (5 Cortos + 10 Desarrollo)',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 415,
    y: 480,
    regionId: 'reg-js-2',
    linkedOvaId: 'ova-js-2',
    linkedLessonId: 'les-js-202',
    tags: ['Ciclos', 'Algoritmia', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      'Invariantes y terminación de bucles, citas de David Flanagan y Haverbeke, diagrama de 4 etapas, 5 ejercicios cortos y 10 para desarrollar.',
    blocks: BLOCKS_JS_202,
  },
  {
    id: 'node-js-203',
    title: 'Protocolo Iterable (for...of) y try/catch/finally (5 Cortos + 10 Desarrollo)',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 750,
    y: 480,
    regionId: 'reg-js-2',
    linkedOvaId: 'ova-js-2',
    linkedLessonId: 'les-js-203',
    tags: ['for...of', 'try/catch', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      'Protocolo Symbol.iterator, citas de Dr. Axel Rauschmayer y Haverbeke, diagrama try/catch/finally, 5 ejercicios cortos y 10 para desarrollar.',
    blocks: BLOCKS_JS_203,
  },

  // Nodos asociados a Región 3 (OVA 3)
  {
    id: 'node-js-301',
    title: 'Arreglos (Arrays), Big-O y Lab Animado (5 Cortos + 10 Desarrollo)',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 80,
    y: 830,
    regionId: 'reg-js-3',
    linkedOvaId: 'ova-js-3',
    linkedLessonId: 'les-js-301',
    tags: ['Arrays', 'Big-O', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      'Memoria contigua O(1) vs O(n), citas de Haverbeke y Flanagan, laboratorio animado de arreglos, 5 ejercicios cortos y 10 para desarrollar.',
    blocks: BLOCKS_JS_301,
  },
  {
    id: 'node-js-302',
    title: 'Programación Funcional (map, filter, reduce) (5 Cortos + 10 Desarrollo)',
    type: 'code',
    codeLanguage: 'javascript',
    researchStatus: 'in_ova',
    x: 415,
    y: 830,
    regionId: 'reg-js-3',
    linkedOvaId: 'ova-js-3',
    linkedLessonId: 'les-js-302',
    tags: ['map/filter', 'reduce', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      'Funciones de Orden Superior e inmutabilidad, citas de Haverbeke y Douglas Crockford, simulador funcional animado, 5 ejercicios cortos y 10 para desarrollar.',
    blocks: BLOCKS_JS_302,
  },
  {
    id: 'node-js-303',
    title: 'Objetos Clave-Valor, Desestructuración y JSON (5 Cortos + 10 Desarrollo)',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 750,
    y: 830,
    regionId: 'reg-js-3',
    linkedOvaId: 'ova-js-3',
    linkedLessonId: 'les-js-303',
    tags: ['Objetos', 'JSON', '15 Ejercicios'],
    updatedAt: '2026-11-25',
    content:
      'Tablas hash clave-valor, citas de David Flanagan y Douglas Crockford, inspector interactivo de objetos, 5 ejercicios cortos y 10 para desarrollar.',
    blocks: BLOCKS_JS_303,
  },
];

export const INITIAL_EDGES: GraphEdge[] = [
  {
    id: 'edge-js-1',
    sourceId: 'node-js-101',
    targetId: 'node-js-102',
    label: 'declara enlaces en',
  },
  {
    id: 'edge-js-2',
    sourceId: 'node-js-102',
    targetId: 'node-js-103',
    label: 'tipa valores en',
  },
  {
    id: 'edge-js-3',
    sourceId: 'node-js-103',
    targetId: 'node-js-201',
    label: 'evalúa predicados en',
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
    label: 'indexa secuencias en',
  },
  {
    id: 'edge-js-7',
    sourceId: 'node-js-301',
    targetId: 'node-js-302',
    label: 'transforma colecciones con',
  },
  {
    id: 'edge-js-8',
    sourceId: 'node-js-302',
    targetId: 'node-js-303',
    label: 'modela entidades en',
  },
];

// ============================================================================
// LAS 3 OVAS DE JAVASCRIPT COMPLETAS (18 CITAS DE LIBROS + 135 EJERCICIOS EJECUTABLES)
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
      'Fundamentación exhaustiva de JavaScript moderno con citas de Kyle Simpson, Marijn Haverbeke, Nicholas C. Zakas, David Flanagan y Douglas Crockford. Cada uno de los 3 tópicos incluye 5 ejercicios propuestos cortos y 10 ejercicios similares para desarrollar con snippet de código interactivo ejecutable (45 ejercicios en esta OVA).',
    estimatedHours: 28,
    updatedAt: '2026-11-25',
    lessons: [
      {
        id: 'les-js-101',
        order: 1,
        title: 'Generalidades de JavaScript, Arquitectura JIT V8 y Gramática Sintáctica',
        durationMinutes: 80,
        summary: 'Estudia la compilación JIT en V8, citas de Kyle Simpson y Marijn Haverbeke, y practica en el snippet ejecutable con 5 ejercicios propuestos cortos + 10 ejercicios para desarrollar.',
        linkedNodeIds: ['node-js-101'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_101,
        quiz: [
          {
            id: 'q-js101-1',
            question: 'Según Kyle Simpson en "You Don’t Know JS Yet", ¿por qué un error de sintaxis en la línea 100 impide que se ejecute la línea 1 de un archivo JavaScript?',
            options: [
              'Porque el motor realiza primero una fase de análisis y compilación (generando el AST) antes de ejecutar la primera instrucción',
              'Porque JavaScript lee los archivos de abajo hacia arriba',
              'Porque el navegador descarga primero el final del archivo',
            ],
            correctIndex: 0,
            explanation: 'El motor de JS parsea el código fuente completo hacia un Árbol de Sintaxis Abstracta (AST) antes de iniciar la ejecución.',
          },
          {
            id: 'q-js101-2',
            question: '¿Cuál es la diferencia fundamental entre una Expresión y una Sentencia según "Eloquent JavaScript"?',
            options: [
              'Una expresión se evalúa y produce un valor, mientras que una sentencia ejecuta una acción completa en el programa',
              'Las expresiones solo funcionan en Node.js y las sentencias solo en el navegador',
              'No existe ninguna diferencia',
            ],
            correctIndex: 0,
            explanation: 'Toda expresión (ej. 5 + 3 o un ternario) se reduce a un valor; por eso puede incrustarse dentro de ${...}.',
          },
        ],
        activity: {
          id: 'act-js101',
          title: 'Taller Práctico OVA 1: 15 Ejercicios Cortos y 30 de Desarrollo Ejecutados en Snippet',
          evidenceCode: 'GA7-220501096-JS1-EV01',
          evidenceType: 'Conocimiento',
          instructions:
            'Resuelve y ejecuta directamente en los snippets interactivos los 5 ejercicios propuestos cortos y los 10 ejercicios para desarrollar de cada uno de los 3 tópicos del OVA 1.',
          dueDate: '2026-11-28',
          deliverableFormat: 'Repositorio GitHub con archivos .js ejecutables en modo estricto',
        },
      },
      {
        id: 'les-js-102',
        order: 2,
        title: 'Declaración de Variables (var, let, const), Block Scope y Zona Muerta Temporal',
        durationMinutes: 85,
        summary: 'Analiza el ámbito léxico con citas de Nicholas C. Zakas y David Flanagan, el diagrama comparativo var/let/const, y practica con 5 ejercicios cortos + 10 ejercicios para desarrollar.',
        linkedNodeIds: ['node-js-102'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_102,
        quiz: [
          {
            id: 'q-js102-1',
            question: '¿Qué es la Zona Muerta Temporal (Temporal Dead Zone - TDZ) en variables declaradas con let y const?',
            options: [
              'El intervalo desde que inicia el bloque { } hasta la línea física donde se declara e inicializa la variable, durante el cual cualquier acceso lanza ReferenceError',
              'Un recolector de basura que borra variables cada 5 minutos',
              'Un modo de ahorro de batería del navegador',
            ],
            correctIndex: 0,
            explanation: 'A diferencia de var (que se inicializa a undefined con hoisting), let y const permanecen no inicializadas en la TDZ hasta alcanzar su línea de declaración.',
          },
          {
            id: 'q-js102-2',
            question: 'Si deseas que un objeto declarado con const tampoco permita modificar ninguna de sus propiedades internas superficiales, ¿qué método debes aplicar?',
            options: ['Object.freeze(objeto)', 'Number.isNaN(objeto)', 'JSON.parse(objeto)'],
            correctIndex: 0,
            explanation: 'const protege la referencia de la variable, mientras que Object.freeze() congela las propiedades propias del objeto.',
          },
        ],
      },
      {
        id: 'les-js-103',
        order: 3,
        title: 'Taxonomía de Tipos de Datos ECMA-262, Stack vs. Heap, Coerción e Igualdad Estricta',
        durationMinutes: 90,
        summary: 'Profundiza en los 7 tipos primitivos y objetos en el Heap, citas de Kyle Simpson y Douglas Crockford, y resuelve en el snippet 5 ejercicios cortos + 10 para desarrollar.',
        linkedNodeIds: ['node-js-103'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_103,
        quiz: [
          {
            id: 'q-js103-1',
            question: '¿Cuáles de los siguientes valores se evalúan como TRUTHY (verdaderos) al convertirlos a booleano en un condicional if?',
            options: [
              'La cadena "0", la cadena "false", un arreglo vacío [] y un objeto vacío {}',
              'El número 0, la cadena vacía "", null, undefined y NaN',
              'Únicamente el booleano true',
            ],
            correctIndex: 0,
            explanation: 'Solo existen 8 valores falsy (false, 0, -0, 0n, "", null, undefined, NaN). Cualquier string no vacío ("0") y cualquier objeto o array ([] o {}) es truthy.',
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
      'Estudio profundo del control de flujo algorítmico con diagramas SVG ilustrados y citas de Marijn Haverbeke, Robert C. Martin (Clean Code), David Flanagan y Dr. Axel Rauschmayer. Cada tópico incluye 5 ejercicios propuestos cortos y 10 ejercicios similares para desarrollar con ejecución en vivo (45 ejercicios en esta OVA).',
    estimatedHours: 32,
    updatedAt: '2026-11-25',
    lessons: [
      {
        id: 'les-js-201',
        order: 1,
        title: 'Estructuras Condicionales, Cláusulas de Guarda (Clean Code) y Cortocircuito',
        durationMinutes: 85,
        summary: 'Domina la toma de decisiones con diagramas de flujo, citas de Haverbeke y Robert C. Martin, y practica en el snippet ejecutable con 5 ejercicios cortos + 10 para desarrollar.',
        linkedNodeIds: ['node-js-201'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_201,
        quiz: [
          {
            id: 'q-js201-1',
            question: '¿Por qué el operador de coalescencia nula (A ?? B) es más seguro que el operador OR (A || B) cuando trabajamos con calificaciones o precios numéricos?',
            options: [
              'Porque ?? solo usa el valor por defecto B cuando A es null o undefined, respetando el número 0 como un valor válido',
              'Porque || no funciona con strings',
              'Porque ?? multiplica ambos números automáticamente',
            ],
            correctIndex: 0,
            explanation: 'Con ||, el número 0 se considera falsy y es reemplazado por el valor por defecto; con ??, el 0 se conserva intacto.',
          },
        ],
      },
      {
        id: 'les-js-202',
        order: 2,
        title: 'Estructuras Repetitivas (for, while, do...while), Invariantes y Complejidad',
        durationMinutes: 90,
        summary: 'Estudia la teoría formal de bucles con citas de David Flanagan y Haverbeke, el diagrama de 4 etapas y desarrolla en vivo 5 ejercicios cortos + 10 ejercicios algorítmicos.',
        linkedNodeIds: ['node-js-202'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_202,
        quiz: [
          {
            id: 'q-js202-1',
            question: 'Para verificar si un número entero n > 1 es primo de forma eficiente, ¿hasta qué límite basta con probar divisores en el ciclo for?',
            options: [
              'Hasta la raíz cuadrada de n (d * d <= n), logrando complejidad O(√n)',
              'Hasta n * 100',
              'Solo hay que probar si es divisible entre 2',
            ],
            correctIndex: 0,
            explanation: 'Todo número compuesto n posee al menos un factor primo menor o igual a √n.',
          },
        ],
        activity: {
          id: 'act-js202',
          title: 'Evidencia de Desempeño: 45 Algoritmos Ejecutables de Control de Flujo y Excepciones',
          evidenceCode: 'GA7-220501096-JS2-EV01',
          evidenceType: 'Desempeño',
          instructions:
            'Resuelve en los snippets ejecutables los 5 ejercicios cortos y 10 ejercicios para desarrollar de Condicionales, Ciclos y Excepciones (45 ejercicios en total del OVA 2).',
          dueDate: '2026-11-30',
          deliverableFormat: 'Repositorio Git con scripts .js y pruebas de consola',
        },
      },
      {
        id: 'les-js-203',
        order: 3,
        title: 'Protocolo Iterable (for...of vs. for...in) y Tolerancia a Fallos (try / catch / finally)',
        durationMinutes: 85,
        summary: 'Explora el protocolo Symbol.iterator con citas de Dr. Axel Rauschmayer y Haverbeke, el diagrama try/catch/finally y practica con 5 ejercicios cortos + 10 para desarrollar.',
        linkedNodeIds: ['node-js-203'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_203,
        quiz: [
          {
            id: 'q-js203-1',
            question: 'Según Dr. Axel Rauschmayer en "Exploring JavaScript", ¿qué ventaja clave ofrece el bucle for...of frente al método .forEach() de los arreglos?',
            options: [
              'Permite detener la iteración anticipadamente con break, saltar pasos con continue o retornar directamente desde la función contenedora',
              'Modifica automáticamente todos los números a strings',
              'Solo for...of puede usarse en archivos HTML',
            ],
            correctIndex: 0,
            explanation: 'Dentro de un callback .forEach() no se puede usar break ni continue, mientras que for...of sí los soporta nativamente.',
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
      'Tratado práctico y visual sobre estructuras de datos en JavaScript con 3 laboratorios interactivos animados, análisis de complejidad Big-O y citas de Marijn Haverbeke, David Flanagan y Douglas Crockford. Cada tópico cuenta con 5 ejercicios propuestos cortos y 10 ejercicios similares para desarrollar en su snippet ejecutable (45 ejercicios en esta OVA).',
    estimatedHours: 36,
    updatedAt: '2026-11-25',
    lessons: [
      {
        id: 'les-js-301',
        order: 1,
        title: 'Arreglos (Arrays): Arquitectura en Memoria, Big-O y Laboratorio Interactivo',
        durationMinutes: 90,
        summary: 'Analiza la complejidad O(1) vs O(n) de push/pop y shift/unshift con citas de Haverbeke y Flanagan, el gráfico animado y 5 ejercicios cortos + 10 para desarrollar.',
        linkedNodeIds: ['node-js-301'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_301,
        quiz: [
          {
            id: 'q-js301-1',
            question: '¿Por qué las operaciones .unshift() y .shift() tienen complejidad O(n) mientras que .push() y .pop() tienen complejidad O(1)?',
            options: [
              'Porque insertar o extraer en el índice [0] obliga a desplazar en memoria todos los demás elementos del arreglo para reindexarlos',
              'Porque .unshift() requiere conexión a internet',
              'Porque .push() solo funciona con números pares',
            ],
            correctIndex: 0,
            explanation: 'Operar al final (.push/.pop) solo toca la última casilla; operar al inicio (.unshift/.shift) desplaza los n elementos restantes.',
          },
        ],
      },
      {
        id: 'les-js-302',
        order: 2,
        title: 'Programación Funcional sobre Arreglos: map, filter, find, some, every y reduce',
        durationMinutes: 95,
        summary: 'Domina las funciones de orden superior con citas de Haverbeke y Douglas Crockford, el simulador animado de pipelines y 5 ejercicios cortos + 10 para desarrollar.',
        linkedNodeIds: ['node-js-302'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_302,
        quiz: [
          {
            id: 'q-js302-1',
            question: '¿Qué método funcional de Array permite condensar o agrupar una lista de objetos de ventas en un único diccionario de totales por categoría?',
            options: ['.reduce()', '.filter()', '.find()', '.some()'],
            correctIndex: 0,
            explanation: '.reduce((acumulador, item) => ..., {}) permite construir cualquier estructura agregada (un número, un objeto diccionario o otro arreglo) a partir de una colección.',
          },
        ],
      },
      {
        id: 'les-js-303',
        order: 3,
        title: 'Objetos Clave-Valor, Desestructuración, Object.entries/fromEntries y JSON',
        durationMinutes: 90,
        summary: 'Modela entidades con citas de David Flanagan y Douglas Crockford, el inspector interactivo de objetos y 5 ejercicios cortos + 10 para desarrollar en el snippet.',
        linkedNodeIds: ['node-js-303'],
        contentMarkdown: '',
        blocks: BLOCKS_JS_303,
        quiz: [
          {
            id: 'q-js303-1',
            question: '¿Qué pareja de métodos estáticos de Object permite transformar un diccionario clave-valor aplicando .filter() o .map() como si fuera un arreglo y reconstruir el objeto?',
            options: [
              'Object.entries(obj) seguido de Object.fromEntries(pares)',
              'Object.freeze(obj) seguido de Object.isFrozen(obj)',
              'JSON.parse(obj) seguido de Math.round(obj)',
            ],
            correctIndex: 0,
            explanation: 'Object.entries(obj) convierte el objeto en un arreglo de pares [clave, valor], y Object.fromEntries() vuelve a ensamblar el objeto resultante.',
          },
        ],
        activity: {
          id: 'act-js303',
          title: 'Evidencia de Producto: 45 Ejercicios Ejecutables de Arreglos, Programación Funcional y Objetos',
          evidenceCode: 'GA7-220501096-JS3-EV02',
          evidenceType: 'Producto',
          instructions:
            'Desarrolla y prueba en los snippets interactivos los 5 ejercicios cortos y 10 ejercicios de desarrollo de cada tópico del OVA 3 (45 ejercicios en total).',
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
            submittedAt: '2026-11-25',
            deliveryLinkOrNote: 'https://github.com/vrojas-sena/js-fundamentos-sena',
            score: 98,
          },
        },
        lastAccessedAt: '2026-11-25 17:45',
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
    activityTitle: 'Taller Práctico OVA 1: 15 Ejercicios Cortos y 30 de Desarrollo Ejecutados en Snippet',
    channel: 'whatsapp',
    sentAt: '2026-11-25 09:15',
    messagePreview:
      'Hola Mateo Hernández Quiroga, te recuerdo que la evidencia GA7-220501096-JS1-EV01 vence el 2026-11-28...',
  },
];
