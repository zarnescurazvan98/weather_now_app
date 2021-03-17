let weather = {
    apiKey: "15d2b0504c37d0482628b77bb19e73dc",
    fetchWeather: function(city){
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function(data) {
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        const {temp_min} = data.main;
        const {temp_max} = data.main;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + " %";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        document.querySelector(".temp_min").innerText = "Min Temperature: " + temp_min + "°C";
        document.querySelector(".temp_max").innerText = "Max Temperature: " + temp_max + "°C";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function(){
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

let geocode = {
    reverseGeocode: function (latitude, longitude) {
      var apikey = "bf2efa8a0b6e4dfb8a7e3d6f10e7367a";
  
      var api_url = "https://api.opencagedata.com/geocode/v1/json";
  
      var request_url =
        api_url +
        "?" +
        "key=" +
        apikey +
        "&q=" +
        encodeURIComponent(latitude + "," + longitude) +
        "&pretty=1" +
        "&no_annotations=1";

      var request = new XMLHttpRequest();
      request.open("GET", request_url, true);
  
      request.onload = function () {  
        if (request.status == 200) {
          var data = JSON.parse(request.responseText);
          weather.fetchWeather(data.results[0].components.city);
          console.log(data.results[0].components.city)
        } else if (request.status <= 500) {
  
          console.log("unable to geocode! Response code: " + request.status);
          var data = JSON.parse(request.responseText);
          console.log("error msg: " + data.status.message);
        } else {
          console.log("server error");
        }
      };
  
      request.onerror = function () {
        console.log("unable to connect to server");
      };
  
      request.send();
    },
    getLocation: function() {
      function success (data) {
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, console.error);
      }
      else {
        weather.fetchWeather("Denver");
      }
    }
  };

document.querySelector(".search button").addEventListener("click", function(){
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        weather.search();
    }
});

geocode.getLocation();