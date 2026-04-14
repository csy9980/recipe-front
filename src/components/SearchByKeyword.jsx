import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import RecipeList from './RecipeList';
import Pagination from './Pagination';
import RecipeDetail from './RecipeDetail';
import FilterOption from './FilterOption';
import Weather from './Weather';
import '../styles/SearchByKeyword.css'

const apiKey = `67a5801a75e74408977cf263fa6ef898`;
const weatherApiKey = 'c0a7c729e2c48706d6ab5b2450d1aae9';

function SearchByKeyword() {
    const [query, setQuery] = useState('');
    const [recipe, setRecipe] = useState([]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    const numberPerPage = 9;
    const[filters, setFilters]=useState({
        vegan: false,
        glutenFree: false,
        lowFodmap: false,
    })

    const handleSearch = (searchTerm) => {
        setQuery(searchTerm);
        setPage(1);
        setHasSearched(true);
        setSelectedRecipeId(null);
    }

    useEffect(()=>{
        if (!query.trim()) {
            setRecipe([]);
            setTotalResults(0);    
            return;
        }

        const findRecipe = async ()=>{
            try {
                const offset = (page - 1) * numberPerPage;

                let dietParams = [];
                let intoleranceParams = [];

                if (filters.vegan) dietParams.push('vegan');
                if (filters.glutenFree) intoleranceParams.push('gluten');
                if (filters.lowFodmap) intoleranceParams.push('FODMAP');

                let url = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=${numberPerPage}&offset=${offset}&apiKey=${apiKey}&addRecipeNutrition=true`;
                if (dietParams.length > 0) {
                    url += `&diet=${dietParams.join(',')}`;
                }
                if (intoleranceParams.length > 0) {
                    url += `&intolerances=${intoleranceParams.join(',')}`;
                }

                const response = await fetch(url);
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                setRecipe(data.results);
                setTotalResults(data.totalResults);
                console.log(data.results);

            } catch(err) {
                console.log('검색 중 오류 발생:', err);
            }
        };
        findRecipe();
    },[query, page, filters.vegan, filters.glutenFree, filters.lowFodmap]);

    // query변경시 page값 1로 변경
    useEffect(() => {
        setPage(1);
    }, [query]);

    // 페이지 변경 함수
    const totalPages = Math.ceil(totalResults / numberPerPage);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return; // 무시하는 경우
        setPage(newPage);
        setSelectedRecipeId(null);
    };    

    const handleRecipeClick = (id)=>{
        console.log('selected recipe ID:', id);
        setSelectedRecipeId(id);
    }

    const handleCloseDetail = ()=>{
        setSelectedRecipeId(null);
    }

    const handleKeywordFromWeather = (keyword) => {
        console.log('keyword from weather:', keyword);
        setSearchInput(keyword);
    };


    return (
        <div className='keyword-container'>
            <SearchBar onSearch={handleSearch} initialValue={searchInput} onToggleOptions={() => setShowOptions(prev => !prev)}/>
            {showOptions && (
                <div className='option-box'>
                    <FilterOption filters={filters} onChange={setFilters}/>
                </div>
            )}
            <Weather onKeywordDetected={handleKeywordFromWeather} weatherApiKey={weatherApiKey}/>
            
            {hasSearched && (
                <div className="search-summary">
                    We found {totalResults} recipes for you.
                </div>
            )}


            {!selectedRecipeId && (
                <>
                    <RecipeList recipes={recipe} onRecipeClick={handleRecipeClick} />
                    {hasSearched && totalPages > 0 && (
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

export default SearchByKeyword;