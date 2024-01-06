let weather = document.getElementById("weather"),
   search = document.getElementById("search"),
   days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
   ];

if (navigator.geolocation) {
   navigator.geolocation.getCurrentPosition(function (position) {
      var y = position.coords.latitude;
      var x = position.coords.longitude;
      display(`${y} ${x}`);
   });
}
search.addEventListener("input", async function () {
   if (/\w{1,}/.test(search.value)) {
      let weatherData = [];
      let myHttp = await fetch(
         `https://api.weatherapi.com/v1/search.json?key=6604b0953f764b359e0115848240501&q=${search.value}`
      );
      weatherData = JSON.parse(myHttp.response);
      if (weatherData.length > 0) {
         display(weatherData[0].url);
      }
   }
});

async function display(search) {
   let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=6604b0953f764b359e0115848240501&q=${search}&days=7`
   );
   let weatherCity = await response.json();
   const apiToday = weatherCity.forecast.forecastday[0];
   const dateToDay = new Date(apiToday.date);
   const toDay = days[dateToDay.getDay()];
   weather.innerHTML = `
   <div class="col-md-4">
   <div class="text-white text-center d-flex flex-column align-items-center">
            <h2 class="fw-bold">${weatherCity.location.country}</h2>
      <h2 class="fw-bold">${weatherCity.location.name}</h2>
      <h5> ${toDay}</h5>
   </div>
</div>
<div class="col-md-4">
   <div class="text-white d-flex flex-column align-items-center">
      <div>
         <span class="d-flex align-items-center ">
            <img
               src="https:${weatherCity.current.condition.icon}"
               alt=""
               style="width: 50px; "
               
            />
            <p class="px-2">${weatherCity.current.condition.text}</p>
         </span>
         <span class="d-flex align-items-center p-2"
            ><img
               src="https://cdn.weatherapi.com/weather/64x64/day/176.png"
               alt=""
               style="width: 30px"
            />
            <p class="px-3">${weatherCity.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
         </span>
         <span class="d-flex align-items-center p-2"
            ><img
               src="images/icon-wind.png"
               alt=""
               style="width: 20px"
            />
            <p class="px-3">${weatherCity.current.wind_kph}km/h</p>
         </span>
         <span class="d-flex align-items-center p-2"
            ><img
               src="images/icon-compass.png"
               alt=""
               style="width: 20px ; margin-left: 5px;"
            />
            <p class="px-3">${weatherCity.current.wind_dir}</p>
         </span>
      </div>
   </div>
</div>
<div class="col-md-4">
   <div class="d-flex flex-column align-items-center">
      <p class="display-1 fw-bold text-white">${weatherCity.current.temp_c}º C</p>
   </div>
</div>

      
      `;
   for (let i = 0; i < weatherCity.forecast.forecastday.length; i++) {
      const path = weatherCity.forecast.forecastday[i + 1];
      const daysDiv = document.createElement("div");
      const date = new Date(path.date);
      const day = days[date.getDay()];
      daysDiv.classList.add("col-lg-2", "text-white");
      daysDiv.innerHTML = `
      <div class="contain">
      <img src="https:${path.day.condition.icon}" style="width: 80px" alt="" />
      <h5> ${day}</h5>
      <p>+${path.day.maxtemp_c}º C</p>
   </div>
      `;
      weather.appendChild(daysDiv);
   }
}
