import React, { useEffect, useState } from 'react';
import humidityIcon from '../assets/humidity.png';
import windIcon from '../assets/wind.png';
import heatIcon from '../assets/heat.png';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [query, setQuery] = useState('');
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async (cityName) => {
    try {
      const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=4&aqi=no&alerts=no`);
      const data = await res.json();
      console.log(data);
      
      if (data.error) return alert(data.error.message);

      setWeather(data);
      setForecast(data.forecast.forecastday.slice(1, 4));
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    }
  };

  const handleSearch = () => {
    if (query.trim()) fetchWeather(query);
  };

    useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (err) => {
          console.warn("Geolocation ruxsati rad etildi:", err.message);
        }
      );
    } else {
      alert("Brauzeringiz geolocationni qo‘llab-quvvatlamaydi");
    }
  }, []);

  return (
    <div className="pt-20 box min-h-screen bg-gradient-to-br from-blue-300 via-yellow-100 to-yellow-300 bg-cover bg-center p-6">
      <div className="max-w-3xl mx-auto bg-white/30 backdrop-blur-md rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">Ob-havo ilovasi</h1>

        <div className="flex gap-4 justify-center mb-8">
          <input
            type="text"
            placeholder="Shahar nomini yozing..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 rounded-md w-2/3 border border-gray-300 focus:outline-none"
          />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"> Qidirish</button>
        </div>

        {weather && (
          <div className="grid  md:grid-cols-2 gap-6 items-start">
            <div className="text-center backdrop-blur-xs rounded-2xl py-5">
              <h2 className="text-xl font-semibold">{weather.location.name}, {weather.location.country}</h2>
              <p className="text-2xl font-medium mt-2 flex flex-col items-center">
                <img src={weather.current.condition.icon} alt="icon" />
                {weather.current.temp_c}°C - {weather.current.condition.text}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/40 backdrop-blur-md rounded-lg shadow-md p-4 text-center">
              <img src={heatIcon} className='mx-auto w-11 my-3' alt="" />
                  <h4 className="font-bold mt-2">Issiqlik</h4>
                <span>{weather.current.temp_c}°C</span>
              </div>
              <div className="bg-white/40 backdrop-blur-md rounded-lg shadow-md p-4 text-center">
               <img src={windIcon} className='mx-auto w-9 my-4' alt="" />
                <h4 className="font-bold mt-2">Shamol</h4>
                <span>{weather.current.wind_kph} km/soat</span>
              </div>
              <div className="bg-white/40 backdrop-blur-md rounded-lg shadow-md p-4 text-center">
                <img src={humidityIcon} alt="icon" className="mx-auto w-11 my-3" />
                <h4 className="font-bold mt-2">Namlik</h4>
                <span>{weather.current.humidity}%</span>
              </div>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="mt-10 ">
            <h3 className="text-lg font-semibold mb-4 text-amber-100">Keyingi 2 kun:</h3>
            <div className="grid sm:grid-cols-2 gap-4 ">
              {forecast.map((day, num) => (
                <div key={num} className="backdrop-blur-3xl rounded-lg shadow-md p-4 text-center">
                  <p>{day.date}</p>
                  <img src={day.day.condition.icon} alt="icon" className="mx-auto" />
                  <p className='text-gray-950'>{day.day.condition.text}</p>
                  <p>{day.day.avgtemp_c}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
