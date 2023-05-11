const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const DBPATH = 'C:\\Users\\fexex\\Documents\\projeto_pessoal\\modelagem.db';
const app = express();

app.use(express.json());
app.use(urlencodedParser);

app.get('/listaExperiencia', (req, res) => {
    const db = new sqlite3.Database(DBPATH);
    const sql = 'SELECT * FROM Experiência';

    db.all(sql, [], (error, rows) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json(rows);
        }
    });

    db.close();
});

app.post('/insereExperiencia', (req, res) => {
    const experiencia = req.body;
    const db = new sqlite3.Database(DBPATH);
    const sql = `INSERT INTO Experiência (candidato_id, empresa, cargo, data_inicio, data_fim, descricao) VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [experiencia.candidato_id, experiencia.empresa, experiencia.cargo, experiencia.data_inicio, experiencia.data_fim, experiencia.descricao], function (error) {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(201).json({ id: this.lastID });
        }
    });

    db.close();
});

app.get('/atualizaExperiencia/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(DBPATH);
    const sql = 'SELECT * FROM Experiência WHERE id = ?';

    db.all(sql, [id], (error, rows) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json(rows[0]);
        }
    });

    db.close();
});

app.post('/atualizaExperiencia/:id', (req, res) => {
    const { id } = req.params;
    const updatedExperiencia = req.body;
    const db = new sqlite3.Database(DBPATH);
    const sql = `UPDATE Experiência SET candidato_id = ?, empresa = ?, cargo = ?, data_inicio = ?, data_fim = ?, descricao = ? WHERE id = ?`;

    db.run(sql, [updatedExperiencia.candidato_id, updatedExperiencia.empresa, updatedExperiencia.cargo, updatedExperiencia.data_inicio, updatedExperiencia.data_fim, updatedExperiencia.descricao, id], function (error) {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json({ affectedRows: this.changes });
        }
    });

    db.close();
});

app.delete('/removeExperiencia/:id', (req, res) => {
    const { id } = req.params;
    const db = new sqlite3.Database(DBPATH);
    const sql = 'DELETE FROM Experiência WHERE id = ?';

    db.run(sql, [id], function (error) {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(200).json({ affectedRows: this.changes });
        }
    });

    db.close();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
