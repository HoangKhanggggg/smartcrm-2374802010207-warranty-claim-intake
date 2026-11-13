# DEPLOYMENT GUIDE – SMART CRM MEKONG MOBILE

## 1. System Requirements

Smart CRM – Mekong Mobile is a web application for the L02 warranty claim intake and classification workflow.

The system consists of the following components:

| Component | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Frontend | React, Vite |
| Database | PostgreSQL 18 |
| Backend testing | Jest, Supertest |
| Frontend linting | Oxlint |
| Containerization | Docker, Docker Compose |
| Version control | Git |

### 1.1. Prerequisites

For manual development deployment, install:

- Node.js 20 or later.
- npm 10 or later.
- PostgreSQL 18.
- Git.
- Visual Studio Code (recommended).
- pgAdmin 4 (recommended).

For Docker deployment, install:

- Docker Desktop with Docker Compose support, or Docker Engine with Docker Compose plugin.
- Git.

The development environment previously recorded for this project includes Node.js 24.12.0, npm 11.6.2, and PostgreSQL 18.6.

### 1.2. Verify installed tools

Run the following commands:

```bash
node --version
npm --version
psql --version
git --version
docker --version
docker compose version
```

The Docker commands are required only when using Docker deployment.

---

## 2. Get the Source Code

Clone the public repository:

```bash
git clone https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake.git
```

Navigate to the project directory:

```bash
cd smartcrm-2374802010207-warranty-claim-intake
```

Open the project in Visual Studio Code:

```bash
code .
```

If the `code` command is unavailable, open the project folder manually using Visual Studio Code.

---

## 3. Database and Environment Configuration

### 3.1. Environment variables

The backend reads configuration from the `.env` file in the project root.

Create a local environment file from the provided example:

```cmd
copy .env.example .env
```

Configure the following variables in `.env`:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_NAME=smart_crm

STAFF_USER=your_staff_username
STAFF_PASSWORD=your_staff_password

MANAGER_USER=your_manager_username
MANAGER_PASSWORD=your_manager_password

AUTH_SECRET=replace_with_random_secret_at_least_32_characters

LOG_LEVEL=INFO

VITE_API_URL=http://localhost:3001
```

Replace all example values with your own configuration.

Requirements:

- `DB_PASSWORD` must match the PostgreSQL database user's password.
- `STAFF_USER` and `STAFF_PASSWORD` configure the intake staff account.
- `MANAGER_USER` and `MANAGER_PASSWORD` configure the center manager account.
- The staff and manager usernames must be different.
- `AUTH_SECRET` must contain at least 32 characters.
- `VITE_API_URL` specifies the backend API address used by the frontend build.
- Use strong passwords for all accounts.

Generate a random authentication secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Copy the generated value into `AUTH_SECRET`.

**Security note:** Never commit `.env` or disclose database passwords, application passwords, or authentication secrets. The `.env` file is excluded from Git, while `.env.example` contains placeholder values only.

### 3.2. Database configuration for manual deployment

Open PostgreSQL using pgAdmin 4 or the PostgreSQL command line.

Create a database named:

```text
smart_crm
```

Configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` to match the PostgreSQL server.

For manual deployment, the default database host is `localhost` and the default port is `5432`.

### 3.3. Database initialization

The backend automatically executes SQL migration and seed files when it starts.

The database scripts are located in:

```text
src/db/migrations/
```

The current migration files include:

- `001_create_tables.sql`: creates database tables and indexes.
- `002_seed.sql`: inserts initial sample data.

The migration and seed scripts support repeated initialization without inserting duplicate sample records.

### 3.4. Docker database configuration

For Docker deployment, Docker Compose creates the PostgreSQL 18 container automatically.

The database service uses the following environment variables:

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

The backend connects to the database using the Docker service name `db` and port `5432`. Docker Compose overrides `DB_HOST` and `DB_PORT` for the container environment.

A persistent Docker volume named `smartcrm_pgdata` stores PostgreSQL data.

---

## 4. Install and Run the Application

The application supports two deployment methods: manual development deployment and Docker deployment.

### 4.1. Manual deployment

#### Step 1: Install backend dependencies

From the project root, run:

```bash
npm install
```

#### Step 2: Start the backend

Run:

```bash
npm start
```

The backend initializes the database and starts the Express server.

Default backend address:

```text
http://localhost:3001
```

Keep this terminal running.

#### Step 3: Install frontend dependencies

Open another terminal at the project root:

```bash
npm install --prefix src/frontend
```

#### Step 4: Start the frontend

Run:

```bash
npm run dev --prefix src/frontend
```

The Vite development server is available at:

```text
http://localhost:5173
```

Open the frontend address in a web browser to access the application.

### 4.2. Docker deployment

Docker Compose builds and runs the database, backend, and frontend services.

#### Docker Quick Start

For a fresh deployment using Docker, follow these steps.

**Step 1: Clone the repository and enter the project directory.**

```bash
git clone https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake.git
cd smartcrm-2374802010207-warranty-claim-intake
```

**Step 2: Create and configure the environment file.**

```cmd
copy .env.example .env
```

Edit `.env` and replace all placeholder values with valid credentials. Ensure that `AUTH_SECRET` contains at least 32 characters.

**Step 3: Build and start all services with one command.**

```bash
docker compose up -d --build
```

Docker Compose builds the images and starts PostgreSQL, the backend, and the frontend. The backend waits for the database healthcheck, and the frontend waits for the backend healthcheck.

**Step 4: Verify the deployment.**

```bash
docker compose ps
```

Access the application at:

- Frontend: `http://localhost:5173`
- Backend health endpoint: `http://localhost:3001/health`

No host-side Node.js installation or `npm install` is required when using Docker deployment.

#### Detailed Docker deployment

**Step 1: Configure environment variables**

Ensure that the project root contains a valid `.env` file.

The `DB_PASSWORD`, staff credentials, manager credentials, and `AUTH_SECRET` must be configured before starting the containers.

**Step 2: Validate Docker Compose configuration**

Run:

```bash
docker compose config --quiet
```

If the command completes without errors, the Compose configuration is valid.

**Step 3: Build the Docker images**

Run:

```bash
docker compose build
```

This builds the backend and frontend images.

**Step 4: Start the application**

Run:

```bash
docker compose up -d
```

Docker Compose starts:

| Service | Container | Purpose |
|---|---|---|
| `db` | `smartcrm-db` | PostgreSQL database |
| `backend` | `smartcrm-backend` | Express API |
| `frontend` | `smartcrm-frontend` | React application served by Nginx |

The backend waits for the database healthcheck. The frontend waits for the backend healthcheck.

**Step 5: Check container status**

Run:

```bash
docker compose ps
```

Check service health and container status before accessing the application.

**Step 6: Access the application**

Frontend:

```text
http://localhost:5173
```

Backend health endpoint:

```text
http://localhost:3001/health
```

**Step 7: View service logs**

To view all service logs:

```bash
docker compose logs
```

To view backend logs:

```bash
docker compose logs backend
```

To view database logs:

```bash
docker compose logs db
```

To view frontend logs:

```bash
docker compose logs frontend
```

**Step 8: Stop the application**

Run:

```bash
docker compose down
```

This stops and removes the containers but preserves the named database volume.

To remove the containers and database volume as well:

```bash
docker compose down -v
```

**Warning:** The `-v` option deletes the persistent database volume and its stored data. Do not use it when database data must be retained.

### 4.3. Optional frontend checks

For manual deployment, build the frontend:

```bash
npm run build --prefix src/frontend
```

Check the frontend source code:

```bash
npm run lint --prefix src/frontend
```

Preview the production build:

```bash
npm run preview --prefix src/frontend
```

---

## 5. Verify the Application

### 5.1. Verify backend availability

Send a GET request to:

```text
http://localhost:3001/health
```

The expected response contains:

```json
{
  "status": "ok",
  "requestId": "..."
}
```

The `requestId` value is generated by the application and may differ between requests.

### 5.2. Verify the frontend

Open:

```text
http://localhost:5173
```

Confirm that the application page loads successfully.

### 5.3. Verify database initialization

Open pgAdmin 4 and connect to the `smart_crm` database.

Confirm that the following tables exist:

- `customer`
- `device`
- `issue_category`
- `ticket`
- `ticket_status_log`

Check that the initial sample data has been inserted.

### 5.4. Verify authentication and authorization

Use the configured staff and manager accounts to verify login.

Check that:

- The intake staff account can access the customer and device lookup functions and create warranty tickets.
- The center manager account can access the ticket list and ticket details.
- Requests without authentication are rejected.
- Requests from unauthorized roles are rejected by backend authorization middleware.

### 5.5. Run backend tests

From the project root, execute:

```bash
npm test -- --runInBand
```

The command runs the Jest test suite.

Record the actual number of passed and failed test suites and tests from the execution output.

### 5.6. Troubleshooting

| Problem | Suggested action |
|---|---|
| Backend cannot connect to PostgreSQL | Check PostgreSQL service, database name, username, password, host, and port in `.env`. |
| Port 3001 is already in use | Stop the process using the port or configure another available port. |
| Frontend cannot start | Run `npm install --prefix src/frontend` again and check the terminal output. |
| Database tables are missing | Check backend startup logs and verify that migration files exist. |
| Login fails | Verify `STAFF_USER`, `STAFF_PASSWORD`, `MANAGER_USER`, `MANAGER_PASSWORD`, and `AUTH_SECRET`. |
| Frontend cannot communicate with backend | Ensure that the backend is running and check the frontend API configuration. |
| Docker database is unhealthy | Check `DB_PASSWORD`, Docker container logs, and database healthcheck status. |
| Docker backend cannot connect to database | Verify that the `db` service is healthy and that the backend uses `DB_HOST=db`. |
| Docker frontend cannot load | Check the frontend container, Nginx configuration, and `VITE_API_URL` build argument. |

---

# SECURITY CHECKLIST

The following checklist records the implemented security controls and deployment responsibilities. A checked item indicates that the corresponding implementation or configuration has been verified; it does not imply that the entire production environment has been security-certified.

| No. | Security requirement | Status | Evidence / Notes |
|---|---|---|---|
| 1 | Keep environment files and secrets out of the Git repository. | [x] | `.gitignore` excludes `.env` and `.env.*`, while allowing `.env.example`. |
| 2 | Provide an environment example file with placeholder credentials. | [x] | `.env.example` contains variable names and placeholder values, not actual credentials. |
| 3 | Configure strong database and application credentials. | [ ] | The deployer must configure strong PostgreSQL, staff, and manager passwords in `.env`. |
| 4 | Validate that `AUTH_SECRET` contains at least 32 characters. | [x] | Backend validates `AUTH_SECRET` and rejects values shorter than 32 characters. The deployer must generate and configure a random secret. |
| 5 | Use parameterized SQL queries to reduce SQL injection risks. | [ ] | Review and verify all database query implementations before production deployment. |
| 6 | Enforce role-based authorization on the backend. | [x] | Authentication and role authorization are implemented using `requireAuth` and `authorizeRoles`. Route permissions are checked on the server. |
| 7 | Protect production traffic and operational data. | [ ] | Production HTTPS, database network restrictions, backup protection, secret management, and log safety require deployment-specific configuration and verification. |

## Deployment Security Notes

- Authentication and role-based authorization are implemented in the backend.
- The application uses `STAFF_USER`, `STAFF_PASSWORD`, `MANAGER_USER`, `MANAGER_PASSWORD`, and `AUTH_SECRET` for authentication configuration.
- The backend validates the authentication secret length and requires different usernames for staff and manager accounts.
- The Docker Compose configuration provides service healthchecks and persistent database storage.
- The current Docker configuration is intended for the project deployment environment. Additional production security controls, including HTTPS termination, network restrictions, backup policies, and secret management, must be configured before public production deployment.

The deployment operator is responsible for replacing all example credentials, protecting environment files, and verifying the security configuration of the target environment before deployment.