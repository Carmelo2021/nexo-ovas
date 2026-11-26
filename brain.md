# El "Cerebro Digital" de Andrej Karpathy: Cómo Gestionar y Compilar Todo el Conocimiento del Día a Día

> **Guía Completa y Digerible:**
> * **Parte I:** Cómo lo hace Andrej Karpathy (su filosofía, su arquitectura exacta y por qué revolucionó la gestión del conocimiento).
> * **Parte II:** Cómo lo puedes hacer tú paso a paso (tanto para tu vida diaria en tu computador como integrado dentro de la plataforma **NexoOVA Studio** que estás construyendo).

---

# PARTE I: CÓMO LO HACE ANDREJ KARPATHY

**Andrej Karpathy** (exdirector de Inteligencia Artificial en Tesla, cofundador de OpenAI y fundador de la escuela nativa de IA *Eureka Labs*) ha compartido dos piezas complementarias que cambiaron por completo la forma en que los ingenieros e investigadores gestionan lo que aprenden día a día:

1. **Su método de captura rápida humana:** La **"Nota Continua con Gravedad" (*Append-and-Review Note*)**.
2. **Su arquitectura de cerebro asistido por IA:** El **"LLM Wiki / Compilador de Conocimiento"** (dentro de su visión del **LLM OS** o *Large Language Model Operating System*).

Para entender por qué su propuesta causó tanto impacto mundial, primero hay que entender **qué estaba roto** en las aplicaciones tradicionales.

---

## 1. El Diagnóstico de Karpathy: ¿Por qué fracasan casi todos los "Segundos Cerebros"?

Cuando una persona intenta guardar todo lo que aprende cada día (artículos, libros, fragmentos de código, ideas de proyectos, reuniones, videos), suele caer en una de estas **dos trampas**:

### Trampa A: El "Cementerio de Notas" (Fatiga de Bibliotecario)
Usas herramientas como Notion, Obsidian o Roam Research. Al principio creas carpetas, etiquetas, plantillas y enlaces bidireccionales. Pero a los dos meses ocurre lo inevitable: **mantener el sistema ordenado consume más energía mental que aprender**. Terminas trabajando como "bibliotecario a tiempo completo" de tus propias notas hasta que te cansas y dejas de anotar, o acumulas 500 notas desordenadas que nunca vuelves a abrir.

### Trampa B: La "Amnesia del RAG Tradicional" (Chatear con PDFs sueltos)
Mucha gente pensó que la solución era meter todos sus PDFs y notas en una base de datos vectorial (RAG — *Retrieval-Augmented Generation*, como NotebookLM o un ChatGPT con archivos adjuntos) y hacerle preguntas.  
Karpathy explicó por qué esto **no funciona como un cerebro real**:
* Cuando le haces una pregunta a un RAG tradicional, la IA busca a ciegas 5 pedacitos de texto entre tus documentos crudos, te responde y **al segundo siguiente olvida todo lo que razonó**.
* Si mañana le haces otra pregunta parecida, vuelve a leer los mismos archivos crudos desde cero.
* **No hay aprendizaje acumulativo (*no compounding knowledge*):** tus documentos siguen siendo un montón de papeles crudos amontonados en una caja; nunca se conectan entre sí, nunca se corrigen las contradicciones entre lo que leíste hace un año y lo que aprendiste hoy, y nunca se construye un modelo mental superior.

---

## 2. La Gran Idea de Karpathy: De "Interpretar al Vuelo" a "Compilar Conocimiento"

Karpathy propuso cambiar por completo la metáfora.  
Imagina cómo funciona **tu propio cerebro biológico**:

1. **Durante el día (Memoria Episódica — Hipocampo):** Recibes estímulos crudos todo el tiempo (una conversación, un capítulo de un libro, un error de código que resolviste). No te detienes a archivarlos en carpetas perfectas en ese instante; simplemente los vives y los capturas rápido.
2. **Durante la noche (Consolidación Sináptica — Sueño REM):** Mientras duermes, tu cerebro toma las experiencias crudas del día y las **compila** dentro de tu **Corteza Cerebral (Memoria Semántica a Largo Plazo)**: conecta la idea nueva con conceptos que ya sabías, descarta el ruido, actualiza creencias viejas que resultaron ser falsas y fortalece las conexiones neuronales.

Karpathy tradujo ese proceso biológico a una arquitectura de software ultra-limpia resumida en una frase célebre:

> **«La base de conocimiento en Markdown es el código fuente; un visor visual (como Obsidian o un Canvas) es el IDE; y el Agente de IA (LLM) es el programador que mantiene y compila tu cerebro.»**

---

## 3. El Nivel 1 de Karpathy: Cómo Captura Ideas Rápidas en el Día a Día (*Append-and-Review*)

Antes de que un conocimiento entre al "cerebro profundo", necesitas capturar las ideas fugaces del día a día con **fricción cero** (desde el celular caminando o en medio de una reunión). Para eso, Karpathy usa su método **"Append-and-Review" (Añadir arriba y Revisar con Gravedad)**:

```
┌──────────────────────────────────────────────────────────┐
│  ARCHIVO ÚNICO DE CAPTURA DIARIA (inbox / notas rápidas) │
├──────────────────────────────────────────────────────────┤
│  ▲ [NUEVO - HOY] Idea: probar arquitectura de grafos...  │  <-- 1. Todo lo nuevo entra
│  │ [NUEVO - HOY] read: Capítulo 5 de Eloquent JS         │      SIEMPRE ARRIBA (0 segundos
│  │ [AYER] fix: error de CORS en servidor Vite            │      eligiendo carpetas)
│  │                                                       │
│  │    ... (Con los días, las notas bajan solas           │  <-- 2. LEY DE GRAVEDAD:
│  │         como si tuvieran peso / gravedad) ...         │      Lo viejo se va hundiendo
│  │                                                       │      hacia el fondo.
│  ▼ [HACE 3 SEMANAS] Idea vieja que sigue siendo valiosa  │  <-- 3. RESCATE SINÁPTICO:
│       └──> Si al revisar hacia abajo sigue importando,   │      Lo importante se rescata
│            la subes de nuevo arriba o la pasas al WIKI.  │      o se compila; el ruido
│            Si ya no importa, la dejas hundirse sola.     │      muere solo sin borrarlo.
└──────────────────────────────────────────────────────────┘
```

### ¿Por qué es tan brillante este primer filtro?
* **Cero parálisis por decisión:** Nunca te preguntas *"¿En qué carpeta guardo esta idea?"*. Solo abres tu bandeja y escribes en la primera línea usando prefijos simples si quieres (`idea:`, `leer:`, `codigo:`, `pregunta:`).
* **Filtro natural darwiniano:** No pierdes tiempo borrando ni limpiando notas irrelevantes. La gravedad hace el trabajo: solo las ideas que sobreviven a tu revisión semanal merecen pasar al **Cerebro Compilado (El LLM Wiki)**.

---

## 4. El Nivel 2 de Karpathy: La Arquitectura del "LLM Wiki" (El Cerebro Compilado)

Una vez que tienes material valioso (tus apuntes del día, un artículo técnico, un PDF de un libro, la transcripción de un video o una conversación donde aprendiste algo importante), entra en acción la arquitectura principal propuesta por Karpathy.

Lo más sorprendente de su propuesta es que **no usa bases de datos propietarias, ni servidores complejos, ni motores vectoriales cerrados**. Todo el cerebro es una simple carpeta en tu computador con archivos de texto **Markdown (`.md`)** controlados por **Git**, dividida en **5 piezas exactas**:

```
mi-cerebro/
│
├── 1. AGENTS.md (o CLAUDE.md)   <-- El "ADN" o manual de instrucciones para tu Agente IA
├── 2. index.md                  <-- El Mapa Maestro / Índice Sináptico de todo lo que sabes
├── 3. log.md                    <-- El Diario Cronológico inmutable (qué aprendiste cada día)
│
├── 4. raw/                      <-- MEMORIA EPISÓDICA (Fuentes Crudas Inmutables)
│   ├── 2026-11-24_apuntes_clase_js.md
│   ├── 2026-11-25_articulo_arquitectura_v8.md
│   └── 2026-11-26_capitulo_libro_flanagan.pdf
│
└── 5. wiki/                     <-- MEMORIA SEMÁNTICA (Escrita y mantenida por la IA)
    ├── conceptos/
    │   ├── compilacion-jit-v8.md
    │   ├── ambito-lexico-y-closures.md
    │   └── programacion-funcional-inmutable.md
    ├── libros-y-autores/
    │   ├── marijn-haverbeke-eloquent-js.md
    │   └── kyle-simpson-ydkjs.md
    ├── proyectos/
    │   └── nexo-ova-studio.md
    └── sintesis/
        └── comparativa-pkm-vs-ovas.md
```

Veamos qué hace exactamente cada una de estas 5 piezas:

### Pieza 1: `raw/` (La Bóveda Cruda e Inocable)
* Aquí tiras todo lo que entra día a día: tus notas en bruto, un artículo que copiaste de internet, un PDF, un fragmento de código o una transcripción de YouTube.
* **Regla sagrada de Karpathy:** La carpeta `raw/` es **solo de lectura (*immutable / append-only*)** para la IA. La IA tiene prohibido modificar o borrar tus archivos originales. Así siempre conservas la fuente de verdad intacta por si años después quieres verificar la cita textual original.

### Pieza 2: `wiki/` (La Corteza Cerebral Compilada por la IA)
* Aquí es donde ocurre la revolución: **Tú no estás obligado a redactar ni organizar manualmente la carpeta `wiki/`; la mantiene el Agente de IA por ti**.
* Cada archivo dentro de `wiki/` es una página de conocimiento vivo sobre un **concepto**, una **herramienta**, un **autor/libro** o un **proyecto**.
* Cada página del `wiki/` contiene:
  * Una explicación destilada y clara del concepto.
  * **Enlaces bidireccionales** (`[[ambito-lexico-y-closures]]`) hacia otros conceptos relacionados de tu cerebro.
  * **Referencias trazables** hacia el archivo exacto de `raw/` de donde salió cada afirmación (por ejemplo: *Fuente: `raw/2026-11-25_articulo_arquitectura_v8.md`*).
  * **Historial de evolución:** Si hace 6 meses pensabas una cosa y hoy leíste un paper que dice lo contrario, la página del wiki registra ambas posturas y explica cómo evolucionó tu comprensión.

### Pieza 3: `index.md` (El Mapa Sináptico que Reemplaza a las Bases Vectoriales)
* ¿Cómo sabe la IA qué hay dentro de tu cerebro sin usar una base de datos vectorial complicada?
* Karpathy mantiene un archivo `index.md` en la raíz. Es un **catálogo maestro organizado por categorías** donde cada página de `wiki/` aparece en una sola línea con su enlace y un resumen de 15 palabras de lo que contiene.
* Cuando le haces una pregunta a tu cerebro, la IA **lee primero `index.md`** (que cabe fácilmente en su memoria RAM / ventana de contexto), identifica en un instante cuáles son las 3 o 4 páginas exactas de `wiki/` que necesita abrir, y va directo a ellas. Es más rápido, más transparente y mucho más inteligente que cortar textos a ciegas en fragmentos vectoriales.

### Pieza 4: `log.md` (La Línea de Tiempo Autobiográfica)
* Es una bitácora cronológica donde cada vez que el cerebro asimila algo nuevo, agrega una línea al final:
  * `[2026-11-26 11:30] INGEST: Leído raw/2026-11-26_capitulo_libro_flanagan.pdf -> Actualizadas páginas wiki/conceptos/objetos-js.md y wiki/libros-y-autores/david-flanagan.md.`
* Te permite ver cómo ha crecido tu conocimiento semana tras semana.

### Pieza 5: `AGENTS.md` o `CLAUDE.md` (El Sistema Operativo del Cerebro)
* Es un archivo de texto de 1 o 2 páginas ubicado en la raíz del proyecto que contiene las reglas permanentes del agente. Cada vez que abres tu asistente de IA en esa carpeta, el agente lee ese archivo y sabe exactamente cómo comportarse como el "compilador de tu cerebro".

---

## 5. Los 3 Ciclos Vitales: Cómo Funciona el Cerebro de Karpathy en la Práctica Diaria

En el sistema de Karpathy, tú solo interactúas con tu cerebro mediante **tres comandos u operaciones naturales**:

```
                  ┌──────────────────────────────────────┐
                  │  Nuevo aprendizaje del día a día     │
                  │  (Apunte, PDF, Artículo, Código)     │
                  └──────────────────┬───────────────────┘
                                     │ Lo sueltas en raw/
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ OPERACIÓN 1: INGEST (Asimilación)                                       │
│ "Agente, ingiere el nuevo archivo de raw/"                              │
│  ├─► 1. Lee el archivo crudo y extrae todas las ideas y datos clave.    │
│  ├─► 2. Revisa index.md para ver qué páginas ya existen sobre el tema.  │
│  ├─► 3. Crea páginas nuevas en wiki/ o ENRIQUECE las que ya existían.   │
│  ├─► 4. Conecta enlaces [[concepto]] y alerta si hay contradicciones.   │
│  └─► 5. Actualiza index.md y registra el evento en log.md.              │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
┌─────────────────────────────────────────┐   ┌─────────────────────────────────────────┐
│ OPERACIÓN 2: QUERY & COMPOUND           │   │ OPERACIÓN 3: LINT (Sueño REM / Limpieza)│
│ (Consultar y Acumular Interés Compuesto)│   │ "Agente, haz un chequeo de salud"       │
│  ├─► Lee index.md -> abre páginas wiki/ │   │  ├─► Busca contradicciones entre notas. │
│  ├─► Responde conectando tus ideas.     │   │  ├─► Detecta páginas huérfanas sin link.│
│  └─► ¡GUARDA la nueva síntesis de       │   │  ├─► Sugiere qué lagunas o preguntas    │
│      vuelta en wiki/ para el futuro!    │   │      te falta investigar mañana.        │
└─────────────────────────────────────────┘   └─────────────────────────────────────────┘
```

### El Secreto del "Interés Compuesto" (*Query & Compound*)
Presta especial atención a la **Operación 2**:
* En un chat normal con ChatGPT o Claude, tú tienes una conversación brillante de 20 minutos donde conectas dos temas, cierras la pestaña y **esa síntesis se pierde para siempre en el historial de chats**.
* En el sistema de Karpathy, cuando haces una consulta y llegas a una conclusión valiosa, le dices al agente: **"Guarda esta síntesis en el wiki"**. El agente crea o actualiza una página en `wiki/sintesis/` y la enlaza en `index.md`.
* Así, **cada pregunta que haces hoy vuelve a tu cerebro permanentemente más sabio para mañana**. El conocimiento gana interés compuesto como una cuenta de inversión.

---

# PARTE II: CÓMO LO PUEDES HACER TÚ MISMO

Puedes implementar este sistema en **dos niveles**:
1. **Para tu vida personal, docente y profesional diaria** (usando este mismo entorno con Antigravity / VS Code / Obsidian en tu computador).
2. **Integrado como motor dentro de tu aplicación `NexoOVA Studio`** (para que tus OVAs y tu Lienzo en Grafo funcionen como un Cerebro Karpathy que se enriquece día a día).

Veamos ambos caminos paso a paso con todo listo para usar.

---

## Camino 1: Cómo Montar Tu Propio "Cerebro Karpathy" Personal en 5 Minutos

No necesitas pagar ninguna suscripción ni instalar bases de datos complicadas. Solo necesitas **una carpeta en tu computador**, **Git**, un **visor Markdown** (como tu IDE u Obsidian) y tu **Agente de IA** (como Antigravity).

### Paso 1: Crea la estructura de 4 carpetas
Abre una terminal donde quieras guardar tu cerebro personal (por ejemplo `~/Escritorio/mi-cerebro-digital`) y crea esta estructura:

```bash
mkdir -p ~/Escritorio/mi-cerebro-digital/raw
mkdir -p ~/Escritorio/mi-cerebro-digital/wiki/conceptos
mkdir -p ~/Escritorio/mi-cerebro-digital/wiki/libros
mkdir -p ~/Escritorio/mi-cerebro-digital/wiki/proyectos
mkdir -p ~/Escritorio/mi-cerebro-digital/wiki/sintesis
cd ~/Escritorio/mi-cerebro-digital && git init
```

### Paso 2: Crea el archivo `inbox.md` (Para tu captura rápida *Append-and-Review* del día)
En este archivo anotas en 5 segundos cualquier idea rápida del día, siempre **arriba del todo**:

```markdown
# Bandeja Rápida con Gravedad (Append-and-Review)
<!-- Regla: Añade siempre en la línea 5. Lo viejo baja solo. -->

- [2026-11-26] idea: Agregar casos de prueba automáticos a los snippets de las OVAs.
- [2026-11-26] leer: Libro Exploring JS de Axel Rauschmayer sobre iteradores.
- [2026-11-25] codigo: En Vite 8 usar allowedHosts tanto en server como en preview para Render.com.
```

### Paso 3: Crea el archivo `index.md` (El Mapa Sináptico Inicial)

```markdown
# Índice Maestro del Cerebro (index.md)

> Este catálogo es leído primero por el Agente IA para localizar conocimiento sin búsquedas a ciegas.

## 1. Conceptos Fundamentales (`wiki/conceptos/`)
*(El agente irá listando aquí cada concepto compilado con un resumen de una línea)*

## 2. Libros, Autores y Citas (`wiki/libros/`)
*(El agente irá listando aquí cada obra analizada)*

## 3. Proyectos Activos (`wiki/proyectos/`)
*(El agente irá listando aquí la arquitectura y decisiones de tus proyectos)*

## 4. Síntesis y Conexiones (`wiki/sintesis/`)
*(El agente guardará aquí las conclusiones de tus consultas profundas)*
```

### Paso 4: Crea el archivo `AGENTS.md` (Las Reglas Exactas de Karpathy para tu Agente IA)
Copia y pega este archivo en la raíz de tu carpeta. Este archivo convierte automáticamente a cualquier agente de código en el compilador de tu cerebro:

```markdown
# Instrucciones del Sistema: Compilador de Cerebro Digital (Patrón Karpathy)

Actúas como el compilador y mantenedor de mi base de conocimiento personal en Markdown.

## Reglas de Arquitectura
1. **`raw/` es INMUTABLE:** Nunca edites, sobrescribas ni borres archivos dentro de `raw/`. Son mis fuentes originales de verdad.
2. **`wiki/` es tu dominio:** Tú redactas, enriqueces y mantienes actualizadas todas las páginas dentro de `wiki/`.
3. **`index.md` siempre sincronizado:** Cada vez que crees o actualices una página en `wiki/`, asegúrate de que esté registrada en `index.md` con su ruta relativa y un resumen claro de 1 línea.
4. **Trazabilidad y Enlaces:**
   - Usa enlaces internos `[[nombre-de-archivo]]` para conectar conceptos relacionados.
   - Al final de cada sección o dato en `wiki/`, cita de qué archivo de `raw/` provino (ej. *Fuente: `raw/2026-11-26_nota.md`*).
5. **`log.md`:** Registra al final de `log.md` cada operación realizada con fecha y hora.

## Cómo responder a mis 3 comandos diarios:
- **Comando `INGEST` ("Ingiere lo nuevo de raw/ o de inbox.md"):**
  1. Lee el archivo nuevo en `raw/` (o las notas marcadas en `inbox.md`).
  2. Revisa `index.md` para ver qué páginas de `wiki/` ya tratan esos temas.
  3. En lugar de crear notas duplicadas, **enriquece y amplía las páginas existentes en `wiki/`** con la nueva información, o crea una página nueva si es un concepto inédito.
  4. Si la nueva fuente contradice o mejora algo escrito antes en `wiki/`, anota explícitamente la evolución del concepto.
  5. Actualiza `index.md` y añade una entrada en `log.md`.

- **Comando `QUERY` ("Consulta en mi cerebro sobre X"):**
  1. Lee primero `index.md` para identificar las páginas relevantes.
  2. Lee esas páginas de `wiki/` y sintetiza una respuesta profunda conectando mis propias notas.
  3. Si la respuesta genera una conexión nueva valiosa, pregúntame si deseo guardarla en `wiki/sintesis/`.

- **Comando `LINT` ("Audita mi cerebro"):**
  1. Revisa `index.md` y las páginas de `wiki/`.
  2. Detecta páginas huérfanas (sin enlaces hacia otras), contradicciones conceptuales o temas que mencioné pero que aún están incompletos.
  3. Propón 3 preguntas o temas concretos que debería investigar esta semana para llenar esos vacíos.
```

### Paso 5: ¿Cómo es tu rutina diaria de 5 minutos con este sistema?
1. **Durante el día:** Si ves algo interesante, lo anotas en la primera línea de `inbox.md` o guardas el artículo/PDF/apunte dentro de la carpeta `raw/`. No organizas nada.
2. **Al final del día (o 2 veces por semana):** Abres tu carpeta en Antigravity y le escribes una sola frase al agente:
   > *"Ingiere los archivos nuevos que puse en `raw/` y las notas de hoy en `inbox.md`, y actualiza mi wiki."*
3. **El agente hace toda la magia:** Lee tus apuntes crudos, busca en `index.md` qué páginas de `wiki/` se relacionan, las enriquece con nuevos párrafos, citas y ejemplos de código, crea los enlaces cruzados y hace un `git commit` automático para que tengas historial completo.

---

## Camino 2: Cómo Integrar el Paradigma de Karpathy Dentro de Tu Aplicación `NexoOVA Studio`

Lo más interesante de todo es que **la aplicación `NexoOVA Studio` que ya estás construyendo tiene el 80% de la infraestructura ideal para convertirse en una versión visual e interactiva del Cerebro de Karpathy aplicada a la educación**.

Mira la equivalencia directa entre la arquitectura de Karpathy y los componentes que ya tienes en tu código:

| Pieza del Cerebro de Karpathy | Equivalente en **NexoOVA Studio** | Cómo Enriquecerlo en Tu App |
| :--- | :--- | :--- |
| **`inbox.md` (*Append-and-Review*)** | Nodos en estado `to_research` (*Por investigar*) | Añadir una **Bandeja Rápida de Semillas (Inbox con Gravedad)** en la barra lateral donde el docente anote ideas en 3 segundos (las nuevas arriba, las viejas bajan solas) y con 1 clic las rescate al Lienzo. |
| **`raw/` (*Fuentes Crudas Inmutables*)** | Archivos, enlaces web, videos y apuntes base del docente | Añadir en cada OVA o en el Canvas un cajón de **"Fuentes Crudas (`raw/`)"** donde el docente pegue un texto largo, un apunte de clase o extractos de un libro sin preocuparse por darle formato. |
| **Operación `INGEST` (*Compilación a Wiki*)** | Promoción y sincronización de Nodos a Bloques (`LessonBlock`) | Un botón **"🧠 Compilar Semilla en Bloques"** que tome un texto crudo y lo desglose automáticamente en bloques tipados de NexoOVA: `heading` + `text` (explicación extensa) + `quote` (cita de libro) + `diagram` + `exercise` (con su snippet ejecutable). |
| **`wiki/` (*Red de Conocimiento Compilado*)** | Los Nodos del Lienzo (`GraphNode`) y las Lecciones de las OVAs (`Lesson`) | Permitir enlaces cruzados `[[Concepto]]` entre bloques de distintas OVAs, de modo que al enriquecer un nodo en el Canvas se actualice automáticamente la lección vinculada. |
| **`index.md` (*Mapa Maestro*)** | El **Lienzo en Grafo (`KnowledgeGraphCanvas.tsx`)** con sus Regiones (`GraphRegion`) y Aristas (`GraphEdge`) | Tu Lienzo en Grafo **ya es un `index.md` visual**: muestra de un vistazo todas las regiones contenedoras (OVAs), sus nodos hijos y cómo se conectan (`declara enlaces en`, `transforma colecciones con`). |
| **Operación `LINT` (*Auditoría de Salud del Cerebro*)** | Inspector del Canvas y Constructor OVA | Añadir un botón **"🔍 Auditar Salud del Conocimiento (Lint)"** que escanee automáticamente el Canvas y las OVAs y te avise:<br>• *"El nodo X está huérfano (no tiene aristas ni OVA vinculada)"*<br>• *"La Lección Y tiene teoría pero aún no tiene citas bibliográficas (`quote`) ni ejercicios cortos (`corto`)"*<br>• *"El ejercicio Z no tiene código semilla (`exerciseStarterCode`)"*. |

---

## Resumen Visual: Tu Flujo de Trabajo Diario como Docente y Creador con el Método Karpathy

Si combinas el método personal de Karpathy con tu plataforma **NexoOVA Studio**, tu flujo para aprender y enseñar cualquier tecnología nueva (por ejemplo, cuando quieras crear las próximas OVAs de **Node.js**, **Bases de Datos SQL**, **Python** o **React**) será este:

1. **Día 1 al 5 (Captura sin Fricción — *Append & Raw*):**
   * Mientras lees libros, ves videos o programas, tiras tus notas rápidas arriba del todo en tu bandeja (`inbox.md`) y guardas artículos o extractos en `raw/`. No pierdes tiempo maquetando nada.
2. **Día 6 (Compilación — *Ingest*):**
   * Le pides al agente que compile lo acumulado en `raw/`.
   * Esas notas crudas se transforman en **Regiones y Nodos dentro del Lienzo en Grafo**, enriquecidos con **explicaciones extensas, citas de libros (`quote`), diagramas visuales (`diagram` / `interactive`) y baterías de ejercicios con snippets ejecutables (`5 cortos + 10 de desarrollo`)**.
3. **Día 7 (Consolidación — *Lint & Publish*):**
   * Ejecutas la auditoría (`Lint`) para verificar que ningún nodo haya quedado huérfano ni ninguna lección incompleta, sincronizas la APK móvil y publicas la OVA para tus aprendices.

---

### En una sola frase para recordar:
> **No uses tu mente como un archivador que sufre organizando carpetas; usa tu mente para capturar chispas en el día a día (`raw/`), y deja que el sistema compile, conecte y enriquezca permanentemente una red viva de conocimiento (`wiki/` + `Canvas` + `OVAs ejecutables`).**
