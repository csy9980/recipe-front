import React, { useEffect, useState } from 'react';
import '../styles/SearchBar.css';

function SearchBar({onSearch, initialValue, onToggleOptions}) {
    const [input, setInput] = useState(initialValue || '');

    useEffect(()=>{
        if(initialValue !== undefined ){
            setInput(initialValue);
        }
    },[initialValue]);

    const handleSubmit = (e)=>{
        e.preventDefault();
        if(input.trim()){
            onSearch(input.trim());
        }
    }

    return (
        <div className='search-bar-area'>
            <form onSubmit={handleSubmit} className='search-keyword'>
                <input 
                    type="text" 
                    placeholder="Search for a recipe you want to try" 
                    value={input}
                    onChange={(e)=> setInput(e.target.value)}
                />
                <button type='submit'></button>
            </form>
            <button className='filter-icon' onClick={onToggleOptions}></button>
        </div>

    );
}

export default SearchBar;