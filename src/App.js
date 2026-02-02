// src/App.js
import React, { useState } from 'react';
import universityLogo from 'E:/bushigemen/bushigemen-u/src/logo.jpg'; // 正确的引入方式

function App() {
  return (
    <nav>
       <img src={universityLogo} alt="校徽" className="h-16 w-16" />
       <h1>BUSHIGEMEN UNIVERSITY</h1>
    </nav>
  );
}