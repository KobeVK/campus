#!/bin/bash
# Create project directory
mkdir school-management-system
cd school-management-system

# Initialize git repository
git init

# Create frontend directory with Next.js
npx create-next-app@latest frontend --typescript --eslint --tailwind --app
cd frontend

# Add Hebrew language support
npm install next-i18next

# Add charting library for student progress graphs
npm install recharts

# Add authentication library
npm install next-auth

# Create basic directory structure
mkdir -p app/components/auth
mkdir -p app/components/dashboard
mkdir -p app/components/calendar
mkdir -p app/components/students
mkdir -p app/components/grades
mkdir -p app/components/public

# Return to root directory
cd ..

# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install backend dependencies
npm install express mongoose jsonwebtoken cors helmet dotenv bcrypt

# Initialize TypeScript
npm install typescript @types/node @types/express ts-node-dev --save-dev
npx tsc --init

# Create basic directory structure
mkdir -p src/controllers
mkdir -p src/models
mkdir -p src/routes
mkdir -p src/middleware
mkdir -p src/config

# Return to root directory
cd ..

# Create Docker files for local development
touch docker-compose.yml
touch frontend/Dockerfile
touch backend/Dockerfile

# Create Kubernetes deployment files for future EKS deployment
mkdir k8s
touch k8s/frontend-deployment.yaml
touch k8s/backend-deployment.yaml
touch k8s/postgres-deployment.yaml
touch k8s/ingress.yaml

# Create .gitignore file
echo "node_modules
.env
.next
dist
build
.DS_Store" > .gitignore

# Create README.md
echo "# School Management System

A web application for managing a private school, including student records, teacher scheduling, and grade tracking.

## Features

- Informational public website in Hebrew
- Secure teacher login portal
- Class scheduling and calendar management
- Student grade tracking with progress visualization
- Attendance tracking for teachers

## Development

### Local Setup

\`\`\`
docker-compose up
\`\`\`

### Deployment to EKS

See \`/k8s\` directory for Kubernetes configuration files.
" > README.md

echo "Setup complete! Next steps:
1. Configure Docker Compose for local development
2. Create the initial React components
3. Set up the Express API routes
4. Configure the PostgreSQL database schema"