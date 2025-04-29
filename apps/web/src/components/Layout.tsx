import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Rumble Boxing Combo Generator
            </h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      
      <footer className="bg-white shadow-sm mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 text-center">
            Rumble Boxing - Music-Driven Combo Generator
          </p>
        </div>
      </footer>
    </div>
  );
}