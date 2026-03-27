import React from 'react';

function Recipe({recipe, onClick}) {
    const {title, image, nutrition} = recipe;
    const calories = nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount;
    return (
        <li className='recipe-card' onClick={onClick}>
            <img src={image} alt="" className='recipe-card-img'/>
            <div className='recipe-card-info'>
                <h3 className='recipe-card-title'>{title}</h3>
                {calories && <p className='recipe-card-cal'>Calories: {Math.round(calories)} kcal</p>}
            </div>
        </li>
    );
}

export default Recipe;