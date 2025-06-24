# cv-parser/Dockerfile
FROM eclipse-temurin:21-jre-jammy

# Copiamos el JAR generado por Maven
COPY target/cv-parser-0.0.1-SNAPSHOT.jar /app.jar

# Puerto interno usado por Spring Boot
EXPOSE 8085

# Lanzamos la aplicación
ENTRYPOINT ["java","-jar","/app.jar"]
