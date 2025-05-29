import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import your main school website component (from your existing src/app.js)
import SchoolWebsiteComponent from './App'; // Assuming 'src/app.js' contains your SchoolWebsite
import TeacherLogin from './TeacherLogin';
import StudentLogin from './StudentLogin';
import './index.css'; // Ensure src/index.css exists

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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SchoolWebsiteComponent />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
      </Routes>
    </Router>
  );
}

export default App;