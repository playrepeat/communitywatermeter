const pool = require('../db'); // Your database connection

const UserModel = {
    // Fetch user by ID
    async getUserById(userId) {
        const query = 'SELECT id, email, first_name, last_name, apartment, time_added FROM watermeterusers WHERE id = $1';
        const result = await pool.query(query, [userId]);
        return result.rows[0]; // Return the user object or null if not found
    },

    // Add a new user
    async addUser(email, firstName, lastName, apartment) {
        const query = `
            INSERT INTO watermeterusers (email, first_name, last_name, apartment, time_added)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id, email, first_name, last_name, apartment;
        `;
        const result = await pool.query(query, [email, firstName, lastName, apartment]);
        return result.rows[0]; // Return the newly created user
    },

    // Update user details
    async updateUser(userId, updates) {
        const { firstName, lastName, apartment } = updates;
        const query = `
            UPDATE watermeterusers
            SET first_name = $1, last_name = $2, apartment = $3
            WHERE id = $4
            RETURNING id, email, first_name, last_name, apartment;
        `;
        const result = await pool.query(query, [firstName, lastName, apartment, userId]);
        return result.rows[0]; // Return the updated user
    },

    // Delete user
    async deleteUser(userId) {
        const query = 'DELETE FROM watermeterusers WHERE id = $1';
        await pool.query(query, [userId]);
        return true; // Indicate success
    }
};

module.exports = UserModel;
