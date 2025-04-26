import { currentLanguage } from "./toolbar_language_map";
import { translations } from "./translations";
import { map, placesService, infoWindow } from "./map";
import { detailsCache } from "./map_places_to_route";

let currentPhotoIndex = 0;
let currentPhotoUrls = [];

// Informacinio langelio žemėlapyje parodymo funkcija
export function showInfoWindow(place, marker) {
    if (!place.place_id){
        return;
    }
    if (detailsCache.has(place.place_id)) {
        const details = detailsCache.get(place.place_id);
        renderInfoWindowContent(details, marker);
    }
    else {
        placesService.getDetails({
            placeId: place.place_id,
            fields: ['name', 'formatted_address', 'rating', 'user_ratings_total', 'photos', 'website', 'opening_hours', 'formatted_phone_number', 'editorial_summary', 'types', 'place_id'],
            language: currentLanguage
        }, (details, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && details) {
                detailsCache.set(place.place_id, details);
                renderInfoWindowContent(details, marker);
            }
        });
    }
}
window.showInfoWindow = showInfoWindow;

// Informacinio langelio atvaizdavimo funkcija
function renderInfoWindowContent(details, marker) {
    const photosHtml = generatePhotosHtml(details.photos || []);
    const ratingsHtml = generateRatingsHtml(details);
    const hoursHtml = generateOpeningHoursHtml(details.opening_hours);
    const contactHtml = generateContactHtml(details);
    const summary = details.editorial_summary?.overview || '';
    const placeId = details.place_id;
    const t = translations[currentLanguage];
    const content = `
        <div style="min-width: 390px; font-family: sans-serif;">
            ${photosHtml}
            <strong style="font-size: 16px;">${details.name}</strong><br>
            ${ratingsHtml}
            ${hoursHtml}
            ${summary ? `<p style="margin-top: 8px; font-size: 14px;">${summary}</p>` : ''}
            ${contactHtml}
            <a href="https://www.google.com/maps/place/?q=place_id:${placeId}" target="_blank">${t.googleMapsLink}</a>
        </div>
    `;
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}

// Informacinio langelio nuotraukų HTML sudarymo funkcija
function generatePhotosHtml(photos) {
    if (!photos.length){
        return '';
    }
    let html = `
        <div class="photo-gallery-wrapper">
            <button class="arrow-btn left" onclick="scrollPhotos(-1)">&#10094;</button>
            <div class="photo-gallery" id="photo-gallery">
    `;
    for (let i = 0; i < Math.min(10, photos.length); i++) {
        const url = photos[i].getUrl({ maxWidth: 500 });
        html += `<img src="${url}" class="gallery-photo" onclick="openImageModal('${url}')" alt="">`;
    }
    html += `
            </div>
            <button class="arrow-btn right" onclick="scrollPhotos(1)">&#10095;</button>
        </div>
    `;
    return html;
}

// Informacinio langelio įvertinimo informacijos HTML sudarymo funkcija
function generateRatingsHtml(ratings) {
    const t = translations[currentLanguage];
    const rating = ratings.rating !== undefined ? `⭐ ${ratings.rating.toFixed(1)}` : '–';
    const ratingCount = ratings.user_ratings_total ? `(${ratings.user_ratings_total} ${t.ratingAmount})` : '';
    return `${rating} ${ratingCount}<br>`;
}

// Informacinio langelio atidarymo valandų HTML sudarymo funkcija
function generateOpeningHoursHtml(opening_hours) {
    const t = translations[currentLanguage];
    if (!opening_hours?.weekday_text?.length){
        return '';
    }
    const todayIndex = (new Date().getDay() + 6) % 7;
    let html = `<div><strong>${t.workingTimes}</strong><div style="display: table; font-family: sans-serif; margin-top: 4px;">`;
    opening_hours.weekday_text.forEach((day, i) => {
        const isToday = i === todayIndex;
        const [dayName, ...rest] = day.split(':');
        const hours = rest.join(':').trim();
        html += `
            <div style="display: table-row;">
                <div style="display: table-cell; padding-right: 12px; font-weight: ${isToday ? 'bold' : 'normal'};">
                    ${dayName}
                </div>
                <div style="display: table-cell; font-weight: ${isToday ? 'bold' : 'normal'};">
                    ${hours}
                </div>
            </div>`;
    });
    html += `</div></div>`;
    return html;
}

// Informacinio langelio kontaktinės informacijos HTML sudarymo funkcija
function generateContactHtml(details) {
    const t = translations[currentLanguage];
    const address = details.formatted_address || '';
    const website = details.website || '';
    const phone = details.formatted_phone_number || '';
    return `
        ${phone ? `📞 <strong>${t.phoneNumber}</strong> ${phone}<br>` : ''}
        ${address}<br>
        ${website ? `<a href="${website}" target="_blank">${t.websiteURL}</a><br>` : ''}
    `;
}

// Nuotraukų ekrane atidarymo funkcija
function openImageModal(url) {
    const allImgs = Array.from(document.querySelectorAll(".gallery-photo")).map(img => img.src);
    currentPhotoUrls = allImgs;
    currentPhotoIndex = allImgs.indexOf(url);
    const modal = document.getElementById("imageModal");
    const img = document.getElementById("modalImage");
    if (!modal || !img){
        return;
    }
    img.src = url;
    modal.classList.add("show");
}
window.openImageModal = openImageModal;

// Nuotraukų perėjimui naudojant rodykles informaciniame langelyje
window.scrollPhotos = function (direction) {
    const container = document.getElementById("photo-gallery");
    const scrollAmount = container.clientWidth;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    if (direction === 1 && Math.ceil(container.scrollLeft) >= maxScrollLeft) {
        container.scrollTo({ left: 0, behavior: "smooth" });
    }
    else if (direction === -1 && container.scrollLeft <= 0) {
        container.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
    }
    else {
        container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
    }
};

// Nuotraukų ekrane uždarymo funkcija
function closeImageModal(e) {
    if (e?.target?.id !== "imageModal" && e?.target?.className !== "close") return;
    document.getElementById("imageModal").classList.remove("show");
}
window.closeImageModal = closeImageModal;

// Nuotraukų ekrane prieš tai buvusios nuotraukos perėjimo funkcija
function showPreviousImage(e) {
    e?.stopPropagation();
    currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotoUrls.length) % currentPhotoUrls.length;
    document.getElementById("modalImage").src = currentPhotoUrls[currentPhotoIndex];
}
window.showPreviousImage = showPreviousImage;

// Nuotraukų ekrane sekančios nuotraukos perėjimo funkcija
function showNextImage(e) {
    e?.stopPropagation();
    currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotoUrls.length;
    document.getElementById("modalImage").src = currentPhotoUrls[currentPhotoIndex];
}
window.showNextImage = showNextImage;

// Nuotraukų ekrane uždarymo funkcija
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("imageModal");
    const closeBtn = modal?.querySelector(".close");
    if (!modal || !closeBtn){
        return;
    }
    closeBtn.onclick = () => modal.classList.remove("show");
    modal.onclick = (event) => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    };
});

