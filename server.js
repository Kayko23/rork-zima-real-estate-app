// Simple test server for authentication
// Run with: node server.js

const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());

// Mock users database
const users = [
  {
    id: 'user1',
    email: 'test@example.com',
    phone: '+225123456789',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    country: 'CI',
    city: 'Abidjan'
  },
  {
    id: 'provider1',
    email: 'provider@example.com',
    phone: '+225987654321',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'provider',
    country: 'CI',
    city: 'Abidjan',
    companyName: 'Smith Services',
    category: 'Agent immobilier'
  }
];

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, phone, password } = req.body;
  
  if (!password || (!email && !phone)) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const user = users.find(u => 
    (email && u.email === email) || 
    (phone && u.phone === phone)
  );

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { password: _, ...userWithoutPassword } = user;
  
  res.json({ 
    token: `token_${user.id}_${Date.now()}`, 
    user: userWithoutPassword 
  });
});

// Register endpoint
app.post('/auth/register', (req, res) => {
  const { email, phone, password, firstName, lastName, role, ...otherData } = req.body;
  
  if (!password || !firstName || !lastName || (!email && !phone)) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if user already exists
  const existingUser = users.find(u => 
    (email && u.email === email) || 
    (phone && u.phone === phone)
  );

  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    phone,
    password,
    firstName,
    lastName,
    role: role || 'user',
    ...otherData
  };

  users.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  
  res.json({ 
    token: `token_${newUser.id}_${Date.now()}`, 
    user: userWithoutPassword 
  });
});

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // In a real app, you would save to S3, GCS, etc.
  const fileId = `file_${Date.now()}`;
  const fileUrl = `https://example.com/files/${fileId}_${req.file.originalname}`;
  
  res.json({ 
    id: fileId, 
    url: fileUrl 
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', users: users.length });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Auth server running on port ${PORT}`);
  console.log(`📝 Test credentials:`);
  console.log(`   Email: test@example.com`);
  console.log(`   Phone: +225123456789`);
  console.log(`   Password: password123`);
});

module.exports = app;