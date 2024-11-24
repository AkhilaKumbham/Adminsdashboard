import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserManagement from "./UserManagement";
import RoleManagement from "./RoleManagement";
import axios from "axios";
import './App.css';
const App = () => {
  const [users, setUsers] = useState([]);
  //const getUsers = async () => {
    //const response = await axios.get("http://localhost:4000/api/v1/alluser");
    //setUsers(response.data);
    //console.log(response.data);
  //};
  //getUsers();

  return (
    <Router>
      <Routes>
        <Route path='/users' element={<UserManagement />} />
        <Route path='/roles' element={<RoleManagement />} />
        <Route path='/' element={<h1>Welcome to Admin Dashboard</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
