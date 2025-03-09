import { useState } from "react";
import axios from "axios";

export default function UpdateUser({ onUserUpdated, buttonClass = "btn btn-warning" }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleUpdate = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await axios.put(`http://localhost:3000/users/${id}`, {
                name,
                email,
            });
            setMessage("User updated successfully: " + response.data.id);
            setId("");
            setName("");
            setEmail("");
            if (onUserUpdated) onUserUpdated(); // Kutsutaan päivitysfunktiota
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <h2>Update User</h2>
            <form onSubmit={handleUpdate}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className={buttonClass}>Update</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}