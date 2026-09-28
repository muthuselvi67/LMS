const db = require('./config/db');

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

const categoriesData = [
  { name: 'HTML', slug: 'html', desc: 'Learn modern markup, semantic tags, forms and responsive structure.', icon: 'Code' },
  { name: 'CSS', slug: 'css', desc: 'Master modern styling, flexbox, grid, animations and responsive design.', icon: 'Palette' },
  { name: 'JavaScript', slug: 'javascript', desc: 'Deep dive into ES6+, DOM manipulation, asynchronous programming and modern JS.', icon: 'FileCode' },
  { name: 'React.js', slug: 'react', desc: 'Build dynamic, reactive user interfaces with modern React, Hooks and Router.', icon: 'Atom' },
  { name: 'MySQL', slug: 'mysql', desc: 'Understand relational databases, schema design, queries, and optimization.', icon: 'Database' },
  { name: 'SQL', slug: 'sql', desc: 'Master SQL queries, joins, aggregates, subqueries, and table manipulation.', icon: 'Layers' },
  { name: 'Full Stack Development', slug: 'full-stack', desc: 'Build end-to-end full stack web applications integrating frontend and backend.', icon: 'Cpu' },
  { name: 'Python', slug: 'python', desc: 'Learn Python syntax, OOP, backend scripting and automation.', icon: 'Terminal' }
];

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

async function seedMasterCatalog() {
  const p = await db.getPool();
  console.log('[SEED MASTER] Starting master database seeding...');

  // 1. Ensure categories exist
  const catIdMap = {};
  for (const cat of categoriesData) {
    const [rows] = await p.query("SELECT id FROM categories WHERE slug = ? OR name = ?", [cat.slug, cat.name]);
    if (rows.length > 0) {
      catIdMap[cat.slug] = rows[0].id;
    } else {
      const [res] = await p.query(
        "INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)",
        [cat.name, cat.slug, cat.desc, cat.icon]
      );
      catIdMap[cat.slug] = res.insertId;
    }
  }

  // 2. Generate 10 courses for EACH category and EACH level (8 categories * 4 levels * 10 courses = 320 courses!)
  let courseCounter = 0;
  for (const cat of categoriesData) {
    const categoryId = catIdMap[cat.slug];
    console.log(`\n[SEED MASTER] Processing category: ${cat.name} (ID: ${categoryId})`);

    for (const lvl of levels) {
      const levelCode = lvl === 'All Levels' ? 'Flexible' : lvl;

      for (let i = 1; i <= 10; i++) {
        courseCounter++;
        const title = `${cat.name} ${levelCode} Level - Course ${i}: Masterclass & Projects`;
        const slug = `${cat.slug}-${lvl.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-course-${i}`;
        const shortDesc = `Comprehensive ${lvl} level course on ${cat.name} with 10 practical video lessons.`;
        const desc = `Deep dive into ${cat.name} at the ${lvl} level. Learn essential techniques, real-world patterns, industry standards, and hands-on exercises in this structured 10-lesson module.`;
        
        const thumbnail = getThumbnailForCategory(cat.slug, i);
        const instructor = getInstructorName(i);
        const duration = `${6 + (i % 8)} Hours`;
        const rating = (4.6 + (i % 4) * 0.1).toFixed(1);
        const students = 600 + i * 140;

        const whatYouWillLearnJson = JSON.stringify([
          `Master ${cat.name} ${lvl} core concepts and techniques`,
          `Build practical industry-grade projects step-by-step`,
          `Implement software engineering best practices`,
          `Solve real-world coding problems with confidence`
        ]);

        const requirementsJson = JSON.stringify([
          `Basic computer operations and internet connectivity`,
          `Installed modern web browser and code editor`,
          `Eagerness to learn ${cat.name}`
        ]);

        const [existing] = await p.query("SELECT id FROM courses WHERE slug = ?", [slug]);
        let courseId;

        if (existing.length > 0) {
          courseId = existing[0].id;
          await p.query(
            `UPDATE courses SET category_id = ?, title = ?, description = ?, short_description = ?, thumbnail = ?, instructor = ?, level = ?, duration = ?, rating = ?, total_students = ?, what_you_will_learn = ?, requirements = ? WHERE id = ?`,
            [categoryId, title, desc, shortDesc, thumbnail, instructor, lvl, duration, rating, students, whatYouWillLearnJson, requirementsJson, courseId]
          );
        } else {
          const [inserted] = await p.query(
            `INSERT INTO courses (category_id, title, slug, description, short_description, thumbnail, instructor, level, duration, price, is_free, rating, total_students, language, what_you_will_learn, requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0.00, 1, ?, ?, 'English', ?, ?)`,
            [categoryId, title, slug, desc, shortDesc, thumbnail, instructor, lvl, duration, rating, students, whatYouWillLearnJson, requirementsJson]
          );
          courseId = inserted.insertId;
        }

        // 3. Ensure exactly 10 video lessons exist for this course
        const [existingLessons] = await p.query("SELECT id FROM lessons WHERE course_id = ?", [courseId]);
        if (existingLessons.length !== 10) {
          await p.query("DELETE FROM lessons WHERE course_id = ?", [courseId]);

          for (let l = 1; l <= 10; l++) {
            const lessonTitle = `Lesson ${l}: ${cat.name} ${levelCode} Fundamentals - Part ${l}`;
            const videoUrl = sampleVideos[(l - 1) % sampleVideos.length];
            const sectionName = l <= 3 ? 'Section 1: Foundations & Setup' : l <= 7 ? 'Section 2: Core Concepts & Deep Dive' : 'Section 3: Practical Projects & Code Review';

            await p.query(
              `INSERT INTO lessons (course_id, section_name, title, description, video_url, duration, lesson_order) VALUES (?, ?, ?, ?, ?, '15 mins', ?)`,
              [courseId, sectionName, lessonTitle, `Interactive hands-on video tutorial covering ${lessonTitle}. Practice alongside the video lesson.`, videoUrl, l]
            );
          }
        }
      }
    }
  }

  const [totalCourses] = await p.query("SELECT COUNT(*) as count FROM courses");
  const [totalLessons] = await p.query("SELECT COUNT(*) as count FROM lessons");

  console.log(`\n==========================================`);
  console.log(`[SEED SUCCESS] Master seeding completed!`);
  console.log(`Total Courses in Database: ${totalCourses[0].count}`);
  console.log(`Total Lessons in Database: ${totalLessons[0].count}`);
  console.log(`==========================================\n`);

  process.exit(0);
}

function getThumbnailForCategory(slug, index) {
  const thumbs = {
    html: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
    ],
    css: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    javascript: [
      'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'
    ],
    react: [
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
    ],
    mysql: [
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    ],
    sql: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80'
    ],
    'full-stack': [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
    ],
    python: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80'
    ]
  };

  const list = thumbs[slug] || thumbs.html;
  return list[(index - 1) % list.length];
}

function getInstructorName(index) {
  const names = [
    'Dr. Alex Turner', 'Sarah Jenkins', 'Michael Chang', 'Emma Watson',
    'David Miller', 'Jessica Alba', 'Robert Vance', 'Claire Dupont',
    'Daniel Craig', 'Sophia Reyes'
  ];
  return names[(index - 1) % names.length];
}

seedMasterCatalog().catch(err => {
  console.error('[SEED MASTER ERROR]', err);
  process.exit(1);
});
