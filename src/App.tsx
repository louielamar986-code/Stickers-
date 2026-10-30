/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandManifesto } from './components/BrandManifesto';
import { CategoryGrid } from './components/CategoryGrid';
import { CollectionsSection } from './components/CollectionsSection';
import { ProductCatalog } from './components/ProductCatalog';
import { FeedbackSection } from './components/FeedbackSection';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { StudioModal } from './components/StudioModal';
import { Footer } from './components/Footer';

const MainContent: React.FC = () => {
  const { activePage } = useStore();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <Hero />
            <CategoryGrid />
            <CollectionsSection />
            <BrandManifesto />
            <FeedbackSection />
          </>
        );
      case 'shop':
        return <ProductCatalog />;
      case 'collections':
        return (
          <div className="pt-20">
            <CollectionsSection />
            <ProductCatalog />
          </div>
        );
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'feedback':
        return (
          <div className="pt-20">
            <FeedbackSection />
          </div>
        );
      default:
        return <ProductCatalog />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F1] dark:bg-[#121316] text-[#171717] dark:text-[#F5F4F0] selection:bg-[#68734D] selection:text-white transition-colors duration-200">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <SearchModal />
      <AuthModal />
      <StudioModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
