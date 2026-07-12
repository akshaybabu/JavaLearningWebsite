# JavaForge Auth Backend

Spring Boot authentication service for JavaForge using:

- MySQL
- Hibernate / JPA
- Flyway migrations
- Spring Security
- BCrypt password hashing
- JWT access tokens

## Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

## Required environment variables

```properties
DB_URL=jdbc:mysql://localhost:3306/javaforge_auth?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=replace-this-with-a-long-random-secret-key-at-least-32-bytes
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
APP_PORT=8080
```

## Run locally

```bash
cd backend
mvn spring-boot:run
```

If the application fails during `JwtService` startup, make sure `JWT_SECRET` is at least 32 bytes long for HS256.

## Hibernate/JPA query layer

The main professional query flow is inside `UserRepository`:

- active user lookup by username or email
- duplicate conflict check for registration
- last-login timestamp update after successful authentication

Flyway migration `V1__create_users_table.sql` creates the MySQL table and indexes expected by Hibernate.
