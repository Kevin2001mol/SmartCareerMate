# Dockerfile para core-service (Spring Boot + Maven)
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java","-jar","/app/app.jar"]
