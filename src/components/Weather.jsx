import React, { useEffect, useState } from 'react';
import '../styles/Weather.css';

function Weather({ onKeywordDetected, weatherApiKey }) {
    const [loading, setLoading] = useState(false);
    const [weather, setWeather] = useState(null);
    const [message, setMessage] = useState('');
    const city = 'seoul';

    useEffect(()=>{
        const fetchWeather = async () =>{
            try {
                const response = await fetch ( 
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}`
                );
                if(!response.ok){
                    throw new Error("Failed to get weather information!");
                }
                const data = await response.json();
                setWeather(data);
            } catch (err) {
                console.log('Error fetching weather:', err);
                setMessage('Failed to get weather information 😢');
            }
        };
        fetchWeather();
    },[city, weatherApiKey]);

    const fetchWeatherAndRecommend = async () => {
        if (!weather) return;
        
        setLoading(true);
        setMessage('');
        
        try {
                const keyword = mapWeatherToKeyword(weather);
                onKeywordDetected(keyword);

                const description = weather.weather[0].description;
                setMessage(<>I recommend <span style={{color: '#38b2ac', fontWeight: 'bold'}}>{keyword}</span> dishes on <span style={{color: '#38b2ac', fontWeight: 'bold'}}>{description}</span> days like today!</>);

            } catch(err) {
                console.error('Error recommending weather:', err);
                setMessage('Failed to recommend dishes 😢');
            }
    };

    const mapWeatherToKeyword = (data) => {
        const condition = data.weather[0].main.toLowerCase();
        const temp = data.main.temp;

        if (['cloud', 'rain'].some(keyword => condition.includes(keyword))) return 'Soup';
        if (temp > 30) return 'Salad';
        if (temp < 10) return 'Stew';
        if (condition.includes('clear')) return 'smoothie';
        if (condition.includes('snow')) return 'Stew';
        return 'Korean Food';
    };

    return (
            <div className='weather-box'>
                {weather && weather.weather && (
                    <div className='weather-now'>
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt=''/>
                        <p>{weather.weather[0].description}</p>                
                    </div>
                )}
                <div className='weather-btn-box'>
                    <button onClick={fetchWeatherAndRecommend} disabled={loading}>
                        {loading ? 'Now recommending...' : 'Find recipes for today’s weather?'}
                    </button>
                </div>
                {message && <p className='weather-msg'>{message}</p>}
            </div>
    );
}

export default Weather;
