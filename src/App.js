import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { 
  Phone, Mail, MapPin, Calendar, Users, Award, BookOpen, 
  Star, ChevronRight, Menu, X, Facebook, Instagram, Youtube,
  GraduationCap, Clock, Globe, Shield
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleTeacherLogin = () => {
    window.location.href = '/admin';
  };

  const handleStudentLogin = () => {
    window.location.href = '/student-login';
  };

  // Auto-rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      title: "ברוכים הבאים לקמפוס הצעיר    ",
      subtitle: "מובילים בחינוך איכותי, בונים עתיד מזהיר לתלמידינו",
      image: "🏫"
    },
    {
      title: "חינוך מותאם אישית לכל תלמיד",
      subtitle: "טכנולוגיות מתקדמות ושיטות הוראה חדשניות",
      image: "💡"
    },
    {
      title: "קהילה חמה ותומכת",
      subtitle: "יחד אנחנו יוצרים סביבה בטוחה ומעצימה",
      image: "🤝"
    }
  ];

  const stats = [
    { number: "850+", label: "תלמידים פעילים", icon: <Users className="w-8 h-8" /> },
    { number: "65+", label: "מורים מנוסים", icon: <GraduationCap className="w-8 h-8" /> },
    { number: "25+", label: "שנות ניסיון", icon: <Award className="w-8 h-8" /> },
    { number: "98%", label: "שביעות רצון הורים", icon: <Star className="w-8 h-8" /> }
  ];

  const programs = [
    {
      title: "חטיבת הביניים",
      description: "כיתות ז'-ט' עם דגש על פיתוח כישורי חשיבה ויצירתיות",
      subjects: ["מתמטיקה", "מדעים", "טכנולוגיה", "אמנויות"],
      icon: "📚"
    },
    {
      title: "חטיבה עליונה",
      description: "הכנה למגמות בגרות עם ליווי אישי והכנה לפסיכומטרי",
      subjects: ["פיזיקה", "כימיה", "מחשבים", "ביוטכנולוגיה"],
      icon: "🔬"
    },
    {
      title: "מגמות מיוחדות",
      description: "מגמות ייחודיות בתחומי עתיד ותעשיות מתקדמות",
      subjects: ["רובוטיקה", "קולנוע", "עיצוב", "יזמות"],
      icon: "🎯"
    },
    {
      title: "העשרה וחוגים",
      description: "מגוון רחב של פעילויות לפיתוח כישרונות ותחביבים",
      subjects: ["ספורט", "מוסיקה", "תיאטרון", "מדעים"],
      icon: "🎨"
    }
  ];

  const facultyMembers = [
    {
      name: "גיא צור",
      position: "מנהל בית הספר",
      experience: "25 שנות ניסיון בהוראה ומנהל",
      description: "דוקטור לחינוך, מתמחה בחדשנות פדגוגית",
      image: "👩‍🏫"
    },
    {
      name: "הילה ווקנין",
      position: "מנהל לימודים",
      experience: "20 שנות ניסיון בהוראת מדעים",
      description: "מומחה לביולוגיה מולקולרית והוראת מדעים",
      image: "👨‍🔬"
    },
    {
      name: "גלית צור",
      position: "רכזת טכנולוגיות",
      experience: "12 שנות ניסיון בחינוך דיגיטלי",
      description: "מובילה בשילוב טכנולוגיה בחינוך",
      image: "👩‍💻"
    },
    {
      name: "אלי אוחנה",
      position: "אליל ילדותי",
      experience: "12 שנות ניסיון בחינוך דיגיטלי",
      description: "מובילה בשילוב טכנולוגיה בחינוך",
      image: "👩‍💻"
    },
  ];

  const testimonials = [
    {
      name: "שרון קדוש",
      role: "הורה לתלמידה בכיתה י׳",
      content: "אתם אלופים .. אין עליכם הילה ,גיא, אופיר,אלון,יעקב החיזוק שאתם נותנים לילדים ההקשבה והעזרה האין סופית לא משנה באיזה שעה אתם שם עם כל שאלה שיש לילדים. אחרי שתי בנות שלמדו ועוד שתיים שלומדות אין לי ספק שבחרתי נכון",
      rating: 5
    },
    {
      name: "דן כהן",
      role: "בוגר 2023",
      content: "המורים כאן לא רק מלמדים, הם באמת אכפת להם. קיבלתי כאן בסיס איתן שעוזר לי בלימודים האקדמיים.",
      rating: 5
    },
    {
      name: "מיכל לוי",
      role: "הורה לתלמיד בכיתה ח׳",
      content: "הגישה האישית וההתייחסות לכל תלמיד כפרט מיוחד. זה מה שמייחד את בית הספר הזה מכל השאר.",
      rating: 5
    }
  ];

  const recentNews = [
    {
      date: "15 בינואר 2025",
      title: "תלמידינו זכו במקום ראשון בתחרות הרובוטיקה הארצית",
      summary: "צוות הרובוטיקה של בית הספר זכה במקום הראשון בתחרות הרובוטיקה הארצית עם פרויקט חדשני של רובוט לניקוי הים."
    },
    {
      date: "10 בינואר 2025",
      title: "השקת מעבדת הביוטכנולוגיה החדשה",
      summary: "חנכנו מעבדה חדישה לביוטכנולוגיה עם ציוד מתקדם שיאפשר לתלמידים לחקור ולגלות בתחום המדעים."
    },
    {
      date: "5 בינואר 2025",
      title: "פתיחת הרישום לשנת הלימודים תשפ״ו",
      summary: "נפתח הרישום לשנת הלימודים הבאה. מקומות מוגבלים - ממליצים להירשם מוקדם."
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{fontFamily: 'Inter, sans-serif'}}>
      {/* Navigation Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and School Name */}
            <div className="flex items-center">
              <div className="text-4xl font-bold text-blue-600 ml-4">🏫</div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">בית ספר הקמפוס הצעיר</h1>
                <p className="text-sm text-gray-600 hidden sm:block">מוביל בחינוך איכותי מאז 1999</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-8 ml-8">
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">אודות </a>
              <a href="#programs" className="text-gray-700 hover:text-blue-600 transition-colors">תוכניות לימוד </a>
              <a href="#faculty" className="text-gray-700 hover:text-blue-600 transition-colors">צוות</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">צור קשר</a>
            </nav>

            {/* Login Buttons */}
            <div className="flex space-x-3">
              <Link
                to="/admin"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm lg:text-base text-center"
              >
                כניסת מורים
              </Link>
              <button
                onClick={handleStudentLogin}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 text-sm lg:text-base"
              >
                כניסת תלמידים
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col space-y-3">
                <a href="#about" className="text-gray-700 hover:text-blue-600 py-2">אודות </a>
                <a href="#programs" className="text-gray-700 hover:text-blue-600 py-2">תוכניות לימוד </a>
                <a href="#faculty" className="text-gray-700 hover:text-blue-600 py-2">צוות</a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 py-2">צור קשר</a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Background Images */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Images with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-800/75 to-purple-900/80 z-10"></div>
          
          {/* Multiple Background Images */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-transparent to-blue-200" 
                 style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
            </div>
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-2xl">
              📚
            </div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-xl">
              🎓
            </div>
            <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-lg">
              ⭐
            </div>
            <div className="absolute bottom-1/3 right-10 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-lg">
              🏆
            </div>
            <div className="absolute top-20 left-1/3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-sm">
              ✨
            </div>
          </div>
          
          {/* Geometric Patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 border border-white/20 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 border border-white/20 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-fade-in drop-shadow-lg">
              {heroSlides[currentSlide].image}
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in drop-shadow-lg">
              {heroSlides[currentSlide].title}
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 max-w-4xl mx-auto drop-shadow-md">
              {heroSlides[currentSlide].subtitle}
            </p>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="#about" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 font-medium py-4 px-8 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 text-center">
                גלה עוד על בית הספר
              </a>
            <a 
              href="https://api.whatsapp.com/send?phone=972503147777&text=שלום%2C%20אני%20מעוניין%20לקבוע%20פגישת%20היכרות%20בבית%20הספר"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600/80 backdrop-blur-sm hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
            >
              קבע פגישת היכרות
            </a>
            </div>

            {/* Slide indicators */}
            <div className="flex justify-center space-x-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">אודות בית ספר הקמפוס הצעיר</h3>
              <p className="text-lg text-gray-600 mb-6">
                מזה 25 שנה, בית ספר הקמפוס הצעיר מוביל בתחום החינוך האיכותי בארץ. אנחנו מאמינים בחינוך מותאם אישית 
                שמתייחס לכל תלמיד כפרט יקר עם פוטנציאל ייחודי.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                הצוות הפדגוגי שלנו מורכב ממורים מנוסים ומסורים, שמשלבים שיטות הוראה מתקדמות עם טכנולוגיות חדישות 
                כדי להכין את התלמידים לעולם של מחר.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-blue-600 ml-3" />
                  <span>סביבה בטוחה ותומכת</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-blue-600 ml-3" />
                  <span>חינוך לאזרחות עולמית</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-6 h-6 text-blue-600 ml-3" />
                  <span>למידה מותאמת אישית</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-600 ml-3" />
                  <span>ליווי אישי מתמיד</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-9xl mb-4">🎓</div>
              <p className="text-gray-600">מחנכים דור אחר דור לעתיד מוצלח</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section id="programs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">תוכניות הלימוד שלנו</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              מגוון רחב של תוכניות לימוד מתקדמות, המותאמות לכל גיל ורמה, 
              עם דגש על פיתוח חשיבה יצירתית
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{program.icon}</div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{program.title}</h4>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <div className="space-y-2">
                  {program.subjects.map((subject, subIndex) => (
                    <span key={subIndex} className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm ml-2 mb-2">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section id="faculty" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            {/* כותרת וטקסט */}
            <div className="max-w-4xl mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">הצוות הפדגוגי שלנו</h3>
              <p className="text-lg text-gray-600 mb-6">
                מורים מנוסים ומסורים עם הכשרה אקדמית מתקדמת ותשוקה אמיתית לחינוך
              </p>
              <p className="text-lg text-gray-600">
                הצוות הפדגוגי שלנו מורכב ממורים מנוסים ומסורים, שמשלבים שיטות הוראה מתקדמות עם טכנולוגיות חדישות 
                כדי להכין את התלמידים לעולם של מחר.
              </p>
            </div>

            {/* גריד חברי הסגל */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
              {facultyMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h4>
                  <p className="text-blue-600 font-medium mb-2">{member.position}</p>
                  <p className="text-sm text-gray-500 mb-3">{member.experience}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">מה אומרים עלינו</h3>
            <p className="text-lg text-blue-100 max-w-3xl mx-auto">
              עדויות אמיתיות מהורים, תלמידים ובוגרים על החוויה בבית ספר הקמפוס הצעיר
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & Announcements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">חדשות ועדכונים</h3>
            <p className="text-lg text-gray-600">עדכונים אחרונים על הישגי התלמידים ופעילויות בית הספר</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map((news, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="text-sm text-blue-600 font-medium mb-2">{news.date}</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">{news.title}</h4>
                  <p className="text-gray-600 mb-4">{news.summary}</p>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    קרא עוד <ChevronRight className="w-4 h-4 mr-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">צור קשר</h3>
              <p className="text-lg text-gray-600 mb-8">
                נשמח לענות על כל שאלה ולקבע פגישת היכרות. צוות המזכירות שלנו זמין לשירותכם.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-600 ml-4" />
                  <div>
                    <p className="font-medium">טלפון</p>
                    <p className="text-gray-600">050-3147777</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-600 ml-4" />
                  <div>
                    <p className="font-medium">אימייל</p>
                    <p className="text-gray-600">info@harmoreh.edu.il</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 ml-4" />
                  <div>
                    <p className="font-medium">כתובת</p>
                    <p className="text-gray-600">רחוב החינוך 123, תל אביב</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-600 ml-4" />
                  <div>
                    <p className="font-medium">שעות פעילות</p>
                    <p className="text-gray-600">ראשון-חמישי: 7:30-16:00</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <p className="font-medium mb-4">עקבו אחרינו</p>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/campusTzair/about?locale=he_IL" className="text-blue-600 hover:text-blue-700">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="https://www.instagram.com/hacampus_rishonlezion/" className="text-pink-600 hover:text-pink-700">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D%252B972503147777%26context%3DAfeyd6KKICG5xb42umT_jCyTN371YvjxreqdtuitKa2iyUPCq1hAj6w5DjQGk5N-knOi7llUO6wAf4MfQEldVbTxcw8ENnCuV39sVrhlhRiBMCcgivR1a6SpKmmWS3tc2k9Pobf1LUzllvG6eLEv_tQ%26source%3DFB_Page%26app%3Dfacebook%26entry_point%3Dpage_cta%26fbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExbUxYR0dJdEpVekhXNkxkMQEeHKV_ZgKeRA26aeEtm212miQpjTSfNWtqAhdIXVYQe5cxCqpCNRbEwlxWqjU_aem_dU-o_U3X7oz-kT9JL8jEfA&h=AT0Zr5YE4uosKHtL00GiHkBYgkgRk10SqB39vVO5LzRaG6NmNaYAqGwXcip-0mJMFf4qan4LxjDTXiCfPDdtfdv9GbbklgSprfL5QYPyLg6CbG6_dKwC8FdCLFwZC3dFPmhbnqJt" className="text-red-600 hover:text-red-700">
                    <Youtube className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h4 className="text-2xl font-semibold text-gray-900 mb-6">שלח הודעה</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="הכנס שם מלא"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="הכנס כתובת אימייל"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="הכנס מספר טלפון"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הודעה</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="הכנס הודעה"
                  ></textarea>
                </div>
                
                <button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                >
                  שלח הודעה
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="text-3xl font-bold text-blue-400 ml-3">🏫</div>
                <h4 className="text-xl font-bold">בית ספר הקמפוס הצעיר</h4>
              </div>
              <p className="text-gray-300">
                מוביל בחינוך איכותי מאז 1999. 
                בונים עתיד מזהיר לתלמידינו.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">קישורים מהירים</h5>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#about" className="hover:text-white">אודות</a></li>
                <li><a href="#programs" className="hover:text-white">תוכניות לימוד</a></li>
                <li><a href="#faculty" className="hover:text-white">צוות</a></li>
                <li><a href="#contact" className="hover:text-white">צור קשר</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">שירותים</h5>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">רישום לבית הספר</a></li>
                <li><a href="#" className="hover:text-white">פגישות הורים</a></li>
                <li><a href="#" className="hover:text-white">פעילויות חוץ</a></li>
                <li><a href="#" className="hover:text-white">תמיכה טכנית</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">פרטי קשר</h5>
              <div className="space-y-2 text-gray-300">
                <p>רחוב החינוך 123, תל אביב</p>
                <p>טלפון: 050-3147777</p>
                <p>אימייל: info@harmoreh.edu.il</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 בית ספר הקמפוס הצעיר. כל הזכויות שמורות. | 
              <a href="#" className="hover:text-white mr-2">תנאי שימוש</a> | 
              <a href="#" className="hover:text-white mr-2">מדיניות פרטיות</a>
            </p>
          </div>
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
        <Route path="/admin" element={<TeacherLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />
      </Routes>
    </Router>
  );
}

export default App;