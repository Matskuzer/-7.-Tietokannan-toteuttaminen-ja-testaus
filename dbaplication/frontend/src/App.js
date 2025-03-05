import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Hakee kaikki käyttäjät backendiltä
  const fetchUsers = () => {
    axios.get('http://localhost:3000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Virhe haettaessa käyttäjiä:', error));
  };

  // Lisää käyttäjä backendille
  const addUser = () => {
    if (!username || !email) {
      alert('Käyttäjänimi ja sähköposti ovat pakollisia');
      return;
    }

    axios.post('http://localhost:3000/add-user', { käyttäjänimi: username, sähköposti: email })
      .then(() => {
        fetchUsers(); // Päivittää käyttäjäluettelon
        setUsername('');
        setEmail('');
      })
      .catch(error => console.error('Virhe lisättäessä käyttäjää:', error));
  };

  // Käynnistetään käyttäjälistan haku komponentin latautuessa
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>Käyttäjien hallinta</h1>
      
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Käyttäjänimi"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Sähköposti"
        />
        <button onClick={addUser}>Lisää käyttäjä</button>
      </div>

      <h2>Kaikki käyttäjät:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.numero}>
            {user.käyttäjänimi} - {user.sähköposti}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
