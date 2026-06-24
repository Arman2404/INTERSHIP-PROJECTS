const API_KEY = "35f668ca0a076364ac17aed220a5cc6e";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const city = document.getElementById("city");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("icon");

const loader = document.getElementById("loader");

const historyList = document.getElementById("historyList");

let searches =
    JSON.parse(localStorage.getItem("cities")) || [];

renderHistory();

searchBtn.addEventListener("click", () => {

    getWeather(cityInput.value);

});

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {
        getWeather(cityInput.value);
    }

});

async function getWeather(cityName) {

    if (cityName === "") {
        return;
    }

    loader.classList.remove("hidden");

    try {

        const response =
            await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
            );

        const data = await response.json();

        if (data.cod !== 200) {

            alert("City not found");
            return;
        }

        city.textContent =
            `${data.name}, ${data.sys.country}`;

        temp.textContent =
            `${data.main.temp} °C`;

        condition.textContent =
            data.weather[0].main;

        humidity.textContent =
            `Humidity: ${data.main.humidity}%`;

        wind.textContent =
            `Wind Speed: ${data.wind.speed} m/s`;

        icon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            // console.log(icon.src);
        document.getElementById("weatherData").style.display = "block";

        saveHistory(cityName);

    }
    catch (error) {

        alert("Something went wrong");

    }
    finally {

        loader.classList.add("hidden");

    }

}

function saveHistory(city) {

    if (!searches.includes(city)) {

        searches.unshift(city);

        if (searches.length > 5) {

            searches.pop();
        }

        localStorage.setItem(
            "cities",
            JSON.stringify(searches)
        );

        renderHistory();
    }
}

function renderHistory() {

    historyList.innerHTML = "";

    searches.forEach(cityName => {

        const li =
            document.createElement("li");

        li.textContent = cityName;

        li.addEventListener("click", () => {

            getWeather(cityName);

        });

        historyList.appendChild(li);

    });

}