// Create UI elements
let captureButton = document.createElement("button");
captureButton.id = "captureButton";
captureButton.textContent = "Start Capture";
captureButton.style.position = "fixed";
captureButton.style.top = "2vh"; // Use viewport height
captureButton.style.left = "2vw"; // Use viewport width
captureButton.style.zIndex = "9999999";
captureButton.style.padding = "10px 20px";
captureButton.style.backgroundColor = "#4CAF50";
captureButton.style.color = "white";
captureButton.style.border = "none";
captureButton.style.borderRadius = "4px";
captureButton.style.cursor = "pointer";
captureButton.style.fontSize = "14px";
captureButton.style.transform = "scale(1)"; // Reset any inherited transform
captureButton.style.transformOrigin = "top left"; // Set transform origin
captureButton.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
captureButton.style.transition = "background-color 0.3s ease";
captureButton.style.minWidth = "120px"; // Ensure minimum width
captureButton.style.maxWidth = "200px"; // Maximum width
captureButton.style.whiteSpace = "nowrap"; // Prevent text wrapping
captureButton.style.overflow = "hidden"; // Hide overflow
captureButton.style.textOverflow = "ellipsis"; // Add ellipsis for overflow text
document.body.appendChild(captureButton);

// Add a resize observer to handle zoom changes
const resizeObserver = new ResizeObserver(() => {
    // Ensure button stays visible and properly positioned
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Update button position if it's outside viewport
    const buttonRect = captureButton.getBoundingClientRect();
    if (buttonRect.right > viewportWidth) {
        captureButton.style.left = `${Math.max(2, viewportWidth - buttonRect.width - 10)}px`;
    }
    if (buttonRect.bottom > viewportHeight) {
        captureButton.style.top = `${Math.max(2, viewportHeight - buttonRect.height - 10)}px`;
    }
});

// Start observing the viewport
resizeObserver.observe(document.documentElement);

let selectionBox = document.createElement("div");
selectionBox.style.position = "fixed";
selectionBox.style.border = "2px dashed red";
selectionBox.style.zIndex = 9999999;
selectionBox.style.pointerEvents = "none";
selectionBox.style.display = "none"; // Initially hidden
document.body.appendChild(selectionBox);

// Create preview overlay
let previewOverlay = document.createElement("div");
previewOverlay.style.position = "fixed";
previewOverlay.style.top = "0";
previewOverlay.style.left = "0";
previewOverlay.style.width = "100%";
previewOverlay.style.height = "100%";
previewOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
previewOverlay.style.zIndex = 10000000;
previewOverlay.style.display = "none";
previewOverlay.style.justifyContent = "center";
previewOverlay.style.alignItems = "center";
previewOverlay.style.flexDirection = "column";
document.body.appendChild(previewOverlay);

// Create preview container
let previewContainer = document.createElement("div");
previewContainer.style.backgroundColor = "#fff";
previewContainer.style.padding = "20px";
previewContainer.style.borderRadius = "8px";
previewContainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
previewContainer.style.maxWidth = "90%";
previewContainer.style.maxHeight = "90%";
previewContainer.style.overflow = "auto";
previewOverlay.appendChild(previewContainer);

// Create preview image
let previewImage = document.createElement("img");
previewImage.style.maxWidth = "100%";
previewImage.style.maxHeight = "80vh";
previewImage.style.objectFit = "contain";
previewContainer.appendChild(previewImage);

// Create button container
let buttonContainer = document.createElement("div");
buttonContainer.style.marginTop = "20px";
buttonContainer.style.display = "flex";
buttonContainer.style.gap = "10px";
previewContainer.appendChild(buttonContainer);

// Create save button
let saveButton = document.createElement("button");
saveButton.textContent = "Save Image";
saveButton.style.padding = "10px 20px";
saveButton.style.backgroundColor = "#4CAF50";
saveButton.style.color = "white";
saveButton.style.border = "none";
saveButton.style.borderRadius = "4px";
saveButton.style.cursor = "pointer";
buttonContainer.appendChild(saveButton);

// Create discard button
let discardButton = document.createElement("button");
discardButton.textContent = "Discard";
discardButton.style.padding = "10px 20px";
discardButton.style.backgroundColor = "#f44336";
discardButton.style.color = "white";
discardButton.style.border = "none";
discardButton.style.borderRadius = "4px";
discardButton.style.cursor = "pointer";
buttonContainer.appendChild(discardButton);

// Create OCR button
let ocrButton = document.createElement("button");
ocrButton.textContent = "Send to OCR";
ocrButton.style.padding = "10px 20px";
ocrButton.style.backgroundColor = "#2196f3";
ocrButton.style.color = "white";
ocrButton.style.border = "none";
ocrButton.style.borderRadius = "4px";
ocrButton.style.cursor = "pointer";
buttonContainer.appendChild(ocrButton);

// Create OCR result container
let ocrResultContainer = document.createElement("div");
ocrResultContainer.style.marginTop = "20px";
ocrResultContainer.style.padding = "15px";
ocrResultContainer.style.border = "1px solid #ddd";
ocrResultContainer.style.borderRadius = "4px";
ocrResultContainer.style.minHeight = "100px";
ocrResultContainer.style.whiteSpace = "pre-wrap";
ocrResultContainer.style.display = "none";
ocrResultContainer.style.backgroundColor = "#fff";
ocrResultContainer.style.maxHeight = "200px";
ocrResultContainer.style.overflow = "auto";
previewContainer.appendChild(ocrResultContainer);

// Create translate button
let translateButton = document.createElement("button");
translateButton.textContent = "Translate";
translateButton.style.padding = "10px 20px";
translateButton.style.backgroundColor = "#9c27b0";
translateButton.style.color = "white";
translateButton.style.border = "none";
translateButton.style.borderRadius = "4px";
translateButton.style.cursor = "pointer";
translateButton.style.marginLeft = "10px";
buttonContainer.appendChild(translateButton);

// Create translation container
let translationContainer = document.createElement("div");
translationContainer.style.marginTop = "20px";
translationContainer.style.padding = "15px";
translationContainer.style.border = "1px solid #ddd";
translationContainer.style.borderRadius = "4px";
translationContainer.style.minHeight = "100px";
translationContainer.style.whiteSpace = "pre-wrap";
translationContainer.style.display = "none";
translationContainer.style.backgroundColor = "#fff";
translationContainer.style.maxHeight = "200px";
translationContainer.style.overflow = "auto";
previewContainer.appendChild(translationContainer);

// Variables to track selection state
let isSelecting = false;
let startX, startY, endX, endY;

// Functions to manage UI visibility
function hideUIElements() {
    if (selectionBox) selectionBox.style.display = "none";
}

function showUIElements() {
    if (selectionBox) selectionBox.style.display = "block";
}

function resetSelection() {
    if (selectionBox) {
        selectionBox.style.display = "none";
        selectionBox.style.left = "0px";
        selectionBox.style.top = "0px";
        selectionBox.style.width = "0px";
        selectionBox.style.height = "0px";
    }
    if (captureButton) {
        captureButton.textContent = "Start Capture";
        captureButton.style.backgroundColor = "#4CAF50";
        captureButton.style.display = "block";
    }
    isSelecting = false;
    startX = startY = endX = endY = undefined;
}

// Event Listeners
captureButton.addEventListener("click", () => {
    isSelecting = true;
    captureButton.textContent = "Click and Drag to Select Area";
    captureButton.style.backgroundColor = "#FF6347";
    if (selectionBox) selectionBox.style.display = "block";
});

document.addEventListener("mousedown", startSelection);
document.addEventListener("mousemove", updateSelection);
document.addEventListener("mouseup", endSelection);

// touch events for laptop touchpad compatibility
document.addEventListener("touchstart", startSelection);
document.addEventListener("touchmove", updateSelection);
document.addEventListener("touchend", endSelection);

function startSelection(e) {
    if (!isSelecting) return;
    e.preventDefault();

    // Get the correct start positions including scroll
    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    // Store absolute coordinates (including scroll)
    startX = clientX + window.scrollX;
    startY = clientY + window.scrollY;

    // Update selection box with viewport-relative coordinates
    if (selectionBox) {
        selectionBox.style.left = `${clientX}px`;
        selectionBox.style.top = `${clientY}px`;
        selectionBox.style.width = "0px";
        selectionBox.style.height = "0px";
    }
}

function updateSelection(e) {
    if (!isSelecting || startX === undefined) return;
    e.preventDefault();

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    // Store absolute coordinates (including scroll)
    endX = clientX + window.scrollX;
    endY = clientY + window.scrollY;

    // Update selection box with viewport-relative coordinates
    if (selectionBox) {
        const boxLeft = Math.min(clientX, startX - window.scrollX);
        const boxTop = Math.min(clientY, startY - window.scrollY);
        const boxWidth = Math.abs(clientX - (startX - window.scrollX));
        const boxHeight = Math.abs(clientY - (startY - window.scrollY));

        selectionBox.style.left = `${boxLeft}px`;
        selectionBox.style.top = `${boxTop}px`;
        selectionBox.style.width = `${boxWidth}px`;
        selectionBox.style.height = `${boxHeight}px`;
    }
}

function endSelection(e) {
    if (!isSelecting) return;

    // Calculate the final selection area using absolute coordinates
    const finalX = Math.min(startX, endX);
    const finalY = Math.min(startY, endY);
    const finalWidth = Math.abs(endX - startX);
    const finalHeight = Math.abs(endY - startY);

    if (finalWidth > 0 && finalHeight > 0) {
        // Hide UI elements before capture
        hideUIElements();

        // Send coordinates to background script
        chrome.runtime.sendMessage({
            type: "REQUEST_SCREEN_CAPTURE",
            coords: {
                x: finalX,
                y: finalY,
                width: finalWidth,
                height: finalHeight,
                devicePixelRatio: window.devicePixelRatio,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
            },
        });
    }

    // Reset selection state
    resetSelection();
}

// Add functions to manage preview
function showPreview(dataUrl) {
    previewImage.src = dataUrl;
    previewOverlay.style.display = "flex";
}

function hidePreview() {
    previewOverlay.style.display = "none";
    previewImage.src = "";
    ocrResultContainer.style.display = "none";
    ocrResultContainer.textContent = "";
    translationContainer.style.display = "none";
    translationContainer.textContent = "";
}

// Add event listeners for preview buttons
saveButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `screenshot-${new Date().toISOString()}.png`;
    link.href = previewImage.src;
    link.click();
    hidePreview();
});

discardButton.addEventListener("click", hidePreview);

// Add click outside to close
previewOverlay.addEventListener("click", (e) => {
    if (e.target === previewOverlay) {
        hidePreview();
    }
});

// Add escape key to close
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && previewOverlay.style.display === "flex") {
        hidePreview();
    }
});

// Add OCR functionality
async function sendToOCR(imageDataUrl) {
    try {
        // Show loading state
        ocrResultContainer.style.display = "block";
        ocrResultContainer.textContent = "Processing image...";

        // Convert data URL to blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();

        // Create form data with the exact field name 'image'
        const formData = new FormData();
        formData.append("image", blob, "screenshot.png");

        // Send to OCR service using the root endpoint with necessary headers
        const ocrResponse = await fetch("http://localhost:3001/", {
            method: "POST",
            body: formData,
            mode: "cors",
            headers: {
                Accept: "application/json, text/plain, */*",
            },
            credentials: "omit", // Don't send cookies
        });

        if (!ocrResponse.ok) {
            throw new Error(`HTTP error! status: ${ocrResponse.status}`);
        }

        // Get the response text and display it
        const result = await ocrResponse.text();
        ocrResultContainer.textContent = result;
    } catch (error) {
        console.error("OCR Error:", error);
        ocrResultContainer.textContent = `Error processing image: ${error.message}\n\nPlease ensure:\n1. Your OCR server is running on port 3001\n2. No ad blockers are blocking localhost requests\n3. The server allows CORS requests from extensions`;
    }
}

// Add OCR button click handler
ocrButton.addEventListener("click", () => {
    if (previewImage.src) {
        sendToOCR(previewImage.src);
    }
});

// Add translation functionality
async function translateText(text) {
    try {
        // Show loading state
        translationContainer.style.display = "block";
        translationContainer.textContent = "Translating...";

        // Use Google Translate API
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // The API returns an array of arrays, where each inner array contains the translated text
        const translation = data[0].map((item) => item[0]).join(" ");

        translationContainer.textContent = translation;
    } catch (error) {
        console.error("Translation Error:", error);
        translationContainer.textContent = `Error translating text: ${error.message}`;
    }
}

// Add translate button click handler
translateButton.addEventListener("click", () => {
    if (
        ocrResultContainer.textContent &&
        ocrResultContainer.textContent !== "Processing image..."
    ) {
        translateText(ocrResultContainer.textContent);
    }
});

// Add message listener for START_CAPTURE command
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "START_CAPTURE") {
        if (captureButton && captureButton.style.display !== "none") {
            captureButton.click();
        }
    } else if (message.type === "TOGGLE_CAPTURE_BUTTON") {
        if (captureButton) {
            captureButton.style.display = message.visible ? "block" : "none";
        }
    }
    if (message.type === "GET_SCROLL_POSITION") {
        // Only hide the selection box, not the capture button
        if (selectionBox) selectionBox.style.display = "none";
        sendResponse({
            scrollX: window.scrollX,
            scrollY: window.scrollY,
        });
        // Show selection box after a short delay
        setTimeout(() => {
            if (selectionBox) selectionBox.style.display = "block";
        }, 100);
        return true;
    }

    if (message.type === "SCREEN_CAPTURE") {
        showPreview(message.dataUrl);
        // Ensure capture button is visible after capture
        if (captureButton) captureButton.style.display = "block";
    }
});

// Add to the initialization section (where we create the capture button)
function initializeCaptureButton() {
    // Check saved state
    chrome.storage.local.get(["captureButtonVisible"], function (result) {
        const shouldShow = result.captureButtonVisible !== false; // default to true if not set
        captureButton.style.display = shouldShow ? "block" : "none";
    });
}

// Call initializeCaptureButton after creating the button
initializeCaptureButton();
