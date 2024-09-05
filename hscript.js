let map, marker;
let autocompleteService;

// Initialize the map using Leaflet.js
// Initialize the map using Leaflet.js
function initMap() {
    // Set default to Faridabad, India (Coordinates: 28.4089° N, 77.3178° E)
    map = L.map('map').setView([28.4089, 77.3178], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    autocompleteService = new google.maps.places.AutocompleteService();

    document.getElementById("autocomplete").addEventListener("input", handleAutocomplete);

    document.getElementById("locate-button").addEventListener("click", function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const pos = [position.coords.latitude, position.coords.longitude];
                map.setView(pos, 15);
                if (!marker) {
                    marker = L.marker(pos).addTo(map);
                } else {
                    marker.setLatLng(pos);
                }
            }, function() {
                alert("Error retrieving your location.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    });
}


// Handle location autocomplete using Google Places API
function handleAutocomplete() {
    const input = document.getElementById('autocomplete').value;
    if (input.length > 2) {
        autocompleteService.getPlacePredictions({ input: input }, function(predictions, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                let suggestionBox = document.getElementById("autocomplete-suggestions");
                suggestionBox.innerHTML = "";  // Clear previous suggestions

                predictions.forEach(function(prediction) {
                    let option = document.createElement('div');
                    option.textContent = prediction.description;
                    option.classList.add('suggestion-item');
                    option.addEventListener('click', function() {
                        document.getElementById('autocomplete').value = prediction.description;
                        suggestionBox.innerHTML = "";
                    });
                    suggestionBox.appendChild(option);
                });
            }
        });
    }
}

// Preview uploaded image
function previewImage(event) {
    const previewImg = document.getElementById('preview-img');
    previewImg.src = URL.createObjectURL(event.target.files[0]);
    previewImg.style.display = "block";
}

// Update flood level slider value display
document.getElementById("flood-level").addEventListener("input", function() {
    document.getElementById("flood-value").textContent = this.value;
});

initMap();
