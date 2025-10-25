# Build stage
FROM gradle:9.1-jdk24 AS build
WORKDIR /app

# Copy gradle files first for better caching
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle ./gradle

# Download dependencies (cached layer)
RUN gradle dependencies --no-daemon || true

# Copy source code
COPY src ./src

# Build the application
RUN gradle buildFatJar --no-daemon

# Runtime stage
FROM eclipse-temurin:24-jre-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the fat JAR from build stage
COPY --from=build /app/build/libs/*-all.jar app.jar

# Change ownership
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port (8080 for todo-service, 8081 for notification-service)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]