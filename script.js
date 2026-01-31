// --- 1. INISIALISASI PETA (BALIKPAPAN) ---
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

// --- 3. STYLE & LAYER DEFINITION ---

// Style Jalan Arteri (Merah)
const jalanArteriLayer = L.geoJSON(null, {
    style: { color: "#e74c3c", weight: 5, opacity: 1 },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>Jalan Arteri</b><br>${feature.properties.NAMA_JALAN || 'Tanpa Nama'}`);
    }
});

// Style Jalan Lingkungan (Biru Putus-putus)
const jalanLingkunganLayer = L.geoJSON(null, {
    style: { color: "#3498db", weight: 3, dashArray: '5, 5', opacity: 1 },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>Jalan Lingkungan</b><br>${feature.properties.NAMA_JALAN || 'Tanpa Nama'}`);
    }
});

// Style Persil Warga (Kuning Transparan)
const persilWargaLayer = L.geoJSON(null, {
    style: { fillColor: "#f1c40f", color: "#333", weight: 1, fillOpacity: 0.5 },
    onEachFeature: function(feature, layer) {
        let content = `
            <b>Pemilik:</b> ${feature.properties.PEMILIK || '-'}<br>
            <b>Luas:</b> ${feature.properties.LUAS || '-'}<br>
            <b>Status:</b> ${feature.properties.STATUS || '-'}
        `;
        layer.bindPopup(content);
    }
});

// Style Puskesmas (Lingkaran Merah)
const puskesmasLayer = L.geoJSON(null, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: "red",
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>PUSKESMAS</b><br>${feature.properties.NAMA_FASKES}`);
    }
});

// Style Pemerintahan (Marker Biru Default)
const pemerintahanLayer = L.geoJSON(null, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(`<b>KANTOR</b><br>${feature.properties.NAMA_KANTOR}`);
    }
});


// --- 4. LOAD DATA (DENGAN ERROR CHECKING) ---
// Fungsi pembantu untuk load data agar lebih rapi
function loadData(url, layer, layerName) {
    $.getJSON(url, function(data) {
        layer.addData(data);
        layer.addTo(map); // Tampilkan langsung
        console.log(`✅ Berhasil memuat: ${layerName}`);
    }).fail(function(jqxhr, textStatus, error) {
        console.error(`❌ GAGAL memuat ${layerName} di URL: ${url}`);
        console.error(`Error: ${error}`);
    });
}

// Panggil fungsi load data
// Pastikan nama file di folder 'asset' SAMA PERSIS (Huruf besar/kecil berpengaruh di GitHub!)
loadData("asset/Jalan_Arteri.geojson", jalanArteriLayer, "Jalan Arteri");
loadData("asset/Jalan_Lingkungan.geojson", jalanLingkunganLayer, "Jalan Lingkungan");
loadData("asset/Persil_Warga.geojson", persilWargaLayer, "Persil Warga");
loadData("asset/Puskesmas.geojson", puskesmasLayer, "Puskesmas");
loadData("asset/Pemerintahan.geojson", pemerintahanLayer, "Pemerintahan");


// --- 5. CONTROL LAYERS ---
const baseMaps = {
    "Peta Jalan (OSM)": basemapOSM,
    "Satelit (Google)": baseMapGoogle
};

const overlayMaps = {
    "Jalan Arteri (Merah)": jalanArteriLayer,
    "Jalan Lingkungan (Biru)": jalanLingkunganLayer,
    "Persil Warga (Kuning)": persilWargaLayer,
    "Puskesmas (Titik Merah)": puskesmasLayer,
    "Kantor Pemerintah (Pin Biru)": pemerintahanLayer
};

L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);

// Fitur Tambahan
L.control.scale().addTo(map);

if (L.Control.Fullscreen) {
    map.addControl(new L.Control.Fullscreen());
}

// Tombol Reset View
const homeCoords = { lat: -1.265386, lng: 116.831200, zoom: 15 };
L.easyButton('fa-solid fa-house', function(btn, map){
    map.setView([homeCoords.lat, homeCoords.lng], homeCoords.zoom);
}, 'Reset Tampilan').addTo(map);
