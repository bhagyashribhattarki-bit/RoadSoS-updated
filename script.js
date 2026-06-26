emailjs.init("ldhob5cvi0nCl8zgT");
const API_URL = "http://127.0.0.1:5000";




function sendMessage(){
     if (!auth.currentUser) {
    alert("Please login first");
    return;
}

    let msg =
        document.getElementById("message")
        .value
        .toLowerCase();

    let response="";

    if(msg.includes("accident")){
        response =
        "🚑 Call Ambulance 108 immediately.";
    }
    else if(msg.includes("fire")){
        response =
        "🔥 Contact Fire Service 101.";
    }
    else if(msg.includes("police")){
        response =
        "👮 Contact Police 100.";
    }
    else{
        response =
        "🤖 Please describe your emergency clearly.";
    }

    document.getElementById("chatResponse")
        .innerHTML = response;
}

function predictSeverity(){
     if (!auth.currentUser) {
    alert("Please login first");
    return;
}

    let speed =
        parseInt(document.getElementById("speed").value);

    let result = "";

    if(speed < 40){
        result = "🟢 Low Risk";
    }
    else if(speed < 80){
        result = "🟠 Medium Risk";
    }
    else{
        result = "🔴 High Risk";
    }

    document.getElementById("severityResult").innerHTML =
        result;
}
async function sendSOS() {
    if (!auth.currentUser) {
    alert("Please login first");
    return;
}
    document.getElementById("sosMessage").innerHTML =
`
<div class="service-card">
    🚨 Sending Emergency Alert...
</div>
`;

    if (!navigator.geolocation) {

        alert("Location not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const locationLink =
                `https://maps.google.com/?q=${latitude},${longitude}`;

            try {

                await emailjs.send(
                    "service_ynwcr67",
                    "template_dm6k4fs",
                    {
                        location: locationLink
                    }
                );

                await addDoc(
                    collection(db, "sosHistory"),
                    {
                        latitude: latitude,
                        longitude: longitude,
                        location: locationLink,
                        createdAt: new Date().toLocaleString()
                    }
                );

                document.getElementById(
                    "sosMessage"
                ).innerHTML =
                "🚨 SOS Alert Sent Successfully!";

                loadSOSHistory();

            } catch(error) {

                console.error(error);

                document.getElementById(
                    "sosMessage"
                ).innerHTML =
                "❌ Failed to send SOS Alert";
            }
        }
    );
}
function startVoice() {
     

    if (!('webkitSpeechRecognition' in window) &&
        !('SpeechRecognition' in window)) {

        alert("Speech Recognition is not supported in this browser.");
        return;
    }

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    recognition.onstart = function() {
        alert("Listening...");
    };

    recognition.onresult = function(event) {

        const speechText =
            event.results[0][0].transcript;

        document.getElementById("message").value =
            speechText;

        sendMessage();
    };

    recognition.onerror = function(event) {
        alert("Error: " + event.error);
    };
}
function getLocation() {
    if (!auth.currentUser) {
    alert("Please login first");
    return;
}
    document.getElementById(
        "locationResult"
    ).innerHTML =
    `
    <div class="service-card">
        📍 Getting your location...
    </div>
    `;

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position){

            const lat = position.coords.latitude;
const lon = position.coords.longitude;

document.getElementById(
    "locationResult"
).innerHTML =

`
📍 Latitude: ${lat}

<br><br>

📍 Longitude: ${lon}

<br><br>

<a href="https://www.google.com/maps?q=${lat},${lon}"
target="_blank">
🗺️ Open My Location in Google Maps
</a>
`;

        });

    } else {

        alert("Geolocation not supported");

    }
}


// ======================
// FIREBASE AUTH
// ======================

async function signup() {

    const email =
        document.getElementById("signupEmail").value;

    const password =
        document.getElementById("signupPassword").value;

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        document.getElementById("authButtons")
            .style.display = "none";

        document.getElementById("userSection")
            .style.display = "flex";

        document.getElementById("userEmail")
            .innerHTML = email;

        document.getElementById("signupModal")
            .style.display = "none";
            document.body.style.overflow = "auto";

        alert("✅ Signup Successful");

    } catch(error) {

        alert(error.message);
    }
}

async function login() {

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        console.log("Logged in:", auth.currentUser.email);
        console.log("Logged in user:", auth.currentUser.email);
        loadContacts();

        document.getElementById("authButtons")
            .style.display = "none";

        document.getElementById("userSection")
            .style.display = "flex";

        document.getElementById("userEmail")
            .innerHTML = email;

        document.getElementById("loginModal")
            .style.display = "none";
            document.body.style.overflow = "auto";

        alert("✅ Login Successful");
        document.getElementById("contactName").value = "";
document.getElementById("contactEmail").value = "";

    } catch(error) {

        alert(error.message);
    }
}
function openLogin() {
    console.log("OPEN LOGIN");

    

    document.getElementById("loginModal")
        .style.display = "flex";

    document.body.style.overflow = "hidden";
}

function closeLogin() {
    console.log("CLOSE LOGIN");

    document.getElementById("loginModal")
        .style.display = "none";

    document.body.style.overflow = "auto";
}
function openSignup() {

    document.getElementById("signupModal")
        .style.display = "flex";

    document.body.style.overflow = "hidden";
}

function closeSignup() {

    document.getElementById("signupModal")
        .style.display = "none";

    document.body.style.overflow = "auto";
}
async function logout() {
    if (!auth.currentUser) {
    alert("Please login first");
    return;
}

    await signOut(auth);

    // Clear contact inputs
    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";

    // Clear user info
    document.getElementById("userEmail").innerHTML = "";

    // Hide logged-in section
    document.getElementById("userSection").style.display = "none";
    document.getElementById("authButtons").style.display = "block";

    // Clear contacts
    document.getElementById("contactsList").innerHTML = "";

    // Clear location
    document.getElementById("locationResult").innerHTML = "";

    // Clear hospitals
    document.getElementById("hospitalResults").innerHTML = "";

    // Clear police stations
    document.getElementById("policeResults").innerHTML = "";

    // Clear AI assistant
    document.getElementById("message").value = "";
    document.getElementById("chatResponse").innerHTML = "";

    // Clear severity predictor
    document.getElementById("speed").value = "";
    document.getElementById("severityResult").innerHTML = "";

    // Clear SOS
    document.getElementById("sosMessage").innerHTML = "";
    document.getElementById("historyList").innerHTML = "";

    alert("👋 Logged Out");
}

// =========================
// EMERGENCY CONTACTS
// =========================

async function saveContact() {
    
    console.log("SAVE CONTACT FUNCTION RUNNING");
console.log("Current user:", auth.currentUser?.email);

    const name =
        document.getElementById("contactName").value;

    const email =
    document.getElementById("contactEmail").value;

    if(name === "" || email === ""){

        alert("Please fill all fields");
        return;
    }

    try{

        await addDoc(
            collection(db, "contacts"),
           {
    name: name,
    email: email,
    owner: auth.currentUser.email
}
        );

        alert("✅ Contact Saved");
        document.getElementById("contactName").value = "";
document.getElementById("contactEmail").value = "";

        loadContacts();

    }
    catch(error){

        alert(error.message);
    }
}

async function loadContacts(){
    console.log("Loading contacts for:", auth.currentUser?.email);
    console.log("Current user:", auth.currentUser?.email);

    if(!auth.currentUser){
        return;
    }

    const q = query(
        collection(db, "contacts"),
        where(
            "owner",
            "==",
            auth.currentUser.email
        )
    );

    const snapshot = await getDocs(q);
    console.log("Contacts found:", snapshot.size);
    document.getElementById("contactName").value = "";
document.getElementById("contactEmail").value = "";

    let html = "";

    snapshot.forEach((doc)=>{

        const data = doc.data();

        html += `
        <div class="service-card">
            <b>${data.name}</b><br>
            📧 ${data.email}
        </div>
        `;
    });

    document.getElementById(
        "contactsList"
    ).innerHTML = html;
}
function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}
async function findHospitals() {
    if (!auth.currentUser) {
    alert("Please login first");
    return;
}
    document.getElementById("hospitalResults").innerHTML =
`
<div class="service-card">
    🔍 Searching nearby hospitals...
</div>
`;

    if (!navigator.geolocation) {

        alert("Location not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async function(position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const query = `
            [out:json];
            (
              node["amenity"="hospital"](around:3000,${lat},${lon});
            );
            out;
            `;

            const response = await fetch(
                "https://overpass-api.de/api/interpreter",
                {
                    method: "POST",
                    body: query
                }
            );

            const data = await response.json();

            let html = "";

            if(data.elements.length === 0){

                html = `
                <div class="service-card">
                    No hospitals found nearby.
                </div>
                `;
            }

            data.elements.forEach(hospital => {

                const distance =
                    calculateDistance(
                        lat,
                        lon,
                        hospital.lat,
                        hospital.lon
                    ).toFixed(2);

                const mapsLink =
                    `https://www.google.com/maps?q=${hospital.lat},${hospital.lon}`;

                html += `
                <div class="service-card">

                    <b>
                    🏥 ${hospital.tags.name || "Hospital"}
                    </b>

                    <br><br>

                    📍 Distance:
                    ${distance} km

                    <br><br>

                    <a
                        href="${mapsLink}"
                        target="_blank">
                        🗺️ Open in Maps
                    </a>

                </div>
                `;
            });

            document.getElementById(
                "hospitalResults"
            ).innerHTML = html;
        }
    );
}
async function findPoliceStations() {
    if (!auth.currentUser) {
    alert("Please login first");
    return;
}
    document.getElementById("policeResults").innerHTML =
`
<div class="service-card">
    🔍 Searching nearby police stations...
</div>
`;

    if (!navigator.geolocation) {

        alert("Location not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async function(position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const query = `
            [out:json];
            (
              node["amenity"="police"](around:5000,${lat},${lon});
            );
            out;
            `;

            const response = await fetch(
                "https://overpass-api.de/api/interpreter",
                {
                    method: "POST",
                    body: query
                }
            );

            const data = await response.json();

            let html = "";

            if(data.elements.length === 0){

                html = `
                <div class="service-card">
                    No police stations found nearby.
                </div>
                `;
            }

            data.elements.forEach(police => {

                const distance =
                    calculateDistance(
                        lat,
                        lon,
                        police.lat,
                        police.lon
                    ).toFixed(2);

                const mapsLink =
                    `https://www.google.com/maps?q=${police.lat},${police.lon}`;

                html += `
                <div class="service-card">

                    <b>
                    🚓 ${police.tags.name || "Police Station"}
                    </b>

                    <br><br>

                    📍 Distance:
                    ${distance} km

                    <br><br>

                    <a href="${mapsLink}" target="_blank">
                        🗺️ Open in Maps
                    </a>

                </div>
                `;
            });

            document.getElementById(
                "policeResults"
            ).innerHTML = html;
        }
    );
}
async function loadSOSHistory() {

    if (!auth.currentUser) {
        alert("Please login first");
        return;
    }

    const snapshot = await getDocs(
        collection(db, "sosHistory")
    );

    let html = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        html += `
        <div class="service-card">
            🚨 Alert Sent
            <br><br>
            🕒 ${data.createdAt}
            <br><br>
            <a href="${data.location}" target="_blank">
                📍 Open Location
            </a>
        </div>
        `;
    });

    document.getElementById("historyList").innerHTML = html;
}

async function clearSOSHistory() {
 
    const confirmDelete =
        confirm(
            "Are you sure you want to delete all SOS history?"
        );

    if (!confirmDelete) return;

    const snapshot =
        await getDocs(
            collection(db, "sosHistory")
        );

    for (const documentItem of snapshot.docs) {

        await deleteDoc(
            doc(
                db,
                "sosHistory",
                documentItem.id
            )
        );
    }

    document.getElementById(
        "historyList"
    ).innerHTML =
    `
    <div class="service-card">
        🗑️ SOS History Cleared
    </div>
    `;

    alert("SOS History Deleted Successfully");
}
window.addEventListener("click", function(event) {

    const loginModal =
        document.getElementById("loginModal");

    const signupModal =
        document.getElementById("signupModal");

    if (event.target.classList.contains("modal")) {

        if (event.target === loginModal) {
            closeLogin();
        }

        if (event.target === signupModal) {
            closeSignup();
        }
    }
});