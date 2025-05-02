//App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/FooterMain/Footer';
import NavbarHeader from './components/navbar/navbarMain';
import Home from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import WorkPage from './pages/OurWorkPage';
import DocumentsPage from './pages/DocumentsPage';
import ReturnPage from './pages/ReturnPage';
import Contacts from './pages/Contacts';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './components/CartContext/CartProvider';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CheckoutSuccess from './pages/CheckoutSuccess';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ProfilePage from './pages/ProfilePage';
import UserDetailsPage from './components/admin/UserDetailsPage';




export default function App() {
  return (
    <CartProvider>
    <Router>
      <div className="App">
        <NavbarHeader />
        
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/cart" element={<CartPage />} /> {/* Добавленный маршрут */}
            <Route path="/work" element={<WorkPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* <Route path="/delivery" element={<CatalogPage />} />
            <Route path="/installing" element={<CatalogPage />} /> */}
            <Route path="/returnProduct" element={<ReturnPage />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/adm" element={<CatalogPage />} />
            <Route path="/assets/document/policy.pdf" element={<a href="/assets/document/policy.pdf" />} />
            <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/admin" element={<AdminLoginPage/>} />
            <Route path="/admin/dashboard" element={
                <AdminLayout> {/* Специальный лейаут без header/footer */}
                  <AdminDashboard />
                </AdminLayout>
              } />
            <Route 
              path="/admin/user/:userId" 
              element={
                <AdminLayout>
                  <UserDetailsPage />
                </AdminLayout>
              } 
            />
            </Routes>
        </main>

        <Footer />

      </div>
    </Router>
    </CartProvider>
  );
}