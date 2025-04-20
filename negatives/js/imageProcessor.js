/**
 * Image Processor Module
 * Handles all image manipulation functionality
 */

const ImageProcessor = (function() {
    'use strict';
    
    // Store processed images
    const processedImages = [];
    
    /**
     * Convert an image to its negative
     * @param {File} imageFile - The original image file
     * @returns {Promise} - Resolves with the processed image data
     */
    function createNegative(imageFile) {
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
                ctx.drawImage(img, 0, 0);
                
                // Get image data for manipulation
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Invert each pixel (create negative)
                for (let i = 0; i < data.length; i += 4) {
                    // Invert RGB values (skip alpha)
                    data[i] = 255 - data[i];         // Red
                    data[i + 1] = 255 - data[i + 1]; // Green
                    data[i + 2] = 255 - data[i + 2]; // Blue
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
                        blob: blob
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
    
    // Public API
    return {
        createNegative,
        processImages,
        getProcessedImages,
        clearProcessedImages
    };
})();
