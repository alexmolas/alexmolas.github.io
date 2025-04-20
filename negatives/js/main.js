/**
 * Main Application Entry Point
 */

(function() {
    'use strict';

    // Initialize the application when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize UI
        UI.init();
        
        console.log('Image Negative Generator initialized');
        
        // Check if JSZip is available
        if (typeof JSZip === 'undefined') {
            console.log('JSZip is not available. Batch downloads will fall back to individual downloads.');
            
            // Dynamically load JSZip library if needed
            const jsZipScript = document.createElement('script');
            jsZipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            jsZipScript.async = true;
            jsZipScript.onload = function() {
                console.log('JSZip library loaded');
            };
            jsZipScript.onerror = function() {
                console.error('Failed to load JSZip library');
            };
            document.body.appendChild(jsZipScript);
        }
    });
    
    // Unload handler to prevent memory leaks
    window.addEventListener('beforeunload', function() {
        // Clean up any object URLs
        try {
            ImageProcessor.clearProcessedImages();
        } catch (e) {
            console.error('Error during cleanup:', e);
        }
    });
})();
