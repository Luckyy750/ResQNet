
const alertBtn = document.getElementById('alert1');
const shelterBtn = document.getElementById('shltr');
const alertsSection = document.getElementById('alertsSection');
const shelterSection = document.getElementById('shelterSection');
const resourceSection = document.getElementById('Resource');


resourceSection.style.display = 'block';
alertsSection.style.display = 'none';
shelterSection.style.display = 'none';

alertBtn.addEventListener('click', () => {
    alertsSection.style.display = 'block';
    shelterSection.style.display = 'none';
    alertsSection.scrollIntoView({behavior: "smooth"});
});

shelterBtn.addEventListener('click', () => {
    shelterSection.style.display = 'block';
    alertsSection.style.display = 'none';
    shelterSection.scrollIntoView({behavior: "smooth"});
});


const map = L.map('mapContainer')?.setView([20, 77], 5); // center India
if (map) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);
}


const cityAlerts = {
    "Mumbai": {
        coords: [19.0760, 72.8777],
        alertHTML: `<b>Flood Alert</b><br>Mumbai Metropolitan Area<br>Heavy rainfall causing severe flooding. Immediate evacuation recommended.`
    },
    "Delhi": {
        coords: [28.6139, 77.2090],
        alertHTML: `<b>Earthquake Alert</b><br>Delhi NCR Region<br>5.2 magnitude earthquake detected. Minor structural damage reported.`
    },
    "Chennai": {
        coords: [13.0827, 80.2707],
        alertHTML: `<b>Storm Alert</b><br>Chennai Coastal District<br>Cyclone warning issued. Strong winds and heavy rainfall expected.`
    }
};

let currentMarker = null;


const apiKey = "10de3aba21950854d0bd4448f8fddb60"; 

async function getRecommendations() {
    const query = document.getElementById("cityInput").value.trim();
    const resultsBox = document.getElementById("results");

    if (query.length < 2) {
        resultsBox.style.display = "none";
        resultsBox.innerHTML = "";
        return;
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            resultsBox.style.display = "block";
            resultsBox.innerHTML = `<li class="list-group-item text-danger">Error ${response.status}</li>`;
            return;
        }

        const data = await response.json();
        resultsBox.innerHTML = "";
        resultsBox.style.display = "block";

        if (data.length === 0) {
            resultsBox.innerHTML = `<li class="list-group-item">No results found</li>`;
            return;
        }

        data.forEach(city => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");
            li.style.cursor = "pointer";
            li.textContent = `${city.name}, ${city.country}`;
            li.onclick = () => {
                document.getElementById("cityInput").value = city.name;
                resultsBox.style.display = "none";

           
                if (cityAlerts[city.name]) {
                    const alertData = cityAlerts[city.name];

                    if (currentMarker) map.removeLayer(currentMarker);

                    currentMarker = L.marker(alertData.coords).addTo(map);
                    currentMarker.bindPopup(alertData.alertHTML).openPopup();

                    map.setView(alertData.coords, 10);
                } else {
                    alert("No alerts for this city.");
                }
            };
            resultsBox.appendChild(li);
        });

    } catch (err) {
        console.error(err);
        resultsBox.innerHTML = `<li class="list-group-item text-danger">Error fetching data</li>`;
        resultsBox.style.display = "block";
    }
}


const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

showSignup?.addEventListener("click", () => {
    loginBox.style.display = "none";
    signupBox.style.display = "block";
});

showLogin?.addEventListener("click", () => {
    signupBox.style.display = "none";
    loginBox.style.display = "block";
});

// Show/Hide password
document.querySelectorAll(".toggle-pass").forEach(icon => {
    icon.addEventListener("click", () => {
        let input = icon.previousElementSibling;
        if (input.type === "password") {
            input.type = "text";
            icon.textContent = "🙈";
        } else {
            input.type = "password";
            icon.textContent = "👁️";
        }
    });
});


document.querySelector("#loginBox .btn")?.addEventListener("click", async () => {
    const email = loginBox.querySelector('input[type="email"]').value;
    const password = loginBox.querySelector('input[type="password"]').value;

    try {
        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);

        const res = await fetch("/login", {
            method: "POST",
            body: formData,
        });

        if (res.redirected) {
            window.location.href = res.url; 
        } else {
            alert("Invalid username or password");
        }
    } catch (err) {
        console.error(err);
        alert("Login error");
    }
});
