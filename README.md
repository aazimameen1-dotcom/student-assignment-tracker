# 🎓 Student Assignment Tracker

A modern, highly aesthetic, and responsive web application designed to help students track, manage, and optimize their academic coursework and assignments. Integrated with Supabase for secure backend storage, user authentication, and profile metadata persistence.

---

## ✨ Features

- **📊 Comprehensive Dashboard**: View real-time statistics (pending tasks, completed tasks, overall completion rate, active tasks).
- **📝 Assignment Management**: Create, update, filter (by status/priority/subject), and delete assignments with ease.
- **📅 Visual Calendar & Schedule**: Track assignment deadlines and exam dates on an interactive calendar interface.
- **📈 Analytics & Progress Charts**: Visualize completion trends, grades, and subject-wise distributions.
- **⚙️ Advanced Settings**: 
  - Manage personal information dynamically (e.g., Address, Phone Number).
  - Theme customization: Toggle between Light, Dark, and a dynamic **System Theme** matching device preferences.
  - Custom user profiles including academic year, major, and GPA.
- **🔔 Notification Panel**: Get real-time alerts for upcoming deadlines, status updates, and milestone completions.
- **🔒 Secure Authentication**: Built-in user authentication via Supabase Auth.

---

## 🛠️ Tech Stack

- **Frontend Core**: React (Vite, HTML5, Vanilla CSS for premium styling)
- **Database & Auth**: Supabase (PostgreSQL, Auth, RLS)
- **Routing**: React Router
- **Icons**: Lucide React / React Icons
- **Deployment**: Configured for quick hosting deployments

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aazimameen1-dotcom/student-assignment-tracker.git
   cd student-assignment-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Duplicate the `.env.example` file to create a `.env` file and input your Supabase project credentials:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in the values:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔒 Security & Best Practices

- Secret keys are kept out of version control; `.env` is explicitly ignored.
- Custom security rules and Row Level Security (RLS) are enforced on the database backend.
- Custom system preference listener automatically adjusts theme without client lag.