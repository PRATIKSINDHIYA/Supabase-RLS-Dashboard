# RLS Guard Dog 🛡️

A comprehensive demonstration of Row Level Security (RLS) with Supabase, featuring role-based access control for students and teachers.

## 🚀 Features

- **Authentication**: Google OAuth + Email/Password login
- **Row Level Security**: Students can only view their own data, teachers can view all data
- **Role-Based Access**: Different dashboards and permissions for students and teachers
- **Modern UI**: Built with Next.js and TailwindCSS
- **Real-time Updates**: Live data synchronization with Supabase
- **Comprehensive Testing**: Unit tests and E2E tests included

## 🏗️ Architecture

- **Frontend**: Next.js 14 with React 18
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: TailwindCSS
- **Testing**: Jest + Playwright
- **Deployment**: Vercel + Supabase

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Git

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd RLSGuardDogProject
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Go to Settings > Database to get your service role key

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

### 5. Set up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the SQL script to create tables and RLS policies

### 6. Configure Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Google OAuth:
   - Add your Google OAuth credentials
   - Set the redirect URL to `http://localhost:3000/auth/callback`
3. Configure email settings as needed

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

The test suite includes:
- Authentication flow testing
- RLS policy enforcement testing
- Role-based access control testing
- UI component testing
- Integration testing

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
4. Deploy!

### Deploy to Supabase

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration script from `supabase/migrations/001_initial_schema.sql`

## 📊 Database Schema

### Tables

- **students**: Stores student data (id, user_id, name, subject, marks)
- **teachers**: Stores teacher data (id, user_id, name)
- **user_roles**: Maps users to their roles (student/teacher)

### RLS Policies

- Students can only view their own data
- Teachers can view all student data
- Teachers can update student marks
- Users can only view their own role

## 🔐 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access**: Granular permissions
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Configured for production

## 📱 User Flows

### Student Flow
1. Sign up/Login as student
2. View personal dashboard with own data
3. See marks, grades, and performance summary

### Teacher Flow
1. Sign up/Login as teacher
2. View all students in dashboard
3. Access teacher panel for detailed management
4. Edit student marks and view statistics

## 🛠️ Development

### Project Structure

```
RLSGuardDogProject/
├── components/          # React components
├── pages/              # Next.js pages
├── utils/              # Utility functions
├── styles/             # Global styles
├── tests/              # Test files
├── supabase/           # Database migrations
└── public/             # Static assets
```

### Key Files

- `utils/supabaseClient.js` - Supabase configuration
- `utils/auth.js` - Authentication utilities
- `utils/students.js` - Student data operations
- `components/AuthForm.js` - Authentication component
- `pages/dashboard.js` - Main dashboard
- `pages/teacher.js` - Teacher panel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Review the Supabase documentation
3. Check the Next.js documentation

## 🎯 Roadmap

- [ ] Add more authentication providers
- [ ] Implement real-time notifications
- [ ] Add data export functionality
- [ ] Implement advanced analytics
- [ ] Add mobile app support

---

Built with ❤️ using Next.js, Supabase, and TailwindCSS