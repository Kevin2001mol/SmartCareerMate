# SmartCareerMate (Finalizando desarrollo)
---
**SmartCareerMate** es un asistente inteligente diseñado para facilitar procesos de selección y gestión del talento en el ámbito de los recursos humanos. Actualmente en desarrollo, este proyecto combina tecnologías modernas de desarrollo web con inteligencia artificial para ofrecer funcionalidades clave como:
- 🔍 **Análisis inteligente de CVs**: extracción de información relevante y evaluación automatizada del perfil del candidato.
- 📝 **Generación automática de documentos**: creación de CVs optimizados y cartas de presentación personalizadas.
- 💬 **Simulación de entrevistas**: chatbot entrenado para realizar entrevistas tipo con preguntas adaptadas al rol.
- 🌐 **Soporte multilenguaje y acceso web**: experiencia de usuario responsive y accesible desde navegador.

El objetivo de **SmartCareerMate** es convertirse en una solución integral que ayude tanto a candidatos como a reclutadores a optimizar el tiempo, mejorar la calidad de los procesos y reducir sesgos humanos, fomentando decisiones basadas en datos.

---
# 📐 Propuesta de arquitectura y stack tecnológico

| Capa | Tecnología | Responsabilidad principal | Observaciones |
|------|------------|---------------------------|---------------|
| **Front-end SPA** | **Angular 17 + Angular Material**<br/>NgRx (estado) · ngx-translate (i18n) | UX completa en castellano: subida de CV, formularios oferta, selector idioma/tono, slider de dificultad y chat en vivo | Angular trae CLI, lazy-loading y A11y; Material acelera prototipado |
| **API Gateway** | Spring Boot 3 (Spring Cloud Gateway) | Enrutado, CORS, rate-limit, token introspection | Única puerta de entrada; escalable en Kubernetes |
| **Servicio Auth** | Keycloak 23 · JWT (Bearer) | Registro OAuth2 / SSO, roles (candidato, admin) | Contenedor; gestiona políticas RGPD/consentimiento |
| **Core Backend** | Spring Boot 3 (Maven) | Orquestar módulos de IA y persistencia | Arquitectura hexagonal para aislar dominio |
| **Módulo IA** | Spring Boot + OpenAI Java SDK<br/>(o microservicio Python para NLP) | - Evaluación CV vs oferta<br/>- Reescritura multilingüe<br/>- Carta de presentación<br/>- Generador de preguntas/ respuestas | Prompts en plantillas; slider → ajusta *temperature* y contexto |
| **Parser de CVs** | Apache Tika + PDFBox + POI | Extraer texto y metadatos de PDF/DOCX/ODT | Convierte a JSON: `{ experiencia:[], formacion:[], skills:[] }` |
| **BD relacional** | PostgreSQL 16 | Usuarios, ofertas, histórico de chats, CVs reescritos | Spring Data JPA; tablas separadas para datos GDPR |
| **File Storage** | MinIO (S3-compatible) o AWS S3 | Almacén de ficheros originales | URLs presignadas desde el front |
| **Mensajería** | RabbitMQ | Jobs largos (parser, IA) | Retries + escalado horizontal |
| **Tiempo real** | Spring WebSocket / SSE | Streaming de tokens del chat (entrevista) | Angular con RxJS |
| **DevOps** | Docker Compose (dev) → Kubernetes + Helm (prod) | CI/CD (GitHub Actions) · Observabilidad (Grafana + Prometheus) | Helm charts por microservicio; HPA |
| **Seguridad/legal** | CSP, OWASP 10, logging anonimizado, cifrado en reposo | RGPD: derecho al olvido → job de borrado | Postgres RLS si se comparten bases |

---

## 🔄 Flujos clave

1. **Carga y análisis de CV**  
   1. Angular sube archivo al *File Service* (URL presignada).  
   2. Devuelve `fileId` y lanza job *ParseCV* en RabbitMQ.  
   3. *Parser Service* extrae texto → guarda JSON → notifica vía WebSocket (`cvParsed`).

2. **Comparación con la oferta**  
   - Front llama `GET /api/fit-score` (CV ID + oferta).  
   - *IA Service* envía prompt a GPT-4o:<br/>
     ```
     1. Perfil (JSON)
     2. Descripción del puesto
     3. Devuelve: score 0-100, fortalezas[], gaps[]
     ```  
   - Guarda evaluación y la envía al front.

3. **Reescritura y carta de presentación**  
   - Endpoint `/api/rewrite` (idioma, tono).  
   - Prompts con guidelines de claridad + lenguaje destino.  
   - Respuesta se guarda; opción *Descargar DOCX/PDF* (docx4j / OpenPDF).

4. **Simulación de entrevista (chat)**  
   - Angular abre socket `/ws/interview?level=<1-5>`.  
   - Backend genera primera pregunta según *level*.  
   - Cada mensaje del usuario se reenvía a GPT con prompt de reclutador; tokens en streaming.  
   - Después de cada respuesta, IA envía **“Modelo de buena respuesta”** (colapsado en UI).

---

## 🛠️ Desarrollo incremental (sprints sugeridos)

| Sprint | Entregable | Puntos críticos |
|--------|-----------|-----------------|
| 1 | PoC subida de CV + parsing + JSON | Validación archivos > 2 MB |
| 2 | Endpoint *fit-score* con OpenAI | Costes y latencia (caching embeddings) |
| 3 | Reescritura multilenguaje + plantillas | Longitud tokens, logs PII |
| 4 | Carta presentación + PDF | Plantillas Freemarker / docx4j |
| 5 | Chat entrevista (nivel 1-3) | Streaming, UX fluido |
| 6 | Seguridad (Auth, RGPD), slider 4-5 | Datos sensibles, auditoría |
| 7 | Docker/K8s + monitorización | Consumo tokens y métricas negocio |

---

## ✔️ Buenas prácticas

* **Embeddings locales**: guarda vectores (e5-small) → reduce llamadas GPT.  
* **Cost-guard**: límite diario/usuario de tokens; métricas en Prometheus.  
* **Caching**: memoization de prompts inmutables.  
* **Testing**: Testcontainers + WireMock (simular OpenAI).  
* **Accesibilidad**: Angular Material cumple WCAG; revisa contraste tras i18n.  
* **Escalabilidad económica**: Módulo IA como microservicio independiente; escala sólo donde hace falta.

---

## 🚀 Próximos pasos

1. Validar alcance con stakeholders y mockups en Figma.  
2. Generar backlog a partir de los sprints.  
3. Configurar mono-repo (Nx para Angular + Maven multi-module).  
4. Evaluar microservicio Python (FastAPI) si en futuro se usan modelos open-source (Llama-3, Mistral).

---

> Con este enfoque tendrás un MVP en **6-8 semanas** y una base sólida para evolucionar la plataforma.
