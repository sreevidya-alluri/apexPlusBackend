const express = require('express');
const router = express.Router();
const { getPokemons, addPokemon, deletePokemon, updatePokemon,deleteAllPokemons,getPokemonById } = require('../controllers/pokemonController');

router.get('/', getPokemons);
router.get("/:id",getPokemonById)
router.post('/', addPokemon);
router.delete('/:id', deletePokemon);
router.put("/:id", updatePokemon);
router.delete("/",deleteAllPokemons);

module.exports = router;
