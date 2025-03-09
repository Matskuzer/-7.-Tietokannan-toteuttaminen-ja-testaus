import { useState } from "react";
import axios from "axios";

export default function DeleteUser() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await axios.delete(`http://localhost:3000/users/${id}`);
      setMessage("User deleted successfully: " + response.data.id);
      setId("");
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <h2>Delete User</h2>
      <form onSubmit={handleDelete}>
        <input
          type="text"
          placeholder="User ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="submit">Delete</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}