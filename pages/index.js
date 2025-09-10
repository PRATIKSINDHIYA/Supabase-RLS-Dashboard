import Link from 'next/link'
import { useAuth } from '@/pages/_app'
import Navbar from '@/components/Navbar'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">RLS Guard Dog</span>{' '}
                  <span className="block text-primary-600 xl:inline">Row Level Security Demo</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  A comprehensive demonstration of Row Level Security (RLS) with Supabase, 
                  featuring role-based access control for students and teachers.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href={user ? "/dashboard" : "/login"}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      {user ? 'Go to Dashboard' : 'Get Started'}
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="#features"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-2xl font-bold">Secure by Design</h2>
              <p className="text-primary-100">Row Level Security ensures data protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive RLS Implementation
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Experience the power of Row Level Security with role-based access control
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Authentication</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Secure authentication with Google OAuth and email/password login. 
                  User roles are stored and managed in Supabase.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Row Level Security</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Students can only view their own data, while teachers have access to all student records. 
                  RLS policies enforce these restrictions at the database level.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Role-Based Access</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Different dashboards and permissions for students and teachers. 
                  Teachers can update marks while students can only view their own progress.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Modern UI</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Built with Next.js and TailwindCSS for a modern, responsive interface. 
                  Clean design with intuitive navigation and real-time updates.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to explore RLS?</span>
            <span className="block">Start your journey today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Experience the power of Row Level Security with a complete, production-ready application.
          </p>
          <Link
            href={user ? "/dashboard" : "/login"}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="https://supabase.com" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Supabase</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"/>
              </svg>
            </a>
            <a href="https://nextjs.org" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Next.js</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.572 0c-.176 0-.31.001-.358.005a6.641 6.641 0 0 0-.633.07 6.26 6.26 0 0 0-1.039.27 5.567 5.567 0 0 0-2.13 1.512A5.567 5.567 0 0 0 5.32 4.406a6.26 6.26 0 0 0-.27 1.039 6.641 6.641 0 0 0-.07.633c-.004.048-.005.182-.005.358v9.128c0 .176.001.31.005.358.015.312.07.604.07.633.17.7.412 1.3.633 1.039a5.567 5.567 0 0 0 1.512 2.13 5.567 5.567 0 0 0 2.13 1.512c.312.17.7.412 1.039.633.312.17.604.412.633.07.048.004.182.005.358.005h.858c.176 0 .31-.001.358-.005.312-.015.604-.07.633-.07a6.26 6.26 0 0 0 1.039-.27 5.567 5.567 0 0 0 2.13-1.512 5.567 5.567 0 0 0 1.512-2.13c.17-.312.412-.7.633-1.039a6.641 6.641 0 0 0 .07-.633c.004-.048.005-.182.005-.358V6.5c0-.176-.001-.31-.005-.358a6.641 6.641 0 0 0-.07-.633 6.26 6.26 0 0 0-.27-1.039 5.567 5.567 0 0 0-1.512-2.13A5.567 5.567 0 0 0 15.5 1.32a6.26 6.26 0 0 0-1.039-.27 6.641 6.641 0 0 0-.633-.07C13.76.001 13.626 0 13.45 0h-1.878zm.358 1.442h1.162c.176 0 .31.001.358.005.312.015.604.07.633.07.312.17.7.412 1.039.633.312.17.604.412.633.07.048.004.182.005.358.005h.858c.176 0 .31-.001.358-.005.312-.015.604-.07.633-.07a6.26 6.26 0 0 0 1.039-.27 5.567 5.567 0 0 0 2.13-1.512 5.567 5.567 0 0 0 1.512-2.13c.17-.312.412-.7.633-1.039a6.641 6.641 0 0 0 .07-.633c.004-.048.005-.182.005-.358V6.5c0-.176-.001-.31-.005-.358a6.641 6.641 0 0 0-.07-.633 6.26 6.26 0 0 0-.27-1.039 5.567 5.567 0 0 0-1.512-2.13A5.567 5.567 0 0 0 15.5 1.32a6.26 6.26 0 0 0-1.039-.27 6.641 6.641 0 0 0-.633-.07c-.048-.004-.182-.005-.358-.005h-1.162z"/>
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 RLS Guard Dog. Built with Next.js and Supabase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}