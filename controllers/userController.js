const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dataFilePath = path.join(__dirname, '../data/users.json');

if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf-8');
}

const getUsers = (req, res) => {
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        try {
            const users = JSON.parse(data);
            res.json(users);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
};

const addUser = (req, res) => {
    const newUser = { id: uuidv4(), ...req.body };
    console.log('New User:', newUser);
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        try {
            const users = JSON.parse(data);
            users.push(newUser);
            fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error('Error writing data:', err);
                    return res.status(500).json({ error: 'Failed to write data' });
                }
                res.status(201).json(newUser);
            });
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
};

const deleteUser = (req, res) => {
    const { id } = req.params;
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        try {
            const users = JSON.parse(data);
            const updatedUsers = users.filter(user => user.id !== id);
            fs.writeFile(dataFilePath, JSON.stringify(updatedUsers, null, 2), (err) => {
                if (err) {
                    console.error('Error writing data:', err);
                    return res.status(500).json({ error: 'Failed to write data' });
                }
                res.status(200).json({ message: 'User deleted successfully' });
            });
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        try {
            let users = JSON.parse(data);
            users = users.map(user => user.id === id ? { ...user, ...updatedData } : user);
            fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error('Error writing data:', err);
                    return res.status(500).json({ error: 'Failed to write data' });
                }
                res.status(200).json({ message: 'User updated successfully' });
            });
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
};

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    updateUser
};
