chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "REQUEST_SCREEN_CAPTURE") {
        const { x, y, width, height, devicePixelRatio, scrollX, scrollY } =
            message.coords;

        // Add a small delay to ensure UI elements are hidden
        setTimeout(() => {
            // Capture the full visible tab as a base64 PNG image
            chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
                try {
                    // Convert base64 to blob directly without using fetch
                    const base64Data = dataUrl.split(",")[1];
                    const byteCharacters = atob(base64Data);
                    const byteArrays = [];

                    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                        const slice = byteCharacters.slice(offset, offset + 512);
                        const byteNumbers = new Array(slice.length);

                        for (let i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }

                        const byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }

                    const blob = new Blob(byteArrays, { type: "image/png" });

                    // Create bitmap from blob
                    const bitmap = await createImageBitmap(blob);

                    // Create offscreen canvas with device pixel ratio
                    const canvas = new OffscreenCanvas(
                        Math.round(width * devicePixelRatio),
                        Math.round(height * devicePixelRatio)
                    );
                    const ctx = canvas.getContext("2d");

                    // Calculate coordinates relative to the visible area and scale by DPR
                    // Since we're now using absolute coordinates, we need to subtract the scroll position
                    const relativeX = Math.round((x - scrollX) * devicePixelRatio);
                    const relativeY = Math.round((y - scrollY) * devicePixelRatio);
                    const scaledWidth = Math.round(width * devicePixelRatio);
                    const scaledHeight = Math.round(height * devicePixelRatio);

                    // Draw the selected portion
                    ctx.drawImage(
                        bitmap,
                        relativeX,
                        relativeY,
                        scaledWidth,
                        scaledHeight,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    // Convert to blob
                    const croppedBlob = await canvas.convertToBlob();

                    // Convert blob to data URL
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const croppedDataUrl = reader.result;

                        // Send the cropped image data back to the content script
                        chrome.tabs.sendMessage(sender.tab.id, {
                            type: "SCREEN_CAPTURE",
                            dataUrl: croppedDataUrl,
                        });
                    };
                    reader.readAsDataURL(croppedBlob);
                } catch (error) {
                    console.error("Error processing screenshot:", error);
                }
            });
        }, 100);
        return true; // Keep the message channel open for async response
    }
});

// Listen for the keyboard shortcut command
chrome.commands.onCommand.addListener(async (command) => {
    if (command === "capture-area") {
        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) return;

            // Check if content script is already injected
            try {
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => window.isSelecting !== undefined,
                });
            } catch (e) {
                // Content script not injected, inject it
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["contentScript.js"],
                });
            }

            // Send message to content script to start capture
            chrome.tabs.sendMessage(tab.id, { type: "START_CAPTURE" });
        } catch (error) {
            console.error("Error handling capture command:", error);
        }
    }
});
