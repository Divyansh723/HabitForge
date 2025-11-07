import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Button } from '@/components/ui';
import { Menu } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  footerVariant?: 'default' | 'minimal';
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showFooter = true,
  footerVariant = 'minimal',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Show for all pages */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile menu button - only show when sidebar is hidden on mobile */}
        <div className="lg:hidden p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="mb-4"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
            <span className="ml-2">Menu</span>
          </Button>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="min-h-full">
            {children}
          </div>
        </main>

        {/* Footer */}
        {showFooter && (
          <Footer variant={footerVariant} />
        )}
      </div>
    </div>
  );
};