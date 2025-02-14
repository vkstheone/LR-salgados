// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const ADMIN_EMAIL = 'admin@pditabira.com';

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const dbPath = path.join(__dirname, '..', 'database', 'feedbacks.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

const createTableQuery = 
CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL
);;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Erro ao criar tabela:', err.message);
    }
});

app.post('/submit-feedback', (req, res) => {
    console.log('Dados recebidos:', req.body);
    const { name, rating, comment, email } = req.body;

    if (!name || !rating || !comment || !email) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const insertQuery = 
INSERT INTO feedbacks (name, email, rating, comment)
VALUES (?, ?, ?, ?);;

    db.run(insertQuery, [name, email, rating, comment], (err) => {
        if (err) {
            console.error('Erro ao inserir feedback:', err.message);
            res.status(500).send('Erro ao salvar o feedback.');
        } else {
            res.redirect('/index.html?comentario=sucesso'); // Redirecionamento atualizado
        }
    });
});

app.get('/feedbacks', (req, res) => {
    const selectQuery = 
SELECT * FROM feedbacks
ORDER BY id DESC;;

    db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar feedbacks:', err.message);
            res.status(500).send('Erro ao buscar feedbacks.');
        } else {
            res.json(rows);
        }
    });
});

app.use(express.static(path.join(__dirname, '../../front-end')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../front-end', 'index.html'));
});

app.listen(PORT, () => {
    console.log(Servidor rodando em http://localhost:${PORT});
});
app.delete('/feedbacks/:id', (req, res) => {
    const feedbackId = req.params.id;
    const userEmail = req.body.email;

    if (!userEmail) {
        return res.status(400).json({ message: 'Email é obrigatório para excluir o comentário.' });
    }

    let sql, params;

    if (userEmail === ADMIN_EMAIL) {
        // Se o email for o de administrador, excluir qualquer comentário pelo ID
        sql = 'DELETE FROM feedbacks WHERE id = ?';
        params = [feedbackId];
    } else {
        // Caso contrário, só excluir se o email coincidir
        sql = 'DELETE FROM feedbacks WHERE id = ? AND email = ?';
        params = [feedbackId, userEmail];
    }

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Erro ao excluir feedback:', err.message);
            return res.status(500).json({ message: 'Erro ao excluir feedback.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: 'Comentário não encontrado ou email incorreto.' });
        }

        res.json({ message: 'Comentário excluído com sucesso!' });
    });
});
O ChatGPT disse: