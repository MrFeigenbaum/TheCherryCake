# ==========================================
# Stage 1: Build the Frontend (React + Vite)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY cherrycake-frontend/package*.json ./
RUN npm ci

COPY cherrycake-frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build the Backend (Spring Boot + Maven)
# ==========================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/backend

COPY cherrycake-backend/pom.xml ./
RUN mvn dependency:go-offline -B || true

COPY cherrycake-backend/src ./src
# Embed built frontend into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests -B

# ==========================================
# Stage 3: Minimal Production Runtime
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S cherrycake && adduser -S cherrycake -G cherrycake
USER cherrycake

COPY --from=backend-builder /app/backend/target/cherrycake-backend-*.jar app.jar

ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT} -jar app.jar"]

