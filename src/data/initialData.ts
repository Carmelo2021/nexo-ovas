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
- **DELETE**: Eliminación lógica o física del recurso.`,
    blocks: [
      {
        id: 'n1-blk-1',
        type: 'text',
        content:
          'Un servicio RESTful modela entidades como recursos URI manipulados con verbos HTTP según el estándar [RFC 9110: Semántica HTTP](https://httpwg.org/specs/rfc9110.html "Especificación oficial IETF que define la idempotencia de GET, PUT y DELETE frente a POST.").',
        sourceNodeId: 'node-1',
      },
      {
        id: 'n1-blk-2',
        type: 'link',
        title: 'Guía MDN: Métodos de Petición HTTP e Idempotencia',
        url: 'https://developer.mozilla.org/es/docs/Web/HTTP/Methods',
        domainOrSource: 'MDN Web Docs',
        content: 'Tabla comparativa de métodos seguros e idempotentes.',
        relevanceComment:
          'Permite al aprendiz verificar qué verbos HTTP alteran estado y qué códigos de estado retornar en la matriz de endpoints del proyecto formativo.',
        sourceNodeId: 'node-1',
      },
      {
        id: 'n1-blk-3',
        type: 'code',
        codeLanguage: 'typescript',
        title: 'src/routes/aprendices.routes.ts',
        content: `router.get('/api/v1/aprendices', listarAprendices); // 200 OK (Idempotente)
router.post('/api/v1/aprendices', crearAprendiz);   // 201 Created + Location`,
        relevanceComment:
          'Convención de rutas REST usando sustantivos en plural y separación clara de verbos HTTP.',
        sourceNodeId: 'node-1',
      },
    ],
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
    mediaUrl: 'https://www.youtube.com/watch?v=pRS9LRBgjYg',
    mediaComment:
      'En el minuto 04:10 demuestra cómo definir esquemas DTO reutilizables en OpenAPI 3.1 antes de codificar los controladores Express.',
    tags: ['OpenAPI', 'DTO', 'Swagger', 'Documentación'],
    updatedAt: '2026-11-08',
    content: `Recurso audiovisual y especificación oficial para documentar APIs antes de codificar los controladores (enfoque *API-First*). Incluye plantilla de validación con esquemas tipados para evitar inyección de payloads malformados.`,
    blocks: [
      {
        id: 'n2-blk-1',
        type: 'text',
        content:
          'El enfoque **API-First** exige consensuar el contrato OpenAPI antes de escribir controladores o vistas frontend.',
        sourceNodeId: 'node-2',
      },
      {
        id: 'n2-blk-2',
        type: 'video',
        title: 'Taller Video: Contratos OpenAPI 3.1 y Validación de Esquemas DTO',
        url: 'https://www.youtube.com/watch?v=pRS9LRBgjYg',
        domainOrSource: 'YouTube · Ingeniería Software SENA',
        videoTimestamp: 'Min 04:10 - 15:20',
        content: 'Diseño de esquemas YAML y rechazo de payloads con 422.',
        relevanceComment:
          'Observa del minuto 04:10 al 11:00 cómo se centralizan los DTOs en #/components/schemas y se valida el patrón de 7 dígitos de la ficha SENA.',
        sourceNodeId: 'node-2',
      },
      {
        id: 'n2-blk-3',
        type: 'link',
        title: 'Especificación Oficial OpenAPI 3.1.0',
        url: 'https://swagger.io/specification/',
        domainOrSource: 'swagger.io',
        content: 'Estándar oficial de documentación de APIs REST.',
        relevanceComment:
          'Referencia clave para documentar los códigos 201, 401, 403 y 422 exigidos en la evidencia de producto.',
        sourceNodeId: 'node-2',
      },
    ],
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
- **3FN**: Eliminación de dependencias transitivas entre columnas no clave.`,
    blocks: [
      {
        id: 'n4-blk-1',
        type: 'text',
        content:
          'Separar `programas_formacion`, `fichas_caracterizacion` y `aprendices` elimina dependencias transitivas y cumple **3FN** con integridad referencial en [Constraints DDL PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html "Explica cómo declarar llaves primarias, foráneas y restricciones CHECK en PostgreSQL.").',
        sourceNodeId: 'node-4',
      },
      {
        id: 'n4-blk-2',
        type: 'video',
        title: 'Video Caso Práctico: Normalización 1FN, 2FN y 3FN Paso a Paso',
        url: 'https://www.youtube.com/watch?v=GFQaEYEc8_8',
        domainOrSource: 'YouTube · Modelado Relacional',
        videoTimestamp: 'Min 01:45 - 12:15',
        content: 'Transformación de una tabla plana a un esquema relacional 3FN.',
        relevanceComment:
          'En el minuto 06:30 se ejemplifica cómo evitar anomalías de actualización al separar el catálogo maestro de las tablas transaccionales.',
        sourceNodeId: 'node-4',
      },
      {
        id: 'n4-blk-3',
        type: 'code',
        codeLanguage: 'sql',
        title: 'sql/01_schema_3fn.sql',
        content: `CREATE TABLE fichas_caracterizacion (
  ficha_codigo CHAR(7) PRIMARY KEY CHECK (ficha_codigo ~ '^[0-9]{7}$'),
  codigo_programa VARCHAR(16) NOT NULL REFERENCES programas_formacion(codigo_programa)
);`,
        relevanceComment:
          'Definición DDL con validación CHECK por expresión regular y llave foránea estricta.',
        sourceNodeId: 'node-4',
      },
    ],
  },
  {
    id: 'node-5',
    title: 'Índices Compuestos B-Tree y Análisis con EXPLAIN ANALYZE',
    type: 'code',
    codeLanguage: 'sql',
    researchStatus: 'in_ova',
    x: 1150,
    y: 140,
    regionId: 'reg-datos',
    linkedOvaId: 'ova-adso-2',
    linkedLessonId: 'les-202',
    tags: ['Rendimiento', 'B-Tree', 'Consultas SQL'],
    updatedAt: '2026-11-09',
    content: `### Optimización de Consultas Frecuentes
Un índice compuesto \`(ficha_codigo, fecha_entrega)\` acelera búsquedas por prefijo izquierdo.`,
    blocks: [
      {
        id: 'n5-blk-1',
        type: 'text',
        content:
          'Un índice compuesto `(ficha_codigo, fecha_entrega)` acelera consultas que filtran por el prefijo izquierdo sin aplicar funciones sobre la columna indexada.',
        sourceNodeId: 'node-5',
      },
      {
        id: 'n5-blk-2',
        type: 'link',
        title: 'Guía Oficial PostgreSQL: Interpretación de EXPLAIN ANALYZE',
        url: 'https://www.postgresql.org/docs/current/using-explain.html',
        domainOrSource: 'postgresql.org',
        content: 'Comparativa entre Seq Scan, Index Scan y Bitmap Index Scan.',
        relevanceComment:
          'Relevante para demostrar con métricas reales en milisegundos la mejora de rendimiento de las consultas del proyecto formativo.',
        sourceNodeId: 'node-5',
      },
      {
        id: 'n5-blk-3',
        type: 'code',
        codeLanguage: 'sql',
        title: 'sql/02_explain_btree.sql',
        content: `CREATE INDEX idx_entregas_ficha_fecha ON entregas (ficha_codigo, fecha_entrega DESC);
EXPLAIN ANALYZE SELECT * FROM entregas WHERE ficha_codigo = '2874512';`,
        relevanceComment:
          'Sentencia para comprobar que el motor utiliza Index Scan sobre el árbol B-Tree.',
        sourceNodeId: 'node-5',
      },
    ],
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
Comparativa práctica entre \`READ COMMITTED\` y \`SERIALIZABLE\` cuando dos aprendices o cajeros descuentan stock del mismo lote simultáneamente.`,
    blocks: [
      {
        id: 'n6-blk-1',
        type: 'text',
        content:
          'Comparativa práctica entre `READ COMMITTED` y `SERIALIZABLE` para prevenir el fenómeno *Lost Update* en inventario concurrente.',
        sourceNodeId: 'node-6',
      },
      {
        id: 'n6-blk-2',
        type: 'code',
        codeLanguage: 'sql',
        title: 'sql/03_transaccion_acid.sql',
        content: `BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT stock_actual FROM inventario WHERE id_item = 42 FOR UPDATE;
UPDATE inventario SET stock_actual = stock_actual - 1 WHERE id_item = 42;
COMMIT;`,
        relevanceComment:
          'Uso de bloqueo pesimista SELECT ... FOR UPDATE dentro de una transacción ACID.',
        sourceNodeId: 'node-6',
      },
    ],
  },
  {
    id: 'node-7',
    title: 'Autenticación Stateless con JWT, Refresh Tokens y RBAC',
    type: 'code',
    codeLanguage: 'typescript',
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
2. **Middleware de Roles**: Verificar el claim \`rol\` en el servidor antes de ejecutar casos de uso administrativos.`,
    blocks: [
      {
        id: 'n7-blk-1',
        type: 'text',
        content:
          'Los **Access Tokens** deben tener expiración corta (15-30 min) y validarse en un middleware RBAC antes de permitir operaciones sensibles.',
        sourceNodeId: 'node-7',
      },
      {
        id: 'n7-blk-2',
        type: 'link',
        title: 'OWASP Authentication & JWT Security Cheat Sheet',
        url: 'https://cheatsheetseries.owasp.org/',
        domainOrSource: 'OWASP Foundation',
        content: 'Guía de endurecimiento de sesiones, hashing Argon2id y JWT.',
        relevanceComment:
          'Explica por qué jamás se debe guardar información sensible en el payload de un JWT y cómo mitigar ataques XSS/CSRF.',
        sourceNodeId: 'node-7',
      },
      {
        id: 'n7-blk-3',
        type: 'video',
        title: 'Video Guía: Implementación de Login JWT y Middleware de Roles en Express',
        url: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
        domainOrSource: 'YouTube · Seguridad Aplicativa',
        videoTimestamp: 'Min 05:00 - 18:10',
        content: 'Codificación paso a paso de firma y verificación de tokens.',
        relevanceComment:
          'A partir del minuto 05:00 se construye el middleware requireRole que diferencia entre aprendiz e instructor.',
        sourceNodeId: 'node-7',
      },
      {
        id: 'n7-blk-4',
        type: 'code',
        codeLanguage: 'typescript',
        title: 'src/middlewares/requireRole.ts',
        content: `const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload;
if (!allowedRoles.includes(payload.role)) {
  return res.status(403).json({ error: 'Forbidden: Rol sin privilegios' });
}`,
        relevanceComment:
          'Fragmento central de autorización RBAC requerido en la evidencia GA7-AA2-EV02.',
        sourceNodeId: 'node-7',
      },
    ],
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
        mediaComment:
          'Referencia oficial indispensable para verificar qué métodos HTTP son idempotentes y seguros al diseñar la matriz de endpoints de la evidencia GA7.',
        contentMarkdown: `### 1. ¿Qué define a una API verdaderamente RESTful?
La transferencia de estado representacional (**REST**) propone modelar un sistema como un conjunto de **recursos** identificables mediante URIs únicas y manipulables a través de representaciones estándar (como JSON), siguiendo el estándar [RFC 9110: HTTP Semantics](https://httpwg.org/specs/rfc9110.html "Estándar oficial IETF que define la semántica formal de métodos como GET, POST, PUT y DELETE y sus garantías de idempotencia.").

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
        blocks: [
          {
            id: 'blk-101-1',
            type: 'heading',
            title: '1. ¿Qué define a una API verdaderamente RESTful?',
            content: '',
          },
          {
            id: 'blk-101-2',
            type: 'text',
            content:
              'La transferencia de estado representacional (**REST**) propone modelar un sistema como un conjunto de **recursos** identificables mediante URIs únicas y manipulables a través de representaciones estándar (como JSON). Puedes consultar la especificación en [RFC 9110: Semántica HTTP](https://httpwg.org/specs/rfc9110.html "Documento normativo del IETF que explica por qué GET, PUT y DELETE son idempotentes mientras que POST no lo es.") o revisar el [video:Resumen Visual de Métodos REST](https://www.youtube.com/watch?v=7YcW25PHnAA "Cápsula audiovisual de 10 minutos que ilustra el ciclo petición-respuesta, cabeceras HTTP y códigos de estado con ejemplos reales.").',
          },
          {
            id: 'blk-101-3',
            type: 'link',
            title: 'Guía MDN: Métodos de Petición HTTP e Idempotencia',
            url: 'https://developer.mozilla.org/es/docs/Web/HTTP/Methods',
            domainOrSource: 'MDN Web Docs · Mozilla',
            content: 'Documentación detallada sobre verbos HTTP, seguridad e idempotencia.',
            relevanceComment:
              'Lectura obligatoria para la Evidencia AA1-EV01: te permitirá justificar técnicamente cuándo usar PUT vs PATCH y qué códigos 2xx/4xx retornar en cada endpoint del proyecto formativo.',
          },
          {
            id: 'blk-101-4',
            type: 'video',
            title: 'Video Explicativo: Diseño de Rutas RESTful, Paginación y Códigos 2xx / 4xx / 5xx',
            url: 'https://www.youtube.com/watch?v=7YcW25PHnAA',
            domainOrSource: 'YouTube · Arquitectura Backend ADSO',
            videoTimestamp: 'Min 03:15 - 11:40',
            content: 'Demostración práctica de diseño de URIs en plural y manejo de errores semánticos.',
            relevanceComment:
              'Presta especial atención entre el minuto 03:15 y 08:20: muestra cómo evitar antipatrones como /crearAprendiz en las rutas y cómo estructurar respuestas 201 Created con la cabecera Location.',
          },
          {
            id: 'blk-101-5',
            type: 'heading',
            title: '2. Implementación de Controlador REST en TypeScript / Express',
            content: '',
          },
          {
            id: 'blk-101-6',
            type: 'code',
            codeLanguage: 'typescript',
            title: 'src/controllers/evidencias.controller.ts',
            content: `import { Request, Response } from 'express';

// GET /api/v1/evidencias?limit=20&offset=0 (Seguro e Idempotente)
export async function listarEvidencias(req: Request, res: Response) {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;
  return res.status(200).json({ data: [], meta: { limit, offset } });
}

// POST /api/v1/evidencias (No Idempotente -> Retorna 201 Created)
export async function registrarEvidencia(req: Request, res: Response) {
  const { fichaCode, evidenceCode, repositoryUrl } = req.body;
  if (!fichaCode || !evidenceCode || !repositoryUrl) {
    return res.status(422).json({
      error: 'Unprocessable Content',
      message: 'Todos los campos del entregable SENA son obligatorios.',
    });
  }
  const nuevaId = 'ev-' + Date.now();
  return res
    .status(201)
    .location(\`/api/v1/evidencias/\${nuevaId}\`)
    .json({ id: nuevaId, status: 'submitted' });
}`,
            relevanceComment:
              'Observa cómo el método POST valida la semántica del dominio (retornando 422 si faltan campos) y responde con 201 Created adjuntando la cabecera Location hacia el nuevo recurso.',
          },
          {
            id: 'blk-101-7',
            type: 'callout',
            calloutTone: 'tip',
            title: 'Criterio de Evaluación para tu Proyecto Formativo SENA',
            content:
              'En tu matriz de endpoints evita verbos en las rutas (usa sustantivos en plural como `/api/v1/aprendices`) y documenta siempre al menos un código de éxito (`200`/`201`) y dos de error (`401`/`422`).',
          },
        ],
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
        mediaComment:
          'Guía oficial de referencia para escribir el archivo openapi.yaml de tu proyecto formativo con esquemas reutilizables en components/schemas.',
        contentMarkdown: `### 1. Enfoque API-First en Equipos de Desarrollo
Antes de codificar las vistas del frontend o las tablas definitivas, el equipo define el **contrato de interfaz** usando OpenAPI (Swagger). Esto permite que el equipo frontend y backend trabajen en paralelo sin bloqueos.

### 2. Uso de Objetos de Transferencia de Datos (DTO)
Nunca pases directamente el objeto \`req.body\` hacia el ORM o consulta SQL. Implementa un esquema de validación estricto:
1. Verifica tipos primitivos (cadenas, números, fechas ISO-8601).
2. Limita longitudes máximas y formatos (correo electrónico, código de ficha de 7 dígitos).
3. Rechaza propiedades no declaradas en el contrato devolviendo un error estructurado \`422 Unprocessable Content\`.`,
        blocks: [
          {
            id: 'blk-102-1',
            type: 'heading',
            title: '1. Enfoque API-First y Contratos OpenAPI 3.1',
            content: '',
          },
          {
            id: 'blk-102-2',
            type: 'text',
            content:
              'Antes de codificar las vistas del frontend o las tablas definitivas, el equipo define el **contrato de interfaz** usando OpenAPI. Puedes probar tus contratos en vivo con [Swagger Editor Online](https://editor.swagger.io/ "Herramienta interactiva en el navegador para validar sintaxis YAML de OpenAPI 3.x y previsualizar la documentación de endpoints.") antes de subirlos al repositorio.',
          },
          {
            id: 'blk-102-3',
            type: 'link',
            title: 'Especificación Oficial OpenAPI 3.1.0 (Swagger)',
            url: 'https://swagger.io/specification/',
            domainOrSource: 'swagger.io · OpenAPI Initiative',
            content: 'Referencia completa de tipos de datos, respuestas y esquemas.',
            relevanceComment:
              'Revisa la sección "Components Object" para aprender a centralizar tus DTOs en #/components/schemas y no repetir definiciones JSON en cada ruta.',
          },
          {
            id: 'blk-102-4',
            type: 'video',
            title: 'Taller Práctico: Documentación de API REST con OpenAPI YAML y Validación Zod',
            url: 'https://www.youtube.com/watch?v=pRS9LRBgjYg',
            domainOrSource: 'YouTube · Ingeniería de Software SENA',
            videoTimestamp: 'Min 04:10 - 15:20',
            content: 'Cómo sincronizar tus esquemas de validación en TypeScript con el contrato OpenAPI.',
            relevanceComment:
              'Este video muestra cómo transformar un esquema DTO validado en servidor en documentación interactiva Swagger UI lista para sustentar ante el instructor.',
          },
          {
            id: 'blk-102-5',
            type: 'code',
            codeLanguage: 'yaml',
            title: 'openapi.yaml',
            content: `openapi: 3.1.0
info:
  title: API Gestión de Evidencias SENA
  version: 1.0.0
paths:
  /api/v1/evidencias:
    post:
      summary: Registrar entrega de evidencia de aprendiz
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CrearEvidenciaDTO'
      responses:
        '201':
          description: Evidencia registrada exitosamente
        '422':
          description: Error de validación en los campos del DTO
components:
  schemas:
    CrearEvidenciaDTO:
      type: object
      required: [fichaCode, evidenceCode, repositoryUrl]
      properties:
        fichaCode:
          type: string
          pattern: '^[0-9]{7}$'
        evidenceCode:
          type: string
          example: GA7-220501096-AA1-EV01
        repositoryUrl:
          type: string
          format: uri`,
            relevanceComment:
              'Plantilla base OpenAPI 3.1: nota cómo la expresión regular ^[0-9]{7}$ restringe el código de ficha SENA exactamente a 7 dígitos numéricos.',
          },
        ],
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
        mediaComment:
          'Listado de verificación de seguridad OWASP para evitar vulnerabilidades frecuentes al almacenar contraseñas y firmar tokens JWT.',
        contentMarkdown: `### 1. Anatomía de un JSON Web Token (JWT)
Un JWT consta de tres partes codificadas en Base64Url separadas por puntos (\`Header.Payload.Signature\`):
- **Header**: Algoritmo de firma (\`HS256\` o \`RS256\`) y tipo de token.
- **Payload (Claims)**: Identificador del usuario (\`sub\`), rol (\`role\`), fecha de emisión (\`iat\`) y fecha de expiración (\`exp\`).
- **Signature**: Firma criptográfica que garantiza que el contenido no fue adulterado por el cliente.

### 2. Reglas de Oro de Seguridad Aplicativa
- **Jamás guardar contraseñas en texto plano**: Utilizar funciones de derivación con *salt* como **Argon2id** o **bcrypt** (factor de costo $\\ge 12$).
- **Expiración corta**: Configurar \`exp\` entre 15 y 30 minutos para tokens de acceso.
- **Principio de menor privilegio**: Validar en un middleware intermedio tanto la firma del token como el permiso específico del rol antes de ejecutar acciones sensibles.`,
        blocks: [
          {
            id: 'blk-103-1',
            type: 'heading',
            title: '1. Anatomía de un JSON Web Token (JWT) y Control RBAC',
            content: '',
          },
          {
            id: 'blk-103-2',
            type: 'text',
            content:
              'Un JWT consta de tres segmentos codificados en Base64Url (`Header.Payload.Signature`). Recuerda que el Payload está **firmado pero no cifrado**: puedes inspeccionar cualquier token en [Depurador Interactivo JWT.io](https://jwt.io/ "Herramienta para decodificar el Header y Payload de un JWT y verificar su firma criptográfica HS256/RS256.") para comprobar que nunca debes incluir contraseñas ni datos sensibles dentro de los claims.',
          },
          {
            id: 'blk-103-3',
            type: 'link',
            title: 'OWASP Authentication & JWT Cheat Sheet Series',
            url: 'https://cheatsheetseries.owasp.org/',
            domainOrSource: 'OWASP Foundation',
            content: 'Estándares internacionales de seguridad aplicativa para tokens y contraseñas.',
            relevanceComment:
              'Consulta este recurso antes de entregar la Evidencia AA2-EV02: explica cómo prevenir robo de tokens por XSS utilizando cookies HttpOnly y tiempos de expiración cortos.',
          },
          {
            id: 'blk-103-4',
            type: 'video',
            title: 'Demostración: Hashing con Bcrypt/Argon2 y Middleware de Roles en Express',
            url: 'https://www.youtube.com/watch?v=mbsmsi7l3r4',
            domainOrSource: 'YouTube · Seguridad Aplicativa ADSO',
            videoTimestamp: 'Min 05:00 - 18:10',
            content: 'Implementación desde cero de login, firma de JWT y protección de endpoints por rol.',
            relevanceComment:
              'A partir del minuto 05:00 se codifica el middleware de autorización RBAC que distingue entre el rol "aprendiz" y el rol "instructor", requisito directo de tu entrega.',
          },
          {
            id: 'blk-103-5',
            type: 'code',
            codeLanguage: 'typescript',
            title: 'src/middlewares/requireRole.ts',
            content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JwtUserPayload {
  sub: string;
  role: 'instructor' | 'aprendiz';
  fichaCode: string;
}

export function requireRole(allowedRoles: Array<'instructor' | 'aprendiz'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autenticación requerido' });
    }
    try {
      const token = authHeader.slice(7);
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload;
      if (!allowedRoles.includes(payload.role)) {
        return res.status(403).json({ error: 'Permisos insuficientes para este rol' });
      }
      res.locals.user = payload;
      return next();
    } catch {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }
  };
}`,
            relevanceComment:
              'Middleware reutilizable que separa claramente el error 401 (no autenticado o token vencido) del error 403 (autenticado pero sin el rol requerido).',
          },
        ],
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
        mediaComment:
          'Manual oficial de PostgreSQL sobre llaves primarias, llaves foráneas (ON DELETE RESTRICT/CASCADE) y restricciones CHECK.',
        contentMarkdown: `### 1. ¿Por qué normalizar el modelo de datos?
Un esquema sin normalizar almacena datos redundantes en múltiples filas, provocando inconsistencias cuando se actualiza un dato (por ejemplo, el nombre de un programa de formación repetido en miles de matrículas).

### 2. Paso a Paso hacia 3FN
1. **Primera Forma Normal (1FN)**: Cada columna contiene un único valor atómico; no existen listas separadas por comas dentro de una celda.
2. **Segunda Forma Normal (2FN)**: Cumple 1FN y todo atributo no primo depende por completo de la llave primaria completa (clave en tablas puente con llave compuesta).
3. **Tercera Forma Normal (3FN)**: Cumple 2FN y ningún atributo no primo depende transitivamente de otro atributo no primo.`,
        blocks: [
          {
            id: 'blk-201-1',
            type: 'heading',
            title: '1. ¿Por qué normalizar hasta Tercera Forma Normal (3FN)?',
            content: '',
          },
          {
            id: 'blk-201-2',
            type: 'text',
            content:
              'Un esquema sin normalizar almacena datos redundantes en múltiples filas, provocando anomalías de inserción y actualización. Revisa las reglas de integridad referencial en [PostgreSQL DDL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html "Explica con ejemplos cómo declarar llaves primarias, foráneas, UNIQUE y CHECK en PostgreSQL para blindar la integridad del modelo.") antes de generar el script de tu evidencia.',
          },
          {
            id: 'blk-201-3',
            type: 'link',
            title: 'Documentación Oficial PostgreSQL: Data Definition (DDL) y Llaves Foráneas',
            url: 'https://www.postgresql.org/docs/current/ddl.html',
            domainOrSource: 'postgresql.org · Documentación Oficial',
            content: 'Guía completa de creación de tablas, tipos de datos y restricciones relacionales.',
            relevanceComment:
              'Imprescindible para la Evidencia GA4-AA1-EV01: muestra la sintaxis estándar de REFERENCES y cómo evitar registros huérfanos en tablas detalle.',
          },
          {
            id: 'blk-201-4',
            type: 'video',
            title: 'Caso Práctico: De Tabla Desnormalizada a Modelo Relacional en 3FN',
            url: 'https://www.youtube.com/watch?v=GFQaEYEc8_8',
            domainOrSource: 'YouTube · Base de Datos Relacionales',
            videoTimestamp: 'Min 01:45 - 12:15',
            content: 'Descomposición paso a paso pasando por 1FN, 2FN y 3FN sin pérdida de información.',
            relevanceComment:
              'Observa en el minuto 06:30 cómo se separa la entidad "Fichas" de la tabla "Matrículas" para eliminar la dependencia transitiva del nombre del programa de formación.',
          },
          {
            id: 'blk-201-5',
            type: 'code',
            codeLanguage: 'sql',
            title: 'sql/01_schema_3fn.sql',
            content: `CREATE TABLE programas_formacion (
  codigo_programa VARCHAR(16) PRIMARY KEY,
  nombre_programa VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE fichas_caracterizacion (
  ficha_codigo CHAR(7) PRIMARY KEY CHECK (ficha_codigo ~ '^[0-9]{7}$'),
  codigo_programa VARCHAR(16) NOT NULL REFERENCES programas_formacion(codigo_programa),
  fecha_inicio DATE NOT NULL
);

CREATE TABLE aprendices (
  id_aprendiz SERIAL PRIMARY KEY,
  documento VARCHAR(20) NOT NULL UNIQUE,
  nombre_completo VARCHAR(120) NOT NULL,
  ficha_codigo CHAR(7) NOT NULL REFERENCES fichas_caracterizacion(ficha_codigo)
);`,
            relevanceComment:
              'Esquema normalizado en 3FN: el nombre del programa vive únicamente en programas_formacion y se vincula a través de fichas_caracterizacion.',
          },
        ],
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
        blocks: [
          {
            id: 'blk-202-1',
            type: 'heading',
            title: '1. Índices Compuestos B-Tree y Regla del Prefijo Izquierdo',
            content: '',
          },
          {
            id: 'blk-202-2',
            type: 'text',
            content:
              'Los índices B-Tree aceleran drásticamente las búsquedas por igualdad y rango (`WHERE`, `JOIN`, `ORDER BY`). Consulta la guía oficial [Uso de EXPLAIN en PostgreSQL](https://www.postgresql.org/docs/current/using-explain.html "Explica cómo interpretar Seq Scan, Index Scan y Bitmap Heap Scan junto con los costos estimados y tiempos reales en milisegundos.") para comparar el rendimiento antes y después de indexar.',
          },
          {
            id: 'blk-202-3',
            type: 'code',
            codeLanguage: 'sql',
            title: 'sql/02_indices_explain.sql',
            content: `-- 1. Crear índice compuesto siguiendo el orden de filtrado más selectivo
CREATE INDEX idx_entregas_ficha_fecha
  ON entregas_evidencias (ficha_codigo, fecha_entrega DESC);

-- 2. Verificar que el optimizador utilice Index Scan en lugar de Seq Scan
EXPLAIN (ANALYZE, BUFFERS)
SELECT id_entrega, aprendiz_id, estado, fecha_entrega
FROM entregas_evidencias
WHERE ficha_codigo = '2874512'
  AND fecha_entrega >= '2026-11-01';`,
            relevanceComment:
              'Al filtrar primero por ficha_codigo (prefijo izquierdo del índice) y luego por rango de fecha_entrega, PostgreSQL resuelve la consulta mediante un Index Scan directo.',
          },
        ],
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
        blocks: [
          {
            id: 'blk-301-1',
            type: 'heading',
            title: '1. Dominios de Broadcast y Etiquetado IEEE 802.1Q',
            content: '',
          },
          {
            id: 'blk-301-2',
            type: 'text',
            content:
              'Una **VLAN** divide un switch físico en múltiples dominios de broadcast lógicos independientes (ej. VLAN 10 Académica, VLAN 20 Instructores, VLAN 99 Gestión). Cuando una trama cruza un enlace troncal, el estándar **IEEE 802.1Q** inserta una etiqueta de 4 bytes identificando la VLAN de origen.',
          },
          {
            id: 'blk-301-3',
            type: 'video',
            title: 'Laboratorio Guiado: Configuración de Trunk 802.1Q y Router-on-a-Stick',
            url: 'https://www.youtube.com/watch?v=1XH2s2s9L8I',
            domainOrSource: 'YouTube · Laboratorio Cisco SENA',
            videoTimestamp: 'Min 02:10 - 14:00',
            content: 'Configuración paso a paso en CLI de switches Capa 2 y subinterfaces de router.',
            relevanceComment:
              'Observa en el minuto 07:40 cómo se cambia la VLAN nativa a la VLAN 99 en ambos extremos del enlace troncal para evitar alertas de Native VLAN Mismatch en CDP/STP.',
          },
          {
            id: 'blk-301-4',
            type: 'code',
            codeLanguage: 'cisco',
            title: 'switch-core-sena.ios',
            content: `! 1. Creación de VLANs corporativas SENA
vlan 10
 name ACADEMICA_APRENDICES
vlan 20
 name INSTRUCTORES
vlan 99
 name GESTION_Y_NATIVA

! 2. Configuración de Enlace Troncal 802.1Q endurecido
interface GigabitEthernet0/1
 description TRUNK_HACIA_ROUTER_PRINCIPAL
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport nonegotiate`,
            relevanceComment:
              'El comando switchport nonegotiate desactiva tramas DTP en el puerto troncal, mitigando ataques de negociación automática de troncales (VLAN Hopping).',
          },
        ],
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
