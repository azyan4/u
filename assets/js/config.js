/* AZYAN — الإعدادات المركزية | Central settings
   عدّل هذا الملف فقط لتغيير الأسماء والأوصاف والصور وروابط التواصل والنصوص.
   whatsapp : رقم دولي بأرقام فقط، مثال: 9665XXXXXXXX (بدون + أو مسافات)
   instagram / tiktok : رابط كامل أو اسم الحساب فقط
   image : مسار صورة صفحة المجال (ضعها في assets/img/)
   card / glow / bg : صورة الزر في الرئيسية (SVG أو JPG) ولون الإضاءة وخلفية الزر */
window.AZYAN = {
  services: [
    { id: 'gifts', path: 'gifts', icon: 'gift', card: 'assets/img/cards/gifts.svg', glow: '#FFD97A', light: true, bg: 'linear-gradient(135deg,#C9962F 0%,#F6DE97 100%)',
      name: { ar: 'الهدايا', en: 'Gifts' },
      desc: { ar: 'هدايا مختارة بعناية وتغليف أنيق يليق بكل مناسبة.', en: 'Thoughtfully chosen gifts, elegantly wrapped for every occasion.' },
      image: 'assets/img/gifts.jpg',
      alt: { ar: 'صورة من مجال الهدايا', en: 'A photo from the gifts collection' },
      whatsapp: '', instagram: '', tiktok: '' },
    { id: 'flowers', path: 'flowers', icon: 'flower', card: 'assets/img/cards/flowers.svg', glow: '#FF9EC4', bg: 'linear-gradient(135deg,#C42D74 0%,#FF7FB0 100%)',
      name: { ar: 'الورد', en: 'Flowers' },
      desc: { ar: 'باقات وتنسيقات ورد طازجة تعبّر عمّا يصعب قوله.', en: 'Fresh bouquets and arrangements that say what words cannot.' },
      image: 'assets/img/flowers.jpg',
      alt: { ar: 'صورة من مجال الورد', en: 'A photo from the flowers collection' },
      whatsapp: '', instagram: '', tiktok: '' },
    { id: 'events', path: 'events', icon: 'event', card: 'assets/img/cards/events.svg', glow: '#C4A8FF', bg: 'linear-gradient(135deg,#4A22B8 0%,#A47BFF 100%)',
      name: { ar: 'تنسيقات الحفلات', en: 'Event Styling' },
      desc: { ar: 'تصميم وتنفيذ تنسيقات حفلات متكاملة بأدق التفاصيل.', en: 'Complete event design and styling, down to the finest detail.' },
      image: 'assets/img/events.jpg',
      alt: { ar: 'صورة من مجال تنسيقات الحفلات', en: 'A photo from event styling' },
      whatsapp: '', instagram: '', tiktok: '' },
    { id: 'advertising', path: 'advertising', icon: 'mega', card: 'assets/img/cards/advertising.svg', glow: '#19D3FF', bg: 'linear-gradient(135deg,#0A2E8C 0%,#10A3FF 100%)', neon: true,
      name: { ar: 'الدعاية والإعلان', en: 'Advertising & Marketing' },
      desc: { ar: 'هويات وحملات إعلانية تمنح علامتك حضورًا واضحًا.', en: 'Brand identities and campaigns that give your brand a clear presence.' },
      image: 'assets/img/advertising.jpg',
      alt: { ar: 'صورة من مجال الدعاية والإعلان', en: 'A photo from advertising and marketing' },
      whatsapp: '', instagram: '', tiktok: '' }
  ],
  i18n: {
    ar: {
      skip: 'انتقل إلى المحتوى', tagline: 'اختر المجال الذي تبحث عنه',
      sub: 'أربعة مجالات، هوية واحدة', home: 'الرئيسية', other: 'مجالات أخرى',
      wa: 'تواصل عبر واتساب', ig: 'إنستغرام', tt: 'تيك توك',
      waMsg: 'مرحبًا AZYAN، أرغب في الاستفسار عن مجال {s}.',
      rights: 'جميع الحقوق محفوظة', missing: 'وضع التطوير — بيانات غير مُدخلة في config.js:',
      noImg: 'الصورة غير موجودة. أضفها في:'
    },
    en: {
      skip: 'Skip to content', tagline: 'Choose the field you are looking for',
      sub: 'Four fields, one identity', home: 'Home', other: 'Other fields',
      wa: 'Chat on WhatsApp', ig: 'Instagram', tt: 'TikTok',
      waMsg: 'Hello AZYAN, I would like to ask about {s}.',
      rights: 'All rights reserved', missing: 'Dev mode — not set in config.js:',
      noImg: 'Image not found. Add it at:'
    }
  }
};
