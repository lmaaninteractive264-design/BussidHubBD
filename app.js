// ================== LOAD DATA ==================
async function loadPageData() {
    try {
        if (document.getElementById("skinGrid")) {
            const res = await fetch('skins.json');
            const data = await res.json();
            window.allSkins = data;
            renderSkins(data);
        } 
        
        else if (document.getElementById("obbGrid")) {
            const res = await fetch('../obbs.json');
            const data = await res.json();
            renderLibrary(data, "obbGrid");
        } 
        
        else if (document.getElementById("modGrid")) {
            const res = await fetch('../mod.json');
            const data = await res.json();
            renderLibrary(data, "modGrid");
        }

    } catch (error) {
        console.error("JSON load error:", error);
    }
}


// ================== RENDER SKINS ==================
function renderSkins(skins) {

    const grid = document.getElementById("skinGrid");
    if (!grid) return;

    grid.innerHTML = "";

    skins.forEach(skin => {

        const path = `../assets/skins/${skin.model}/${skin.file}`;

        let type = skin.link ? "official" : "local";

        let button = "";

        if (skin.link) {
            button = `
            <a href="${skin.link}" target="_blank">
                <button>🌐 Download</button>
            </a>`;
        } else {
            button = `
            <a href="${path}" download="bussid_skin.png">
                <button>📦 Download</button>
            </a>`;
        }

        let badge = skin.link ? "🌐 Official" : "📦 Local";

        grid.innerHTML += `
        <div class="card" 
            data-name="${skin.name.toLowerCase()}" 
            data-model="${skin.model}" 
            data-type="${type}">

            <img src="${path}" onclick="previewSkin('${path}')" alt="${skin.name}">

            <p>${skin.name} ${badge}</p>

            <small>By ${skin.creator || "Unknown"}</small>

            ${button}

        </div>`;
    });

    filterSkins(); // render এর পর filter apply
}


// ================== FILTER ==================
function filterSkins(){

    let modelValue = document.getElementById("modelFilter")?.value || "all";
    let typeValue = document.getElementById("typeFilter")?.value || "all";

    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        let model = card.getAttribute("data-model");
        let type = card.getAttribute("data-type");

        let show = true;

        if(modelValue !== "all" && model !== modelValue){
            show = false;
        }

        if(typeValue !== "all" && type !== typeValue){
            show = false;
        }

        card.style.display = show ? "block" : "none";
    });

}


// ================== SEARCH ==================
function searchSkin() {

    const input = document.getElementById("search").value.toLowerCase();

    const filtered = window.allSkins.filter(skin => 
        skin.name.toLowerCase().includes(input)
    );

    renderSkins(filtered); // filter auto apply হবে

}


// ================== LIBRARY ==================
function renderLibrary(items, gridId) {

    const grid = document.getElementById(gridId);
    if (!grid) return;

    grid.innerHTML = "";

    items.forEach(item => {

        let videoId = "";

        if (item.videoUrl.includes("v=")) {
            videoId = item.videoUrl.split("v=")[1].split("&")[0];
        } else if (item.videoUrl.includes("be/")) {
            videoId = item.videoUrl.split("be/")[1].split("?")[0];
        }

        const thumbnailUrl = videoId 
            ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
            : `../assets/placeholder.png`;

        grid.innerHTML += `
        <div class="card">

            <img src="${thumbnailUrl}" alt="${item.name}">

            <h3>${item.name}</h3>

            <div style="display:flex; gap:10px;">

                <a href="${item.videoUrl}" target="_blank" style="flex:1;">
                    <button style="background:red;color:white;">▶ Video</button>
                </a>

                <a href="${item.downloadUrl}" target="_blank" style="flex:1;">
                    <button>⬇ Download</button>
                </a>

            </div>

        </div>`;
    });

}


// ================== PREVIEW ==================
function previewSkin(src) {
    const modal = document.getElementById("previewModal");
    const img = document.getElementById("previewImg");

    if (modal && img) {
        img.src = src;
        modal.style.display = "flex";
    }
}

function closePreview() {
    const modal = document.getElementById("previewModal");
    if (modal) modal.style.display = "none";
}


// ================== MENU ==================
function toggleMenu(){
    let menu=document.getElementById("dropdownMenu");
    menu.style.display = (menu.style.display==="block") ? "none" : "block";
}

window.onclick=function(e){
    if(!e.target.matches('.menu-btn')){
        let menu=document.getElementById("dropdownMenu");
        if(menu && menu.style.display==="block"){
            menu.style.display="none";
        }
    }
}


// ================== INIT ==================
window.addEventListener('load', () => {

    const splash = document.getElementById("splash");

    if (splash) {
        setTimeout(() => {
            splash.style.display = "none";
            const main = document.getElementById("main");
            if (main) main.style.display = "block";
        }, 3000);
    }

    loadPageData();
});