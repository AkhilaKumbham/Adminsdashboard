const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const readUsersFromFile = () => {
  const data = fs.readFileSync("db.json", "utf8");
  return JSON.parse(data);
};

const writeUsersToFile = (users) => {
  fs.writeFileSync("db.json", JSON.stringify(users));
};

const createUser = (req, res) => {
  try {
    const { name, email, password, avatar, role, status } = req.body;

    const users = readUsersFromFile();
    const userExists = users.find((u) => u.email === email);

    if (userExists)
      return res.status(400).json({ message: "User already exists!" });

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      avatar:
        avatar ||
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
      role: role || "User",
      status: status || "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    writeUsersToFile(users);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
};

const editUser = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, avatar, role, status } = req.body;

    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex < 0)
      return res.status(404).json({ message: "User not found!" });

    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      avatar: avatar || users[userIndex].avatar,
      role: role || users[userIndex].role,
      status: status || users[userIndex].status,
      updatedAt: new Date(),
    };

    writeUsersToFile(users);
    res.json({ message: "User updated successfully", user: users[userIndex] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

const deleteUser = (req, res) => {
  try {
    const { id } = req.params;

    const users = readUsersFromFile();
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex < 0)
      return res.status(404).json({ message: "User not found!" });

    const deletedUser = users.splice(userIndex, 1); // remove user
    writeUsersToFile(users);

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

const displayAllUser = (req, res) => {
  try {
    const users = readUsersFromFile();
    const excludePwd = users.map(({ password, ...user }) => user);
    res.json(excludePwd);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

module.exports = {
  createUser,
  editUser,
  deleteUser,
  displayAllUser,
};
