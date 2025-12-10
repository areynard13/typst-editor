let zoom = 1;
const zoomStep = 0.1;
const page = document.getElementById('page');
const zoomLevelDisplay = document.getElementById('zoomLevel');

export function initZoom(btnZoomIn, btnZoomOut) {
    btnZoomIn.addEventListener('click', () => { zoom += zoomStep; updateZoom(); });
    btnZoomOut.addEventListener('click', () => { zoom = Math.max(0.1, zoom - zoomStep); updateZoom(); });
}

function updateZoom() {
    page.style.transform = `scale(${zoom})`;
    page.style.transformOrigin = 'top left';
    zoomLevelDisplay.innerText = `${Math.round(zoom*100)}%`;
}
