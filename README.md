# בית ספר הר המורה - School Website

A modern, responsive school website built with React and designed for Hebrew (RTL) content.

## 🚀 Features

- **Modern Design**: Clean, professional design with gradient backgrounds and smooth animations
- **RTL Support**: Full right-to-left support for Hebrew content
- **Responsive**: Mobile-first design that works on all devices
- **Interactive**: Smooth scrolling, hover effects, and modern UI components
- **Accessible**: Semantic HTML and proper contrast ratios

## 🛠 Tech Stack

- **Frontend**: React.js 18
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **Deployment**: Docker + Kubernetes with Helm charts
- **Web Server**: Nginx

## 📁 Project Structure

```
├── public/
│   └── index.html          # Main HTML template with RTL support
├── src/
│   ├── App.js              # Main React component
│   └── index.js            # React entry point
├── helm/                   # Kubernetes Helm charts
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
├── Dockerfile              # Multi-stage Docker build
├── nginx.conf              # Nginx configuration
└── package.json            # Dependencies and scripts
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve built files locally
npm run serve
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t school-website:latest .
```

### Run with Docker
```bash
docker run -p 3000:80 school-website:latest
```

## ☸️ Kubernetes Deployment

### Using Helm (Recommended)
```bash
# Install
helm install school-website ./helm

# Upgrade
helm upgrade school-website ./helm

# Uninstall
helm uninstall school-website
```

### Configuration
Edit `helm/values.yaml` to customize:
- Domain name (`ingress.hosts`)
- Resource limits
- SSL certificates
- Scaling settings

## 🌐 Features Overview

### Sections
1. **Header**: Navigation with mobile menu
2. **Hero**: Main introduction with call-to-action buttons
3. **Stats**: Key numbers and achievements
4. **About**: School philosophy and values
5. **Programs**: Academic programs and courses
6. **Achievements**: Awards and recognition
7. **Contact**: Contact information and form
8. **Footer**: Additional links and social media

### Key Components
- Responsive navigation with mobile hamburger menu
- Animated statistics counters
- Interactive program cards
- Contact form with validation
- Social media integration
- Smooth scrolling between sections

## 🎨 Design Features

- **Color Scheme**: Blue and indigo gradients with white backgrounds
- **Typography**: Inter font family optimized for Hebrew
- **Animations**: Fade-in effects and hover interactions
- **Icons**: Consistent Lucide React icon set
- **Layout**: Grid-based responsive design

## 🔒 Security & Performance

- **HTTPS**: SSL/TLS termination via ingress
- **Caching**: Static asset caching with nginx
- **Gzip**: Compression enabled for faster loading
- **Health Checks**: Kubernetes liveness and readiness probes

## 📱 Mobile Responsiveness

- Mobile-first approach
- Collapsible navigation menu
- Touch-friendly buttons and forms
- Optimized text sizes and spacing
- Responsive grid layouts

## 🌍 Internationalization

- Full RTL (Right-to-Left) support
- Hebrew language content
- Proper text direction handling
- Culturally appropriate design elements

## 🚀 Deployment Options

1. **Local Development**: `npm start`
2. **Static Hosting**: Build and deploy `build/` folder
3. **Docker**: Containerized deployment with nginx
4. **Kubernetes**: Production-ready with Helm charts

## 📞 Support

For questions about the school website or technical issues:
- Email: info@campus.co.il
- Phone: 03-1234567

## 🏫 About campus School


# School Management System API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### Teacher Login
```http
POST /auth/teacher/login
Content-Type: application/json

{
  "username": "admin",
  "password": "pwd1234"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@school.local",
    "first_name": "Admin",
    "last_name": "User"
  },
  "userType": "teacher",
  "mustChangePassword": true
}
```

### Student Login
```http
POST /auth/student/login
Content-Type: application/json

{
  "username": "student123",
  "password": "student1234"
}
```

### Change Password
```http
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "pwd1234",
  "newPassword": "newpassword123"
}
```

### Verify Token
```http
GET /auth/verify
Authorization: Bearer <token>
```

## Teacher Endpoints

### Get Teacher Profile
```http
GET /teachers/profile
Authorization: Bearer <teacher-token>
```

### Update Teacher Profile
```http
PUT /teachers/profile
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "first_name": "שרה",
  "last_name": "כהן",
  "phone": "050-1234567",
  "email": "sarah.cohen@school.local"
}
```

### Get Teacher's Classes
```http
GET /teachers/classes
Authorization: Bearer <teacher-token>
```

### Get Teacher's Students
```http
GET /teachers/students?class_id=<optional-class-id>
Authorization: Bearer <teacher-token>
```

### Get Dashboard Statistics
```http
GET /teachers/dashboard
Authorization: Bearer <teacher-token>
```

## Class Management Endpoints

### Create Class
```http
POST /classes
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "class_name": "כיתה ז1",
  "school_name": "בית ספר הר המורה",
  "profession": "מתמטיקה",
  "grade_level": "כיתה ז",
  "academic_year": "2025",
  "max_students": 30,
  "description": "כיתת מתמטיקה מתקדמת"
}
```

### Get All Classes
```http
GET /classes
Authorization: Bearer <teacher-token>
```

### Get Single Class
```http
GET /classes/:id
Authorization: Bearer <teacher-token>
```

### Update Class
```http
PUT /classes/:id
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "class_name": "כיתה ז1 מעודכן",
  "profession": "מתמטיקה",
  // ... other fields
}
```

### Delete Class
```http
DELETE /classes/:id
Authorization: Bearer <teacher-token>
```

### Get Students in Class
```http
GET /classes/:id/students
Authorization: Bearer <teacher-token>
```

### Get Available Professions
```http
GET /classes/meta/professions
```

**Response:**
```json
[
  "מתמטיקה",
  "אנגלית",
  "פיזיקה",
  "כימיה",
  "ביולוגיה",
  "היסטוריה",
  "גאוגרפיה",
  "ספרות",
  "תנ\"ך",
  "אמנות",
  "מוסיקה",
  "חינוך גשמי",
  "מדעי המחשב"
]
```

## Student Management Endpoints

### Create Student
```http
POST /students
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "full_name": "יוסי כהן",
  "student_id": "12345",
  "date_of_birth": "2010-05-15",
  "address": "רחוב הרצל 123, תל אביב",
  "phone": "050-9876543",
  "email": "yossi.cohen@example.com",
  "parent_name": "דוד כהן",
  "parent_phone": "052-1234567",
  "parent_email": "david.cohen@example.com",
  "emergency_contact": "רחל כהן",
  "emergency_phone": "053-7654321",
  "siblings": "שרה כהן (כיתה ה)",
  "medical_notes": "אסטמה קלה",
  "class_id": "class-uuid-here"
}
```

### Get All Students
```http
GET /students?class_id=<optional>&search=<optional>
Authorization: Bearer <teacher-token>
```

### Get Single Student
```http
GET /students/:id
Authorization: Bearer <teacher-token>
```

### Update Student
```http
PUT /students/:id
Authorization: Bearer <teacher-token>
Content-Type: application/json
```

### Delete Student
```http
DELETE /students/:id
Authorization: Bearer <teacher-token>
```

### Create Student Login
```http
POST /students/:id/login
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "username": "yossi.cohen",
  "password": "student1234"
}
```

### Assign Student to Class
```http
PUT /students/:id/assign-class
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "class_id": "class-uuid-here"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "username",
      "message": "Username must be at least 3 characters"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Teacher access required"
}
```

### 404 Not Found
```json
{
  "error": "Student not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "timestamp": "2025-05-29T20:43:27.000Z"
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Returns 429 status code when exceeded

## Security Features
- JWT tokens with 24-hour expiration
- bcrypt password hashing with 12 salt rounds
- Helmet.js security headers
- CORS protection
- Input validation and sanitization
- SQL injection protection via parameterized queries

## Database Schema

### Teachers Table
```sql
- id (UUID, Primary Key)
- username (VARCHAR, Unique)
- email (VARCHAR, Unique)
- password_hash (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- phone (VARCHAR)
- must_change_password (BOOLEAN)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Classes Table
```sql
- id (UUID, Primary Key)
- teacher_id (UUID, Foreign Key)
- class_name (VARCHAR)
- school_name (VARCHAR)
- profession (VARCHAR)
- grade_level (VARCHAR)
- academic_year (VARCHAR)
- max_students (INTEGER)
- description (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Students Table
```sql
- id (UUID, Primary Key)
- class_id (UUID, Foreign Key)
- student_id (VARCHAR, Unique)
- full_name (VARCHAR)
- date_of_birth (DATE)
- address (TEXT)
- phone (VARCHAR)
- email (VARCHAR)
- parent_name (VARCHAR)
- parent_phone (VARCHAR)
- parent_email (VARCHAR)
- emergency_contact (VARCHAR)
- emergency_phone (VARCHAR)
- siblings (TEXT)
- medical_notes (TEXT)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Student Logins Table
```sql
- id (UUID, Primary Key)
- student_id (UUID, Foreign Key)
- username (VARCHAR, Unique)
- password_hash (VARCHAR)
- must_change_password (BOOLEAN)
- last_login (TIMESTAMP)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```


# Migration between RDS instances is actually simple:

# 1. Export from dev RDS
pg_dump -h dev-rds-endpoint -U school_user -d school_management > school_backup.sql

# 2. Import to prod RDS  
psql -h prod-rds-endpoint -U school_user -d school_management < school_backup.sql
# It's literally this simple:
pg_dump -h old-rds > backup.sql
psql -h new-rds < backup.sql
# Done!
# Done! Takes 5 minutes.

```
kubectl create secret docker-registry jfrog-secret \
  --docker-server= \
  --docker-username=admin \
  --docker-password=Omer1107 \
  --docker-email=admin@campus.local \
  -n campus
```