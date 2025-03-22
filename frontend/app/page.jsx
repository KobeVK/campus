// frontend/app/page.jsx
import Link from 'next/link';

export default function Home() {
  return (
    <div dir="rtl" className="min-h-screen bg-white">
      {/* Navigation Header with Login Link */}
      <header className="bg-blue-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">בית הספר הפרטי שלנו</h1>
          <div>
            <Link 
              href="/login" 
              className="bg-white text-blue-800 py-2 px-4 rounded-md hover:bg-blue-100 transition"
            >
              כניסה למורים
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">ברוכים הבאים לבית הספר הפרטי שלנו</h2>
          <p className="text-xl text-blue-800 max-w-3xl mx-auto">
            אנו מחויבים לחינוך איכותי והצלחת התלמידים שלנו בכל תחומי החיים
          </p>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">מי אנחנו</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg mb-4">
                בית הספר הפרטי שלנו נוסד בשנת 2010 במטרה לספק חינוך איכותי ואישי לכל תלמיד ותלמידה. 
                אנו מאמינים ביצירת סביבת למידה תומכת שמעודדת מצוינות אקדמית לצד פיתוח אישי וחברתי.
              </p>
              <p className="text-lg mb-4">
                הצוות החינוכי שלנו מורכב ממורים מנוסים ומסורים שמחויבים להצלחת התלמידים. 
                אנו מציעים תוכנית לימודים מקיפה שכוללת דגש על מדעים, אמנויות, שפות וכישורי חיים.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">הערכים שלנו:</h3>
              <ul className="list-disc list-inside text-lg space-y-2">
                <li>מצוינות אקדמית</li>
                <li>כבוד הדדי</li>
                <li>יצירתיות וחדשנות</li>
                <li>אחריות אישית</li>
                <li>מעורבות קהילתית</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">התוכניות שלנו</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">תוכנית לימודי ליבה</h3>
              <p>תוכנית לימודים מקיפה הכוללת מתמטיקה, מדעים, אנגלית, עברית, היסטוריה ואזרחות.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">העשרה</h3>
              <p>תוכניות העשרה במגוון תחומים כגון אמנות, מוזיקה, תיאטרון, ספורט ותכנות.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">תמיכה אישית</h3>
              <p>ליווי אישי לכל תלמיד, עזרה בשיעורי בית, והכנה לבחינות בקבוצות קטנות.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">צרו קשר</h2>
          <p className="text-lg mb-4">
            נשמח לענות על כל שאלה ולספק מידע נוסף על בית הספר שלנו.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-2xl mx-auto">
            <div>
              <h3 className="font-bold mb-2">כתובת</h3>
              <p>רחוב הדוגמה 123, תל אביב</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">טלפון</h3>
              <p>03-1234567</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">דוא"ל</h3>
              <p>info@ourschool.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} בית הספר הפרטי שלנו. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
}