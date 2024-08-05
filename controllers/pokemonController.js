const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataFilePath = path.join(__dirname, '../data/pokemons.json');

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf-8');
}

// Route handlers

const getPokemons = (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }

        try {
            const jsonData = JSON.parse(data);
            console.log('Pokémons data:', jsonData);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
};

const addPokemon = (req, res) => {
    const newPokemon = { id: uuidv4(), ...req.body };
    console.log('New Pokemon:', newPokemon);
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        let pokemons;
        try {
            pokemons = JSON.parse(data);
            console.log(pokemons);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).json({ error: 'Failed to parse data' });
        }
        pokemons.push(newPokemon);
        console.log('Updated Pokemons:', pokemons);
        fs.writeFile(dataFilePath, JSON.stringify(pokemons, null, 2), (err) => {
            if (err) {
                console.error('Error writing data:', err);
                return res.status(500).json({ error: 'Failed to write data' });
            }
            res.status(201).json(newPokemon);
        });
    });
};

const deletePokemon = (req, res) => {
    const { id } = req.params;
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        let pokemons;
        try {
            pokemons = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).json({ error: 'Failed to parse data' });
        }
        const updatedPokemons = pokemons.filter(pokemon => pokemon.id !== id);
        fs.writeFile(dataFilePath, JSON.stringify(updatedPokemons, null, 2), (err) => {
            if (err) {
                console.error('Error writing data:', err);
                return res.status(500).json({ error: 'Failed to write data' });
            }
            res.status(200).json({ message: 'Pokemon deleted successfully' });
        });
    });
};

const deleteAllPokemons = (req, res) => {
    fs.writeFile(dataFilePath, JSON.stringify([], null, 2), (err) => {
        if (err) {
            console.error('Error writing data:', err);
            return res.status(500).json({ error: 'Failed to delete all Pokémon' });
        }
        res.status(200).json({ message: 'All Pokémon deleted successfully' });
    });
};

const updatePokemon = (req, res) => {
    const { id } = req.params;
    const updatedPokemon = req.body;

    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }

        let pokemons;
        try {
            pokemons = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).json({ error: 'Failed to parse data' });
        }

        const index = pokemons.findIndex(pokemon => pokemon.id === id);
        if (index === -1) {
            return res.status(404).json({ error: 'Pokemon not found' });
        }

        pokemons[index] = { ...pokemons[index], ...updatedPokemon };

        fs.writeFile(dataFilePath, JSON.stringify(pokemons, null, 2), (err) => {
            if (err) {
                console.error('Error writing data:', err);
                return res.status(500).json({ error: 'Failed to write data' });
            }
            res.status(200).json({ message: 'Pokemon updated successfully' });
        });
    });
};

const getPokemonById = (req, res) => {
    const { id } = req.params;
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        let pokemons;
        try {
            pokemons = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing data:', parseError);
            return res.status(500).json({ error: 'Failed to parse data' });
        }
        const pokemon = pokemons.find(p => p.id === id);
        if (!pokemon) {
            return res.status(404).json({ error: 'Pokémon not found' });
        }
        res.json(pokemon);
    });
};

module.exports = {
    getPokemons,
    addPokemon,
    deletePokemon,
    updatePokemon,
    getPokemonById,
    deleteAllPokemons,
};
