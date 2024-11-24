const express = require("express");
const bodyParser = require("body-parser");
const { isAdmin, login, logout, getProfile, updateProfile } = require("./auth");
const { createUser, editUser, deleteUser, displayAllUser } = require("./user");

const app = express();
const PORT = 4000;
const auth = require("./auth");
// password : admin123

// Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

// auth.js
app.post("/api/v1/auth/login", login);
app.post("/api/v1/auth/logout", logout);
app.get("/api/v1/auth/profile", getProfile);
app.put("/api/v1/auth/profile", updateProfile);

//user.js
// only admin can perform operations
app.post("/api/v1/admin/users", createUser); // create new user only can admin do
app.put("/api/v1/admin/users/:id", editUser); // edit particular user .
app.delete("/api/v1/admin/users/:id", deleteUser); // delete user

app.get("/api/v1/alluser", displayAllUser);

//allow all domains

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
