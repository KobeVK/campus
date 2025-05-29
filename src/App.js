import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import your main school website component (from your existing src/app.js)
import SchoolWebsiteComponent from './app'; // Correctly importing from your src/app.js
import TeacherLogin from './TeacherLogin';
import StudentLogin from './StudentLogin';
import './index.css'; // Assuming your Tailwind styles are imported here or in public/index.html

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if the path does not contain an anchor link
    if (!pathname.includes('#')) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Handles scrolling to top on page navigation */}
      <Routes>
        {/* Route for the main school website page */}
        <Route path="/" element={<SchoolWebsiteComponent />} />

        {/* Route for Teacher Login page */}
        <Route path="/teacher-login" element={<TeacherLogin />} />

        {/* Route for Student Login page */}
        <Route path="/student-login" element={<StudentLogin />} />

        {/* You can add a 404 Not Found route here if you like */}
        {/* <Route path="*" element={<div>Page Not Found</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;