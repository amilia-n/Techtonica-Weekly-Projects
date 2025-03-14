// import { useState } from 'react'

import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Calendar from "./components/Calendar"
import Events from "./components/Events"
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/calendar" element={<Calendar />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App
