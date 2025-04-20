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

export default function App() {
  return (
    <Router>
      <div className="App">
        <NavbarHeader />
        
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            {/* <Route path="/delivery" element={<CatalogPage />} />
            <Route path="/installing" element={<CatalogPage />} /> */}
            <Route path="/returnProduct" element={<ReturnPage />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/adm" element={<CatalogPage />} />
            <Route path="/assets/document/policy.pdf" element={<a href="/assets/document/policy.pdf" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}