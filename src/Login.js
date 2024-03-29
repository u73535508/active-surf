// src/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("username", username);
      console.log("password", password);
      const data = await axios.post(
        "https://active-surf-api.onrender.com/api/signin",
        {
          username: username,
          password: password,
        }
      );
      console.log(data);
      if (data.data.success) {
        navigate("/dashboard");
      }
    } catch (e) {
      console.log(e);
      alert(e.response.data.error);
    }
  };

  return (
    <Container maxWidth="xs">
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
