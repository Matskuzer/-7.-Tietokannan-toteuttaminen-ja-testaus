import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State-tilat
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  // Haetaan käyttäjät API:sta
  const fetchUsers = () => {
    axios.get('http://localhost:3000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Virhe haettaessa käyttäjiä:', error));
  };

  // Käyttäjän tallentaminen (lisääminen/päivitys)
  const saveUser = () => {
    if (!username || !email) {
      alert('Käyttäjänimi ja sähköposti ovat pakollisia');
      return;
    }
  
    const newUser = { käyttäjänimi: username, sähköposti: email };
  
    if (editingUser) {
      // Päivitetään käyttäjä
      axios.put(`http://localhost:3000/update-user/${editingUser.numero}`, newUser)
        .then(() => {
          fetchUsers(); // Päivitetään lista API:sta
          setUsername('');
          setEmail('');
          setEditingUser(null);
        })
        .catch(error => console.error('Virhe päivitettäessä käyttäjää:', error));
    } else {
      // Lisätään uusi käyttäjä
      axios.post('http://localhost:3000/add-user', newUser)
        .then((response) => {
          setUsers(prevUsers => [...prevUsers, response.data]); // Lisätään uusi käyttäjä suoraan listalle
          setUsername('');
          setEmail('');
        })
        .catch(error => console.error('Virhe lisättäessä käyttäjää:', error));
    }
  };

  // Poistetaan käyttäjä
  const deleteUser = (id) => {
    axios.delete(`http://localhost:3000/delete-user/${id}`)
      .then(() => fetchUsers()) // Päivitetään lista
      .catch(error => console.error('Virhe poistettaessa käyttäjää:', error));
  };

  // Asetetaan muokattava käyttäjä
  const editUser = (user) => {
    setEditingUser(user);
    setUsername(user.käyttäjänimi);
    setEmail(user.sähköposti);
  };

  // Haetaan käyttäjät, kun komponentti latautuu
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1>User Management App</h1>
      
      {/* Lomake käyttäjän lisäämistä varten */}
      <div className="form-container">
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
        <button className="add-button" onClick={saveUser}>{editingUser ? 'Päivitä käyttäjä' : 'Lisää käyttäjä'}</button>
        {editingUser && <button className="cancel-button" onClick={() => setEditingUser(null)}>Peruuta</button>}
      </div>

      {/* Käyttäjälista */}
      <div className="user-list">
        <h2>Käyttäjät</h2>
        {users.length === 0 ? (
          <p>Ei käyttäjiä saatavilla.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.numero} className="user-item">
                <div className="user-info">
                  <span>{user.käyttäjänimi} - {user.sähköposti}</span>
                </div>
                <div className="user-actions">
                  <button className="edit-button" onClick={() => editUser(user)}>Muokkaa</button>
                  <button className="delete-button" onClick={() => deleteUser(user.numero)}>Poista</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
