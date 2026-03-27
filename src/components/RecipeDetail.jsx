import React, { useEffect, useState } from 'react';
import '../styles/RecipeDetail.css';

function RecipeDetail({ recipeId, onClose }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiKey = `67a5801a75e74408977cf263fa6ef898`;

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setDetail(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [recipeId, apiKey]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!detail) return null;

    const {title, image, summary, instructions, extendedIngredients } = detail;

    return (
        <div className='detail-container'>
            <h2>{title}</h2>
            <img src={image} alt={title} className='detail-img'/>
            <h3 className='small-title'>Ingredients</h3>
            <ul>
                {extendedIngredients.map(ing => (
                    <li key={ing.id}>{ing.original}</li>
                ))}
            </ul>
            <h3 className='small-title'>Instructions</h3>
            <div dangerouslySetInnerHTML={{ __html: instructions }} className='detail-instruction'></div>
            <h3 className='small-title'>Summary</h3>
            <p dangerouslySetInnerHTML={{ __html: summary }} className='detail-summary'></p>
            <div className='back-btn'>
                <button className='back-to-list' onClick={onClose}>Back to list</button>
            </div>
        </div>
    );
}

export default RecipeDetail;