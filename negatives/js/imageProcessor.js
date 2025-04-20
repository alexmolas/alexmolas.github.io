/**
 * Image Processor Module
 * Handles all image manipulation functionality for creating cyanotype-ready negatives
 */

const ImageProcessor = (function() {
    'use strict';
    
    // Store processed images
    const processedImages = [];
    
    // Default settings for cyanotype processing
    const defaultSettings = {
        contrast: 1,      // Contrast enhancement factor
        density: 1,       // Density adjustment for proper exposure
        flipHorizontal: false, // Whether to flip the image horizontally
    };
    
    /**
     * Convert an image to a cyanotype-ready negative
     * @param {File} imageFile - The original image file
     * @param {Object} settings - Optional settings to override defaults
     * @returns {Promise} - Resolves with the processed image data
     */
    function createNegative(imageFile, settings = {}) {
        // Merge provided settings with defaults
        const processingSettings = {
            ...defaultSettings,
            ...settings
        };
        
        return new Promise((resolve, reject) => {
            // Create image element
            const img = new Image();
            const originalUrl = URL.createObjectURL(imageFile);
            
            img.onload = function() {
                // Create canvas for image manipulation
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Get canvas context and draw image
                const ctx = canvas.getContext('2d');
                
                // Apply horizontal flip if needed
                if (processingSettings.flipHorizontal) {
                    ctx.translate(canvas.width, 0);
                    ctx.scale(-1, 1);
                }
                
                ctx.drawImage(img, 0, 0);
                
                // Reset transform if we flipped
                if (processingSettings.flipHorizontal) {
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                }
                
                // Get image data for manipulation
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Process each pixel: convert to B&W, adjust contrast, and invert
                for (let i = 0; i < data.length; i += 4) {
                    // Convert to grayscale first - weighted method for better perceptual results
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // Use luminance formula for better grayscale conversion
                    let gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    
                    // Apply contrast adjustment
                    gray = applyContrast(gray, processingSettings.contrast);
                    
                    // Apply density adjustment and invert (255 - value)
                    gray = Math.max(0, Math.min(255, 255 - (gray * processingSettings.density)));
                    
                    // Set all RGB channels to the same value (inverted grayscale)
                    data[i] = data[i + 1] = data[i + 2] = gray;
                    // data[i + 3] is alpha (leave unchanged)
                }
                
                // Put the modified image data back on the canvas
                ctx.putImageData(imageData, 0, 0);
                
                // Convert canvas to blob to get a downloadable URL
                canvas.toBlob(function(blob) {
                    // Create object URL for the blob
                    const negativeUrl = URL.createObjectURL(blob);
                    
                    // Store processed image data
                    const result = {
                        id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                        name: imageFile.name,
                        type: imageFile.type,
                        originalSize: imageFile.size,
                        negativeSize: blob.size,
                        originalUrl: originalUrl,
                        negativeUrl: negativeUrl,
                        blob: blob,
                        originalBlob: imageFile, // Store the original file/blob data
                        settings: processingSettings
                    };
                    
                    processedImages.push(result);
                    resolve(result);
                }, imageFile.type);
            };
            
            img.onerror = function() {
                URL.revokeObjectURL(originalUrl);
                reject(new Error('Failed to load image'));
            };
            
            img.src = originalUrl;
        });
    }
    
    /**
     * Process multiple images
     * @param {FileList} fileList - List of image files to process
     * @param {Function} progressCallback - Called with progress updates
     * @returns {Promise} - Resolves when all images are processed
     */
    function processImages(fileList, progressCallback) {
        return new Promise((resolve, reject) => {
            const files = Array.from(fileList).filter(file => {
                return file.type.match(/^image\//);
            });
            
            if (files.length === 0) {
                reject(new Error('No valid image files were selected'));
                return;
            }
            
            const results = [];
            let completed = 0;
            
            // Process each file
            files.forEach((file, index) => {
                createNegative(file)
                    .then(result => {
                        results.push(result);
                        completed++;
                        
                        // Update progress
                        if (progressCallback) {
                            progressCallback(completed / files.length);
                        }
                        
                        // Check if all files have been processed
                        if (completed === files.length) {
                            resolve(results);
                        }
                    })
                    .catch(error => {
                        console.error(`Error processing ${file.name}:`, error);
                        completed++;
                        
                        // Update progress even on error
                        if (progressCallback) {
                            progressCallback(completed / files.length);
                        }
                        
                        // Check if all files have been processed
                        if (completed === files.length) {
                            resolve(results);
                        }
                    });
            });
        });
    }
    
    /**
     * Get all processed images
     * @returns {Array} - Array of processed image data
     */
    function getProcessedImages() {
        return [...processedImages];
    }
    
    /**
     * Clear all processed images
     */
    function clearProcessedImages() {
        // Revoke all object URLs to prevent memory leaks
        processedImages.forEach(image => {
            URL.revokeObjectURL(image.originalUrl);
            URL.revokeObjectURL(image.negativeUrl);
        });
        
        // Clear the array
        processedImages.length = 0;
    }
    
    /**
     * Apply contrast adjustment to a pixel value
     * @param {number} value - Pixel value (0-255)
     * @param {number} factor - Contrast adjustment factor
     * @returns {number} - Adjusted pixel value
     */
    function applyContrast(value, factor) {
        // Adjust contrast around the midpoint (128)
        return Math.max(0, Math.min(255, 128 + (value - 128) * factor));
    }
    
    /**
     * Update the processing settings for an existing processed image
     * @param {string} id - The ID of the processed image
     * @param {Object} newSettings - New settings to apply
     * @returns {Promise} - Resolves with the updated image data
     */
    function updateImageSettings(id, newSettings) {
        console.log(`Updating image ${id} with new settings:`, newSettings);
        
        // Create a lookup map for ALL processed images by ID for easier access
        const imagesMap = {};
        processedImages.forEach(img => {
            imagesMap[img.id] = img;
        });
        
        // Get the LATEST version of the image settings
        const existingImage = imagesMap[id];
        
        if (!existingImage) {
            console.error(`Image not found with ID: ${id}`);
            return Promise.reject(new Error('Image not found'));
        }
        
        console.log(`Current settings for image ${id}:`, existingImage.settings);
        
        // Use the stored original blob directly - no fetch needed
        const originalBlob = existingImage.originalBlob;
        
        // Apply the updated settings - make a deep copy of existing settings first
        const updatedSettings = JSON.parse(JSON.stringify(existingImage.settings));
        
        // Then apply only the specific new settings that were changed
        Object.keys(newSettings).forEach(key => {
            updatedSettings[key] = newSettings[key];
        });
        
        console.log(`Final settings to be applied:`, updatedSettings);
        
        // Process the image with the new settings but keep the same ID
        return createNegative(originalBlob, updatedSettings)
            .then(result => {
                // Remove the old image from processed images
                const index = processedImages.findIndex(img => img.id === id);
                if (index !== -1) {
                    // Revoke old URLs to prevent memory leaks
                    URL.revokeObjectURL(existingImage.originalUrl);
                    URL.revokeObjectURL(existingImage.negativeUrl);
                    processedImages.splice(index, 1);
                }
                
                // Force the new result to have the same ID as the original
                result.id = id;
                
                // Preserve the original blob data in the new result
                result.originalBlob = originalBlob;
                
                // Store the result
                processedImages.push(result);
                
                console.log(`Update complete for image ${id}. New settings:`, result.settings);
                return result;
            });
    }
    
    // Public API
    return {
        createNegative,
        processImages,
        getProcessedImages,
        clearProcessedImages,
        updateImageSettings,
        defaultSettings
    };
})();
