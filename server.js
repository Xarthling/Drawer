const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'assessmentUsers.json');

// Middleware
app.use(cors());
app.use(express.json());

// Utility function to read data from the file
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return []; // Return empty array if there is an error
  }
};

// Utility function to write data to the file
const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// Utility function to generate unique IDs
const generateUniqueID = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// GET: Retrieve all users
app.get('/users', (req, res) => {
  const users = readDataFromFile();
  res.json(users);
});

// GET: Retrieve a user by ID
app.get('/users/:id', (req, res) => {
  const users = readDataFromFile();
  const user = users.find((u) => u.UserID === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// POST: Add a new user
app.post("/create-user", (req, res) => {
  const newUser = req.body;
  newUser.UserID = generateUniqueID(); // Assign a unique ID to the new user

  // Validate the incoming user data (basic check)
  if (!newUser.UserFirstname || !newUser.UserLastname || !newUser.UserEmail) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Read the current data from the JSON file
  const currentData = readDataFromFile();

  // Add the new user to the array
  currentData.push(newUser);

  // Write the updated data back to the JSON file
  writeDataToFile(currentData);

  // Respond with a success message
  res.status(201).json({ message: "User created successfully", user: newUser });
});

// PUT: Update an existing user by ID
app.put('/users/:id', (req, res) => {
  let users = readDataFromFile();
  const userIndex = users.findIndex((u) => u.UserID === parseInt(req.params.id));

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...req.body }; // Merge existing data with new data
    writeDataToFile(users);
    res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// DELETE: Remove a user by ID
app.delete('/users/:id', (req, res) => {
  let users = readDataFromFile();
  const updatedUsers = users.filter((u) => u.UserID !== parseInt(req.params.id));

  if (updatedUsers.length !== users.length) {
    writeDataToFile(updatedUsers);
    res.status(200).json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
