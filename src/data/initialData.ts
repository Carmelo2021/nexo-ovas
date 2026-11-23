import {
  GraphEdge,
  GraphNode,
  GraphRegion,
  InstructorCredentials,
  Learner,
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

export const INITIAL_REGIONS: GraphRegion[] = [
  {
    id: 'reg-arquitectura',
    title: 'Región 01 · Arquitectura Backend y Contratos REST',
    subtitle: 'Fundamentos HTTP, diseño de endpoints y validación de esquemas',
    x: 60,
    y: 60,
    width: 680,
    height: 490,
    tone: 'indigo',
  },
  {
    id: 'reg-datos',
    title: 'Región 02 · Persistencia Relacional y Optimización SQL',
    subtitle: 'Modelado entidad-relación, índices B-Tree y transacciones ACID',
    x: 800,
    y: 60,
    width: 660,
    height: 490,
    tone: 'emerald',
  },
  {
    id: 'reg-seguridad',
    title: 'Región 03 · Seguridad Aplicativa y Evidencias del Proyecto',
    subtitle: 'Autenticación JWT, control de roles RBAC y entregas de producto SENA',
    x: 340,
    y: 600,
    width: 820,
    height: 390,
    tone: 'amber',
  },
];

export const INITIAL_NODES: GraphNode[] = [
  {
    id: 'node-1',
    title: 'Principios de Arquitectura RESTful y Semántica HTTP',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 95,
    y: 130,
    regionId: 'reg-arquitectura',
    linkedOvaId: 'ova-adso-1',
    linkedLessonId: 'les-101',
    tags: ['REST', 'HTTP', 'ADSO', 'Fase Ejecución'],
    updatedAt: '2026-11-08',
    content: `### Semántica de Verbos y Códigos de Estado
Un servicio RESTful bien estructurado utiliza los métodos HTTP según su contrato de idempotencia:
- **GET**: Lectura segura e idempotente de colecciones o recursos individuales.
- **POST**: Creación de nuevos recursos subordinados (retorna \`201 Created\` + cabecera \`Location\`).
- **PUT / PATCH**: Reemplazo completo o actualización parcial del estado de un recurso.
- **DELETE**: Eliminación lógica o física del recurso.

#### Convención de Rutas para Proyecto Formativo
1. Usar sustantivos en plural (\`/api/v1/aprendices\`, \`/api/v1/evidencias\`).
2. Evitar verbos en la URI (\`/api/v1/crearAprendiz\` es un antipatrón).
3. Manejar paginación explícita con \`?limit=20&offset=0\`.`,
  },
  {
    id: 'node-2',
    title: 'Video Guía: Diseño de Contratos OpenAPI 3.1 y Validación DTO',
    type: 'media',
    researchStatus: 'in_ova',
    x: 425,
    y: 135,
    regionId: 'reg-arquitectura',
    linkedOvaId: 'ova-adso-1',
    linkedLessonId: 'les-102',
    mediaKind: 'video',
    mediaUrl: 'https://swagger.io/specification/',
    tags: ['OpenAPI', 'DTO', 'Swagger', 'Documentación'],
    updatedAt: '2026-11-08',
    content: `Recurso audiovisual y especificación oficial para documentar APIs antes de codificar los controladores (enfoque *API-First*). Incluye plantilla de validación con esquemas tipados para evitar inyección de payloads malformados.`,
  },
  {
    id: 'node-3',
    title: 'Cuestionario: Idempotencia y Códigos de Estado HTTP',
    type: 'quiz',
    researchStatus: 'in_ova',
    x: 245,
    y: 355,
    regionId: 'reg-arquitectura',
    linkedOvaId: 'ova-adso-1',
    linkedLessonId: 'les-101',
    tags: ['Evaluación', 'HTTP', 'Conocimiento'],
    updatedAt: '2026-11-09',
    content: 'Banco de preguntas de comprobación rápida sobre métodos HTTP, códigos 2xx/4xx/5xx y diseño de rutas REST.',
    quizQuestions: [
      {
        id: 'q-node-1',
        question: '¿Cuál de los siguientes métodos HTTP NO es idempotente por definición del estándar RFC 9110?',
        options: ['GET', 'PUT', 'POST', 'DELETE'],
        correctIndex: 2,
        explanation: 'POST crea un nuevo recurso o ejecuta un proceso en cada invocación, alterando el estado del servidor múltiples veces.',
      },
      {
        id: 'q-node-2',
        question: '¿Qué código de estado es el más apropiado cuando un payload JSON incumple las reglas de validación semántica del dominio?',
        options: ['200 OK', '422 Unprocessable Content', '502 Bad Gateway', '304 Not Modified'],
        correctIndex: 1,
        explanation: '422 indica que la sintaxis del cuerpo es válida, pero las reglas de negocio o validación de campos fallaron.',
      },
    ],
  },
  {
    id: 'node-4',
    title: 'Normalización 3FN y Modelado Entidad-Relación',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 835,
    y: 130,
    regionId: 'reg-datos',
    linkedOvaId: 'ova-adso-2',
    linkedLessonId: 'les-201',
    tags: ['SQL', '3FN', 'Modelo ER', 'PostgreSQL'],
    updatedAt: '2026-11-07',
    content: `### Reglas de Normalización Aplicadas
- **1FN**: Atributos atómicos sin grupos repetidos ni arreglos serializados en texto.
- **2FN**: Dependencia funcional completa respecto a llaves primarias compuestas.
- **3FN**: Eliminación de dependencias transitivas entre columnas no clave.

#### Nota de Investigación del Instructor
Para el sistema de gestión de inventario de los aprendices, separar siempre \`catalogo_productos\` de \`movimientos_kardex\` para preservar trazabilidad histórica.`,
  },
  {
    id: 'node-5',
    title: 'Índices Compuestos B-Tree y Análisis con EXPLAIN ANALYZE',
    type: 'markdown',
    researchStatus: 'verified',
    x: 1150,
    y: 140,
    regionId: 'reg-datos',
    linkedOvaId: 'ova-adso-2',
    linkedLessonId: 'les-202',
    tags: ['Rendimiento', 'B-Tree', 'Consultas SQL'],
    updatedAt: '2026-11-09',
    content: `### Optimización de Consultas Frecuentes
Un índice compuesto \`(ficha_codigo, fecha_entrega)\` acelera búsquedas por prefijo izquierdo.
- Evitar funciones sobre la columna indexada en el \`WHERE\` (ej. \`WHERE YEAR(fecha) = 2026\` invalida el árbol B-Tree).
- Revisar \`Seq Scan\` vs \`Index Scan\` en planes de ejecución.`,
  },
  {
    id: 'node-6',
    title: 'Transacciones ACID y Niveles de Aislamiento en Concurrencia',
    type: 'markdown',
    researchStatus: 'draft',
    x: 990,
    y: 355,
    regionId: 'reg-datos',
    tags: ['ACID', 'Concurrencia', 'Bloqueos'],
    updatedAt: '2026-11-09',
    content: `### Investigación en Curso para Próxima Lección
Comparativa práctica entre \`READ COMMITTED\` y \`SERIALIZABLE\` cuando dos aprendices o cajeros descuentan stock del mismo lote simultáneamente. Pendiente agregar diagrama de *Lost Update*.`,
  },
  {
    id: 'node-7',
    title: 'Autenticación Stateless con JWT, Refresh Tokens y RBAC',
    type: 'markdown',
    researchStatus: 'in_ova',
    x: 380,
    y: 675,
    regionId: 'reg-seguridad',
    linkedOvaId: 'ova-adso-1',
    linkedLessonId: 'les-103',
    tags: ['JWT', 'Seguridad', 'OWASP', 'RBAC'],
    updatedAt: '2026-11-08',
    content: `### Estructura Segura de Tokens
1. **Access Token** de vida corta (15 min) firmado con \`RS256\` o \`HS256\`.
2. **Middleware de Roles**: Verificar el claim \`rol\` en el servidor antes de ejecutar casos de uso administrativos.
3. **Almacenamiento**: Preferir cookies \`HttpOnly; SameSite=Strict\` frente a exponer credenciales sensibles.`,
  },
  {
    id: 'node-8',
    title: 'Evidencia Producto: API REST Documentada + Colección de Pruebas',
    type: 'activity',
    researchStatus: 'in_ova',
    x: 760,
    y: 675,
    regionId: 'reg-seguridad',
    linkedOvaId: 'ova-adso-1',
    linkedLessonId: 'les-103',
    dueDate: '2026-11-12',
    evidenceType: 'Producto',
    tags: ['Evidencia SENA', 'GA7-220501096', 'Entrega'],
    updatedAt: '2026-11-09',
    content: `Entrega del repositorio Git con endpoints protegidos por JWT, especificación OpenAPI y pruebas de integración automatizadas para el proyecto formativo de la Ficha.`,
  },
  {
    id: 'node-9',
    title: 'Pasarelas OAuth 2.0 / OpenID Connect y Mitigación CSRF',
    type: 'markdown',
    researchStatus: 'to_research',
    x: 50,
    y: 675,
    tags: ['OAuth2', 'OIDC', 'Investigación Futura'],
    updatedAt: '2026-11-09',
    content: `### Pendiente por Investigar
Documentar el flujo *Authorization Code with PKCE* para aplicaciones SPA y móviles que integrarán los aprendices en el último trimestre lectivo.`,
  },
];

export const INITIAL_EDGES: GraphEdge[] = [
  {
    id: 'edge-1',
    sourceId: 'node-1',
    targetId: 'node-2',
    label: 'se formaliza con',
  },
  {
    id: 'edge-2',
    sourceId: 'node-1',
    targetId: 'node-3',
    label: 'evalúa conceptos en',
  },
  {
    id: 'edge-3',
    sourceId: 'node-2',
    targetId: 'node-7',
    label: 'protege rutas con',
  },
  {
    id: 'edge-4',
    sourceId: 'node-1',
    targetId: 'node-4',
    label: 'persiste entidades en',
  },
  {
    id: 'edge-5',
    sourceId: 'node-4',
    targetId: 'node-5',
    label: 'optimiza lecturas con',
  },
  {
    id: 'edge-6',
    sourceId: 'node-4',
    targetId: 'node-6',
    label: 'garantiza integridad con',
  },
  {
    id: 'edge-7',
    sourceId: 'node-7',
    targetId: 'node-8',
    label: 'se integra en evidencia',
  },
  {
    id: 'edge-8',
    sourceId: 'node-5',
    targetId: 'node-8',
    label: 'alimenta consultas de',
  },
  {
    id: 'edge-9',
    sourceId: 'node-9',
    targetId: 'node-7',
    label: 'extiende arquitectura de',
  },
];

export const INITIAL_OVAS: OVA[] = [
  {
    id: 'ova-adso-1',
    code: 'OVA-ADSO-220501096-01',
    title: 'Construcción de APIs RESTful Seguras y Contratos OpenAPI',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    competence: '220501096 · Desarrollar la solución de software de acuerdo con el diseño y metodologías de desarrollo',
    learningOutcome: 'RAP 03 · Construir servicios backend aplicando estándares de codificación, validación de datos y seguridad por tokens',
    status: 'published',
    description:
      'Objeto Virtual de Aprendizaje orientado a que el aprendiz diseñe, codifique y asegure servicios web RESTful para su proyecto formativo, desde la semántica HTTP hasta la protección de rutas mediante JWT.',
    estimatedHours: 24,
    updatedAt: '2026-11-09',
    lessons: [
      {
        id: 'les-101',
        order: 1,
        title: 'Fundamentos de Arquitectura REST y Semántica del Protocolo HTTP',
        durationMinutes: 45,
        summary: 'Comprende los principios de diseño orientado a recursos, verbos HTTP, idempotencia y códigos de respuesta.',
        linkedNodeIds: ['node-1', 'node-3'],
        mediaTitle: 'Guía MDN: Métodos de Petición y Códigos de Estado HTTP',
        mediaUrl: 'https://developer.mozilla.org/es/docs/Web/HTTP/Methods',
        contentMarkdown: `### 1. ¿Qué define a una API verdaderamente RESTful?
La transferencia de estado representacional (**REST**) propone modelar un sistema como un conjunto de **recursos** identificables mediante URIs únicas y manipulables a través de representaciones estándar (como JSON).

### 2. Matriz de Métodos HTTP y Contrato de Idempotencia
- **GET \`/api/v1/fichas\`**: Obtiene el listado de fichas. Es *seguro* (no altera datos) e *idempotente*.
- **POST \`/api/v1/evidencias\`**: Registra un nuevo envío de evidencia. **No es idempotente**; debe responder con \`201 Created\`.
- **PUT \`/api/v1/aprendices/{id}\`**: Reemplaza de forma íntegra el registro del aprendiz. Es *idempotente*.
- **PATCH \`/api/v1/aprendices/{id}\`**: Modifica únicamente los campos enviados en el cuerpo de la petición.
- **DELETE \`/api/v1/evidencias/{id}\`**: Elimina el recurso especificado. Es *idempotente*.

### 3. Familias de Códigos de Respuesta Esenciales
- **200 OK / 201 Created / 204 No Content**: Éxito en la operación solicitada.
- **400 Bad Request / 401 Unauthorized / 403 Forbidden / 404 Not Found / 422 Unprocessable Content**: Errores originados en la solicitud del cliente.
- **500 Internal Server Error / 503 Service Unavailable**: Fallos internos en la capa de servidor o base de datos.`,
        quiz: [
          {
            id: 'q-101-1',
            question: '¿Cuál de los siguientes métodos HTTP NO es idempotente según el estándar HTTP?',
            options: ['GET', 'PUT', 'POST', 'DELETE'],
            correctIndex: 2,
            explanation: 'POST crea un nuevo recurso o dispara un procesamiento distinto cada vez que se invoca.',
          },
          {
            id: 'q-101-2',
            question: 'Si un aprendiz intenta acceder a una ruta de administración con un token válido pero sin permisos de instructor, ¿qué código debe retornar la API?',
            options: ['401 Unauthorized', '403 Forbidden', '404 Not Found', '400 Bad Request'],
            correctIndex: 1,
            explanation: '401 indica falta de autenticación; 403 Forbidden indica que el usuario está autenticado pero carece de permisos para ese recurso.',
          },
        ],
        activity: {
          id: 'act-101',
          title: 'Mapa de Endpoints y Matriz de Códigos del Proyecto Formativo',
          evidenceCode: 'GA7-220501096-AA1-EV01',
          evidenceType: 'Conocimiento',
          instructions:
            'Elabora el cuadro de recursos REST de tu proyecto formativo (mínimo 5 entidades principales), indicando método HTTP, ruta URI, payload de entrada y códigos de estado esperados.',
          dueDate: '2026-11-10',
          deliverableFormat: 'Enlace a repositorio Git o documento técnico PDF/Markdown',
        },
      },
      {
        id: 'les-102',
        order: 2,
        title: 'Contratos OpenAPI 3.1 y Validación de Esquemas de Entrada (DTO)',
        durationMinutes: 50,
        summary: 'Aplica el enfoque API-First documentando contratos interactivos y validando tipos de datos antes de llegar a la base de datos.',
        linkedNodeIds: ['node-2'],
        mediaTitle: 'Especificación Oficial OpenAPI 3.1 y Ejemplos YAML',
        mediaUrl: 'https://swagger.io/specification/',
        contentMarkdown: `### 1. Enfoque API-First en Equipos de Desarrollo
Antes de codificar las vistas del frontend o las tablas definitivas, el equipo define el **contrato de interfaz** usando OpenAPI (Swagger). Esto permite que el equipo frontend y backend trabajen en paralelo sin bloqueos.

### 2. Uso de Objetos de Transferencia de Datos (DTO)
Nunca pases directamente el objeto \`req.body\` hacia el ORM o consulta SQL. Implementa un esquema de validación estricto:
1. Verifica tipos primitivos (cadenas, números, fechas ISO-8601).
2. Limita longitudes máximas y formatos (correo electrónico, código de ficha de 7 dígitos).
3. Rechaza propiedades no declaradas en el contrato devolviendo un error estructurado \`422 Unprocessable Content\`.`,
        quiz: [
          {
            id: 'q-102-1',
            question: '¿Cuál es el beneficio principal de validar el payload mediante un DTO en la capa de entrada del controlador?',
            options: [
              'Acelerar la velocidad de renderizado CSS en el navegador',
              'Garantizar que la lógica de negocio y la base de datos reciban únicamente datos íntegros y tipados',
              'Reemplazar por completo la necesidad de usar llaves primarias en SQL',
              'Permitir conexiones sin usar protocolo HTTP',
            ],
            correctIndex: 1,
            explanation: 'Los DTOs con validación protegen el dominio contra datos corruptos, campos faltantes o inyecciones inesperadas.',
          },
        ],
      },
      {
        id: 'les-103',
        order: 3,
        title: 'Seguridad Stateless con JSON Web Tokens (JWT) y Control de Roles',
        durationMinutes: 60,
        summary: 'Implementa autenticación basada en tokens firmados, hashing de contraseñas con Argon2/Bcrypt y protección de rutas por rol.',
        linkedNodeIds: ['node-7', 'node-8'],
        mediaTitle: 'Guía OWASP: Buenas Prácticas de Autenticación y Manejo de Sesiones',
        mediaUrl: 'https://cheatsheetseries.owasp.org/',
        contentMarkdown: `### 1. Anatomía de un JSON Web Token (JWT)
Un JWT consta de tres partes codificadas en Base64Url separadas por puntos (\`Header.Payload.Signature\`):
- **Header**: Algoritmo de firma (\`HS256\` o \`RS256\`) y tipo de token.
- **Payload (Claims)**: Identificador del usuario (\`sub\`), rol (\`role\`), fecha de emisión (\`iat\`) y fecha de expiración (\`exp\`).
- **Signature**: Firma criptográfica que garantiza que el contenido no fue adulterado por el cliente.

### 2. Reglas de Oro de Seguridad Aplicativa
- **Jamás guardar contraseñas en texto plano**: Utilizar funciones de derivación con *salt* como **Argon2id** o **bcrypt** (factor de costo $\\ge 12$).
- **Expiración corta**: Configurar \`exp\` entre 15 y 30 minutos para tokens de acceso.
- **Principio de menor privilegio**: Validar en un middleware intermedio tanto la firma del token como el permiso específico del rol antes de ejecutar acciones sensibles.`,
        quiz: [
          {
            id: 'q-103-1',
            question: '¿Por qué NUNCA se debe almacenar información confidencial (como contraseñas o claves privadas) dentro del Payload de un JWT estándar (JWS)?',
            options: [
              'Porque el Payload solo acepta números enteros',
              'Porque el Payload está únicamente codificado en Base64Url (firmado pero no cifrado) y cualquiera que posea el token puede leerlo',
              'Porque invalida automáticamente el certificado TLS del servidor',
              'Porque los navegadores bloquean cadenas mayores a 20 caracteres',
            ],
            correctIndex: 1,
            explanation: 'Un JWT firmado (JWS) garantiza autenticidad e integridad, pero su contenido es legible decodificando Base64Url.',
          },
        ],
        activity: {
          id: 'act-103',
          title: 'Evidencia de Producto: API REST Protegida con JWT y Suite de Pruebas',
          evidenceCode: 'GA7-220501096-AA2-EV02',
          evidenceType: 'Producto',
          instructions:
            'Entrega el módulo de autenticación y autorización de tu proyecto formativo con registro de usuarios, login con JWT, middleware de roles y colección de pruebas exportada.',
          dueDate: '2026-11-12',
          deliverableFormat: 'URL del repositorio Git + archivo JSON de colección de pruebas',
        },
      },
    ],
  },
  {
    id: 'ova-adso-2',
    code: 'OVA-ADSO-220501095-02',
    title: 'Diseño de Bases de Datos Relacionales y Optimización de Consultas SQL',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    competence: '220501095 · Diseñar la solución de software de acuerdo con procedimientos y requisitos técnicos',
    learningOutcome: 'RAP 02 · Construir el modelo de datos relacional aplicando formas normales y estrategias de indexación para alto rendimiento',
    status: 'published',
    description:
      'Guía práctica y conceptual para transformar los requerimientos del proyecto formativo en un esquema relacional normalizado en 3FN, con integridad referencial e índices B-Tree optimizados.',
    estimatedHours: 18,
    updatedAt: '2026-11-08',
    lessons: [
      {
        id: 'les-201',
        order: 1,
        title: 'Modelado Entidad-Relación y Normalización hasta Tercera Forma Normal (3FN)',
        durationMinutes: 50,
        summary: 'Elimina anomalías de inserción, actualización y borrado estructurando tablas limpias con integridad referencial.',
        linkedNodeIds: ['node-4'],
        mediaTitle: 'Documentación Oficial PostgreSQL: Definición de Datos y Constraints',
        mediaUrl: 'https://www.postgresql.org/docs/current/ddl.html',
        contentMarkdown: `### 1. ¿Por qué normalizar el modelo de datos?
Un esquema sin normalizar almacena datos redundantes en múltiples filas, provocando inconsistencias cuando se actualiza un dato (por ejemplo, el nombre de un programa de formación repetido en miles de matrículas).

### 2. Paso a Paso hacia 3FN
1. **Primera Forma Normal (1FN)**: Cada columna contiene un único valor atómico; no existen listas separadas por comas dentro de una celda.
2. **Segunda Forma Normal (2FN)**: Cumple 1FN y todo atributo no primo depende por completo de la llave primaria completa (clave en tablas puente con llave compuesta).
3. **Tercera Forma Normal (3FN)**: Cumple 2FN y ningún atributo no primo depende transitivamente de otro atributo no primo.`,
        quiz: [
          {
            id: 'q-201-1',
            question: 'En una tabla "Matriculas(id_aprendiz, id_ficha, nombre_programa_ficha)", ¿qué forma normal se incumple principalmente?',
            options: [
              'Ninguna, está en 5FN',
              'Segunda y Tercera Forma Normal por dependencia parcial/transitiva de nombre_programa_ficha respecto a id_ficha',
              'Solo se incumple el uso de índices B-Tree',
              'Primera Forma Normal por no usar JSON',
            ],
            correctIndex: 1,
            explanation: 'El nombre del programa depende únicamente de la ficha (no de la combinación aprendiz+ficha), generando redundancia en cada matrícula.',
          },
        ],
        activity: {
          id: 'act-201',
          title: 'Evidencia de Desempeño: Script DDL en 3FN y Diagrama Relacional',
          evidenceCode: 'GA4-220501095-AA1-EV01',
          evidenceType: 'Desempeño',
          instructions:
            'Presenta el diagrama Entidad-Relación y el script SQL DDL (CREATE TABLE con llaves primarias, foráneas y restricciones CHECK/UNIQUE) normalizado en 3FN.',
          dueDate: '2026-11-08',
          deliverableFormat: 'Archivo .sql + Diagrama ER en PDF',
        },
      },
      {
        id: 'les-202',
        order: 2,
        title: 'Indexación B-Tree y Lectura de Planes de Ejecución con EXPLAIN',
        durationMinutes: 45,
        summary: 'Identifica cuellos de botella en consultas SQL complejas y diseña índices compuestos eficientes.',
        linkedNodeIds: ['node-5'],
        contentMarkdown: `### 1. Cuándo crear un Índice B-Tree
Los índices aceleran drásticamente las lecturas (\`SELECT ... WHERE / JOIN / ORDER BY\`) pero añaden un costo adicional en cada escritura (\`INSERT / UPDATE / DELETE\`).

### 2. Regla del Prefijo Izquierdo en Índices Compuestos
Si creas el índice \`CREATE INDEX idx_evidencias_ficha_estado ON evidencias (ficha_codigo, estado);\`:
- Acelera consultas que filtran por \`ficha_codigo\`.
- Acelera consultas que filtran por \`ficha_codigo AND estado\`.
- **No** es óptimo si la consulta filtra únicamente por \`estado\` omitiendo \`ficha_codigo\`.`,
        quiz: [
          {
            id: 'q-202-1',
            question: 'Dado un índice compuesto sobre las columnas (ficha_codigo, fecha_entrega), ¿cuál consulta aprovecha directamente el árbol del índice?',
            options: [
              'SELECT * FROM entregas WHERE ficha_codigo = \'2874512\' AND fecha_entrega >= \'2026-11-01\';',
              'SELECT * FROM entregas WHERE LOWER(ficha_codigo) = \'2874512\';',
              'SELECT * FROM entregas;',
              'SELECT * FROM entregas WHERE comentario LIKE \'%pendiente%\';',
            ],
            correctIndex: 0,
            explanation: 'Filtra exactamente por el prefijo izquierdo del índice compuesto sin envolver la columna en funciones que inhabiliten el índice.',
          },
        ],
      },
    ],
  },
  {
    id: 'ova-redes-1',
    code: 'OVA-RED-220501104-01',
    title: 'Segmentación VLAN, Enrutamiento Inter-VLAN y Endurecimiento de Switches',
    fichaCode: '2901845',
    programName: 'Tecnólogo en Gestión de Redes de Datos',
    competence: '220501104 · Implementar la infraestructura de red de acuerdo con el diseño y estándares técnicos',
    learningOutcome: 'RAP 01 · Configurar conmutación segura, enlaces troncales IEEE 802.1Q y control de tráfico entre subredes corporativas',
    status: 'published',
    description:
      'Material de estudio y laboratorio paso a paso para segmentar dominios de broadcast en redes empresariales, configurar enlaces troncales 802.1Q y mitigar ataques de capa 2.',
    estimatedHours: 20,
    updatedAt: '2026-11-09',
    lessons: [
      {
        id: 'les-301',
        order: 1,
        title: 'Segmentación Lógica con VLANs y Enlaces Troncales IEEE 802.1Q',
        durationMinutes: 55,
        summary: 'Diseña topologías segmentadas por departamento, voz y administración utilizando etiquetado de tramas 802.1Q.',
        linkedNodeIds: [],
        contentMarkdown: `### 1. Dominios de Broadcast y Segmentación Capa 2
Una **VLAN (Virtual Local Area Network)** divide un switch físico en múltiples switches lógicos independientes, conteniendo el tráfico de broadcast y mejorando la seguridad entre áreas (ej. VLAN 10 Académica, VLAN 20 Instructores, VLAN 99 Gestión).

### 2. Etiquetado IEEE 802.1Q y VLAN Nativa
Cuando una trama atraviesa un enlace **Trunk** entre dos switches, el protocolo 802.1Q inserta una etiqueta de 4 bytes en la cabecera Ethernet con el **VLAN ID (12 bits, hasta 4094 VLANs)**.
- Cambia siempre la **VLAN Nativa** por defecto (VLAN 1) a una VLAN dedicada sin puertos de usuario activos para prevenir ataques de *VLAN Hopping*.`,
        quiz: [
          {
            id: 'q-301-1',
            question: '¿Qué estándar IEEE define el mecanismo de etiquetado de tramas Ethernet para enlaces troncales entre switches?',
            options: ['IEEE 802.11ax', 'IEEE 802.1Q', 'IEEE 802.3af', 'IEEE 802.1X'],
            correctIndex: 1,
            explanation: 'IEEE 802.1Q especifica el formato de etiqueta VLAN en tramas Ethernet sobre enlaces troncales.',
          },
        ],
        activity: {
          id: 'act-301',
          title: 'Laboratorio Packet Tracer: Topología Multi-VLAN y Router-on-a-Stick',
          evidenceCode: 'GA3-220501104-AA1-EV02',
          evidenceType: 'Producto',
          instructions:
            'Configura tres VLANs (Datos, Voz y Gestión), enlaces troncales 802.1Q con cambio de VLAN nativa y subinterfaces 802.1Q en el router principal.',
          dueDate: '2026-11-14',
          deliverableFormat: 'Archivo de topología .pkt + memoria técnica de direccionamiento IP',
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
      'ova-adso-1': {
        ovaId: 'ova-adso-1',
        completedLessonIds: ['les-101', 'les-102'],
        quizScores: { 'les-101': 100, 'les-102': 100 },
        submissions: {
          'les-101': {
            lessonId: 'les-101',
            activityId: 'act-101',
            status: 'submitted',
            submittedAt: '2026-11-08',
            deliveryLinkOrNote: 'https://github.com/vrojas-sena/adso-api-contratos/blob/main/MATRIZ_ENDPOINTS.md',
            score: 95,
          },
          'les-103': {
            lessonId: 'les-103',
            activityId: 'act-103',
            status: 'pending',
          },
        },
        lastAccessedAt: '2026-11-09 07:45',
      },
      'ova-adso-2': {
        ovaId: 'ova-adso-2',
        completedLessonIds: ['les-201', 'les-202'],
        quizScores: { 'les-201': 100, 'les-202': 100 },
        submissions: {
          'les-201': {
            lessonId: 'les-201',
            activityId: 'act-201',
            status: 'submitted',
            submittedAt: '2026-11-07',
            deliveryLinkOrNote: 'https://github.com/vrojas-sena/adso-db-3fn/tree/main/sql',
            score: 100,
          },
        },
        lastAccessedAt: '2026-11-08 18:20',
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
    progressByOva: {
      'ova-adso-1': {
        ovaId: 'ova-adso-1',
        completedLessonIds: ['les-101'],
        quizScores: { 'les-101': 50 },
        submissions: {
          'les-101': {
            lessonId: 'les-101',
            activityId: 'act-101',
            status: 'pending',
          },
          'les-103': {
            lessonId: 'les-103',
            activityId: 'act-103',
            status: 'pending',
          },
        },
        lastAccessedAt: '2026-11-07 14:10',
      },
      'ova-adso-2': {
        ovaId: 'ova-adso-2',
        completedLessonIds: [],
        quizScores: {},
        submissions: {
          'les-201': {
            lessonId: 'les-201',
            activityId: 'act-201',
            status: 'late',
          },
        },
        lastAccessedAt: '2026-11-05 11:30',
      },
    },
  },
  {
    id: 'apr-3',
    documentNumber: '1000784319',
    name: 'Laura Sofía Pineda Gómez',
    email: 'lspineda@soy.sena.edu.co',
    phone: '573214908821',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    progressByOva: {
      'ova-adso-1': {
        ovaId: 'ova-adso-1',
        completedLessonIds: ['les-101', 'les-102', 'les-103'],
        quizScores: { 'les-101': 100, 'les-102': 100, 'les-103': 100 },
        submissions: {
          'les-101': {
            lessonId: 'les-101',
            activityId: 'act-101',
            status: 'submitted',
            submittedAt: '2026-11-08',
            deliveryLinkOrNote: 'https://github.com/lpineda-adso/api-spec-sena',
            score: 100,
          },
          'les-103': {
            lessonId: 'les-103',
            activityId: 'act-103',
            status: 'submitted',
            submittedAt: '2026-11-09',
            deliveryLinkOrNote: 'https://github.com/lpineda-adso/jwt-auth-module',
            score: 98,
          },
        },
        lastAccessedAt: '2026-11-09 08:10',
      },
      'ova-adso-2': {
        ovaId: 'ova-adso-2',
        completedLessonIds: ['les-201'],
        quizScores: { 'les-201': 100 },
        submissions: {
          'les-201': {
            lessonId: 'les-201',
            activityId: 'act-201',
            status: 'submitted',
            submittedAt: '2026-11-08',
            deliveryLinkOrNote: 'https://github.com/lpineda-adso/modelo-relacional-3fn',
            score: 92,
          },
        },
        lastAccessedAt: '2026-11-08 16:00',
      },
    },
  },
  {
    id: 'apr-4',
    documentNumber: '1024598103',
    name: 'Juan David Morales Pardo',
    email: 'jdmorales@soy.sena.edu.co',
    phone: '573157723410',
    fichaCode: '2874512',
    programName: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    progressByOva: {
      'ova-adso-1': {
        ovaId: 'ova-adso-1',
        completedLessonIds: ['les-101'],
        quizScores: { 'les-101': 100 },
        submissions: {
          'les-101': {
            lessonId: 'les-101',
            activityId: 'act-101',
            status: 'pending',
          },
          'les-103': {
            lessonId: 'les-103',
            activityId: 'act-103',
            status: 'pending',
          },
        },
        lastAccessedAt: '2026-11-08 09:15',
      },
      'ova-adso-2': {
        ovaId: 'ova-adso-2',
        completedLessonIds: ['les-201'],
        quizScores: { 'les-201': 100 },
        submissions: {
          'les-201': {
            lessonId: 'les-201',
            activityId: 'act-201',
            status: 'late',
          },
        },
        lastAccessedAt: '2026-11-06 19:40',
      },
    },
  },
  {
    id: 'apr-5',
    documentNumber: '1014290855',
    name: 'Camila Andrea Vargas Soto',
    email: 'cavargas@soy.sena.edu.co',
    phone: '573006129874',
    fichaCode: '2901845',
    programName: 'Tecnólogo en Gestión de Redes de Datos',
    progressByOva: {
      'ova-redes-1': {
        ovaId: 'ova-redes-1',
        completedLessonIds: ['les-301'],
        quizScores: { 'les-301': 100 },
        submissions: {
          'les-301': {
            lessonId: 'les-301',
            activityId: 'act-301',
            status: 'pending',
          },
        },
        lastAccessedAt: '2026-11-09 07:30',
      },
    },
  },
];

export const INITIAL_REMINDER_TEMPLATES: ReminderTemplate[] = [
  {
    id: 'tpl-wa-upcoming',
    name: 'Recordatorio Preventivo WhatsApp (Evidencia Próxima)',
    channel: 'whatsapp',
    urgency: 'upcoming',
    subject: 'Recordatorio de Evidencia SENA — Ficha {{ficha}}',
    bodyTemplate:
      'Hola {{aprendiz}}, cordial saludo desde formación SENA (Ficha {{ficha}}). Te recuerdo que la evidencia "{{evidencia}}" del OVA "{{ova}}" tiene fecha límite de entrega el {{fecha_limite}}. Actualmente tu avance en este OVA es del {{progreso}}%. Puedes consultar la guía de estudio y registrar tu entrega en el portal de aprendices. ¡Muchos éxitos!',
  },
  {
    id: 'tpl-wa-overdue',
    name: 'Alerta Urgente WhatsApp (Plan de Mejoramiento / Evidencia Vencida)',
    channel: 'whatsapp',
    urgency: 'overdue',
    subject: 'Evidencia Pendiente de Entrega — Ficha {{ficha}}',
    bodyTemplate:
      'Hola {{aprendiz}} (Ficha {{ficha}}). Notamos que la evidencia "{{evidencia}}" correspondiente al OVA "{{ova}}" venció el {{fecha_limite}} y aún figura pendiente de envío. Tu avance actual es del {{progreso}}%. Por favor realiza el cargue lo antes posible o escríbeme si presentaste algún inconveniente técnico.',
  },
  {
    id: 'tpl-mail-formal',
    name: 'Notificación Institucional por Correo (@soy.sena.edu.co)',
    channel: 'email',
    urgency: 'upcoming',
    subject: '[SENA Ficha {{ficha}}] Recordatorio de Entrega: {{evidencia}}',
    bodyTemplate: `Estimado(a) aprendiz {{aprendiz}},

Recibe un cordial saludo. A través de este mensaje te recordamos el compromiso académico correspondiente al Objeto Virtual de Aprendizaje "{{ova}}":

• Ficha de Caracterización: {{ficha}}
• Evidencia Requerida: {{evidencia}}
• Fecha Límite Programada: {{fecha_limite}}
• Progreso Individual Registrado: {{progreso}}%

Recuerda que desde la Vista Pública del Aprendiz en NexoOVA Studio puedes descargar la Guía de Estudio en PDF, repasar las lecciones y registrar el enlace de tu entrega.

Atentamente,
Instructor Técnico SENA`,
  },
];

export const INITIAL_SENT_REMINDERS: SentReminderLog[] = [
  {
    id: 'log-1',
    learnerId: 'apr-2',
    learnerName: 'Mateo Hernández Quiroga',
    fichaCode: '2874512',
    ovaTitle: 'Diseño de Bases de Datos Relacionales y Optimización de Consultas SQL',
    activityTitle: 'GA4-220501095-AA1-EV01 · Script DDL en 3FN y Diagrama Relacional',
    channel: 'whatsapp',
    sentAt: '2026-11-08 17:15',
    messagePreview: 'Hola Mateo Hernández Quiroga (Ficha 2874512). Notamos que la evidencia "GA4-220501095-AA1-EV01" venció el 2026-11-08...',
  },
];
