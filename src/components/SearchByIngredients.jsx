import React, { useEffect, useState } from 'react';
import RecipeList from './RecipeList';
import Pagination from './Pagination';
import RecipeDetail from './RecipeDetail';
import '../styles/SearchByIngredients.css';

function SearchByIngredients() {
    const [input, setInput] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe] = useState([]);
    const [page, setPage] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const apiKey = `67a5801a75e74408977cf263fa6ef898`;
    const numberPerPage = 9;

    // API findByIngredients는 offset 지원 안해서 페이지네이션은 자르기 등으로 처리 필요. 한 페이지 결과만
    const addIngredient = () => {
        if (input.trim() && !ingredients.includes(input.trim())) {
            setIngredients(prev => [...prev, input.trim()]);
            setInput('');
        }
    };

    const searchRecipes = async () => {
        if (ingredients.length === 0) return;
        try {
            setHasSearched(true);
            const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=${numberPerPage}&apiKey=${apiKey}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRecipe(data); // data 배열
            // totalResults는 따로 없음
            setPage(1); // 페이지 1로 초기화
        } catch (err) {
            console.error('검색 중 오류 발생:', err);
        }
    };

    const handlePageChange = (newPage) => {
        // findByIngredients API는 페이지네이션 지원 안함
        setPage(newPage);
        setSelectedRecipeId(null);
    };

    const handleRecipeClick = (id) => {
        setSelectedRecipeId(id);
    };

    const handleCloseDetail = () => {
        setSelectedRecipeId(null);
    };

    // client-side pagination (간단히 예시)
    const totalPages = Math.ceil(recipe.length / numberPerPage);
    const displayedRecipes = recipe.slice((page - 1) * numberPerPage, page * numberPerPage);

    const removeIngredient = (ingredientToRemove) => {
        setIngredients((prev) => prev.filter(ing => ing !== ingredientToRemove));
    };


    return (
        <div className='ingredients-container'>
            <div className='ingredients-search-bar'>
                <div className='ingredients-input-form'>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type in an ingredient and press the 'Add Ingredient' button"
                    />
                    <button className='btn-search' onClick={searchRecipes}></button>
                </div>
                <button className='btn-add' onClick={addIngredient}>Add Ingredient</button>
            </div>
            
            <ul className='added-ingredients'>
                {ingredients.map((ing, i) => (
                    <li key={i}>
                        <span>{ing}</span>
                        <button 
                            className="remove-ingredient-btn" 
                            onClick={() => removeIngredient(ing)}
                        ></button>                        
                    </li>
                ))}
            </ul>

            {hasSearched && (
                <div className="search-summary">
                    We found {recipe.length} recipes for you
                </div>
            )}

            {!selectedRecipeId && (
                <>
                    <RecipeList recipes={displayedRecipes} onRecipeClick={handleRecipeClick} />
                {/* <div className="pagination-summary">
                    {page} / total {totalPages} pages
                </div> */}
                    {hasSearched && totalPages > 1 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}

            {selectedRecipeId && (
                <RecipeDetail
                    recipeId={selectedRecipeId}
                    apiKey={apiKey}
                    onClose={handleCloseDetail}
                />
            )}
        </div>
    );
}

export default SearchByIngredients;
