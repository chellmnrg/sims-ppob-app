import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TopUpPage from './pages/TopUpPage';
import TransactionPage from './pages/TransactionPage';
import AccountPage from './pages/AccountPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/topup" element={<TopUpPage />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/payment/:serviceCode" element={<PaymentPage />} />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
