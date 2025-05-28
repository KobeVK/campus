import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Users, BookOpen, Award, ChevronDown, Menu, X, Star, Clock, Calendar } from 'lucide-react';

const SchoolWebsite = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  // Hero images rotation
  const heroImages = [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const navigation = [
    { name: 'בית', href: '#home' },
    { name: 'אודות', href: '#about' },
    { name: 'תוכניות לימוד', href: '#programs' },
    { name: 'צוות', href: '#staff' },
    { name: 'יצירת קשר', href: '#contact' }
  ];

  const programs = [
    { 
      title: 'חטיבת ביניים', 
      description: 'תוכנית לימודים מותאמת לכיתות ז-ט עם דגש על פיתוח אישיות ויכולות אקדמיות',
      icon: BookOpen,
      students: '150 תלמידים',
      age: 'גילאי 12-15'
    },
    { 
      title: 'חטיבה עליונה', 
      description: 'הכנה מקיפה לבגרות ולהמשך לימודים אקדמיים ברמה הגבוהה ביותר',
      icon: Award,
      students: '200 תלמידים',
      age: 'גילאי 15-18'
    },
    { 
      title: 'תוכניות העשרה', 
      description: 'מגוון פעילויות העשרה בתחומי אמנות, מדע וטכנולוגיה, ספורט ומנהיגות',
      icon: Star,
      students: 'כל השכבות',
      age: 'פעילות חוץ לימודית'
    }
  ];

  const stats = [
    { number: '350+', label: 'תלמידים' },
    { number: '25+', label: 'מורים מנוסים' },
    { number: '95%', label: 'הצלחה בבגרות' },
    { number: '15+', label: 'שנות ניסיון' }
  ];

  const testimonials = [
    {
      name: 'רחל כהן',
      role: 'הורה לתלמידה בכיתה י',
      text: 'הבית ספר שלנו מעניק חינוך איכותי ומקפיד על ערכים. הצוות המקצועי והמסור עוזר לכל תלמיד להגיע להישגים הטובים ביותר.'
    },
    {
      name: 'דוד לוי',
      role: 'בוגר מהכיתה האחרונה',
      text: 'הלימודים כאן הכינו אותי בצורה מושלמת ללימודים האקדמיים. המורים היו תמיד זמינים לעזרה וההדרכה הייתה ברמה גבוהה.'
    }
  ];

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                בית ספר הר המורה
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`תמונת רקע ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            בית ספר הר המורה
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            חינוך איכותי לעתיד מזהיר - בואו להצטרף אלינו למסע של למידה והתפתחות אישית
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg">
              הירשמו עכשיו
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-200">
              לקבלת מידע נוסף
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible.about ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                אודות בית הספר שלנו
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                לורם איפסום דולור סיט אמט, קונסקטטור אדיפיסקינג אלית גולר מונפרר סוברט לורם שבצק יהול, לכנוץ בעריר גק ליץ, ושבעגט. קולורס מונפרד אדנדום סילקוף, מרגשי ומרגשח. עמחליף.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                אדנדום סילקוף, מרגשי ומרגשח. עמחליף לפרומי בלוף קינץ תתיח לרעח. לורם איפסום דולור סיט אמט, קונסקטטור אדיפיסקינג אלית. סת אלמנקום ניסי נון ניבאה.
              </p>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse text-blue-600">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">הכרה לאומית</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-green-600">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">קהילה חזקה</span>
                </div>
              </div>
            </div>
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible.about ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="תלמידים בכיתה"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              תוכניות הלימוד שלנו
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              מגוון תוכניות לימוד מותאמות אישית לכל שכבת גיל, עם דגש על מצוינות אקדמית ופיתוח אישי
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  isVisible.programs ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <program.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {program.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {program.description}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{program.students}</span>
                  <span>{program.age}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section id="staff" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              הצוות המקצועי שלנו
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              מורים מנוסים ומסורים הפועלים למען הצלחת כל תלמיד ותלמידה
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={`https://images.unsplash.com/photo-${[
                      '1494790108755-2616c56b3e13',
                      '1507003211169-0a1dd7228f2d',
                      '1438761681033-6461ffad8d80'
                    ][index]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                    alt={`מורה ${index + 1}`}
                    className="w-64 h-64 mx-auto rounded-full object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {['ד"ר שרה כהן', 'מר דוד לוי', 'גב\' רחל אברהם'][index]}
                </h3>
                <p className="text-blue-600 font-semibold mb-4">
                  {['מנהלת בית הספר', 'רכז חטיבת ביניים', 'רכזת חטיבה עליונה'][index]}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  לורם איפסום דולור סיט אמט, קונסקטטור אדיפיסקינג אלית גולר מונפרר סוברט לורם שבצק יהול קונסקטטור.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              מה אומרים עלינו
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-blue-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                יצירת קשר
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                נשמח לענות על כל שאלה ולעזור לכם למצוא את המסלול המתאים ביותר עבור ילדכם
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">טלפון</div>
                    <div className="text-gray-600">03-1234567</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">אימייל</div>
                    <div className="text-gray-600">info@harhamoreh.edu</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">כתובת</div>
                    <div className="text-gray-600">רחוב החינוך 15, תל אביב</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">שעות פעילות</div>
                    <div className="text-gray-600">א׳-ה׳: 08:00-16:00</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם מלא
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="הכניסו את שמכם המלא"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    אימייל
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="הכניסו את כתובת האימייל"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טלפון
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="הכניסו מספר טלפון"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    הודעה
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="כתבו כאן את הודעתכם..."
                  />
                </div>

                <button
                  onClick={() => alert('הודעה נשלחה בהצלחה!')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 shadow-lg"
                >
                  שליחת הודעה
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">בית ספר הר המורה</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                חינוך איכותי ומקצועי למען עתיד מזהיר לילדינו
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">קישורים מהירים</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">אודות</a></li>
                <li><a href="#programs" className="hover:text-white transition-colors">תוכניות לימוד</a></li>
                <li><a href="#staff" className="hover:text-white transition-colors">צוות</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">יצירת קשר</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">פרטי התקשרות</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>טלפון: 03-1234567</li>
                <li>אימייל: info@harhamoreh.edu</li>
                <li>כתובת: רחוב החינוך 15, תל אביב</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">עקבו אחרינו</h3>
              <div className="flex space-x-4 space-x-reverse">
                <button className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="text-xs font-bold">f</span>
                </button>
                <button className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="text-xs font-bold">@</span>
                </button>
                <button className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <span className="text-xs font-bold">ig</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 בית ספר הר המורה. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SchoolWebsite;