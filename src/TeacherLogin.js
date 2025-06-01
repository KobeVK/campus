import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, GraduationCap, Settings, BarChart3, Plus, User, School, ChevronRight, Eye, EyeOff, Clock, TrendingUp } from 'lucide-react';

// Mock authentication service - Replace with real API calls
const authService = {
  login: async (username, password, userType) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === 'admin' && password === 'admin123') {
      return {
        success: true,
        user: { id: 1, username: 'admin', name: 'מנהל המערכת', type: 'admin' },
        token: 'admin-token-123'
      };
    } else if (username === 'teacher' && password === 'teacher123') {
      return {
        success: true,
        user: { id: 2, username: 'teacher', name: 'שרה כהן', type: 'teacher' },
        token: 'teacher-token-123'
      };
    }
    throw new Error('שם משתמש או סיסמה שגויים');
  }
};

// Login Component
function LoginPage({ onLogin }) {
  const [loginType, setLoginType] = useState('teacher'); // 'admin' or 'teacher'
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      setError('נא למלא את כל השדות');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.login(credentials.username, credentials.password, loginType);
      onLogin(result.user, result.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">מערכת ניהול בית ספר</h1>
          <p className="text-gray-600">היכנס למערכת כדי להמשיך</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setLoginType('teacher')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === 'teacher'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            כניסת מורים
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === 'admin'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-700 hover:text-purple-600'
            }`}
          >
            כניסת מנהלים
          </button>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              שם משתמש
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="הכנס שם משתמש"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="הכנס סיסמה"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              loginType === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'}`}
          >
            {isLoading ? 'מתחבר...' : 'התחבר'}
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
          <h4 className="font-medium text-gray-800 mb-2">נתוני התחברות לדוגמה:</h4>
          <div className="space-y-1 text-gray-600">
            <div><strong>מנהל:</strong> admin / admin123</div>
            <div><strong>מורה:</strong> teacher / teacher123</div>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← חזרה לאתר הראשי
          </a>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard({ user, authToken, onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'add-teacher', etc.

  const menuItems = [
    { id: 'overview', label: 'סקירה כללית', icon: BarChart3 },
    { id: 'teachers', label: 'ניהול מורים', icon: Users },
    { id: 'schools', label: 'ניהול בתי ספר', icon: School },
    { id: 'classes', label: 'ניהול כיתות', icon: GraduationCap },
    { id: 'students', label: 'ניהול תלמידים', icon: User },
    { id: 'settings', label: 'הגדרות', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="mr-4">
                <h1 className="text-xl font-bold text-gray-900">פאנל ניהול</h1>
                <p className="text-sm text-gray-600">שלום, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-sm p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setCurrentView('main'); // Reset to main view when switching sections
                    }}
                    className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-purple-100 text-purple-700 border-r-4 border-purple-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 ml-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {currentView === 'add-teacher' && <AddTeacher authToken={authToken} onBack={() => setCurrentView('main')} />}
            {currentView === 'main' && (
              <>
                {activeSection === 'overview' && <AdminOverview />}
                {activeSection === 'teachers' && <TeachersManagement onAddTeacher={() => setCurrentView('add-teacher')} />}
                {activeSection === 'schools' && <SchoolsManagement />}
                {activeSection === 'classes' && <ClassesManagement />}
                {activeSection === 'students' && <StudentsManagement />}
                {activeSection === 'settings' && <AdminSettings />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Teacher Dashboard Component
function TeacherDashboard({ user, authToken, onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedClass, setSelectedClass] = useState(null);

  const menuItems = [
    { id: 'overview', label: 'סקירה כללית', icon: BarChart3 },
    { id: 'classes', label: 'הכיתות שלי', icon: GraduationCap },
    { id: 'schedule', label: 'מערכת שעות', icon: Calendar },
    { id: 'exams', label: 'בחינות', icon: BookOpen },
    { id: 'grades', label: 'ציונים', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="mr-4">
                <h1 className="text-xl font-bold text-gray-900">פאנל מורה</h1>
                <p className="text-sm text-gray-600">שלום, {user.name}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-xl shadow-sm p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-right rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 ml-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeSection === 'overview' && <TeacherOverview />}
            {activeSection === 'classes' && <TeacherClasses onSelectClass={setSelectedClass} />}
            {activeSection === 'schedule' && <TeacherSchedule />}
            {activeSection === 'exams' && <TeacherExams />}
            {activeSection === 'grades' && <TeacherGrades />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Components
function AddTeacher({ authToken, onBack }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    profession: '',
    experience: '',
    education: '',
    subjects: [],
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    startDate: '',
    salary: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const professions = [
    'מתמטיקה', 'אנגלית', 'פיזיקה', 'כימיה', 'ביולוגיה',
    'היסטוריה', 'גאוגרפיה', 'ספרות', 'תנ"ך', 'אמנות',
    'מוסיקה', 'חינוך גשמי', 'מדעי המחשב', 'אחר'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.username) {
      setError('נא למלא את כל השדות החובה');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('נא להכניס כתובת אימייל תקינה');
      return false;
    }

    if (formData.password && formData.password.length < 6) {
      setError('סיסמה חייבת להכיל לפחות 6 תווים');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Teacher data to submit:', formData);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        onBack();
      }, 2000);

    } catch (err) {
      setError('שגיאה בשמירת המורה. אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="ml-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">הוסף מורה חדש</h2>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          המורה נוסף בהצלחה! מעביר חזרה לרשימה...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">פרטים אישיים</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם פרטי <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="הכנס שם פרטי"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם משפחה <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="הכנס שם משפחה"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אימייל <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="teacher@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טלפון
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="050-1234567"
                />
              </div>
            </div>
          </div>

          {/* Login Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">פרטי התחברות</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם משתמש <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="הכנס שם משתמש ייחודי"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  סיסמה זמנית
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="יש להכניס סיסמה זמנית"
                />
                <p className="text-xs text-gray-500 mt-1">המורה יתבקש לשנות את הסיסמה בכניסה הראשונה</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">פרטים מקצועיים</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מקצוע עיקרי
                </label>
                <select
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">בחר מקצוע</option>
                  {professions.map(prof => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שנות ניסיון
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="מספר שנות הניסיון"
                  min="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  השכלה
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="תואר ומוסד לימודים"
                />
              </div>
            </div>

            {/* Subjects */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                מקצועות הוראה
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {professions.slice(0, -1).map(subject => (
                  <label key={subject} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                      className="ml-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">מידע נוסף</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  כתובת
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="כתובת מגורים"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  תאריך תחילת עבודה
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  איש קשר לחירום
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="שם איש קשר"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טלפון חירום
                </label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="050-1234567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הערות
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="הערות נוספות..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'שומר...' : 'שמור מורה'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">סקירה כללית</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">סה"כ מורים</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">סה"כ כיתות</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">סה"כ תלמידים</p>
              <p className="text-2xl font-bold text-gray-900">542</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <School className="w-6 h-6 text-orange-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">בתי ספר</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeachersManagement({ onAddTeacher }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ניהול מורים</h2>
        <button 
          onClick={onAddTeacher}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 ml-2" />
          הוסף מורה
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <input
            type="text"
            placeholder="חפש מורה..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="p-6">
          <p className="text-gray-600">רשימת המורים תוצג כאן...</p>
        </div>
      </div>
    </div>
  );
}

function SchoolsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ניהול בתי ספר</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 ml-2" />
          הוסף בית ספר
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">רשימת בתי הספר תוצג כאן...</p>
      </div>
    </div>
  );
}

function ClassesManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ניהול כיתות</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 ml-2" />
          הוסף כיתה
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">רשימת הכיתות תוצג כאן...</p>
      </div>
    </div>
  );
}

function StudentsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ניהול תלמידים</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 ml-2" />
          הוסף תלמיד
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">רשימת התלמידים תוצג כאן...</p>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">הגדרות מערכת</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">הגדרות המערכת יוצגו כאן...</p>
      </div>
    </div>
  );
}

// Teacher Components
function TeacherOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">סקירה כללית</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">הכיתות שלי</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">סה"כ תלמידים</p>
              <p className="text-2xl font-bold text-gray-900">127</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">שיעורים השבוע</p>
              <p className="text-2xl font-bold text-gray-900">16</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">בחינות קרובות</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">מתמטיקה - כיתה ח'1</p>
              <p className="text-sm text-gray-600">בחינת חזרה על חטיבות</p>
            </div>
            <span className="text-blue-600 font-medium">15/06/2025</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">מתמטיקה - כיתה ט'2</p>
              <p className="text-sm text-gray-600">מבחן רבעוני</p>
            </div>
            <span className="text-green-600 font-medium">18/06/2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeacherClasses({ onSelectClass }) {
  const classes = [
    { id: 1, name: 'כיתה ח\'1', school: 'בית ספר הקמפוס הצעיר', students: 32, subject: 'מתמטיקה' },
    { id: 2, name: 'כיתה ח\'2', school: 'בית ספר הקמפוס הצעיר', students: 28, subject: 'מתמטיקה' },
    { id: 3, name: 'כיתה ט\'1', school: 'בית ספר הקמפוס הצעיר', students: 30, subject: 'מתמטיקה' },
    { id: 4, name: 'כיתה ט\'2', school: 'בית ספר הקמפוס הצעיר', students: 27, subject: 'מתמטיקה' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">הכיתות שלי</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {classItem.subject}
              </span>
            </div>
            
            <p className="text-gray-600 mb-2">{classItem.school}</p>
            <p className="text-sm text-gray-500 mb-4">{classItem.students} תלמידים</p>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onSelectClass(classItem)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              >
                צפה בתלמידים
                <ChevronRight className="w-4 h-4 mr-2" />
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                שיעורי עזר
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeacherSchedule() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">מערכת השעות שלי</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">מערכת השעות תוצג כאן...</p>
      </div>
    </div>
  );
}

function TeacherExams() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ניהול בחינות</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Plus className="w-4 h-4 ml-2" />
          הוסף בחינה
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">רשימת הבחינות תוצג כאן...</p>
      </div>
    </div>
  );
}

function TeacherGrades() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">ניהול ציונים</h2>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">מערכת הציונים תוצג כאן...</p>
      </div>
    </div>
  );
}

// Main App Component
function TeacherLogin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  // Check for existing session on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.type === 'admin') {
    return <AdminDashboard user={currentUser} authToken={authToken} onLogout={handleLogout} />;
  }

  if (currentUser.type === 'teacher') {
    return <TeacherDashboard user={currentUser} authToken={authToken} onLogout={handleLogout} />;
  }

  return null;
}

export default TeacherLogin;