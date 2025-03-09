const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Ensure cors is imported and used before routes

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());  // Allow CORS requests globally
app.use(express.static('public')); // Serve static files from 'public' directory

// Connect to the database
const db = new sqlite3.Database('.mydatabase.db', (err) => {
    if (err) {
        console.error('Virhe tietokantaa avatessa:', err.message);
    } else {
        console.log('Yhteys SQLite-tietokantaan on muodostettu.');
    }
});

// Create table if it doesn't exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        numero INTEGER PRIMARY KEY AUTOINCREMENT,
        käyttäjänimi TEXT NOT NULL,
        sähköposti TEXT NOT NULL UNIQUE
    )`);
});

// Endpoint to add a user
app.post('/add-user', (req, res) => {
    const { käyttäjänimi, sähköposti } = req.body;
    if (!käyttäjänimi || !sähköposti) {
        return res.status(400).send('Käyttäjänimi ja sähköposti ovat pakollisia');
    }

    db.run(`INSERT INTO users (käyttäjänimi, sähköposti) VALUES (?, ?)`, [käyttäjänimi, sähköposti], function(err) {
        if (err) {
            return res.status(500).send('Virhe lisättäessä tietuetta: ' + err.message);
        }
        res.status(201).send(`Käyttäjä lisätty numerolla: ${this.lastID}`);
    });
});

// Endpoint to get all users
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Virhe haettaessa tietueita: ' + err.message);
        }
        res.status(200).json(rows);
    });
});

// Endpoint to update a user
app.put('/update-user/:numero', (req, res) => {
    const { numero } = req.params;
    const { käyttäjänimi, sähköposti } = req.body;
    if (!käyttäjänimi || !sähköposti) {
        return res.status(400).send('Käyttäjänimi ja sähköposti ovat pakollisia');
    }

    db.run(`UPDATE users SET käyttäjänimi = ?, sähköposti = ? WHERE numero = ?`, [käyttäjänimi, sähköposti, numero], function(err) {
        if (err) {
            return res.status(500).send('Virhe päivittäessä tietuetta: ' + err.message);
        }
        if (this.changes === 0) {
            return res.status(404).send('Käyttäjää ei löytynyt');
        }
        res.status(200).send(`Käyttäjä päivitetty numerolla: ${numero}`);
    });
});

// Endpoint to delete a user
app.delete('/delete-user/:numero', (req, res) => {
    const { numero } = req.params;

    db.run(`DELETE FROM users WHERE numero = ?`, numero, function(err) {
        if (err) {
            return res.status(500).send('Virhe poistettaessa tietuetta: ' + err.message);
        }
        if (this.changes === 0) {
            return res.status(404).send('Käyttäjää ei löytynyt');
        }
        res.status(200).send(`Käyttäjä poistettu numerolla: ${numero}`);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Palvelin käynnissä portissa ${PORT}`);
});

// Close the database connection when the app is terminated
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Virhe suljettaessa tietokantaa:', err.message);
        } else {
            console.log('Tietokantayhteys suljettu.');
        }
        process.exit(0);
    });
});

