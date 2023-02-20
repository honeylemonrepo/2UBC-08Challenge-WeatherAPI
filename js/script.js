var city = $("#search-input");
var submitBtn = $("#submit-btn");
var currentForcastWrapper = $(".current-weather");
const apiKey = "a4a63cafcc2efce63f95bb959387e446";
var cityName = "";
var weatherData = {};
const unit = "metric";
var todayDate = moment();
var citiesList = $(".previous-cities");
var cityHistory = [];

function renderCities() {
  var savedCity = JSON.parse(localStorage.getItem("cityHistory"));
  if (savedCity !== null) {
    cityHistory = savedCity;
    for (let i = 0; i < cityHistory.length; i++) {
      if (i === 4) {
        break;
      }
      var cityBtn = $("<button>").attr(
        "class",
        "btn btn-secondary btn-block cityBtn"
      );
      cityBtn.text(cityHistory[i]);
      citiesList.append(cityBtn);
    }
  }
}
// Search history buttons, click event
$(document).on("click", ".cityBtn", function (event) {
  cityName = event.target.innerText;
  console.log(cityName);
  $("#search-input").val(cityName);
  $(".currWeatherCard").remove();
  $(".five-days").remove();
  fetchWeather();
});

// Save new Input into local storage
function saveCityList(cityName) {
  let checkHistory = cityHistory.includes(cityName);
  if (!checkHistory && cityName !== "") {
    cityHistory.unshift(cityName);
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    citiesList.empty();
    renderCities();
  }
}

function display5days() {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 5; i < 38; i += 8) {
        // Create a div for each forecast card
        var fiveDayCard = $("<div>").attr("class", "five-days");
        var list = data.list[i];
        var main = data.list[i].main;
        $(".forecast-container").append(fiveDayCard);
        // Get the date and format using momentJs
        cardDate = moment(list.dt_txt.split(" ")[0]).format("YYYY-MM-DD");
        // Display Date
        fiveDayCard.append($("<h4>").html(cardDate));
        // Display Icon
        var iconCode = list.weather[0].icon;
        var urlIcon = `https://openweathermap.org/img/w/${iconCode}.png`;
        fiveDayCard.append($("<img>").attr("src", urlIcon));
        var weatherDescription = list.weather[0].description;
        fiveDayCard.append($("<p>").html(weatherDescription));
        // display temp, windspeed, and humidity
        var temp = Math.round(main.temp);
        fiveDayCard.append($("<p>").html("Temp: " + temp + "&#8451"));
        var windSpeed = list.wind.speed;
        fiveDayCard.append($("<p>").html("Wind Speed: " + windSpeed + "m/s"));
        var humidity = main.humidity;
        fiveDayCard.append($("<p>").html("Humidity: " + humidity + "%"));
      }
    });
}

function displayCurrentWeather() {
  var currTemp = Math.round(weatherData.list[0].main.temp);
  var currHumid = weatherData.list[0].main.humidity;
  var currWind = weatherData.list[0].wind.speed;
  var currDescription = weatherData.list[0].weather[0].description;
  var currIcon = weatherData.list[0].weather[0].icon;
  var currDate = weatherData.list[0].dt_txt;
  currentForcastWrapper.append(`
        <div class='currWeatherCard'>
        <h3>${weatherData.city.name} ${moment(currDate).format(
    "YYYY-MM-DD"
  )}</h3>
        <h5>${currDescription}</h5>
        <img class="inline" src="https://openweathermap.org/img/w/${currIcon}.png" alt="${currDescription}" title="${currDescription}">
        <p>Temp: ${currTemp}&deg C</p>
        <p>Wind: ${currWind} m/s</p>
        <p>Humidity: ${currHumid}%</p>
        </div>
      `);
  display5days();
}

function fetchWeather() {
  $.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}`
  ).then(function (data) {
    weatherData = data;
    displayCurrentWeather(weatherData);
  });
}

submitBtn.on("click", (e) => {
  e.preventDefault();
  cityName = city.val();
  $(".currWeatherCard").remove();
  $(".five-days").remove();
  console.log(cityName);
  saveCityList(cityName);
  fetchWeather();
});

function fetchWeatherKeyDown(event) {
  var keyCode = event.keyCode;
  cityName = city.val();
  $(".currWeatherCard").remove();
  $(".five-days").remove();
  if (keyCode === 13 && cityName) {
    $.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${unit}`
    ).then(function (data) {
      weatherData = data;
      displayCurrentWeather(weatherData);
      saveCityList(cityName);
    });
  }
}

function init() {
  city.keydown(fetchWeatherKeyDown);
  renderCities();
}

init();
