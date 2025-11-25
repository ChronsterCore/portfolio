document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const weatherStatusEl = document.getElementById('weather-status');
    const weatherIconEl = document.getElementById('weather-icon');
    const calendarGridEl = document.getElementById('calendar-grid');
    const calendarMonthEl = document.getElementById('calendar-month');
    const recentUploadsGridEl = document.getElementById('recent-uploads-grid');

    // --- WEATHER LOGIC ---

    // !!! IMPORTANT PROTOTYPE NOTE !!!
    // For this prototype to work for everyone without setup, the API key is placed here.
    // In a real, public application, this key should be hidden on a server to keep it secure.
    const API_KEY = "22c6d18cb2a2453b8714f9abf3749ffc"; // <--- PASTE YOUR KEY HERE

    /**
     * This is the main function that starts the weather process.
     * It tries to get the user's location first.
     */
    function initializeWeather() {
        // Check if the API key has been set
        if (API_KEY === "YOUR_API_KEY_GOES_HERE" || !API_KEY) {
            console.error("API Key is not set in home.js. Weather will not function.");
            weatherStatusEl.textContent = "Weather Unavailable";
            return;
        }

        // Check if the browser supports Geolocation
        if ("geolocation" in navigator) {
            // Ask for user's current position
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
        } else {
            // Geolocation is not available, fall back to a default city
            console.log("Geolocation not available. Fetching weather for default city.");
            fetchWeatherByCity("New York");
        }
    }

    /**
     * Callback function for when geolocation is successful.
     * @param {GeolocationPosition} position - The position object from the browser.
     */
    function geolocationSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherByCoords(lat, lon);
    }

    /**
     * Callback function for when geolocation fails or is denied.
     * @param {GeolocationPositionError} error - The error object.
     */
    function geolocationError(error) {
        console.warn(`Geolocation error (${error.code}): ${error.message}`);
        // If user denies permission or another error occurs, fall back to a default city.
        weatherStatusEl.innerHTML = `Location access denied.<br>Showing weather for New York.`;
        fetchWeatherByCity("New York");
    }

    /**
     * Fetches weather data using latitude and longitude.
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     */
    async function fetchWeatherByCoords(lat, lon) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        fetchAndDisplayWeather(apiUrl);
    }

    /**
     * Fetches weather data using a city name.
     * @param {string} city - The name of the city.
     */
    async function fetchWeatherByCity(city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        fetchAndDisplayWeather(apiUrl);
    }

    /**
     * Generic function to fetch from a given API URL and update the UI.
     * @param {string} apiUrl - The full OpenWeatherMap API URL.
     */
    async function fetchAndDisplayWeather(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Weather API request failed with status ${response.status}`);
            }
            const data = await response.json();
            updateWeatherUI(data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            weatherStatusEl.textContent = "Weather Unavailable";
        }
    }

    /**
     * Updates the HTML elements with the fetched weather data.
     * @param {object} data - The weather data object from the API.
     */
    function updateWeatherUI(data) {
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
        const city = data.name;
        
        weatherStatusEl.textContent = `${city}: ${temp}°C, ${description}`;

        const iconCode = data.weather[0].icon;
        weatherIconEl.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;
    }


    // --- OTHER PAGE LOGIC ---

    /**
     * Renders the calendar preview for the current month.
     */
    function renderCalendarPreview() {
        const now = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        calendarMonthEl.textContent = monthNames[now.getMonth()];

        const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        calendarGridEl.innerHTML = ''; // Clear grid

        // Add day names
        daysOfWeek.forEach(day => {
            const dayNameEl = document.createElement('div');
            dayNameEl.className = 'day-name';
            dayNameEl.textContent = day;
            calendarGridEl.appendChild(dayNameEl);
        });

        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGridEl.appendChild(document.createElement('div'));
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayNumberEl = document.createElement('div');
            dayNumberEl.className = 'day-number';
            dayNumberEl.textContent = i;
            if (i === now.getDate()) {
                dayNumberEl.classList.add('today');
            }
            calendarGridEl.appendChild(dayNumberEl);
        }
    }

    /**
     * Renders the most recent uploads from localStorage.
     */
    function renderRecentUploads() {
        const wardrobe = JSON.parse(localStorage.getItem('styloWardrobe')) || [];
        recentUploadsGridEl.innerHTML = '';

        if (wardrobe.length === 0) {
            recentUploadsGridEl.innerHTML = `<p class="no-recent-uploads">You haven't uploaded any clothes yet!</p>`;
            return;
        }

        const recentItems = wardrobe.slice(-4).reverse(); 

        recentItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'image-grid-item';
            const altText = `Clothing item: ${Array.isArray(item.types) ? item.types.join(', ') : 'Unknown'}`;
            itemEl.innerHTML = `<img src="${item.image}" alt="${altText}">`;
            recentUploadsGridEl.appendChild(itemEl);
        });
    }

    // --- Initial Execution ---
    initializeWeather(); // This now starts the whole weather process.
    renderCalendarPreview();
    renderRecentUploads();
});