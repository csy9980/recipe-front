import React from 'react';
import '../styles/FilterOption.css';

const FILTERS = [
    {id: 'vegan', label: 'Vegan'},
    {id: 'glutenFree', label: 'Gluten Free'},
    {id: 'lowFodmap', label: 'Low FODMAP'},
]

function FilterOption({filters, onChange}){
    const handleToggle = (filterId) => {
        onChange({
            ...filters,
            [filterId]: !filters[filterId],
        })
    }

    return (
        <div className="filter-box">
            {FILTERS.map(({ id, label }) => (
                <div key={id} className="filter-item">
                    <input
                        type="checkbox"
                        id={`filter-${id}`}
                        checked={filters[id] || false}
                        onChange={() => handleToggle(id)}
                    />
                    <label htmlFor={`filter-${id}`}>{label}</label>
                </div>
            ))}
        </div>
    );

    // return (
    //     <div className='filter-box'>
    //         {FILTERS.map(({id, label})=>(
    //             <label key={id}>
    //                 <span></span>
    //                 <input 
    //                     type="checkbox"
    //                     checked={filters[id] || false}
    //                     onChange={()=>handleToggle(id)}
    //                 />
    //                 {label}
    //             </label>
    //         ))}
    //     </div>
    // );
}

export default FilterOption;