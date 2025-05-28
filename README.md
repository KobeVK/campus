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