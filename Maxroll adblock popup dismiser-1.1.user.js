// ==UserScript==
// @name Maxroll adblock popup dismiser
// @version 1.1
// @author Lysandus + Google Gemini
// @description Automatically close the maxroll adblock popup
// @match https://maxroll.gg/*
// @license MIT
// @grant none

// ==/UserScript==

// Initialize MutationObserver, checking for browser compatibility.
let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

// A flag to prevent the script from clicking the button multiple times in rapid succession.
let isInteracting = false;

if (MutationObserver) {
    console.log('Ad-block message handler is enabled.');

    // Create a new observer instance.
    let observer = new MutationObserver(mutations => {
        // Find all buttons on the page and convert the NodeList to an Array to use array methods.
        const allButtons = Array.from(document.querySelectorAll('button'));

        // Find the specific button that has the exact text "No Thanks".
        const noThanksButton = allButtons.find(btn => btn.textContent.trim() === 'No Thanks');

        // If the button exists and we are not already in the process of interacting with it...
        if (noThanksButton && !isInteracting) {

            // *** NEW: Check the adjacent sibling element ***
            const precedingElement = noThanksButton.previousElementSibling;

            // Verify the preceding element exists and is the "Support Us" button.
            if (precedingElement && precedingElement.textContent.trim() === 'Support Us') {

                console.log('"No Thanks" button found next to a "Support Us" button. Attempting to click.');

                // Click the "No Thanks" button.
                noThanksButton.click();

                let date = new Date();
                isInteracting = true; // Set the flag to true.

                // Set a timeout to reset the flag after a short, random delay.
                // This prevents the observer from firing repeatedly.
                setTimeout(() => {
                    console.log('Clicked "No Thanks" at: ' + date.toLocaleTimeString());
                    isInteracting = false;
                }, Math.random() * 1000 + 1500); // Wait 1.5-2.5 seconds

            }
        }
    });

    // Start observing the entire document body for changes to the child list and subtree.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
} else {
    console.log('MutationObserver is not supported by your browser. Auto-interaction script disabled.');
}