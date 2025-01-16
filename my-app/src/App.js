
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import Gallery from './components/Gallery';
import SidebarPage from './components/Sidebar'; // Sidebar layout
import VillageManagement from './components/VillageManagement';
import AddVillageModal from './components/AddVillageModal';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
       
        <Route path="/addvillage" element={<addvillage />} />
        <Route path="/sidebar/*" element={<SidebarPage />} /> {/* nested routes */}
        <Route path="/addvillage" element={<AddVillageModal />} /> 

      </Routes>
    </Router>
  );
}

export default App;
