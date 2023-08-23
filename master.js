const currentPositionButton = document.getElementById("current");
const fiveDaysContainer = document.getElementsByClassName("five-days")[0];
const apikey = "93e9f1c4c04aaf3176619689dc71742e";
let longitude;
let latitude;
currentPositionButton.addEventListener("click", () => {
  // location.reload();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(myLocation, showError);
  }
});

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function myLocation(position) {
  //   console.log(position.coords.latitude);
  //   console.log(position.coords.longitude);
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  let instantData = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apikey}&units=metric`
  )
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      instantWeather(data);
    });
  fiveDaysContainer.innerHTML = "";
  let fiveDaysData = fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apikey}&units=metric`
  )
    .then((data) => {
      return data;
    })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      showFive(data);
    });
}
function instantWeather(data) {
  const weather = document.getElementsByClassName("weather")[0];
  if (weather.children.length > 0) {
    weather.children[1].remove();
    weather.children[0].remove();
  }

  const name = document.getElementById("name");
  name.innerHTML = data.name;

  const date = document.getElementById("date");
  const todayDate = new Date(data.dt * 1000);
  const year = todayDate.getFullYear();
  const month = todayDate.getMonth() + 1;
  const day = todayDate.getDate();
  date.innerHTML = `${year}-${month}-${day}`;

  const temp = document.getElementById("temp");
  temp.innerHTML = data.main.temp;

  const wind = document.getElementById("wind");
  wind.innerHTML = data.wind.speed;

  const humidity = document.getElementById("humidity");
  humidity.innerHTML = data.main.humidity;

  let icon = document.createElement("div");
  icon.className = "icon";
  let image = document.createElement("img");
  image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  icon.appendChild(image);
  weather.appendChild(icon);

  let weatherText = document.createElement("p");
  weatherText.innerHTML = data.weather[0].description;
  weatherText.style.textAlign = "center";
  weather.appendChild(weatherText);
}
function showFive(data) {
  for (let i in data.list) {
    if (data.list[i].dt_txt.includes("09:00:00", 10)) {
      const box = document.createElement("div");
      box.className = "five";

      const date = document.createElement("h3");
      const iteratorDate = new Date(data.list[i].dt * 1000);
      const year = iteratorDate.getFullYear();
      const month = iteratorDate.getMonth() + 1;
      const day = iteratorDate.getDate();
      date.innerHTML = `(${year}-${month}-${day})`;
      box.appendChild(date);

      let icon = document.createElement("div");
      icon.className = "icon";
      let image = document.createElement("img");
      image.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
      icon.appendChild(image);
      box.appendChild(icon);
      let weatherText = document.createElement("p");
      weatherText.innerHTML = data.list[i].weather[0].description;

      box.appendChild(weatherText);

      let temp = document.createElement("p");
      temp.innerHTML = `Temp: ${data.list[i].main.temp}°C`;
      box.appendChild(temp);

      let wind = document.createElement("p");
      wind.innerHTML = `Wind: ${data.list[i].wind.speed} M/S`;
      box.appendChild(wind);

      let humidity = document.createElement("p");
      humidity.innerHTML = `Humidity: ${data.list[i].main.humidity}%`;
      box.appendChild(humidity);

      fiveDaysContainer.appendChild(box);
    }
  }
}

let cityButton = document.getElementById("search");

cityButton.addEventListener("click", () => {
  const inputCity = document.querySelector(".container .location input");
  const city = inputCity.value.trim();
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apikey}`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      latitude = data[0].lat;
      longitude = data[0].lon;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`
      )
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          instantWeather(data);
        });

      fiveDaysContainer.innerHTML = "";
      let fiveDaysData = fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`
      )
        .then((data) => {
          return data;
        })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          showFive(data);
        });
    });
});

// console.log(longitude)
// console.log(latitude)
