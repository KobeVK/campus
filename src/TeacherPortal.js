import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users, GraduationCap, School, User } from 'lucide-react';

const YEARS = [2025, 2026];

function TeacherPortal({ user, authToken, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Schools state
  const [schools, setSchools] = useState([]);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showEditSchool, setShowEditSchool] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [newSchool, setNewSchool] = useState({ name: '', address: '', phone: '', email: '', website: '' });
  const [schoolError, setSchoolError] = useState('');

  // Classes state
  const [classes, setClasses] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showEditClass, setShowEditClass] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({ 
    class_name: '', 
    school_name: '', 
    school_id: '',
    profession: 'מתמטיקה', 
    grade_level: '', 
    academic_year: selectedYear.toString(),
    max_students: 30,
    description: ''
  });
  const [classError, setClassError] = useState('');

  // Students state
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showEditStudent, setShowEditStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ 
    full_name: '', 
    student_id: '', 
    date_of_birth: '',
    address: '',
    phone: '',
    email: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    emergency_contact: '',
    emergency_phone: '',
    siblings: '',
    medical_notes: '',
    class_id: null
  });
  const [studentError, setStudentError] = useState('');

  // Available professions for classes
  const professions = [
    'מתמטיקה', 'אנגלית', 'פיזיקה', 'כימיה', 'ביולוגיה',
    'היסטוריה', 'גאוגרפיה', 'ספרות', 'תנ"ך', 'אמנות',
    'מוסיקה', 'חינוך גשמי', 'מדעי המחשב'
  ];

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'schools') {
      fetchSchools();
    } else if (activeTab === 'classes') {
      fetchClasses();
      fetchSchools(); // Also fetch schools for the dropdown
    } else if (activeTab === 'students') {
      fetchStudents();
      fetchClasses(); // Also fetch classes for the dropdown
    } else if (activeTab === 'overview') {
      fetchSchools();
      fetchClasses();
      fetchStudents();
    }
  }, [activeTab, selectedYear]);

  // API Functions
  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      setSchools(data.schools || []);
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError('שגיאה בטעינת בתי ספר');
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/classes', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      setClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('שגיאה בטעינת כיתות');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('שגיאה בטעינת תלמידים');
    } finally {
      setLoading(false);
    }
  };

  // School handlers
  const handleAddSchool = async (e) => {
    e.preventDefault();
    setSchoolError('');
    if (!newSchool.name) {
      setSchoolError('שם בית הספר הוא שדה חובה');
      return;
    }
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchool),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בהוספת בית ספר');
      }
      setShowAddSchool(false);
      setNewSchool({ name: '', address: '', phone: '', email: '', website: '' });
      fetchSchools();
    } catch (err) {
      setSchoolError(err.message);
    }
  };

  const handleEditSchool = async (e) => {
    e.preventDefault();
    setSchoolError('');
    try {
      const response = await fetch(`/api/schools/${editingSchool.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingSchool),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בעדכון בית ספר');
      }
      setShowEditSchool(false);
      setEditingSchool(null);
      fetchSchools();
    } catch (err) {
      setSchoolError(err.message);
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את בית הספר?')) return;
    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה במחיקת בית ספר');
      }
      fetchSchools();
    } catch (err) {
      alert(err.message);
    }
  };

  // Class handlers
  const handleAddClass = async (e) => {
    e.preventDefault();
    setClassError('');
    if (!newClass.class_name || !newClass.school_name || !newClass.profession) {
      setClassError('נא למלא את כל השדות החובה');
      return;
    }
    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClass),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בהוספת כיתה');
      }
      setShowAddClass(false);
      setNewClass({ 
        class_name: '', 
        school_name: '', 
        school_id: '',
        profession: 'מתמטיקה', 
        grade_level: '', 
        academic_year: selectedYear.toString(),
        max_students: 30,
        description: ''
      });
      fetchClasses();
    } catch (err) {
      setClassError(err.message);
    }
  };

  const handleEditClass = async (e) => {
    e.preventDefault();
    setClassError('');
    try {
      const response = await fetch(`/api/classes/${editingClass.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingClass),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בעדכון כיתה');
      }
      setShowEditClass(false);
      setEditingClass(null);
      fetchClasses();
    } catch (err) {
      setClassError(err.message);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את הכיתה?')) return;
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה במחיקת כיתה');
      }
      fetchClasses();
    } catch (err) {
      alert(err.message);
    }
  };

  // Student handlers
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setStudentError('');
    if (!newStudent.full_name) {
      setStudentError('שם התלמיד הוא שדה חובה');
      return;
    }
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בהוספת תלמיד');
      }
      setShowAddStudent(false);
      setNewStudent({ 
        full_name: '', 
        student_id: '', 
        date_of_birth: '',
        address: '',
        phone: '',
        email: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        emergency_contact: '',
        emergency_phone: '',
        siblings: '',
        medical_notes: '',
        class_id: null
      });
      fetchStudents();
    } catch (err) {
      setStudentError(err.message);
    }
  };

  const handleEditStudent = async (e) => {
    e.preventDefault();
    setStudentError('');
    try {
      const response = await fetch(`/api/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingStudent),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה בעדכון תלמיד');
      }
      setShowEditStudent(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      setStudentError(err.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את התלמיד?')) return;
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'שגיאה במחיקת תלמיד');
      }
      fetchStudents();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="mr-4">
                <h1 className="text-xl font-bold text-gray-900">פורטל מורה</h1>
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
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          {[
            { id: 'overview', label: 'סקירה כללית', icon: GraduationCap },
            { id: 'schools', label: 'בתי ספר', icon: School },
            { id: 'classes', label: 'כיתות', icon: Users },
            { id: 'students', label: 'תלמידים', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 ml-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Year Selector */}
        <div className="mb-6">
          <label className="font-medium mr-2">שנת לימודים:</label>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-1"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">טוען...</p>
          </div>
        )}

        {/* Content based on active tab */}
        {!loading && (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <School className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm text-gray-600">בתי ספר</p>
                      <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm text-gray-600">כיתות</p>
                      <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm text-gray-600">תלמידים</p>
                      <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schools Tab */}
            {activeTab === 'schools' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">ניהול בתי ספר</h2>
                  <button
                    onClick={() => setShowAddSchool(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    הוסף בית ספר
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">כתובת</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">טלפון</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">אימייל</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {schools.map((school) => (
                          <tr key={school.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{school.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{school.address || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{school.phone || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{school.email || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setEditingSchool(school); setShowEditSchool(true); }}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSchool(school.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {schools.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-600">אין בתי ספר</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Classes Tab */}
            {activeTab === 'classes' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">ניהול כיתות</h2>
                  <button
                    onClick={() => setShowAddClass(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    הוסף כיתה
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{classItem.class_name}</h3>
                          <p className="text-gray-600">{classItem.school_full_name || classItem.school_name}</p>
                          <p className="text-sm text-blue-600">{classItem.profession}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditingClass(classItem); setShowEditClass(true); }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(classItem.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>רמה: {classItem.grade_level || 'לא צוין'}</p>
                        <p>מקסימום תלמידים: {classItem.max_students}</p>
                        <p>תלמידים: {classItem.student_count || 0}</p>
                      </div>
                    </div>
                  ))}
                  {classes.length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-600">אין כיתות</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">ניהול תלמידים</h2>
                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    הוסף תלמיד
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">מספר תלמיד</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">כיתה</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">טלפון</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{student.full_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.student_id || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.class_name || 'לא משויך'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">{student.phone || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { setEditingStudent(student); setShowEditStudent(true); }}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {students.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-600">אין תלמידים</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Add School Modal */}
        {showAddSchool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">הוסף בית ספר</h3>
              <form onSubmit={handleAddSchool} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם בית ספר *</label>
                  <input
                    type="text"
                    value={newSchool.name}
                    onChange={e => setNewSchool({ ...newSchool, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
                  <input
                    type="text"
                    value={newSchool.address}
                    onChange={e => setNewSchool({ ...newSchool, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                  <input
                    type="text"
                    value={newSchool.phone}
                    onChange={e => setNewSchool({ ...newSchool, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input
                    type="email"
                    value={newSchool.email}
                    onChange={e => setNewSchool({ ...newSchool, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                {schoolError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{schoolError}</div>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddSchool(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    הוסף
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Class Modal */}
        {showAddClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">הוסף כיתה</h3>
              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם הכיתה *</label>
                  <input
                    type="text"
                    value={newClass.class_name}
                    onChange={e => setNewClass({ ...newClass, class_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">בית ספר</label>
                  <select
                    value={newClass.school_id}
                    onChange={e => {
                      const selectedSchool = schools.find(s => s.id === e.target.value);
                      setNewClass({ 
                        ...newClass, 
                        school_id: e.target.value,
                        school_name: selectedSchool ? selectedSchool.name : ''
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">בחר בית ספר</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם בית ספר (חופשי) *</label>
                  <input
                    type="text"
                    value={newClass.school_name}
                    onChange={e => setNewClass({ ...newClass, school_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מקצוע *</label>
                  <select
                    value={newClass.profession}
                    onChange={e => setNewClass({ ...newClass, profession: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    {professions.map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">רמת כיתה</label>
                  <input
                    type="text"
                    value={newClass.grade_level}
                    onChange={e => setNewClass({ ...newClass, grade_level: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="כיתה ז, כיתה ח וכד׳"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מקסימום תלמידים</label>
                  <input
                    type="number"
                    value={newClass.max_students}
                    onChange={e => setNewClass({ ...newClass, max_students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                  <textarea
                    value={newClass.description}
                    onChange={e => setNewClass({ ...newClass, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>
                {classError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{classError}</div>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddClass(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    הוסף
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Student Modal */}
        {showAddStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">הוסף תלמיד</h3>
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא *</label>
                  <input
                    type="text"
                    value={newStudent.full_name}
                    onChange={e => setNewStudent({ ...newStudent, full_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מספר תלמיד</label>
                  <input
                    type="text"
                    value={newStudent.student_id}
                    onChange={e => setNewStudent({ ...newStudent, student_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תאריך לידה</label>
                  <input
                    type="date"
                    value={newStudent.date_of_birth}
                    onChange={e => setNewStudent({ ...newStudent, date_of_birth: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">כיתה</label>
                  <select
                    value={newStudent.class_id || ''}
                    onChange={e => setNewStudent({ ...newStudent, class_id: e.target.value || null })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">ללא כיתה</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={e => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם הורה</label>
                  <input
                    type="text"
                    value={newStudent.parent_name}
                    onChange={e => setNewStudent({ ...newStudent, parent_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון הורה</label>
                  <input
                    type="tel"
                    value={newStudent.parent_phone}
                    onChange={e => setNewStudent({ ...newStudent, parent_phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                {studentError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{studentError}</div>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStudent(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    הוסף
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit School Modal */}
        {showEditSchool && editingSchool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ערוך בית ספר</h3>
              <form onSubmit={handleEditSchool} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם בית ספר *</label>
                  <input
                    type="text"
                    value={editingSchool.name}
                    onChange={e => setEditingSchool({ ...editingSchool, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
                  <input
                    type="text"
                    value={editingSchool.address || ''}
                    onChange={e => setEditingSchool({ ...editingSchool, address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                  <input
                    type="text"
                    value={editingSchool.phone || ''}
                    onChange={e => setEditingSchool({ ...editingSchool, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                  <input
                    type="email"
                    value={editingSchool.email || ''}
                    onChange={e => setEditingSchool({ ...editingSchool, email: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                {schoolError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{schoolError}</div>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditSchool(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    שמור
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Class Modal */}
        {showEditClass && editingClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ערוך כיתה</h3>
              <form onSubmit={handleEditClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם הכיתה *</label>
                  <input
                    type="text"
                    value={editingClass.class_name}
                    onChange={e => setEditingClass({ ...editingClass, class_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">בית ספר</label>
                  <select
                    value={editingClass.school_id || ''}
                    onChange={e => {
                      const selectedSchool = schools.find(s => s.id === e.target.value);
                      setEditingClass({ 
                        ...editingClass, 
                        school_id: e.target.value,
                        school_name: selectedSchool ? selectedSchool.name : editingClass.school_name
                      });
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">בחר בית ספר</option>
                    {schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם בית ספר (חופשי) *</label>
                  <input
                    type="text"
                    value={editingClass.school_name}
                    onChange={e => setEditingClass({ ...editingClass, school_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מקצוע *</label>
                  <select
                    value={editingClass.profession}
                    onChange={e => setEditingClass({ ...editingClass, profession: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    {professions.map(prof => (
                      <option key={prof} value={prof}>{prof}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">רמת כיתה</label>
                  <input
                    type="text"
                    value={editingClass.grade_level || ''}
                    onChange={e => setEditingClass({ ...editingClass, grade_level: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="כיתה ז, כיתה ח וכד׳"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מקסימום תלמידים</label>
                  <input
                    type="number"
                    value={editingClass.max_students}
                    onChange={e => setEditingClass({ ...editingClass, max_students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                  <textarea
                    value={editingClass.description || ''}
                    onChange={e => setEditingClass({ ...editingClass, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>
                {classError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{classError}</div>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditClass(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    שמור
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditStudent && editingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ערוך תלמיד</h3>
              <form onSubmit={handleEditStudent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא *</label>
                  <input
                    type="text"
                    value={editingStudent.full_name}
                    onChange={e => setEditingStudent({ ...editingStudent, full_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">מספר תלמיד</label>
                  <input
                    type="text"
                    value={editingStudent.student_id || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, student_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תאריך לידה</label>
                  <input
                    type="date"
                    value={editingStudent.date_of_birth || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, date_of_birth: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">כיתה</label>
                  <select
                    value={editingStudent.class_id || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, class_id: e.target.value || null })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">ללא כיתה</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                  <input
                    type="tel"
                    value={editingStudent.phone || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">שם הורה</label>
                  <input
                    type="text"
                    value={editingStudent.parent_name || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, parent_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">טלפון הורה</label>
                  <input
                    type="tel"
                    value={editingStudent.parent_phone || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, parent_phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                {studentError && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded">{studentError}</div>}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditStudent(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  >
                    שמור
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherPortal;