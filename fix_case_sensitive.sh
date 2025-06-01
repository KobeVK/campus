#!/bin/bash

# Fix case sensitivity and file conflicts
echo "🔧 Fixing case sensitivity issues..."

# Check if src/app.js exists (lowercase)
if [ -f "src/app.js" ]; then
    echo "❌ Found src/app.js - removing it..."
    rm "src/app.js"
    echo "✅ Removed src/app.js"
else
    echo "✅ No conflicting src/app.js found"
fi

# Fix src/App.js - remove the bad import
echo "🔧 Fixing src/App.js imports..."

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
            ברוכים הבאים לקמפוס הצעיר
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
          <p>&copy; כל הזכויות שמורות לקמפוס הצעיר</p>
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

echo "✅ Fixed src/App.js"

# Clean up build directory
echo "🧹 Cleaning build directory..."
rm -rf build/
rm -rf node_modules/.cache/
echo "✅ Cleaned build directory"

# Test build again
echo "🔨 Testing build..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build still failing"
    exit 1
fi

# Test Docker build
echo "🐳 Testing Docker build..."
if docker build -f Dockerfile.frontend -t test-frontend . --quiet; then
    echo "✅ Docker build successful!"
    docker rmi test-frontend --force >/dev/null 2>&1
else
    echo "❌ Docker build still failing"
    echo "Let's check the exact error:"
    docker build -f Dockerfile.frontend -t test-frontend .
    exit 1
fi

echo ""
echo "🎉 All issues fixed!"
echo "✅ Case sensitivity resolved"
echo "✅ Build working"
echo "✅ Docker build working"
echo ""
echo "🚀 Ready to deploy:"
echo "   docker build -f Dockerfile.frontend -t campus:latest-arm64 ."
echo "   docker tag campus:latest-arm64 campus2.jfrtpt.org/docker/campus:latest-arm64"
echo "   docker push campus2.jfrtpt.org/docker/campus:latest-arm64"
echo "   kubectl rollout restart deployment/campus-website-frontend -n campus"