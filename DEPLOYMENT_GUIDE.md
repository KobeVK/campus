# Campus School Management System - Deployment Guide

## 🚀 Quick Setup Guide

### 1. Backend Bcrypt Fix

**Problem**: bcrypt native binary compatibility error
```
Error: Error loading shared library /app/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node: Exec format error
```

**Local Solution**: Rebuild bcrypt for current environment
```bash
cd backend
npm rebuild bcrypt
```

**Rebuild Docker Image**:
```bash
# Option 1: Use the rebuild script (recommended)
./rebuild-backend.sh

# Option 2: Manual rebuild
# Build for ARM64 (Apple Silicon)
docker build -f Dockerfile.backend -t campus0507.jfrtpt.org/docker/campus-backend:latest-arm64 .

# Build for AMD64 (Intel)
docker build --platform linux/amd64 -f Dockerfile.backend -t campus0507.jfrtpt.org/docker/campus-backend:latest-amd64 .

# Push to registry
docker push campus0507.jfrtpt.org/docker/campus-backend:latest-arm64
docker push campus0507.jfrtpt.org/docker/campus-backend:latest-amd64
```

### 2. Database Setup (Already Applied ✅)

**Database**: `campus` on PostgreSQL
**Connection**: 127.0.0.1:11127 (via StrongDM tunnel)

#### Tables Created:
- `teachers` - Teacher accounts and info
- `classes` - Class information  
- `students` - Student details
- `student_logins` - Student credentials

#### Setup Commands:
```bash
# Create database
psql -h 127.0.0.1 -p 11127 -U campus_admin -d postgres -c "CREATE DATABASE campus;"

# Run setup script
psql -h 127.0.0.1 -p 11127 -U campus_admin -d campus -f setup_db.sql
```

### 3. Local Development

#### Start Backend:
```bash
cd backend
npm start
```
**Result**: Server runs on http://localhost:3001

#### Start Frontend:
```bash
npm start
```
**Result**: React app runs on http://localhost:3000

### 4. Kubernetes Deployment (Helm)

#### Prerequisites:
- Kubernetes cluster
- Helm installed
- JFrog registry access

#### Deploy:
```bash
# 1. Rebuild Docker image with bcrypt fix
docker build -f Dockerfile.backend -t campus0507.jfrtpt.org/docker/campus-backend:latest-arm64 .
docker push campus0507.jfrtpt.org/docker/campus-backend:latest-arm64

# 2. Navigate to helm directory
cd helm

# 3. Deploy to cluster
helm install campus-school . -f values.yaml

# Or upgrade existing deployment
helm upgrade campus-school . -f values.yaml
```

#### Configuration (values.yaml):
- **Backend Image**: `campus0507.jfrtpt.org/docker/campus-backend:latest-arm64`
- **Frontend Image**: `campus0507.jfrtpt.org/docker/campus:latest-arm64`
- **Database**: AWS RDS PostgreSQL
- **Ingress**: Nginx with Let's Encrypt SSL

#### Environment Variables (Backend):
```yaml
DB_HOST: rds-campus0507.czkduehwi9ml.eu-central-1.rds.amazonaws.com
DB_PORT: 5432
DB_NAME: campus
DB_USER: campus_admin
DB_PASSWORD: school_password_2025
```

### 5. Health Checks

#### Backend Health:
```bash
curl http://localhost:3001/health
```

#### Database Connection:
```bash
psql -h 127.0.0.1 -p 11127 -U campus_admin -d campus -c "SELECT NOW();"
```

### 6. Troubleshooting

#### Bcrypt Issues:
```bash
# Rebuild native dependencies
cd backend
npm rebuild bcrypt

# Or clean install
rm -rf node_modules package-lock.json
npm install
```

#### Database Issues:
```bash
# Check connection
psql -h 127.0.0.1 -p 11127 -U campus_admin -d campus

# List tables
\dt

# Check table counts
SELECT 'teachers' as table, COUNT(*) FROM teachers
UNION ALL SELECT 'classes', COUNT(*) FROM classes
UNION ALL SELECT 'students', COUNT(*) FROM students
UNION ALL SELECT 'student_logins', COUNT(*) FROM student_logins;
```

### 7. Next Steps

1. **Create Admin User**: Run `node create_admin.js` in backend
2. **Add Sample Data**: Use API endpoints to add teachers/classes
3. **Test Authentication**: Login with admin credentials
4. **Monitor Logs**: Check application and database logs

---
**Status**: ✅ Backend Fixed | ✅ Database Configured | ✅ Ready for Deployment 