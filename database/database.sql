-- ============================================================
--  LEARNLIKE LMS - Complete Database Schema + Seed Data
--  Database: learnlike_lms
-- ============================================================

CREATE DATABASE IF NOT EXISTS `learnlike_lms`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `learnlike_lms`;

-- 1. USERS
CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`       VARCHAR(150)  NOT NULL,
  `email`      VARCHAR(191)  NOT NULL UNIQUE,
  `password`   VARCHAR(255)  NOT NULL,
  `role`       ENUM('student','admin') NOT NULL DEFAULT 'student',
  `avatar`     VARCHAR(500)  DEFAULT NULL,
  `created_at` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(100) NOT NULL,
  `slug`        VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT         DEFAULT NULL,
  `icon`        VARCHAR(100) DEFAULT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. COURSES
CREATE TABLE IF NOT EXISTS `courses` (
  `id`                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id`         INT UNSIGNED     NOT NULL,
  `title`               VARCHAR(300)     NOT NULL,
  `slug`                VARCHAR(350)     NOT NULL UNIQUE,
  `description`         TEXT             NOT NULL,
  `short_description`   VARCHAR(500)     DEFAULT NULL,
  `thumbnail`           VARCHAR(500)     DEFAULT NULL,
  `instructor`          VARCHAR(150)     DEFAULT 'Learnlike Instructor',
  `level`               ENUM('Beginner','Intermediate','Advanced') NOT NULL DEFAULT 'Beginner',
  `duration`            VARCHAR(50)      DEFAULT '10 Hours',
  `price`               DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  `is_free`             TINYINT(1)       NOT NULL DEFAULT 1,
  `rating`              DECIMAL(3,1)     NOT NULL DEFAULT 4.8,
  `total_students`      INT UNSIGNED     NOT NULL DEFAULT 0,
  `what_you_will_learn` JSON             DEFAULT NULL,
  `requirements`        JSON             DEFAULT NULL,
  `created_at`          TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_courses_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. LESSONS
CREATE TABLE IF NOT EXISTS `lessons` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id`     INT UNSIGNED  NOT NULL,
  `section_name`  VARCHAR(200)  DEFAULT 'General',
  `title`         VARCHAR(300)  NOT NULL,
  `description`   TEXT          DEFAULT NULL,
  `video_url`     VARCHAR(500)  DEFAULT NULL,
  `duration`      VARCHAR(30)   DEFAULT NULL,
  `lesson_order`  INT           NOT NULL DEFAULT 0,
  `created_at`    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_lessons_course`
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ENROLLMENTS
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`      INT UNSIGNED NOT NULL,
  `course_id`    INT UNSIGNED NOT NULL,
  `status`       ENUM('enrolled','in_progress','completed') NOT NULL DEFAULT 'enrolled',
  `enrolled_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP    DEFAULT NULL,
  UNIQUE KEY `uq_enrollment` (`user_id`, `course_id`),
  CONSTRAINT `fk_enrollments_user`   FOREIGN KEY (`user_id`)   REFERENCES `users`(`id`)   ON DELETE CASCADE,
  CONSTRAINT `fk_enrollments_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. LESSON PROGRESS
CREATE TABLE IF NOT EXISTS `lesson_progress` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`      INT UNSIGNED NOT NULL,
  `course_id`    INT UNSIGNED NOT NULL,
  `lesson_id`    INT UNSIGNED NOT NULL,
  `completed`    TINYINT(1)   NOT NULL DEFAULT 0,
  `completed_at` TIMESTAMP    DEFAULT NULL,
  UNIQUE KEY `uq_lesson_progress` (`user_id`, `course_id`, `lesson_id`),
  CONSTRAINT `fk_lp_user`   FOREIGN KEY (`user_id`)   REFERENCES `users`(`id`)   ON DELETE CASCADE,
  CONSTRAINT `fk_lp_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lp_lesson` FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. REVIEWS
CREATE TABLE IF NOT EXISTS `reviews` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`    INT UNSIGNED NOT NULL,
  `course_id`  INT UNSIGNED NOT NULL,
  `rating`     TINYINT UNSIGNED NOT NULL,
  `comment`    TEXT         NOT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_review` (`user_id`, `course_id`),
  CONSTRAINT `fk_reviews_user`   FOREIGN KEY (`user_id`)   REFERENCES `users`(`id`)   ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. CERTIFICATES
CREATE TABLE IF NOT EXISTS `certificates` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id`          INT UNSIGNED NOT NULL,
  `course_id`        INT UNSIGNED NOT NULL,
  `certificate_id`   VARCHAR(100) NOT NULL UNIQUE,
  `completion_date`  DATE         NOT NULL,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_certificate` (`user_id`, `course_id`),
  CONSTRAINT `fk_cert_user`   FOREIGN KEY (`user_id`)   REFERENCES `users`(`id`)   ON DELETE CASCADE,
  CONSTRAINT `fk_cert_course` FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. RESOURCES (PDF Downloads)
CREATE TABLE IF NOT EXISTS `resources` (
  `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `course_id`   INT UNSIGNED NOT NULL,
  `lesson_id`   INT UNSIGNED DEFAULT NULL,
  `title`       VARCHAR(300) NOT NULL,
  `file_name`   VARCHAR(300) NOT NULL,
  `file_path`   VARCHAR(500) NOT NULL,
  `file_size`   VARCHAR(30)  DEFAULT NULL,
  `uploaded_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_resources_course`  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_resources_lesson`  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin  (password: Admin@1234  -> bcrypt hash below is "password" placeholder; replace if needed)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin', 'admin@learnlike.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Student', 'student@learnlike.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student');

-- Categories
INSERT INTO `categories` (`name`, `slug`, `description`, `icon`) VALUES
('Web Development',         'web-development',          'Build modern websites and web applications',     'Code'),
('Data Science',            'data-science',             'Analyse data and build ML models',               'BarChart2'),
('Mobile Development',      'mobile-development',       'Create iOS and Android applications',            'Smartphone'),
('UI/UX Design',            'ui-ux-design',             'Design beautiful and functional interfaces',     'Layers'),
('DevOps & Cloud',          'devops-cloud',             'Deploy, scale and monitor applications',         'Cloud'),
('Cybersecurity',           'cybersecurity',            'Protect systems and networks',                   'Shield'),
('Artificial Intelligence', 'artificial-intelligence',  'Build intelligent systems with AI & LLMs',       'Cpu');

-- Courses
INSERT INTO `courses` (`category_id`,`title`,`slug`,`description`,`short_description`,`thumbnail`,`instructor`,`level`,`duration`,`price`,`is_free`,`rating`,`total_students`,`what_you_will_learn`,`requirements`) VALUES
(1,'Complete HTML & CSS Bootcamp','complete-html-css-bootcamp','Master HTML5 and CSS3 from scratch. Build real-world projects and learn responsive design, Flexbox, Grid and modern CSS techniques.','Master HTML5 and CSS3 with hands-on projects.','https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80','Sarah Johnson','Beginner','18 Hours',0.00,1,4.9,1240,'["Build professional websites from scratch","Master Flexbox and CSS Grid","Create responsive layouts","Deploy websites to the web"]','["No prior experience needed","A computer with internet access"]'),
(1,'JavaScript Mastery - ES6 to Modern JS','javascript-mastery-es6-modern','Deep-dive into JavaScript from fundamentals to advanced ES6+ features, async/await, modules and the DOM API.','From JavaScript basics to ES6+ and beyond.','https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80','Michael Chen','Intermediate','24 Hours',0.00,1,4.8,980,'["Master ES6+ features","Work with async programming","Understand closures and prototypes","Build DOM-heavy applications"]','["Basic HTML/CSS knowledge","Willingness to practice daily"]'),
(1,'React.js - Build Modern Web Apps','reactjs-build-modern-web-apps','Learn React from the ground up: components, hooks, context, React Router and Redux Toolkit.','Build powerful single-page applications with React.','https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80','Emily Davis','Intermediate','30 Hours',0.00,1,4.9,870,'["Build reusable components","Master React hooks","Manage state with Redux","Fetch data from REST APIs"]','["JavaScript fundamentals","Basic HTML & CSS"]'),
(2,'Python for Data Science & ML','python-data-science-ml','Learn Python for data analysis, visualisation and ML with NumPy, Pandas, Matplotlib and Scikit-Learn.','Analyse data and build ML models with Python.','https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&w=800&q=80','Dr. Priya Sharma','Beginner','28 Hours',0.00,1,4.8,1100,'["Use NumPy and Pandas","Visualise data with Matplotlib","Build ML models with Scikit-Learn","Understand supervised learning"]','["No prior Python experience","Basic math knowledge helpful"]'),
(5,'Docker & Kubernetes - DevOps Essentials','docker-kubernetes-devops-essentials','Containerise apps with Docker, orchestrate with Kubernetes and set up CI/CD pipelines.','Master containerisation for modern DevOps.','https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80','Alex Turner','Intermediate','22 Hours',0.00,1,4.7,650,'["Build and run Docker containers","Deploy apps on Kubernetes","Set up CI/CD pipelines","Understand microservices"]','["Basic Linux command line","Some programming experience"]'),
(4,'UI/UX Design Fundamentals with Figma','ui-ux-design-fundamentals-figma','Learn UI/UX principles, create wireframes, prototypes and design systems in Figma.','Design stunning interfaces with Figma.','https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80','Lisa Park','Beginner','16 Hours',0.00,1,4.8,720,'["UX research and wireframing","Create interactive prototypes","Build design systems","Master Figma tools"]','["No design experience required","Free Figma account"]'),
(7,'Generative AI & Prompt Engineering','generative-ai-prompt-engineering','Understand LLMs, master prompt engineering and build AI-powered apps with OpenAI APIs.','Master AI prompting and build real apps with LLMs.','https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80','Dr. James Wilson','Intermediate','20 Hours',0.00,1,4.9,1050,'["Understand LLMs and transformers","Write effective prompts","Build AI-powered apps","Use OpenAI and Hugging Face APIs"]','["Basic Python knowledge","Curiosity about AI"]');

-- Lessons - Course 1 (HTML & CSS)
INSERT INTO `lessons` (`course_id`,`section_name`,`title`,`description`,`video_url`,`duration`,`lesson_order`) VALUES
(1,'Getting Started','Introduction to Web Development','Overview of how the web works.','https://www.youtube.com/embed/qz0aGYrrlhU','8:32',1),
(1,'Getting Started','Setting Up Your Environment','Install VS Code and extensions.','https://www.youtube.com/embed/qz0aGYrrlhU','6:15',2),
(1,'HTML Fundamentals','HTML Structure & Syntax','Tags, attributes and document structure.','https://www.youtube.com/embed/qz0aGYrrlhU','12:40',3),
(1,'HTML Fundamentals','Semantic HTML5 Elements','header, nav, main, footer and why they matter.','https://www.youtube.com/embed/qz0aGYrrlhU','10:22',4),
(1,'HTML Fundamentals','Forms & Input Elements','Accessible forms with various input types.','https://www.youtube.com/embed/qz0aGYrrlhU','14:05',5),
(1,'CSS Fundamentals','CSS Selectors & Specificity','Master all CSS selectors and the cascade.','https://www.youtube.com/embed/qz0aGYrrlhU','11:30',6),
(1,'CSS Fundamentals','The Box Model','Margin, padding, border and content.','https://www.youtube.com/embed/qz0aGYrrlhU','9:18',7),
(1,'CSS Fundamentals','Flexbox Layout','One-dimensional layouts with Flexbox.','https://www.youtube.com/embed/qz0aGYrrlhU','18:45',8),
(1,'CSS Fundamentals','CSS Grid Layout','Two-dimensional layouts with Grid.','https://www.youtube.com/embed/qz0aGYrrlhU','20:10',9),
(1,'Responsive Design','Media Queries & Responsive Design','Make websites look great on every screen.','https://www.youtube.com/embed/qz0aGYrrlhU','16:22',10);

-- Lessons - Course 2 (JavaScript)
INSERT INTO `lessons` (`course_id`,`section_name`,`title`,`description`,`video_url`,`duration`,`lesson_order`) VALUES
(2,'JS Basics','Variables, Data Types & Operators','let, const, var and primitive types.','https://www.youtube.com/embed/W6NZfCO5SIk','13:20',1),
(2,'JS Basics','Functions & Scope','Declarations, expressions and closures.','https://www.youtube.com/embed/W6NZfCO5SIk','15:45',2),
(2,'JS Basics','Arrays & Objects','Create, access and manipulate arrays and objects.','https://www.youtube.com/embed/W6NZfCO5SIk','17:30',3),
(2,'ES6+ Features','Arrow Functions & Destructuring','Modern syntax for cleaner JS code.','https://www.youtube.com/embed/W6NZfCO5SIk','14:10',4),
(2,'ES6+ Features','Promises & Async/Await','Handle asynchronous operations elegantly.','https://www.youtube.com/embed/W6NZfCO5SIk','19:55',5),
(2,'DOM & Events','DOM Manipulation','Select and modify HTML elements with JS.','https://www.youtube.com/embed/W6NZfCO5SIk','16:40',6),
(2,'DOM & Events','Event Listeners & Delegation','Respond to user interactions efficiently.','https://www.youtube.com/embed/W6NZfCO5SIk','12:18',7),
(2,'APIs & Fetch','Fetch API & REST','Retrieve data from APIs using fetch.','https://www.youtube.com/embed/W6NZfCO5SIk','18:00',8);

-- Lessons - Course 3 (React)
INSERT INTO `lessons` (`course_id`,`section_name`,`title`,`description`,`video_url`,`duration`,`lesson_order`) VALUES
(3,'React Basics','Introduction to React & JSX','Why React? Vite setup and JSX syntax.','https://www.youtube.com/embed/Ke90Tje7VS0','11:12',1),
(3,'React Basics','Components & Props','Reusable components and data via props.','https://www.youtube.com/embed/Ke90Tje7VS0','14:35',2),
(3,'React Hooks','useState & useEffect','Manage local state and side effects.','https://www.youtube.com/embed/Ke90Tje7VS0','20:22',3),
(3,'React Hooks','useContext & Custom Hooks','Share state globally and abstract logic.','https://www.youtube.com/embed/Ke90Tje7VS0','17:48',4),
(3,'Routing','React Router v6','Multi-page SPAs with React Router.','https://www.youtube.com/embed/Ke90Tje7VS0','15:30',5),
(3,'State Management','Redux Toolkit Basics','Global state with Redux Toolkit.','https://www.youtube.com/embed/Ke90Tje7VS0','23:10',6);

-- Lessons - Course 4 (Python/DS)
INSERT INTO `lessons` (`course_id`,`section_name`,`title`,`description`,`video_url`,`duration`,`lesson_order`) VALUES
(4,'Python Basics','Python Syntax & Data Types','Variables, loops, functions and built-in types.','https://www.youtube.com/embed/_uQrJ0TkZlc','16:00',1),
(4,'Python Basics','OOP in Python','Classes, objects and inheritance.','https://www.youtube.com/embed/_uQrJ0TkZlc','19:30',2),
(4,'Data Analysis','NumPy Arrays & Operations','Efficient numerical computing with NumPy.','https://www.youtube.com/embed/_uQrJ0TkZlc','18:20',3),
(4,'Data Analysis','Pandas DataFrames','Load, clean and analyse tabular data.','https://www.youtube.com/embed/_uQrJ0TkZlc','22:45',4),
(4,'Visualisation','Matplotlib & Seaborn','Charts, histograms and heatmaps.','https://www.youtube.com/embed/_uQrJ0TkZlc','15:15',5),
(4,'Machine Learning','Scikit-Learn Regression & Classification','Train and evaluate ML models end-to-end.','https://www.youtube.com/embed/_uQrJ0TkZlc','25:00',6);

-- Lessons - Course 5 (DevOps)
INSERT INTO `lessons` (`course_id`,`section_name`,`title`,`description`,`video_url`,`duration`,`lesson_order`) VALUES
(5,'Docker','What is Docker & Containers?','Containers vs VMs and Docker architecture.','https://www.youtube.com/embed/3c-iBn73dDE','12:50',1),
(5,'Docker','Dockerfiles & Images','Write Dockerfiles and build custom images.','https://www.youtube.com/embed/3c-iBn73dDE','16:20',2),
(5,'Docker','Docker Compose','Orchestrate multi-container apps locally.','https://www.youtube.com/embed/3c-iBn73dDE','18:40',3),
(5,'Kubernetes','Kubernetes Architecture','Nodes, pods, deployments and services.','https://www.youtube.com/embed/3c-iBn73dDE','20:15',4),
(5,'Kubernetes','Deploying to Kubernetes','Deploy and scale a containerised app on K8s.','https://www.youtube.com/embed/3c-iBn73dDE','22:30',5);

-- Lessons - Course 6 (UI/UX)
INSERT INTO `lessons` (`course_id`,`section_name`,`title`,`description`,`video_url`,`duration`,`lesson_order`) VALUES
(6,'Design Thinking','UX Research & User Personas','Understand users through research and personas.','https://www.youtube.com/embed/c9Wg6Cb_YlU','13:10',1),
(6,'Design Thinking','Wireframing & Information Architecture','Sketch layouts and plan content hierarchy.','https://www.youtube.com/embed/c9Wg6Cb_YlU','15:25',2),
(6,'Figma','Figma Interface Tour','Navigate frames, layers and tools in Figma.','https://www.youtube.com/embed/c9Wg6Cb_YlU','11:40',3),
(6,'Figma','Components & Auto Layout','Build scalable component libraries in Figma.','https://www.youtube.com/embed/c9Wg6Cb_YlU','17:55',4),
(6,'Prototyping','Interactive Prototypes','Link frames and add transitions for demos.','https://www.youtube.com/embed/c9Wg6Cb_YlU','14:30',5);

-- Lessons - Course 7 (AI)
INSERT INTO `lessons` (`course_id`,`section_name`,`title`,`description`,`video_url`,`duration`,`lesson_order`) VALUES
(7,'AI Foundations','How LLMs Work','Transformers, tokens and attention mechanisms.','https://www.youtube.com/embed/zjkBMFhNj_g','18:00',1),
(7,'AI Foundations','OpenAI API - Getting Started','Set up API keys and make your first API call.','https://www.youtube.com/embed/zjkBMFhNj_g','12:30',2),
(7,'Prompt Engineering','Prompt Engineering Techniques','Zero-shot, few-shot, chain-of-thought prompting.','https://www.youtube.com/embed/zjkBMFhNj_g','20:45',3),
(7,'Prompt Engineering','Advanced Prompting & RAG','Retrieval-Augmented Generation with vector DBs.','https://www.youtube.com/embed/zjkBMFhNj_g','24:10',4),
(7,'Building Apps','Build a Chatbot with OpenAI','Create a context-aware chatbot in Python.','https://www.youtube.com/embed/zjkBMFhNj_g','22:00',5),
(7,'Building Apps','Deploy Your AI App','Deploy to Vercel or Hugging Face Spaces.','https://www.youtube.com/embed/zjkBMFhNj_g','16:20',6);

-- Sample reviews
INSERT INTO `reviews` (`user_id`,`course_id`,`rating`,`comment`) VALUES
(2,1,5,'Absolutely loved this course! Sarah explains everything so clearly. Built my first website after just week 2!'),
(2,2,5,'Best JavaScript course I have taken. The ES6 section alone is worth it.'),
(2,3,4,'Great React content. Would love more Redux examples but overall excellent.');
