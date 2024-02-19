var map = L.map('map').setView([46.603354, 1.888334], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var franceBounds = [[51.1242, -5.1389], [41.3439, 9.5600]];

map.fitBounds(franceBounds);


var date = new Date();
var jour = date.getDate();
var mois = date.getMonth() + 1;
var annee = date.getFullYear();
var dateAujourdhui = jour + '/' + mois + '/' + annee;

document.getElementById("date").textContent = dateAujourdhui;

function capitalizeWords(str) {
    return str.replace(/\b\w/, function (char) {
        return char.toUpperCase();
    });
}

var marker

//une seule fonction
// document.getElementById("rechercherBtn").addEventListener("click", function () {
//     var adresse = document.getElementById("recherche").value;
//     var url = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(adresse) + "&autocomplete=1";

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             data.features.forEach(feature => {
//                 var cityName = feature.properties.city.toLowerCase();
//                 if (cityName === adresse.toLowerCase()) {
//                     var cityCoordinates = feature.geometry.coordinates;
//                     var cityNameFormatted = capitalizeWords(cityName);

//                     map.setView([cityCoordinates[1], cityCoordinates[0]], 13);

//                     document.getElementById("name").textContent = cityNameFormatted;
//                     console.log("x:", cityCoordinates[0]);
//                     console.log("y:", cityCoordinates[1]);
//                     var openWeatherMapUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityCoordinates[1] + "&lon=" + cityCoordinates[0] + "&lang=fr&appid=0d47d640a383307597fca125db84f064";

//                     fetch(openWeatherMapUrl)
//                         .then(response => response.json())
//                         .then(weatherData => {
//                             var temperature = weatherData.list[0].main.temp;
//                             var clouds = weatherData.list[0].clouds.all;
//                             var humidity = weatherData.list[0].main.humidity;
//                             var windSpeed = weatherData.list[0].wind.speed;
//                             var weatherDescription = weatherData.list[0].weather[0].description;

//                             var temperatureCelsius = (temperature - 273.15).toFixed(2);
//                             var windSpeedKmh = (windSpeed * 3.6).toFixed(2);

//                             document.getElementById("temperature").textContent = temperatureCelsius + "°C";
//                             document.getElementById("vitesse").textContent = windSpeedKmh + " km/h";
//                             document.getElementById("precip").textContent = clouds + "%";
//                             document.getElementById("humid").textContent = humidity + "%";
//                             document.getElementById("temps").textContent = capitalizeWords(weatherDescription);

//                             var weatherImage = document.getElementById("weather");
//                             if (weatherDescription.includes("légère pluie")) {
//                                 weatherImage.src = "./image/rain.png";
//                             } else if (weatherDescription.includes("nuageux")) {
//                                 weatherImage.src = "./image/broken_clouds.png";
//                             } else if (weatherDescription.includes("légères chutes de neige")) {
//                                 weatherImage.src = "./image/snow.png";
//                             } else if (weatherDescription.includes("orageux")) {
//                                 weatherImage.src = "./image/thunderstorm.png";
//                             } else if (weatherDescription.includes("brouillard")) {
//                                 weatherImage.src = "./image/mist.png";
//                             } else if (weatherDescription.includes("couvert")) {
//                                 weatherImage.src = "./image/few_clouds.png";
//                             } else if (weatherDescription.includes("pluie modérée")) {
//                                 weatherImage.src = "./image/shower rain.png";
//                             } else if (weatherDescription.includes("partiellement nuageux")) {
//                                 weatherData.src = "./image/scattered_clouds.png";
//                             } else {
//                                 weatherImage.src = "./image/clear_sky.png";
//                             }
//                             if (marker) {
//                                 map.removeLayer(marker);
//                             }
//                             marker = L.marker([cityCoordinates[1], cityCoordinates[0]]).addTo(map);
//                             markers.push(marker);
//                         })
//                         .catch(error => {
//                             console.error('Erreur lors de la récupération des données météorologiques:', error);
//                         });
//                 }
//             });
//         })
//         .catch(error => {
//             console.error('Erreur lors de la récupération des données:', error);
//         });
// });



//fonctions séparées
function rechercherAdresse() {
    var adresse = document.getElementById("recherche").value;
    var url = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(adresse) + "&autocomplete=1";
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                var cityName = feature.properties.city.toLowerCase();
                if (cityName === adresse.toLowerCase()) {
                    var cityCoordinates = feature.geometry.coordinates;
                    var cityNameFormatted = capitalizeWords(cityName);
                    
                    map.setView([cityCoordinates[1], cityCoordinates[0]], 13);
                    
                    document.getElementById("name").textContent = cityNameFormatted;
                    console.log("x:", cityCoordinates[0]);
                    console.log("y:", cityCoordinates[1]);
                    
                    obtenirDonneesMeteo(cityCoordinates);
                }
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données:', error);
        });
    }
    
    function obtenirDonneesMeteo(coordinates) {
        var openWeatherMapUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[1] + "&lon=" + coordinates[0] + "&lang=fr&appid=0d47d640a383307597fca125db84f064";
        
        fetch(openWeatherMapUrl)
        .then(response => response.json())
        .then(weatherData => {
            var temperature = weatherData.list[0].main.temp;
            var clouds = weatherData.list[0].clouds.all;
            var humidity = weatherData.list[0].main.humidity;
            var windSpeed = weatherData.list[0].wind.speed;
            var weatherDescription = weatherData.list[0].weather[0].description;
            
            var temperatureCelsius = (temperature - 273.15).toFixed(2);
            var windSpeedKmh = (windSpeed * 3.6).toFixed(2);
            
            document.getElementById("temperature").textContent = temperatureCelsius + "°C";
            document.getElementById("vitesse").textContent = windSpeedKmh + " km/h";
            document.getElementById("precip").textContent = clouds + "%";
            document.getElementById("humid").textContent = humidity + "%";
            document.getElementById("temps").textContent = capitalizeWords(weatherDescription);
            
            var weatherImage = document.getElementById("weather");
            if (weatherDescription.includes("légère pluie")) {
                weatherImage.src = "./image/rain.png";
            } else if (weatherDescription.includes("nuageux")) {
                weatherImage.src = "./image/broken_clouds.png";
            } else if (weatherDescription.includes("légères chutes de neige")) {
                weatherImage.src = "./image/snow.png";
            } else if (weatherDescription.includes("orageux")) {
                weatherImage.src = "./image/thunderstorm.png";
            } else if (weatherDescription.includes("brouillard")) {
                weatherImage.src = "./image/mist.png";
            } else if (weatherDescription.includes("couvert")) {
                weatherImage.src = "./image/few_clouds.png";
            } else if (weatherDescription.includes("pluie modérée")) {
                weatherImage.src = "./image/shower rain.png";
            } else if (weatherDescription.includes("partiellement nuageux")) {
                weatherData.src = "./image/scattered_clouds.png";
            } else {
                weatherImage.src = "./image/clear_sky.png";
            }
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);
            markers.push(marker);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données météorologiques:', error);
        });
    }
    
    document.getElementById("rechercherBtn").addEventListener("click", function () {
        rechercherAdresse();
    });