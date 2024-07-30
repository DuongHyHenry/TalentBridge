import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Username from './Username';
import Logout from './Logout';
import AboutUs from './AboutUs';
import MarineConservationCompany from './MarineConservationCompany';
import SmartLab from './SmartLab';
import HiRezStudios from './HiRezStudios';
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
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/company/3" element={<MarineConservationCompany />} />
          <Route path="/company/2" element={<SmartLab />} />
          <Route path="/company/1" element={<HiRezStudios />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
