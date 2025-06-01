#!/bin/bash

# Comprehensive Frontend Fix Script
set -e

echo "🔧 Comprehensive Frontend Fix"
echo "============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}➤ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step "1. Cleaning up conflicting files..."
# Remove any lowercase app.js file that might exist
if [ -f "src/app.js" ]; then
    print_warning "Found conflicting src/app.js - removing it"
    rm "src/app.js"
    print_success "Removed src/app.js"
fi

# Clean up any other potential conflicts
find src/ -name "*.js" -exec basename {} \; | sort | uniq -d | while read duplicate; do
    print_warning "Found duplicate filename: $duplicate"
done

print_step "2. Fixing all source files..."

# Fix src/index.js
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
print_success "Fixed src/index.js"

# Ensure src/index.css is properly set up
cat > src/index.css << 'EOF'
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  direction: rtl;
  text-align: right;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}

/* Animation for fade-in effect */
.animate-fade-in {
  animation: fadeIn 1.5s ease-in-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
EOF
print_success "Fixed src/index.css"

# Create the corrected App.js without any problematic imports
cat > src/App.js << 'EOF'
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TeacherLogin from './TeacherLogin';
import StudentLogin from './StudentLogin';
import './index.css';

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!pathname.includes('#')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

// Main School Website Component
function SchoolWebsite() {
  const handleTeacherLogin = () => {
    window.location.href = '/teacher-login';
  };

  const handleStudentLogin = () => {
    window.location.href = '/student-login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{fontFamily: 'Inter, sans-serif'}}>
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600">🏫</div>
              <h1 className="mr-4 text-2xl font-bold text-gray-900">הקמפוס הצעיר</h1>
            </div>
            
            {/* Login Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleTeacherLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                כניסת מורים
              </button>
              <button
                onClick={handleStudentLogin}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                כניסת תלמידים
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
            ברוכים הבאים להקמפוס הצעיר 
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            מובילים בחינוך איכותי, בונים עתיד מזהיר לתלמידינו
          </p>
          
          {/* Login Section for Mobile */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:hidden">
            <button
              onClick={handleTeacherLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 text-lg"
            >
              כניסת מורים
            </button>
            <button
              onClick={handleStudentLogin}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 text-lg"
            >
              כניסת תלמידים
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">למה לבחור בנו?</h3>
            <p className="text-lg text-gray-600">אנחנו מציעים חוויית לימוד מעוררת השראה ומתקדמת</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📚</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">חינוך איכותי</h4>
              <p className="text-gray-600">תוכניות לימוד מתקדמות המותאמות לכל תלמיד</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">צוות מקצועי</h4>
              <p className="text-gray-600">מורים מנוסים ומסורים לחינוך הדור הבא</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🌟</div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">הישגים מרשימים</h4>
              <p className="text-gray-600">תוצאות לימודים מעולות ושביעות רצון גבוהה</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; כל הזכויות שמורות להקמפוס הצעיר 2025</p>
        </div>
      </footer>
    </div>
  );
}

// Main App component with routing
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SchoolWebsite />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
EOF
print_success "Fixed src/App.js"

print_step "3. Cleaning package.json..."
cat > package.json << 'EOF'
{
  "name": "school-website",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1",
    "react-router-dom": "^6.22.0",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "serve": "npx serve -s build -l 3000"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF
print_success "Cleaned package.json"

print_step "4. Complete cleanup..."
# Remove node_modules and package-lock.json to force fresh install
rm -rf node_modules/
rm -f package-lock.json
rm -rf build/
print_success "Cleaned node_modules and build artifacts"

print_step "5. Fresh install..."
npm install
print_success "Fresh dependencies installed"

print_step "6. Testing build..."
if npm run build; then
    print_success "Build successful!"
else
    print_error "Build failed!"
    exit 1
fi

print_step "7. Testing Docker build..."
if docker build -f Dockerfile.frontend -t test-frontend . --no-cache; then
    print_success "Docker build successful!"
    docker rmi test-frontend --force >/dev/null 2>&1
else
    print_error "Docker build failed!"
    print_warning "Trying to see detailed error..."
    docker build -f Dockerfile.frontend -t test-frontend . --no-cache
    exit 1
fi

print_step "8. Final verification..."
echo "Checking file structure:"
ls -la src/
echo ""
echo "Checking for case conflicts:"
find src/ -name "*.js" | sort
echo ""

print_success "🎉 ALL ISSUES FIXED!"
echo ""
echo "📋 Summary of fixes:"
echo "✅ Removed case-sensitive file conflicts"
echo "✅ Fixed import statements" 
echo "✅ Cleaned package.json"
echo "✅ Fresh dependency install"
echo "✅ Build working locally"
echo "✅ Docker build working"
echo ""
echo "🚀 Ready to deploy:"
echo "   docker build -f Dockerfile.frontend -t campus:latest-arm64 ."
echo "   docker tag campus:latest-arm64 campus2.jfrtpt.org/docker/campus:latest-arm64"
echo "   docker push campus2.jfrtpt.org/docker/campus:latest-arm64"
echo "   kubectl rollout restart deployment/campus-website-frontend -n campus"
echo ""
echo "🔍 To test locally first:"
echo "   npm start"