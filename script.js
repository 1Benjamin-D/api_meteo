


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

var marker;

function rechercherAdresse() {
    var adresse = document.getElementById("recherche").value.trim();
    var url = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(adresse) + "&autocomplete=1";
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        var features = data.features;
        if (features.length === 0) {
            console.error('Aucun résultat trouvé.');
            return;
        }
        
        var cityFound = false;
            var chosenFeature;
            
            features.forEach(feature => {
                var city = feature.properties.city.toLowerCase();
                var postalCode = feature.properties.postcode;
                var fullAddress = city + ' ' + postalCode;
                var fullAddress2 = city + ', ' + postalCode;
                var fullAddress3 = city + ' ,' + postalCode;
                var fullAddress4 = city + ',' + postalCode;
                var fullAddress5 = city + '' + postalCode;
                var fullAddress6 = postalCode + ' ' + city;
                var fullAddress7 = postalCode + ', ' + city;
                var fullAddress8 = postalCode + ' ,' + city;
                var fullAddress9 = postalCode + ',' + city;
                var fullAddress10 = postalCode + '' + city;
                
                if (adresse.toLowerCase() === city || adresse === postalCode || adresse.toLowerCase() === fullAddress || adresse.toLowerCase() === fullAddress2 || adresse.toLowerCase() === fullAddress3 || adresse.toLowerCase() === fullAddress4 || adresse.toLowerCase() === fullAddress5 || adresse.toLowerCase() === fullAddress6 || adresse.toLowerCase() === fullAddress7 || adresse.toLowerCase() === fullAddress8 || adresse.toLowerCase() === fullAddress9 || adresse.toLowerCase() === fullAddress10) {
                    cityFound = true;
                    chosenFeature = feature;
                }
            });

            if (!cityFound) {
                alert('Aucun résultat trouvé pour l\'adresse spécifiée.');
                return;
            }
            
            if (adresse === chosenFeature.properties.postcode && features.length > 1) {
                var randomIndex = Math.floor(Math.random() * features.length);
                chosenFeature = features[randomIndex];
            }

            var cityCoordinates = chosenFeature.geometry.coordinates;
            var cityNameFormatted = capitalizeWords(chosenFeature.properties.city);
            
            if (typeof map !== 'undefined') {
                map.setView([cityCoordinates[1], cityCoordinates[0]], 13);
            } else {
                console.error('La carte n\'est pas définie.');
            }
            
            document.getElementById("name").textContent = cityNameFormatted;
            console.log("x:", cityCoordinates[0]);
            console.log("y:", cityCoordinates[1]);
            
            obtenirDonneesMeteo(cityCoordinates);
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
    
    function obtenirSuggestions(recherche) {
        var urlSuggestions = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(recherche) + "&type=municipality&autocomplete=1&limit=5";
    
        fetch(urlSuggestions)
            .then(response => response.json())
            .then(data => {
                var suggestions = data.features.filter(feature => feature.properties.city && feature.properties.postcode);
                afficherSuggestions(suggestions);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des suggestions:', error);
            });
    }
    
    function afficherSuggestions(suggestions) {
        var listeSuggestions = document.getElementById("suggestions");
    
        listeSuggestions.innerHTML = "";
    
        suggestions.forEach(suggestion => {
            var li = document.createElement("li");
            li.textContent = suggestion.properties.city + " - " + suggestion.properties.postcode;
            li.addEventListener("click", function () {
                document.getElementById("recherche").value = suggestion.properties.city,
                effacerSuggestions();
            });
            listeSuggestions.appendChild(li);
        });
    }
    
    var inputRecherche = document.getElementById("recherche");
    
    inputRecherche.addEventListener("input", function () {
        var valeurRecherche = inputRecherche.value.trim();
    
        if (valeurRecherche.length > 2) {
            obtenirSuggestions(valeurRecherche);
        } else {
            effacerSuggestions();
        }
    });
    
    function effacerSuggestions() {
        var listeSuggestions = document.getElementById("suggestions");
        listeSuggestions.innerHTML = "";
    }


    
document.getElementById("rechercherBtn").addEventListener("click", function () {
    rechercherAdresse();
});
