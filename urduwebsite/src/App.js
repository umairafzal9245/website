import React from 'react';
import Home from './components/Home';
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Auth from './components/Auth';

function App() {

  const user = useSelector((state) => state.authReducer.authData);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user ? <Navigate to={"home"} /> : <Navigate to="auth" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="../auth" />} />
        <Route path="/auth" element={user ? <Navigate to='../home' /> : <Auth />} />
      </Routes>
    </div>
  );
}

export default App;
