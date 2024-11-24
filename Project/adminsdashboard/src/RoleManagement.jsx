import React, { useEffect, useState } from "react";
import axios from "axios";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/v1/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  };

  const addRole = async () => {
    if (!newRole.name.trim()) {
      alert("Role name cannot be empty!");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/v1/roles", newRole);
      fetchRoles();
      setNewRole({ name: "", permissions: [] });
    } catch (error) {
      console.error("Error adding role:", error.message);
    }
  };

  const deleteRole = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/roles/${id}`);
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error.message);
    }
  };

  return (
    <div>
      <h1>Role Management</h1>
      <div>
        <input
          type="text"
          placeholder="Role Name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
        />
        <br/>
        <button onClick={addRole}>Add Role</button>
        <br/>
      </div>
      <ul>
        {roles.map((role) => (
          <li key={role.id}>
            {role.name}
            <button onClick={() => deleteRole(role.id)} className="del">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoleManagement;
