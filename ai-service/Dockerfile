# ai-service/Dockerfile
# ---------- fase de build ----------
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -q package -DskipTests

# ---------- imagen final -----------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/ai-service-*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java","-jar","/app/app.jar"]
