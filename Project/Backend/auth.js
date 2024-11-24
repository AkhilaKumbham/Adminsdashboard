const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const SECRET_KEY = "your-secret-key";

// helper function for reading data from file
const readUsersFromFile = () => {
  const data = fs.readFileSync("db.json", "utf8");
  return JSON.parse(data);
};

// helper function for reading data
const writeUsersToFile = (users) => {
  fs.writeFileSync("db.json", JSON.stringify(users));
};

const isAdmin = (req, res, next) => {
  const token = req.headers.cookie?.split("=")[1];
  console.log("header", token);
  if (!token) return res.status(401).json({ message: "Access token required" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only!" });
    }

    req.user = decoded; // decoded contains user data from cookies
    next(); // move to next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 1. Login
const login = (req, res) => {
  const { email, password } = req.body;

  const users = readUsersFromFile();
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(404).json({ message: "User not found!" });

  // check if user is inactive
  if (user.status !== "Active") {
    return res
      .status(403)
      .json({ message: "Your account is inactive. Please contact support." });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid password!" });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: "1d",
  });
  res.cookie("jwt", token);
  res.json({ message: "Login successful", user });
};

// 2. Logout
const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.json({ message: "Logout successful" });
};

// 3. Get Profile
const getProfile = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const users = readUsersFromFile();
    const user = users.find((u) => u.id === decoded.id);

    if (!user) return res.status(404).json({ message: "User not found!" });

    const { password, ...profile } = user;
    res.json(profile);
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 4. Update Profile
const updateProfile = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.id === decoded.id);

    if (userIndex < 0)
      return res.status(404).json({ message: "User not found!" });

    const { name, avatar } = req.body;
    users[userIndex] = {
      ...users[userIndex],
      name,
      avatar,
      updatedAt: new Date(),
    };

    writeUsersToFile(users);
    res.json({
      message: "Profile updated successfully",
      user: users[userIndex],
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  isAdmin,
  login,
  logout,
  getProfile,
  updateProfile,
  readUsersFromFile,
  writeUsersToFile,
};
