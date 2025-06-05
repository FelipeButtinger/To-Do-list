const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
require('dotenv').config();
const path = require('path');

const app = express()
const SECRET_KEY = process.env.SECRET_KEY;

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'home.html'));
});

app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/html', express.static(path.join(__dirname, 'html')));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL!');
});

app.post('/register', async (req, res) => {
  const { name, password } = req.body;
  

  

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (name, password) VALUES (?, ?)';
  db.query(sql, [name, hashedPassword], (err, result) => {
      if (err) {
          console.error('Erro ao registrar usuário:', err);
          if(err.sqlMessage == `Duplicate entry '${name}' for key 'users.name'`){
            return res.status(500).json('Este usuário já existe');
          }else{
            return res.status(500).json({ error: 'Erro no servidor' });
          }
          
      }
      res.json({ message: 'Usuário registrado com sucesso!', userId: result.insertId });
  });
});
app.post('/login', async (req, res) => {
  const { name, password } = req.body; // Obtém o email e senha do corpo da requisição

  // Consulta o usuário no banco de dados
  db.query('SELECT * FROM users WHERE name= ?', [name], async (err, result) => {
    if (err) throw err;

    // Verifica se o usuário existe e se a senha está correta
    if (result.length === 0 || !(await bcrypt.compare(password, result[0].password))) {
      return res.status(400).send('Login ou senha inválidos');
    }

    // Gera o token JWT
    const token = jwt.sign({ name }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token }); // Retorna o token ao cliente
  });
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('Token não fornecido');
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Erro ao verificar token:', err);
      return res.sendStatus(403);
    }
    console.log('Usuário autenticado:', user); 
    req.user = user;
    next();
  });
};

app.get('/user', authenticateToken, (req, res) => {
  
  db.query('SELECT name,id FROM users WHERE name = ?', [req.user.name], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(result[0]); 
  });
});

app.post('/taskCreation', async (req, res) => {
  const { userId, taskName, importance } = req.body;
  
 const sqlConfire = 'select * from tasks WHERE taskname = ? and userId = ?;';
 db.query(sqlConfire, [taskName, userId], (err,result)=>{
  if(result.length === 0){
    const sql = 'insert into tasks(userId, taskName,importance,state) values (?,?,?,?);';
    db.query(sql, [userId,taskName,importance,0], (err, result) => {
      if (err) {
          console.error('Erro ao registrar task:', err);
          return res.status(500).json('Erro ao registrar task');
      }
      res.json({ message: 'Task registrada com sucesso!' });
  });
}else{
    return res.status(409).json('Esta task já existe');
}
 })

  
});

app.get('/task', async (req, res) => {
  const { userId } = req.query;  

  const sql = 'SELECT * FROM tasks WHERE userId = ?';
  
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro no servidor');
    }

    if (result.length === 0) {
      return res.status(404).send('Nenhuma task encontrada');
    }

    return res.json(result);
  });
});
app.delete('/task/:id', async (req,res)=>{
  const { id } = req.params;

  sql = 'DELETE from tasks where id = ?'

  db.query(sql,[id],(err,result)=>{
    if (err){
      console.log(err)
      return res.status(500).send('Erro ao deletar a task');
    }
    if(result.affectedRows === 0){
      return res.status(404).send('Task não encontrada');
    }
    return res.send('Task deletada com sucesso');
  })

})
app.patch('/task/:id', async (req,res)=>{
  const {id} = req.params;
  const {state} = req.body;

  sql = "UPDATE tasks set state = ? where id = ?"

  db.query(sql,[state,id],(err,result)=>{
    if (err){
      console.log(err)
      return res.status(500).send('Erro ao atualizar a task');
    }
    if(result.affectedRows === 0){
      return res.status(404).send('Task não encontrada');
    }
    return res.send('Task atualizada com sucesso');
  })
})
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
