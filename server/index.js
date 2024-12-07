const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const jwt = require('jsonwebtoken');
const SECRET_KEY = "secret123";

const users = [{ username: "admin", password: "password" }];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send("Token is required");

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send("Invalid token");
        req.user = user;
        next();
    });
};

app.get('/home', verifyToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}`, token: req.headers['authorization'] });
});

