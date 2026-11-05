import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';

export default function App() {
  return <BrowserRouter><Routes><Route element={<Layout />}><Route index element={<HomePage />} /></Route></Routes></BrowserRouter>;
}
