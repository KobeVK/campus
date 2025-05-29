import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react'; // Optional: for styling

const TeacherLogin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">כניסת מורים</h1>
        <p className="text-gray-600 mb-8">
          אנא הכניסו את פרטי ההתחברות שלכם.
        </p>
        {/* Placeholder for login form */}
        <form className="space-y-6">
          <div>
            <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700 text-right mb-1">
              אימייל
            </label>
            <input
              type="email"
              id="teacher-email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="teacher@example.com"
            />
          </div>
          <div>
            <label htmlFor="teacher-password" className="block text-sm font-medium text-gray-700 text-right mb-1">
              סיסמה
            </label>
            <input
              type="password"
              id="teacher-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            onClick={(e) => { e.preventDefault(); alert('לוגיקת התחברות מורים תטופל כאן'); }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            התחברות
          </button>
        </form>
        <Link to="/" className="block mt-8 text-blue-600 hover:underline">
          חזרה לאתר הראשי
        </Link>
      </div>
    </div>
  );
};

export default TeacherLogin;