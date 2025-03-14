import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = () => {
    axios.get('http://localhost:3000/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Virhe haettaessa käyttäjiä:', error));
  };

  const saveUser = () => {
    if (!username || !email) {
      alert('Käyttäjänimi ja sähköposti ovat pakollisia');
      return;
    }
    
    if (editingUser) {
      axios.put(`http://localhost:3000/update-user/${editingUser.numero}`, { käyttäjänimi: username, sähköposti: email })
        .then(() => {
          fetchUsers();
          setUsername('');
          setEmail('');
          setEditingUser(null);
        })
        .catch(error => console.error('Virhe päivitettäessä käyttäjää:', error));
    } else {
      axios.post('http://localhost:3000/add-user', { käyttäjänimi: username, sähköposti: email })
        .then(() => {
          fetchUsers();
          setUsername('');
          setEmail('');
        })
        .catch(error => console.error('Virhe lisättäessä käyttäjää:', error));
    }
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:3000/delete-user/${id}`)
      .then(() => fetchUsers())
      .catch(error => console.error('Virhe poistettaessa käyttäjää:', error));
  };

  const editUser = (user) => {
    setEditingUser(user);
    setUsername(user.käyttäjänimi);
    setEmail(user.sähköposti);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container">
      <h1>Käyttäjien hallinta</h1>
      
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
    </div>
  );
}

export default App;