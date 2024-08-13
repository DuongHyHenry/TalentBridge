import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Username from './Username';
import Logout from './Logout';
import CompanyTemplate from './CompanyTemplate';
import Profile from './Profile';
import { AuthProvider } from './AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Username" element={<Username />} />
          <Route path="/Logout" element={<Logout />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Company/:companyName" element={<CompanyTemplate />} />
        </Routes>``
      </Router>
    </AuthProvider>
  );
};

export default App;
