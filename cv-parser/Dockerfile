# ---------- Stage 1: build con Maven ----------
FROM maven:3.9.8-eclipse-temurin-21 AS builder

WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn -q -DskipTests package      # genera target/cv-parser-0.0.1‑SNAPSHOT.jar

# ---------- Stage 2: runtime ligero ----------
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=builder /app/target/cv-parser-0.0.1-SNAPSHOT.jar /app.jar

EXPOSE 8085
ENTRYPOINT ["java","-jar","/app.jar"]
