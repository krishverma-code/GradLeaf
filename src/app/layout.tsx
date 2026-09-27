import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/lib/userContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'GradLeaf | Student-Focused Professional Social Network',
  description: 'Education today, growth tomorrow. Connect student identity, learning, projects, networking, hackathons, and AI-assisted teammate matching.',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 min-h-screen text-slate-900 flex flex-col">
        <UserProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
