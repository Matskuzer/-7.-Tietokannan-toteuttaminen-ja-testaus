import { useState, useEffect } from "react";
import axios from "axios";

export default function ReadDeleteUsers({ refresh, buttonClass = "btn btn-danger" }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/users");
            setUsers(response.data);
        } catch (err) {
            setError("Error fetching users: " + (err.response?.data?.error || err.message));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refresh]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            fetchUsers();
            setMessage(`User with ID ${id} deleted successfully.`);
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <h2>Users List</h2>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        User ID: {user.id}, Name: {user.name}, Email: {user.email}
                        <button onClick={() => handleDelete(user.id)} className={buttonClass}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}