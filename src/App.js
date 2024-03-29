import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";

import Teachers from "./pages/Teachers";
import Member from "./pages/Member";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Lesson from "./pages/Lesson";
import Rent from "./pages/Rent";
import Camp from "./pages/Camp";
import Debt from "./pages/Debt";
import Storage from "./pages/Storage";
import Teacher from "./pages/Teacher";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/report" element={<Report />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/camp" element={<Camp />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/debt" element={<Debt />} />
        <Route path="/storage" element={<Storage />} />
        <Route path="/member/:id" element={<Member />} />
        <Route path="/teacher/:id" element={<Teacher />} />
      </Routes>
    </Router>
  );
};

export default App;
