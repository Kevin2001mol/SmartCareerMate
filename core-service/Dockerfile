# ------------ Fase de construcción ------------
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app

# 1) copiar sólo descriptor para cachear deps
COPY pom.xml ./
COPY mvnw ./
COPY .mvn ./.mvn
RUN chmod +x mvnw && ./mvnw -q dependency:go-offline

# 2) copiar el resto del código y compilar
COPY src ./src
RUN ./mvnw -q clean package -DskipTests

# ------------ Imagen runtime ------------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
