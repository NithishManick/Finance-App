const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const verifyToken = require('./middleware/authentication');
const app = express();
app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, './json/data.json');
const itemsFilePath = path.join(__dirname, './json/items.json');

const dotenv = require('dotenv')
dotenv.config();

const readData = (filePath) => {
    try {
      const data = fs.readFileSync(filePath);
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return [];
    }
  };
  
  const writeData = (filePath, data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(`Error writing to file ${filePath}:`, err);
    }
  };




app.get('/users', (req, res) => {
  const users = readData(dataFilePath);
  res.status(200).json({ data: users });
});


const getNextId = (items) => {
    if (items.length === 0) return 1;
    return Math.max(...items.map(item => item.userId)) + 1;
  };

  app.post('/users', (req, res) => {
    const { username, email, password, token } = req.body;
    const users = readData(dataFilePath);
    const newUser = {
      userId: getNextId(users),
      username,
      email,
      password,
      token,
    };
    users.push(newUser);
    writeData(dataFilePath, users);
    res.status(200).json({ data: newUser });
  });


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readData(dataFilePath);
 
  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (password !== user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWTSECRET, { expiresIn: '1h' });


  user.token = token;
  console.log("TOKEN : ",token)
  fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));

  const isLoggedIn = true;
  return res.status(200).json({ isLoggedIn,  id: user._id,message: 'Login successfully', token });
});


const verifyToken = (req, res, next) => {
  const requestToken = req.body.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;

  if (!requestToken) {
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  let token = requestToken;

  if (requestToken.startsWith('Bearer ')) {
    token = requestToken.split(' ')[1];
  }

  try {
    const users = readData(dataFilePath);
    console.log("Users:", users);
    const user = users.find(user => user.token === token); 
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.userId = user.userId; 
    console.log("USER ID:", req.userId);
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    return res.status(401).json({
      status: false,
      message: 'Invalid token provided',
    });
  }
};



app.get('/items', verifyToken, (req, res) => {
  const items = readData(itemsFilePath);
  console.log("USER ID VALIE PASSED :",req.userId)
  const userItems = items.filter(item => item.userId === req.userId);
  if (userItems.length === 0) {
    return res.status(404).json({ message: 'No items found for this user' });
  }
  res.status(200).json({ data: userItems });
});



const getNextItemId = (items, userId) => {
    const userItems = items.filter(item => item.userId === userId);
    if (userItems.length === 0) return 1;
    return Math.max(...userItems.map(item => item.itemId)) + 1;
  };


app.post('/items', verifyToken, (req, res) => {
    const { description, category, amount,date } = req.body;
    const userId = req.userId;
    console.log("UserId:", userId);
    const items = readData(itemsFilePath);
  
   const nextItemId = getNextItemId(items, userId);
   const newItem = {
      userId: parseInt(userId),
      itemId: nextItemId,
      description,
      category,
      amount,
      date,
    };
  
    items.push(newItem);
  
    writeData(itemsFilePath, items);
  
    res.status(200).json({ data: newItem });
  });

  app.get('/items/:itemId', verifyToken, (req, res) => {
  const { itemId } = req.params;
  const userId = req.userId;

  const items = readData(itemsFilePath);
  const itemIndex = items.findIndex(item => item.userId === parseInt(userId) && item.itemId === parseInt(itemId));

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.status(200).json(items[itemIndex]);
});
  



  app.put('/items/:itemId', verifyToken, (req, res) => {
    const { itemId } = req.params;
    const { description, category, amount } = req.body;
    const userId =req.userId;

    const items = readData(itemsFilePath);
    const itemIndex = items.findIndex(item => item.userId === parseInt(userId) && item.itemId === parseInt(itemId));
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }
  
     const updatedItem = {
      ...items[itemIndex],
      description: description !== undefined ? description : items[itemIndex].description,
      category: category !== undefined ? category : items[itemIndex].category,
      amount: amount !== undefined ? amount : items[itemIndex].amount,
    };
  
    items[itemIndex] = updatedItem;
    writeData(itemsFilePath, items);
    res.status(200).json({ data: updatedItem });
  });
  
  

  app.delete('/items/:itemId', verifyToken, (req, res) => {
    const { itemId } = req.params;
    const items = readData(itemsFilePath);
    const userId =req.userId;
    const newItems = items.filter(item => item.userId !== parseInt(userId) || item.itemId !== parseInt(itemId));
    
    if (newItems.length === items.length) {
      return res.status(404).json({ message: 'Item not found' });
    }
  
    writeData(itemsFilePath, newItems);
    
    res.status(200).json({ message: 'Item deleted successfully' });
  });
  
  

app.listen(3002, () => {
  console.log('Server is Started');
});
