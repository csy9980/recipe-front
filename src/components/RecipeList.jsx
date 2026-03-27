import Recipe from './Recipe';
import '../styles/RecipeList.css';

function RecipeList({recipes, onRecipeClick}) {
    return (
        <ul className='recipe-list'>
            {recipes.map((recipe)=>{
                return(
                    <Recipe recipe={recipe} key={recipe.id} onClick={() => onRecipeClick(recipe.id)}></Recipe>
                )
            })}
        </ul>
    );
}

export default RecipeList;