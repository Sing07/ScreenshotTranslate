## Intro

As a 3rd generation Chinese Malaysian, I've been more keen to learn reading & writing Mandarin having growing through English-syllabus school since elemetary school. 

As someone who spends a lot of time infront of computers, when it comes to Mandarin texts on the screen, I find myself going back and forth between Google Translate to translate between anywhere from 1 Mandarin character to a whole passages of texts too often.

To simply this process, I thought of a way to screenshotting what's in the current browser tab window, and have image extracted and translated, mainly to address texts in the form of picture/images.

Hence, cometh the Screenshot Translator Chrome extension.

![Alt text](/normal.png)

## Setup

run tesseract translator from folder
`npm start`

tesseract image recognizer api will listen on localhost/3001

## How to use

Since this is not offically published through the Chrome Extension Web Store, make sure to setup it up in Step 3 in the above setup section

1. You can toggle on/off for the button 'Start Capture' to appear on the left top corner to browser window screen.

2. To screen capture a selected area, click 'Start Capture' and drag a rectangular grid over desired Mandarin text

3. A modal will overlay window, containing image, selection of 4 action choices

4. Extract Mandarin text by clicking "Send to OCR"

5. After Mandarin text is extracted, hit "Translate", voilà 

## High Level Overview

Capture Image -> HTTP:POST to localhost:3001/ to extract Mandarin text ->  HTTP:POST Mandarin Text to https://translate.googleapis.com/ to receive English translation of Mandarin as response

## Low Level Overview

1. Optical Character Recognition (OCR) module
- Runs Tesseract.JS (open-source OCR on Github) on local machine that handles text extration

2. Chrome Extension (V3)
- Background Script (background.js) - has access to privileged Chrome APIs such as
 - Keyboard shortcuts (via chrome.commands)
 - Screen capture (via chrome.tabs.captureVisibleTab)
 - Cross-tab communication

- Content Script (contentScript.js) have access to DOM for
 - UI elements (capture button, selection box, preview)
 - User interactions (mouse/touch events)
 - Selection area drawing
 - Preview display

- Popup (popup.html & popup.js) User interface for extension settings
 - Toggle button state
 - Settings persistence
 - User settings interface for users

1. Capture Initiation:
background.js (command listener)
↓
Sends "START_CAPTURE" message to contentScript.js
↓
contentScript.js shows capture button/selection UI
 
2. Grid window capture 
User selects area
↓
contentScript.js handles mouse/touch events
↓
Draws selection box
↓
On selection end, sends coordinates to background.js

3. Post-Capture Process
contentScript.js sends "REQUEST_SCREEN_CAPTURE"
↓
background.js uses chrome.tabs.captureVisibleTab
↓
Processes image with coordinates
↓
Sends captured image back to contentScript.js
↓
contentScript.js shows preview# ScreenshotTranslate
