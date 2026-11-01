import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AIRecommenderModal from './components/AIRecommenderModal';
import CloudStatusModal from './components/CloudStatusModal';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');
  const [cloudModalOpen, setCloudModalOpen] = useState(false);

  const handleOpenAIModal = (prompt = '') => {
    setAiInitialPrompt(prompt);
    setAiModalOpen(true);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-navy-950 text-slate-100 selection:bg-cyber-purple selection:text-white">
            
            {/* Top Navigation */}
            <Navbar
              onOpenAIModal={() => handleOpenAIModal('')}
              onOpenCloudModal={() => setCloudModalOpen(true)}
            />

            {/* Main Application Body */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage onOpenAIModal={handleOpenAIModal} />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:idOrSlug" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Shopping Cart Drawer */}
            <CartDrawer />

            {/* Interactive "Ask Nexa AI" Recommender Modal */}
            <AIRecommenderModal
              isOpen={aiModalOpen}
              onClose={() => setAiModalOpen(false)}
              initialPrompt={aiInitialPrompt}
            />

            {/* AWS Cloud Architecture & Diagnostic Hub */}
            <CloudStatusModal
              isOpen={cloudModalOpen}
              onClose={() => setCloudModalOpen(false)}
            />

            {/* Modern Footer */}
            <Footer />

          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

