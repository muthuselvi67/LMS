const db = require('./config/db');

// List of YouTube video IDs for web dev lessons
const sampleVideos = [
  'https://www.youtube.com/watch?v=pQN-pnXPaVg',
  'https://www.youtube.com/watch?v=kUMe1FH4CHE',
  'https://www.youtube.com/watch?v=UB1O30fR-EE',
  'https://www.youtube.com/watch?v=qz0aGYrrlhU',
  'https://www.youtube.com/watch?v=1PnVor36_40',
  'https://www.youtube.com/watch?v=HD13eq_Pzs8',
  'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
  'https://www.youtube.com/watch?v=3g3-pG-0vVw',
  'https://www.youtube.com/watch?v=916GWv2Qs08',
  'https://www.youtube.com/watch?v=8gNrZ4lAnaw'
];

const htmlCoursesData = {
  Beginner: [
    {
      title: 'Complete HTML 5 Web Development Course',
      slug: 'complete-html-5-course',
      description: 'Master modern HTML5 web development from complete beginner to advanced professional. Learn to structure websites, work with semantic elements, tables, forms, multimedia, and build real-world accessible web pages.',
      short_description: 'Learn HTML from beginner to advanced level with practical projects and downloadable resources.',
      thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      instructor: 'John Instructor',
      duration: '8 Hours',
      rating: 4.8,
      students: 1420
    },
    {
      title: 'HTML5 Essentials for Absolute Beginners',
      slug: 'html5-essentials-beginners',
      description: 'Start your web development journey here. Learn HTML tags, attributes, document structure, and how web pages work under the hood.',
      short_description: 'The ultimate starting point for anyone learning web development with HTML5.',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sarah Jenkins',
      duration: '6 Hours',
      rating: 4.9,
      students: 980
    },
    {
      title: 'Building Your First Webpage with HTML5',
      slug: 'building-first-webpage-html5',
      description: 'Step-by-step beginner guide to writing clean, valid HTML markup and publishing your very first live website.',
      short_description: 'Build and launch your first website using clean HTML5 syntax.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      instructor: 'Michael Chang',
      duration: '5 Hours',
      rating: 4.7,
      students: 850
    },
    {
      title: 'HTML Semantic Elements & Page Structure',
      slug: 'html-semantic-elements-structure',
      description: 'Learn header, nav, main, section, article, aside, and footer tags. Understand search engine readability and semantic code structure.',
      short_description: 'Master semantic HTML tags for modern, SEO-friendly website structure.',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      instructor: 'Emma Watson',
      duration: '7 Hours',
      rating: 4.8,
      students: 1120
    },
    {
      title: 'Mastering HTML Forms & Input Validations',
      slug: 'mastering-html-forms-validations',
      description: 'Deep dive into form controls, inputs, fieldsets, textareas, selection menus, native validation attributes, and user input accessibility.',
      short_description: 'Build interactive, secure, and user-friendly HTML forms.',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      instructor: 'David Miller',
      duration: '6.5 Hours',
      rating: 4.9,
      students: 1340
    },
    {
      title: 'HTML Links, Navigation & Site Architecture',
      slug: 'html-links-navigation-architecture',
      description: 'Learn absolute vs relative paths, anchor targets, navigation menus, deep linking, and structuring multi-page web applications.',
      short_description: 'Connect web pages efficiently using anchors, paths, and navigation architecture.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      instructor: 'Jessica Alba',
      duration: '5.5 Hours',
      rating: 4.6,
      students: 760
    },
    {
      title: 'HTML Tables & Structured Data Presentation',
      slug: 'html-tables-structured-data',
      description: 'Master tabular data display using table, tr, th, td, thead, tbody, tfoot, colspan, rowspan, and accessible data captions.',
      short_description: 'Present complex data clearly using modern HTML table tags.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      instructor: 'Robert Vance',
      duration: '4.5 Hours',
      rating: 4.7,
      students: 620
    },
    {
      title: 'HTML Multimedia: Images, Audio & Video Integration',
      slug: 'html-multimedia-audio-video',
      description: 'Embed images, audio tracks, video players, iframes, responsive picture tags, srcset, and captions into your web pages.',
      short_description: 'Add rich media, audio, and video content to HTML web pages.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      instructor: 'Claire Dupont',
      duration: '6 Hours',
      rating: 4.8,
      students: 890
    },
    {
      title: 'HTML Best Practices & Clean Code Standards',
      slug: 'html-best-practices-clean-code',
      description: 'Write clean, maintainable, W3C-valid HTML markup following industrial standards, indentation guidelines, and meta tagging.',
      short_description: 'Learn code organization, W3C validation, and professional HTML standards.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      instructor: 'Daniel Craig',
      duration: '5 Hours',
      rating: 4.9,
      students: 1050
    },
    {
      title: 'HTML5 Portfolio Web Development Hands-on Project',
      slug: 'html5-portfolio-project-beginner',
      description: 'Build a complete personal developer portfolio website from scratch using pure HTML5. Practice everything you learned in a real project.',
      short_description: 'Build a full personal portfolio website using pure HTML5 markup.',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sophia Reyes',
      duration: '8 Hours',
      rating: 4.95,
      students: 1650
    }
  ],
  Intermediate: [
    {
      title: 'Intermediate HTML5 Canvas, Web Audio & Interactive Media',
      slug: 'intermediate-html5-canvas-media',
      description: 'Master 2D canvas drawing, animations, web audio API, custom video controls, and interactive multimedia in modern HTML5.',
      short_description: 'Build interactive 2D graphics, games, and web audio applications using HTML5 Canvas.',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      instructor: 'Alex Turner',
      duration: '14 Hours',
      rating: 4.8,
      students: 1240
    },
    {
      title: 'HTML5 Microdata, Metadata & Technical SEO Optimization',
      slug: 'html5-microdata-seo-optimization',
      description: 'Learn JSON-LD schema.org markup, Open Graph social tags, meta tags, and structured data to rank higher on search engines.',
      short_description: 'Optimize HTML pages for search engine crawlers and rich search results.',
      thumbnail: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=800&q=80',
      instructor: 'Elena Rostova',
      duration: '9 Hours',
      rating: 4.85,
      students: 930
    },
    {
      title: 'HTML5 Web Storage & IndexedDB Data Persistence',
      slug: 'html5-web-storage-indexeddb',
      description: 'Store client-side data using localStorage, sessionStorage, and IndexedDB database for offline-first web applications.',
      short_description: 'Master client-side data persistence with HTML5 Web Storage & IndexedDB.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      instructor: 'Kevin O\'Connor',
      duration: '10 Hours',
      rating: 4.75,
      students: 840
    },
    {
      title: 'HTML5 Drag and Drop API & Interactive UIs',
      slug: 'html5-drag-and-drop-api',
      description: 'Build interactive kanban boards, file uploader zones, and draggable interface components using native HTML5 Drag and Drop API.',
      short_description: 'Create interactive drag-and-drop web interfaces without third-party libraries.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      instructor: 'Marcus Vance',
      duration: '8 Hours',
      rating: 4.8,
      students: 790
    },
    {
      title: 'HTML5 Geolocation & Device Sensor Integration',
      slug: 'html5-geolocation-device-sensors',
      description: 'Access user location, orientation, battery status, and device sensors using HTML5 JavaScript Web APIs.',
      short_description: 'Integrate real-time location and device sensors into HTML5 web apps.',
      thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
      instructor: 'Hannah Abbott',
      duration: '7.5 Hours',
      rating: 4.7,
      students: 690
    },
    {
      title: 'HTML5 SVG Graphics & Vector Animations',
      slug: 'html5-svg-graphics-animations',
      description: 'Embed scalable vector graphics directly in HTML, manipulate inline SVG paths, and animate icons using CSS & JS.',
      short_description: 'Create sharp, scalable vector graphics and animations inside HTML5 pages.',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      instructor: 'Lucas Meyer',
      duration: '11 Hours',
      rating: 4.9,
      students: 1150
    },
    {
      title: 'HTML5 Web Workers & Background Multithreading',
      slug: 'html5-web-workers-multithreading',
      description: 'Offload heavy computations, image processing, and data parsing off the main browser thread using Web Workers.',
      short_description: 'Boost web app performance with background multithreading Web Workers.',
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      instructor: 'Dr. James Sterling',
      duration: '10 Hours',
      rating: 4.85,
      students: 920
    },
    {
      title: 'Accessible Rich Internet Applications (ARIA) & HTML Accessibility',
      slug: 'html-aria-accessibility-mastery',
      description: 'Implement WCAG 2.1 standards, ARIA roles, states, landmarks, keyboard focus management, and screen reader compatibility.',
      short_description: 'Build fully accessible, inclusive web applications using HTML5 & ARIA.',
      thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80',
      instructor: 'Maya Lin',
      duration: '12 Hours',
      rating: 4.95,
      students: 1480
    },
    {
      title: 'HTML5 Custom Data Attributes & JS Interaction',
      slug: 'html5-custom-data-attributes-js',
      description: 'Leverage data-* attributes for dynamic DOM state management, dataset API manipulation, and component decoupling.',
      short_description: 'Store custom state data directly in HTML tags for clean JS interactions.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      instructor: 'Oliver Queen',
      duration: '6 Hours',
      rating: 4.75,
      students: 810
    },
    {
      title: 'Interactive HTML5 Dashboard Layout & Canvas Charts',
      slug: 'interactive-html5-dashboard-canvas',
      description: 'Combine HTML5 grid containers, canvas charts, real-time widgets, and semantic markup to build responsive admin dashboards.',
      short_description: 'Build an interactive data dashboard using HTML5 Canvas & semantic layout.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      instructor: 'Victoria Chang',
      duration: '13 Hours',
      rating: 4.9,
      students: 1390
    }
  ],
  Advanced: [
    {
      title: 'Advanced HTML5 Web Components, Accessibility & Performance',
      slug: 'advanced-html5-web-components',
      description: 'Master Custom Elements, Shadow DOM, HTML Templates, ARIA accessibility, Core Web Vitals, and DOM rendering optimizations.',
      short_description: 'Build reusable native Web Components and optimize HTML rendering performance.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      instructor: 'Elena Rostova',
      duration: '16 Hours',
      rating: 4.9,
      students: 1100
    },
    {
      title: 'Shadow DOM & Custom HTML Elements Architecture',
      slug: 'shadow-dom-custom-elements-architecture',
      description: 'Architect encapsulated framework-agnostic UI component libraries using HTML Templates, Slot API, and Shadow Root scoping.',
      short_description: 'Build framework-free custom UI components with encapsulated Shadow DOM.',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      instructor: 'Dr. Aris Thorne',
      duration: '15 Hours',
      rating: 4.95,
      students: 870
    },
    {
      title: 'HTML WebSockets & Real-time Web Applications',
      slug: 'html-websockets-realtime-apps',
      description: 'Implement full-duplex bi-directional communication using HTML5 WebSockets API for real-time chat, notifications, and gaming.',
      short_description: 'Build low-latency real-time web applications using HTML5 WebSockets.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      instructor: 'Nathan Drake',
      duration: '14 Hours',
      rating: 4.85,
      students: 960
    },
    {
      title: 'HTML DOM Performance & Layout Thrashing Optimization',
      slug: 'html-dom-performance-optimization',
      description: 'Eliminate reflows, repaints, layout thrashing, memory leaks, and DOM node bloating for buttery 60fps web performance.',
      short_description: 'Optimize DOM trees, eliminate layout thrashing, and achieve 100/100 Lighthouse scores.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sophie Germain',
      duration: '12 Hours',
      rating: 4.9,
      students: 750
    },
    {
      title: 'HTML Enterprise Security & Content Security Policy (CSP)',
      slug: 'html-enterprise-security-csp',
      description: 'Protect HTML applications against XSS attacks, clickjacking, MIME sniffing, and CSRF using Content Security Policy (CSP) meta tags.',
      short_description: 'Harden web pages against client-side vulnerabilities using CSP & security headers.',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      instructor: 'Victor Stone',
      duration: '11 Hours',
      rating: 4.88,
      students: 820
    },
    {
      title: 'HTML5 Progressive Web Apps (PWA) Manifest & Offline Shell',
      slug: 'html5-pwa-manifest-offline-shell',
      description: 'Turn HTML sites into installable progressive web apps with Web App Manifest, Service Workers, app icons, and offline fallback pages.',
      short_description: 'Transform web pages into installable mobile and desktop Progressive Web Apps.',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
      instructor: 'Samantha Ray',
      duration: '16 Hours',
      rating: 4.92,
      students: 1210
    },
    {
      title: 'HTML WebRTC Video & Peer-to-Peer Communication',
      slug: 'html-webrtc-peer-to-peer',
      description: 'Build real-time video conferencing, screen sharing, and peer-to-peer file transfer tools using WebRTC and media streams.',
      short_description: 'Create peer-to-peer video call and screen sharing tools using WebRTC.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      instructor: 'Alexander Wright',
      duration: '18 Hours',
      rating: 4.94,
      students: 940
    },
    {
      title: 'High-Performance HTML Rendering & Server-Side Hydration',
      slug: 'high-performance-html-rendering',
      description: 'Understand critical rendering path, resource hints (dns-prefetch, preload, prefetch), SSR HTML streaming, and hydration strategy.',
      short_description: 'Master browser rendering pipeline, resource preloading, and HTML streaming.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      instructor: 'Dmitri Volkov',
      duration: '14 Hours',
      rating: 4.89,
      students: 670
    },
    {
      title: 'HTML5 WebGL 3D Integration & Hardware Acceleration',
      slug: 'html5-webgl-3d-hardware-acceleration',
      description: 'Embed hardware-accelerated 3D graphics inside HTML canvas elements using WebGL, shaders, and GPU acceleration.',
      short_description: 'Render complex 3D graphics and GPU shaders inside HTML5 web pages.',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      instructor: 'Gavin Belson',
      duration: '17 Hours',
      rating: 4.86,
      students: 810
    },
    {
      title: 'Enterprise HTML Architecture & Scalable Component Design',
      slug: 'enterprise-html-architecture-scalable',
      description: 'Design enterprise-scale web architectures, atomic HTML design systems, automated accessibility testing pipelines, and CI/CD linting.',
      short_description: 'Architect enterprise design systems and automated HTML quality pipelines.',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      instructor: 'Rachel Green',
      duration: '20 Hours',
      rating: 4.96,
      students: 1350
    }
  ],
  'All Levels': [
    {
      title: 'HTML5 & Modern Web Standards Masterclass',
      slug: 'html5-modern-web-standards',
      description: 'Comprehensive, all-in-one guide to modern HTML5, semantic tags, forms, media, web accessibility, and performance best practices.',
      short_description: 'Complete masterclass covering foundational to advanced HTML5 web standards.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      instructor: 'David Miller',
      duration: '18 Hours',
      rating: 4.9,
      students: 1560
    },
    {
      title: 'Complete HTML Developer Bootcamp: Zero to Hero',
      slug: 'complete-html-bootcamp-zero-to-hero',
      description: 'The ultimate HTML bootcamp covering beginner basics to advanced web components, canvas, forms, and production deployment.',
      short_description: 'Go from complete beginner to professional HTML web developer in one course.',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      instructor: 'Brandon Lee',
      duration: '22 Hours',
      rating: 4.95,
      students: 2100
    },
    {
      title: 'HTML5 Crash Course for Front-End & Full Stack Developers',
      slug: 'html5-crash-course-frontend-fullstack',
      description: 'Fast-paced HTML5 course designed for developers transitioning to web development or refreshing modern HTML features.',
      short_description: 'Fast-track guide to HTML5 for developers of all skill levels.',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      instructor: 'Laura Croft',
      duration: '8 Hours',
      rating: 4.8,
      students: 1150
    },
    {
      title: 'Modern Web Markup Handbook: HTML5 & Beyond',
      slug: 'modern-web-markup-handbook-html5',
      description: 'Reference handbook and practical guide for every HTML5 tag, attribute, microformat, semantic pattern, and web API.',
      short_description: 'Complete reference handbook and practical guide to HTML5 markup.',
      thumbnail: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      instructor: 'Chris Hemsworth',
      duration: '12 Hours',
      rating: 4.85,
      students: 990
    },
    {
      title: 'HTML Email Template Design & Cross-Client Compatibility',
      slug: 'html-email-template-design-compatibility',
      description: 'Master building responsive, beautiful HTML email newsletters that render perfectly in Gmail, Outlook, Apple Mail, and Yahoo.',
      short_description: 'Design responsive, cross-client HTML email templates that look great everywhere.',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      instructor: 'Amanda Waller',
      duration: '10 Hours',
      rating: 4.78,
      students: 880
    },
    {
      title: 'HTML5 Game Development Fundamentals',
      slug: 'html5-game-development-fundamentals',
      description: 'Build 2D arcade games, physics simulations, and browser games using HTML5 Canvas, audio tags, and requestAnimationFrame.',
      short_description: 'Create 2D browser games using HTML5 Canvas and game loops.',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      instructor: 'Felix Kjellberg',
      duration: '15 Hours',
      rating: 4.92,
      students: 1740
    },
    {
      title: 'Building Web Applications with Modern HTML5 APIs',
      slug: 'building-web-apps-modern-html5-apis',
      description: 'Explore HTML5 APIs: History API, Clipboard API, Notification API, Fullscreen API, Page Visibility API, and Web Share API.',
      short_description: 'Harness powerful browser Web APIs to turn HTML pages into app-like experiences.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      instructor: 'Grace Hopper',
      duration: '14 Hours',
      rating: 4.88,
      students: 1020
    },
    {
      title: 'HTML & Web Accessibility (WCAG 2.1) Complete Guide',
      slug: 'html-web-accessibility-wcag-guide',
      description: 'Learn how to make websites compliant with ADA, Section 508, and WCAG 2.1 AAA accessibility guidelines using semantic HTML.',
      short_description: 'Complete guide to WCAG compliance and accessible HTML markup.',
      thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&q=80',
      instructor: 'Ada Lovelace',
      duration: '13 Hours',
      rating: 4.96,
      students: 1410
    },
    {
      title: 'HTML5 Semantic Web & Structured Schema.org Markup',
      slug: 'html5-semantic-web-schema-markup',
      description: 'Implement microformats, RDFa, JSON-LD, and Schema.org structured data to enable intelligent search engine indexing.',
      short_description: 'Master structured data, Schema.org, and semantic web tags.',
      thumbnail: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=800&q=80',
      instructor: 'Tim Berners-Lee',
      duration: '9.5 Hours',
      rating: 4.91,
      students: 860
    },
    {
      title: 'HTML5 Web Development Code Along & 10 Real Projects',
      slug: 'html5-web-dev-code-along-10-projects',
      description: 'Build 10 real-world web projects step-by-step: Landing Page, Contact Form, Video Gallery, Audio Player, Quiz Page, and more.',
      short_description: 'Build 10 real-world web projects step-by-step using pure HTML5.',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      instructor: 'Linus Torvalds',
      duration: '24 Hours',
      rating: 4.98,
      students: 3100
    }
  ]
};

async function seedHTMLCourses() {
  const p = await db.getPool();
  
  // Ensure category HTML (id 1) exists
  const [catRows] = await p.query("SELECT id FROM categories WHERE slug = 'html' OR name = 'HTML'");
  let categoryId = 1;
  if (catRows.length > 0) {
    categoryId = catRows[0].id;
  } else {
    const [res] = await p.query("INSERT INTO categories (name, slug, description, icon) VALUES ('HTML', 'html', 'Learn modern markup, semantic tags, forms and responsive structure.', 'Code')");
    categoryId = res.insertId;
  }
  console.log(`[SEED] HTML Category ID: ${categoryId}`);

  // Loop through levels
  for (const level of ['Beginner', 'Intermediate', 'Advanced', 'All Levels']) {
    const coursesList = htmlCoursesData[level];
    console.log(`[SEED] Seeding ${coursesList.length} courses for level: ${level}`);

    for (let i = 0; i < coursesList.length; i++) {
      const c = coursesList[i];
      
      const [existing] = await p.query("SELECT id FROM courses WHERE slug = ?", [c.slug]);
      let courseId;

      const whatYouWillLearnJson = JSON.stringify([
        `Master ${c.title} fundamentals`,
        `Build real-world projects with modern standards`,
        `Understand semantic elements and industry best practices`,
        `Write clean, valid, and accessible web code`
      ]);

      const requirementsJson = JSON.stringify([
        `Basic computer usage and web browsing knowledge`,
        `A code editor (VS Code, Sublime Text, or Atom)`,
        `Desire to learn modern web development`
      ]);

      if (existing.length > 0) {
        courseId = existing[0].id;
        await p.query(
          `UPDATE courses SET category_id = ?, title = ?, description = ?, short_description = ?, thumbnail = ?, instructor = ?, level = ?, duration = ?, rating = ?, total_students = ?, what_you_will_learn = ?, requirements = ? WHERE id = ?`,
          [categoryId, c.title, c.description, c.short_description, c.thumbnail, c.instructor, level, c.duration, c.rating, c.students, whatYouWillLearnJson, requirementsJson, courseId]
        );
      } else {
        const [inserted] = await p.query(
          `INSERT INTO courses (category_id, title, slug, description, short_description, thumbnail, instructor, level, duration, price, is_free, rating, total_students, language, what_you_will_learn, requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, 1, ?, ?, 'English', ?, ?)`,
          [categoryId, c.title, c.slug, c.description, c.short_description, c.thumbnail, c.instructor, level, c.duration, c.rating, c.students, whatYouWillLearnJson, requirementsJson]
        );
        courseId = inserted.insertId;
      }

      // Ensure this course has 10 lessons!
      const [existingLessons] = await p.query("SELECT id FROM lessons WHERE course_id = ?", [courseId]);
      if (existingLessons.length < 10) {
        await p.query("DELETE FROM lessons WHERE course_id = ?", [courseId]);

        for (let l = 1; l <= 10; l++) {
          const lessonTitle = `Lesson ${l}: ${c.title.replace('Course', '').replace('Masterclass', '').trim()} - Part ${l}`;
          const videoUrl = sampleVideos[(l - 1) % sampleVideos.length];
          const sectionName = l <= 3 ? 'Section 1: Foundations & Setup' : l <= 7 ? 'Section 2: Core Concepts & Hands-on' : 'Section 3: Practical Projects & Best Practices';

          await p.query(
            `INSERT INTO lessons (course_id, section_name, title, description, video_url, duration, lesson_order) VALUES (?, ?, ?, ?, ?, '15 mins', ?)`,
            [courseId, sectionName, lessonTitle, `In depth tutorial covering ${lessonTitle}. Practice alongside the instructor.`, videoUrl, l]
          );
        }
      }
    }
  }

  // Check total HTML courses per level
  const [counts] = await p.query("SELECT level, COUNT(*) as count FROM courses WHERE category_id = ? GROUP BY level", [categoryId]);
  console.log('[SEED] HTML Courses counts per level:', counts);

  process.exit(0);
}

seedHTMLCourses().catch(err => {
  console.error('[SEED ERROR]', err);
  process.exit(1);
});
