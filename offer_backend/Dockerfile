# ---------- Stage 1: Build ----------
FROM maven:3.9-eclipse-temurin-21-alpine AS build

# Копируем исходники и POM
WORKDIR /build
COPY pom.xml .
COPY src ./src

# Собираем проект
RUN mvn clean package -DskipTests

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Копируем собранный JAR из build stage
COPY --from=build /build/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
