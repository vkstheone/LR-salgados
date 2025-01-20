// Importar módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Configurar banco de dados SQLite
const db = new sqlite3.Database('./feedbacks.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabela para feedbacks se não existir
const createTableQuery = `CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL
);`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Erro ao criar tabela:', err.message);
    }
});

// Rota para processar envio de feedbacks
app.post('/submit-feedback', (req, res) => {
    console.log('Dados recebidos:', req.body);
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const insertQuery = `INSERT INTO feedbacks (name, rating, comment) VALUES (?, ?, ?)`;
    db.run(insertQuery, [name, rating, comment], (err) => {
        if (err) {
            console.error('Erro ao inserir feedback:', err.message);
            res.status(500).send('Erro ao salvar o feedback.');
        } else {
            res.redirect('/');
        }
    });
});

// Rota para buscar feedbacks
app.get('/feedbacks', (req, res) => {
    const selectQuery = `SELECT * FROM feedbacks ORDER BY id DESC`; // Ordenar por mais recentes, se desejado
    db.all(selectQuery, [], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar feedbacks:', err.message);
            res.status(500).send('Erro ao buscar feedbacks.');
        } else {
            res.json(rows); // Retorna os feedbacks como JSON
        }
    });
});


// Rota para deletar um feedback pelo ID
app.delete('/feedbacks/:id', (req, res) => {
    const feedbackId = req.params.id;

    const query = 'DELETE FROM feedbacks WHERE id = ?';

    db.run(query, [feedbackId], function (err) {
        if (err) {
            console.error('Erro ao excluir feedback:', err.message);
            return res.status(500).json({ message: 'Erro ao excluir feedback.' });
        }

        // Verifica se algum registro foi realmente excluído
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Feedback não encontrado.' });
        }

        res.status(200).json({ message: 'Feedback excluído com sucesso!' });
    });
});



app.get('/feedback.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'feedback.html'));
});


// Iniciar servidor
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
