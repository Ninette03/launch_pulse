LaunchPulse is an all-in-one platform that helps users learn how to start and grow businesses. It allows users to log in and and provide information about their business ideas and the system evaluates their business ideas and rates them.

Open [https://launch-pulse-agatesi-ninette-irisas-projects.vercel.app/] with your browser to access the website.

## Getting Started

First, run the development server:

```bash
npm run dev
```

You can start editing the page by modifying `app/page.jsx`. The page auto-updates as you edit the file.

LaunchPulse
User Authentication
Secure Login: Google OAuth via Firebase for seamless, passwordless authentication.

Role-Based Access: Future support for admin, mentor, and learner roles.

Session Management: JWT tokens for secure client-server communication.

AI-Based Evaluation
Instant Feedback:

Uses OpenAI’s GPT-4 to analyze business plans for clarity, market viability, and financial soundness.
Scoring system (1–100) with actionable insights (e.g., “Strengthen competitive analysis section”).

Community Forum
Collaboration Tools:

Threaded discussions with upvoting, tagging (#funding, #tech), and mentorship threads.
Real-time chat using Socket.io for instant peer support.
Resource-sharing hub for templates, case studies, and pitch examples.

Tech Stack (Detailed)
Frontend
Next.js: Server-side rendering (SSR) for SEO-friendly static pages (e.g., landing page, blog).

Tailwind CSS: Utility-first styling with custom themes for rapid UI development.

Javascript: Type safety for complex components (e.g., dashboard, plan builder).

Prisma ORM: Type-safe database queries and migrations.

Database
PostgreSQL: Relational structure for user progress, forum posts, and business plans.

Authentication & Third-Party Services
Firebase: Google OAuth and anonymous guest access.

PostgreSQL 14+: Ensure the service is running (sudo service postgresql status on Linux).

📦 Installation Steps
Clone the Repository:

bash
Copy
git clone https://github.com/Ninette03/launch_pulse.git
cd launch_pulse
Install Dependencies:

bash
Copy
npm install
cd client && npm install 
Environment Setup:

Create .env using .env.example template.

Obtain Firebase keys:

Create a project at Firebase Console.
Enable Google Auth under Authentication > Sign-in Methods.
Register app and copy SDK configs to .env.

Database Configuration:

Start PostgreSQL:

bash
Copy
sudo service postgresql start  # Linux
brew services start postgresql  # macOS
Create database and user:

sql
Copy
CREATE DATABASE LaunchPulse;
CREATE USER devuser WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE LaunchPulse TO devuser;
Run Prisma migrations:

bash
Copy
npx prisma migrate dev --name init

Run the App:

bash
Copy
npm run dev  # Starts Next.js
Access at http://localhost:3000.

Add environment variables:

DATABASE_URL: Production PostgreSQL URL
FIREBASE_ADMIN_KEY: Service account JSON for server-side auth.

Enable automatic deployments on main branch pushes.
Security Best Practices
Database: Enable SSL and daily backups.
Rate Limiting: Configure Express middleware to prevent abuse.