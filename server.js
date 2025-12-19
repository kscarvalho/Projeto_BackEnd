require('dotenv').config();


const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');


const app = express();


// 🔒 CORS (troque pelo seu GitHub Pages)
app.use(cors({
origin: 'https://SEUUSUARIO.github.io'
}));


app.use(express.json());


const USERS_FILE = './users.json';


if (!fs.existsSync(USERS_FILE)) {
fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}


// 📌 CADASTRO
app.post('/register', (req, res) => {
const { name, email, password } = req.body;


if (!name || !email || !password) {
return res.status(400).json({ message: 'Preencha todos os campos' });
}


const users = JSON.parse(fs.readFileSync(USERS_FILE));


if (users.find(u => u.email === email)) {
return res.status(400).json({ message: 'Usuário já existe' });
}


const hashedPassword = bcrypt.hashSync(password, 10);


users.push({ name, email, password: hashedPassword });
fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));


res.json({ message: 'Usuário cadastrado com sucesso' });
});


// 🔑 LOGIN
app.post('/login', (req, res) => {
const { email, password } = req.body;


const users = JSON.parse(fs.readFileSync(USERS_FILE));
const user = users.find(u => u.email === email);


if (!user) {
return res.status(400).json({ message: 'Usuário não encontrado' });
}


if (!bcrypt.compareSync(password, user.password)) {
return res.status(400).json({ message: 'Senha inválida' });
}


res.json({ message: 'Login realizado com sucesso', name: user.name });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));