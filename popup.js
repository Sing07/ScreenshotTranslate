document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("toggleButton");

    // Load saved state
    chrome.storage.local.get(["captureButtonVisible"], function (result) {
        toggleButton.checked = result.captureButtonVisible !== false; // default to true if not set
    });

    // Handle toggle changes
    toggleButton.addEventListener("change", function () {
        const isVisible = toggleButton.checked;

        // Save state
        chrome.storage.local.set({ captureButtonVisible: isVisible });

        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "TOGGLE_CAPTURE_BUTTON",
                    visible: isVisible,
                });
            }
        });
    });
});
