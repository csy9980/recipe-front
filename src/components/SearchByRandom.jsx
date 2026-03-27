import React, { useState } from 'react';
import RecipeList from './RecipeList';
import RecipeDetail from './RecipeDetail';
import '../styles/SearchByRandom.css';

const RandomRecipeContainer = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const apiKey = '67a5801a75e74408977cf263fa6ef898';

  const fetchRandomRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=5`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (id) => {
    setSelectedRecipeId(id);
  };

  const handleCloseDetail = () => {
    setSelectedRecipeId(null);
  };

  return (
    <div className='random-container'>
      <h1>Try out the random recipe picker!</h1>
      <img src='/images/random.png' alt='' className='random-bg-img' />
      {!selectedRecipeId && (
        <>
          <div className='random-btn'>
            <button onClick={fetchRandomRecipes} disabled={loading}>{loading ? 'Loading…' : 'Get 5 random recipes!'}<span></span></button>            
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <RecipeList recipes={recipes} onRecipeClick={handleRecipeClick} />
        </>
      )}

      {selectedRecipeId && (
        <RecipeDetail recipeId={selectedRecipeId} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default RandomRecipeContainer;