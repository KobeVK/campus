#!/bin/bash

# Fix missing CSS files for React build
echo "🔧 Creating missing CSS files..."

# Create src/index.css (basic styles)
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
EOF

# Update src/index.js to import the CSS
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SchoolWebsite from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SchoolWebsite />
  </React.StrictMode>
);
EOF

echo "✅ Created src/index.css"
echo "✅ Updated src/index.js to import CSS"

# Check if App.js exists and has content
if [ ! -s "src/App.js" ]; then
    echo "⚠️  src/App.js is empty or missing! Creating basic App.js with login buttons..."
    
    cat > src/App.js << 'EOF'
import React from 'react';

function SchoolWebsite() {
  const handleTeacherLogin = () => {
    alert('כניסת מורים - בקרוב יהיה זמין!');
  };

  const handleStudentLogin = () => {
    alert('כניסת תלמידים - בקרוב יהיה זמין!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{fontFamily: 'Inter, sans-serif'}}>
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600">🏫</div>
              <h1 className="mr-4 text-2xl font-bold text-gray-900">בית ספר הר המורה</h1>
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
            ברוכים הבאים לבית ספר הר המורה
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
          <p>&copy; 2025 בית ספר הר המורה. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}

export default SchoolWebsite;
EOF
    
    echo "✅ Created src/App.js with login buttons"
fi

echo ""
echo "🚀 Files are ready! Now try building again:"
echo "docker build -f Dockerfile.frontend -t campus:latest-arm64 ."