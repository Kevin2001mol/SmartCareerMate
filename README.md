# 🧠 SmartCareerMate

**SmartCareerMate** es una plataforma web inteligente diseñada para ayudar a candidatos en procesos de selección laboral, automatizando tareas clave mediante el uso de inteligencia artificial y una arquitectura basada en microservicios.

La herramienta está pensada para optimizar y personalizar la presentación del perfil profesional de cada usuario, a través de funcionalidades como:

- ✍️ Generación automática de cartas de presentación adaptadas a una oferta
- 📄 Adaptación de CVs a descripciones de puestos concretos
- 🤖 Simulación de entrevistas mediante un chatbot con IA
- 📊 Análisis semántico de textos (CV + oferta)

---

## 🚀 Funcionalidades principales

### 📝 Adaptación de CVs
- El usuario sube su CV y la descripción de la oferta.
- El sistema analiza ambas y genera una nueva versión del CV adaptada a los requisitos del puesto.

### 💬 Generación de carta de presentación
- Se genera automáticamente una carta ajustada al perfil del candidato y la oferta.
- Permite edición y copia directa.

### 🤖 Simulador de entrevista
- Chatbot basado en IA (modelos LLM) que plantea preguntas y evalúa las respuestas.
- Permite practicar con feedback básico.

---

## 🧩 Estructura de microservicios

| Carpeta              | Descripción                                                                 |
|----------------------|------------------------------------------------------------------------------|
| `frontend/`          | Interfaz de usuario desarrollada con Angular                                |
| `core-service/`      | Servicio central: lógica de negocio, validación, orquestación parcial       |
| `cv-parser/`         | Microservicio para extracción y análisis de texto desde archivos de CV       |
| `ai-service/`        | Microservicio de IA: generación de carta, simulación de entrevista, etc.    |
| `gateway/`           | API Gateway entre los microservicios y el frontend                          |
| `.vscode/`           | Configuración personalizada para entorno de desarrollo                      |

---

## 🧪 Archivos clave

| Archivo                     | Función                                                                 |
|-----------------------------|-------------------------------------------------------------------------|
| `docker-compose.yml`        | Orquesta todos los servicios en contenedores                           |
| `ai-ollama.Dockerfile`      | Dockerfile específico para entorno de IA local con modelos Ollama       |
| `cv1.json` / `payload.json` | Archivos de ejemplo para pruebas de CV y flujo de procesamiento         |

---

## 🛠️ Tecnologías utilizadas

**Frontend**
- Angular · TypeScript · HTML/CSS

**Backend / Microservicios**
- Java + Spring Boot (`core-service`)
- Node.js + Express (`ai-service`, `cv-parser`)
- RabbitMQ (mensajería entre servicios)

**IA / NLP**
- OpenAI API y modelos Ollama
- NLP clásico para análisis de texto

**Infraestructura**
- Docker + Docker Compose
- PostgreSQL
- GitHub Actions

---
## ⚠️ Estado actual del proyecto

✅ Funcional  
⚙️ Se utiliza un endpoint gratuito para IA, por lo que los tiempos de respuesta pueden ser lentos y las respuestas limitadas.

🎨 El diseño actual es funcional pero se encuentra en revisión. El objetivo es mejorar la experiencia visual y de usuario (UI/UX) en futuras versiones.

---

## 🧠 Motivación

Este proyecto nació como una forma de aplicar mis conocimientos full-stack y de IA para resolver un problema real: ayudar a personas a presentar su perfil de forma más efectiva.  
Mi objetivo es seguir mejorando la herramienta, tanto a nivel técnico como funcional.

---

## 📬 Contacto

Creado por **Kevin Molina**  
🔗 [Portfolio](https://kevinhub.dev)  
📧 kevin2001molina@gmail.com  
📱 +34 695 918 954

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Libre para usar, aprender o mejorar.



