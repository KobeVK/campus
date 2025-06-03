import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, GraduationCap, Settings, BarChart3, Plus, User, School, ChevronRight, Eye, EyeOff, Clock, TrendingUp, Edit, Trash2, Search, Filter } from 'lucide-react';

// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

// API Service
const apiService = {
  // Authentication
  login: async (username, password, userType) => {
    const endpoint = userType === 'admin' ? '/auth/teacher/login' : '/auth/teacher/login';
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data;
  },

  // Teachers API
  getTeachers: async (authToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/teachers`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }

    return response.json();
  },

  createTeacher: async (teacherData, authToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/teacher/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create teacher');
    }

    return data;
  },

  updateTeacher: async (teacherId, teacherData, authToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/teachers/${teacherId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update teacher');
    }

    return data;
  },

  deleteTeacher: async (teacherId, authToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/teachers/${teacherId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete teacher');
    }

    return response.json();
  },

  // Dashboard stats
  getDashboardStats: async (authToken) => {
    const response = await fetch(`${API_BASE_URL}/teachers/dashboard`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return response.json();
  }
};

// Login Component
function LoginPage({ onLogin }) {
  const [loginType, setLoginType] = useState('teacher');
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
      const result = await apiService.login(credentials.username, credentials.password, loginType);
      onLogin(result.user, result.token, result.userType);
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
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'}`}
          >
            {isLoading ? 'מתחבר...' : 'התחבר'}
          </button>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
          <h4 className="font-medium text-gray-800 mb-2">נתוני התחברות לדוגמה:</h4>
          <div className="space-y-1 text-gray-600">
            <div><strong>מורה:</strong> admin / pwd1234</div>
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

// Teachers Management Component with Real API
function TeachersManagement({ authToken, onAddTeacher }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);






  

  const handleRefresh = () => fetchTeachers();
  window.addEventListener('refreshTeachers', handleRefresh);


  const fetchTeachers = async () => {
    try {
      setLoading(true);
      
      // Use real API instead of mock data
      const data = await apiService.getTeachers(authToken);
      
      // The backend returns { teachers: [...], pagination: {...} }
      // or just an array of teachers
      const teachersList = data.teachers || data;
      setTeachers(teachersList);
      
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('שגיאה בטעינת רשימת המורים: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await apiService.deleteTeacher(teacherId, authToken);
      setTeachers(teachers.filter(t => t.id !== teacherId));
      setShowDeleteModal(false);
      setSelectedTeacher(null);
    } catch (err) {
      setError('שגיאה במחיקת המורה: ' + err.message);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">ניהול מורים</h2>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען רשימת מורים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">ניהול מורים</h2>
        <button 
          onClick={onAddTeacher}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-4 h-4 ml-2" />
          הוסף מורה
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {/* Search and Filters */}
        <div className="p-6 border-b">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חפש מורה לפי שם, אימייל או שם משתמש..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="w-4 h-4 ml-2" />
              סינון
            </button>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  מורה
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פרטי קשר
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  שם משתמש
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תאריך הצטרפות
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {teacher.first_name} {teacher.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{teacher.email}</div>
                    <div className="text-sm text-gray-500">{teacher.phone || 'לא צוין'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {teacher.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(teacher.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      teacher.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {teacher.is_active ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
                        title="עריכה"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded"
                        title="מחיקה"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'לא נמצאו מורים התואמים לחיפוש' : 'אין מורים במערכת'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination would go here */}
        <div className="px-6 py-3 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              מציג {filteredTeachers.length} מורים
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">אשר מחיקה</h3>
            <p className="text-gray-600 mb-6">
              האם אתה בטוח שברצונך למחוק את המורה {selectedTeacher.first_name} {selectedTeacher.last_name}?
              פעולה זו לא ניתנת לביטול.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                onClick={() => handleDeleteTeacher(selectedTeacher.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Add Teacher Component with Real API
function AddTeacher({ authToken, onBack, onTeacherAdded }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.username) {
      setError('נא למלא את כל השדות החובה (שם פרטי, שם משפחה, אימייל, שם משתמש)');
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
      // Prepare data for API - only include fields that exist in backend
      const teacherData = {
        username: formData.username,
        email: formData.email,
        password: formData.password || 'teacher1234', // Default password if none provided
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone
      };

      const result = await apiService.createTeacher(teacherData, authToken);
      
      setSuccess(true);
      
      // Call callback to refresh teachers list
      if (onTeacherAdded) {
        onTeacherAdded(result.teacher);
      }
      
      // Reset form and go back after success
      setTimeout(() => {
        setSuccess(false);
        onBack();
      }, 2000);

    } catch (err) {
      setError('שגיאה ביצירת המורה: ' + err.message);
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
        <form onSubmit={handleSubmit} className="space-y-8">
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
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="הכנס שם פרטי"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  שם משפחה <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="הכנס שם משפחה"
                  required
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
                  required
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
                  required
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
                  placeholder="יש להכניס סיסמה זמנית (או יוגדר teacher1234)"
                />
                <p className="text-xs text-gray-500 mt-1">המורה יתבקש לשנות את הסיסמה בכניסה הראשונה</p>
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
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'שומר...' : 'שמור מורה'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard({ user, authToken, onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentView, setCurrentView] = useState('main');

  const menuItems = [
    { id: 'overview', label: 'סקירה כללית', icon: BarChart3 },
    { id: 'teachers', label: 'ניהול מורים', icon: Users },
    { id: 'schools', label: 'ניהול בתי ספר', icon: School },
    { id: 'classes', label: 'ניהול כיתות', icon: GraduationCap },
    { id: 'students', label: 'ניהול תלמידים', icon: User },
    { id: 'settings', label: 'הגדרות', icon: Settings }
  ];

  const handleTeacherAdded = (newTeacher) => {
    // Force refresh of teachers list
    setCurrentView('main');
    // Trigger a re-fetch when going back to teachers management
    window.dispatchEvent(new CustomEvent('refreshTeachers'));
  };

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
                <p className="text-sm text-gray-600">שלום, {user.first_name} {user.last_name}</p>
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
                      setCurrentView('main');
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
            {currentView === 'add-teacher' && (
              <AddTeacher 
                authToken={authToken} 
                onBack={() => setCurrentView('main')} 
                onTeacherAdded={handleTeacherAdded}
              />
            )}
            {currentView === 'main' && (
              <>
                {activeSection === 'overview' && <AdminOverview authToken={authToken} />}
                {activeSection === 'teachers' && (
                  <TeachersManagement 
                    authToken={authToken}
                    onAddTeacher={() => setCurrentView('add-teacher')} 
                  />
                )}
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

// Enhanced Admin Overview with Real Data
function AdminOverview({ authToken }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // For now using mock data since we don't have the stats endpoint
        // In real implementation: const data = await apiService.getDashboardStats(authToken);
        const mockStats = {
          totalTeachers: 12,
          totalClasses: 18,
          totalStudents: 542,
          totalSchools: 3
        };
        setStats(mockStats);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authToken]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">סקירה כללית</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-gray-900">{stats?.totalTeachers || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.totalClasses || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.totalStudents || 0}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats?.totalSchools || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Other placeholder components
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

// Main App Component
function TeacherLogin() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [userType, setUserType] = useState(null);

  const handleLogin = (user, token, type) => {
    setCurrentUser(user);
    setAuthToken(token);
    setUserType(type);
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userType', type);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    setUserType(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  // Check for existing session on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedToken && savedUser && savedUserType) {
      setAuthToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
  }, []);

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // For now, treat all logged in users as admins since we have admin functionality
  return <AdminDashboard user={currentUser} authToken={authToken} onLogout={handleLogout} />;
}

export default TeacherLogin;