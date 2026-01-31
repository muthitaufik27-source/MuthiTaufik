// --- 1. INISIALISASI PETA (Fokus Balikpapan) ---
const map = L.map('map').setView([-1.265386, 116.831200], 15);

// --- 2. BASEMAPS ---
const basemapOSM = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const baseMapGoogle = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Google Satellite'
});

// --- 3. DEFINISI LAYER GROUP (Wadah Data) ---
const jalanArteriLayer = L.geoJSON(null, {
    style: { color: "#e74c3c", weight: 4, opacity: 1 }, // Merah Tebal
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>Jalan Arteri</b><br>${feature.properties.NAMA_JALAN}`);
    }
});

const jalanLingkunganLayer = L.geoJSON(null, {
    style: { color: "#3498db", weight: 2, dashArray: '5, 5', opacity: 1 }, // Biru Putus-putus
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>Jalan Lingkungan</b><br>${feature.properties.NAMA_JALAN}`);
    }
});

const persilWargaLayer = L.geoJSON(null, {
    style: { fillColor: "#f1c40f", color: "#333", weight: 1, fillOpacity: 0.6 }, // Kuning
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`
            <b>Pemilik:</b> ${feature.properties.PEMILIK}<br>
            <b>Luas:</b> ${feature.properties.LUAS}<br>
            <b>Status:</b> ${feature.properties.STATUS}
        `);
    }
});

const puskesmasLayer = L.geoJSON(null, {
    pointToLayer: function(feature, latlng) {
        // Menggunakan CircleMarker Merah untuk Puskesmas
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "#ff0000",
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>Faskes:</b> ${feature.properties.NAMA_FASKES}<br>${feature.properties.ALAMAT}`);
    }
});

const pemerintahanLayer = L.geoJSON(null, {
    pointToLayer: function(feature, latlng) {
        // Menggunakan Marker Standar (Biru) untuk Kantor
        return L.marker(latlng); 
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>Kantor:</b> ${feature.properties.NAMA_KANTOR}<br>${feature.properties.INSTANSI}`);
    }
});

// --- 4. MEMUAT DATA DARI FILE GEOJSON ---

// 1. Load Jalan Arteri
$.getJSON("asset/Jalan_Arteri.geojson", function(data) {
    jalanArteriLayer.addData(data);
    jalanArteriLayer.addTo(map); // Tampilkan default
});

// 2. Load Jalan Lingkungan
$.getJSON("asset/Jalan_Lingkungan.geojson", function(data) {
    jalanLingkunganLayer.addData(data);
    jalanLingkunganLayer.addTo(map);
});

// 3. Load Persil Warga
$.getJSON("asset/Persil_Warga.geojson", function(data) {
    persilWargaLayer.addData(data);
    persilWargaLayer.addTo(map);
});

// 4. Load Puskesmas (Perhatikan nama folder 'asset' bukan 'sset')
$.getJSON("asset/Puskesmas.geojson", function(data) {
    puskesmasLayer.addData(data);
    puskesmasLayer.addTo(map);
});

// 5. Load Pemerintahan
$.getJSON("asset/Pemerintahan.geojson", function(data) {
    pemerintahanLayer.addData(data);
    pemerintahanLayer.addTo(map);
});


// --- 5. CONTROLS (Layer Control & Fitur Lain) ---

const baseMaps = {
    "Peta Jalan": basemapOSM,
    "Satelit Google": baseMapGoogle
};

const overlayMaps = {
    "<span style='color:red; font-weight:bold'>— Jalan Arteri</span>": jalanArteriLayer,
    "<span style='color:blue'>- - Jalan Lingkungan</span>": jalanLingkunganLayer,
    "<span style='background-color:yellow; opacity:0.5'>⬛</span> Persil Warga": persilWargaLayer,
    "🏥 Puskesmas": puskesmasLayer,
    "🏢 Pemerintahan": pemerintahanLayer
};

// Tambahkan Layer Control ke Peta
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);

// Skala Peta
L.control.scale({imperial: false}).addTo(map);

// Tombol Home
const homeCoords = { lat: -1.265386, lng: 116.831200, zoom: 15 };
L.easyButton('fa-solid fa-house', function(btn, map){
    map.setView([homeCoords.lat, homeCoords.lng], homeCoords.zoom);
}, 'Reset Tampilan').addTo(map);

// Tombol Lokasi Saya
if (L.control.locate) {
    L.control.locate({
        position: 'topleft',
        strings: { title: "Dimana saya?" }
    }).addTo(map);
}