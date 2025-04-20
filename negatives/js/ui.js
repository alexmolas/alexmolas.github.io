/**
 * UI Module
 * Handles all user interface interactions
 */

const UI = (function() {
    'use strict';
    
    // DOM Elements
    let dropArea;
    let fileInput;
    let processingSection;
    let progressBar;
    let progressText;
    let resultsSection;
    let resultsGrid;
    let downloadAllButton;
    let processMoreButton;
    
    /**
     * Initialize the UI
     */
    function init() {
        // Get DOM elements
        dropArea = document.getElementById('drop-area');
        fileInput = document.getElementById('file-input');
        processingSection = document.getElementById('processing-section');
        progressBar = document.getElementById('progress-bar');
        progressText = document.getElementById('progress-text');
        resultsSection = document.getElementById('results-section');
        resultsGrid = document.getElementById('results-grid');
        downloadAllButton = document.getElementById('download-all');
        processMoreButton = document.getElementById('process-more');
        
        // Set up event listeners
        setupDragAndDrop();
        
        // Button event listeners
        fileInput.addEventListener('change', handleFileSelect);
        downloadAllButton.addEventListener('click', handleDownloadAll);
        processMoreButton.addEventListener('click', handleProcessMore);
    }
    
    /**
     * Set up drag and drop functionality
     */
    function setupDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });
        
        dropArea.addEventListener('drop', handleDrop, false);
    }
    
    // Event handlers
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    /**
     * Handle file drop event
     * @param {Event} e - The drop event
     */
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        processFiles(files);
    }
    
    /**
     * Handle file select from input
     * @param {Event} e - The change event
     */
    function handleFileSelect(e) {
        const files = e.target.files;
        
        processFiles(files);
    }
    
    /**
     * Process the uploaded files
     * @param {FileList} files - The files to process
     */
    function processFiles(files) {
        if (files.length === 0) return;
        
        // Show processing section
        dropArea.style.display = 'none';
        processingSection.style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Reset progress
        updateProgress(0);
        
        // Process images
        ImageProcessor.processImages(files, updateProgress)
            .then(results => {
                displayResults(results);
            })
            .catch(error => {
                console.error('Error processing images:', error);
                alert('Error processing images: ' + error.message);
                handleProcessMore(); // Reset UI
            });
    }
    
    /**
     * Update progress bar
     * @param {number} progress - Progress value between 0 and 1
     */
    function updateProgress(progress) {
        const percentage = Math.round(progress * 100);
        progressBar.style.width = percentage + '%';
        progressText.textContent = percentage + '%';
    }
    
    /**
     * Display the results
     * @param {Array} results - Array of processed image data
     */
    function displayResults(results) {
        // Hide processing section and show results
        processingSection.style.display = 'none';
        resultsSection.style.display = 'block';
        
        // Clear previous results
        resultsGrid.innerHTML = '';
        
        // Create result items
        results.forEach(result => {
            const resultItem = createResultItem(result);
            resultsGrid.appendChild(resultItem);
        });
        
        // Hide download all button if only one result
        downloadAllButton.style.display = results.length > 1 ? 'block' : 'none';
    }
    
    /**
     * Create a result item element
     * @param {Object} result - The processed image data
     * @returns {HTMLElement} - The result item element
     */
    function createResultItem(result) {
        const item = document.createElement('div');
        item.className = 'result-item';
        item.dataset.id = result.id;
        
        // Create image comparison section
        const comparison = document.createElement('div');
        comparison.className = 'image-comparison';
        
        // Original image
        const originalContainer = document.createElement('div');
        originalContainer.className = 'image-container';
        
        const originalImg = document.createElement('img');
        originalImg.src = result.originalUrl;
        originalImg.alt = 'Original';
        
        const originalLabel = document.createElement('div');
        originalLabel.className = 'image-label';
        originalLabel.textContent = 'Original';
        
        originalContainer.appendChild(originalImg);
        originalContainer.appendChild(originalLabel);
        
        // Negative image
        const negativeContainer = document.createElement('div');
        negativeContainer.className = 'image-container';
        
        const negativeImg = document.createElement('img');
        negativeImg.src = result.negativeUrl;
        negativeImg.alt = 'Negative';
        
        const negativeLabel = document.createElement('div');
        negativeLabel.className = 'image-label';
        negativeLabel.textContent = 'Negative';
        
        negativeContainer.appendChild(negativeImg);
        negativeContainer.appendChild(negativeLabel);
        
        comparison.appendChild(originalContainer);
        comparison.appendChild(negativeContainer);
        
        // Create actions section
        const actions = document.createElement('div');
        actions.className = 'result-actions';
        
        const name = document.createElement('div');
        name.className = 'result-name';
        name.title = result.name;
        name.textContent = result.name;
        
        const downloadLink = document.createElement('a');
        downloadLink.className = 'download-link';
        downloadLink.textContent = 'Download';
        downloadLink.href = result.negativeUrl;
        downloadLink.download = getDownloadName(result.name);
        
        actions.appendChild(name);
        actions.appendChild(downloadLink);
        
        // Add sections to item
        item.appendChild(comparison);
        item.appendChild(actions);
        
        return item;
    }
    
    /**
     * Get download filename for negative image
     * @param {string} originalName - Original filename
     * @returns {string} - New filename with '_negative' appended
     */
    function getDownloadName(originalName) {
        const dotIndex = originalName.lastIndexOf('.');
        if (dotIndex === -1) {
            return originalName + '_negative';
        }
        
        const nameWithoutExt = originalName.substring(0, dotIndex);
        const extension = originalName.substring(dotIndex);
        return nameWithoutExt + '_negative' + extension;
    }
    
    /**
     * Handle download all button click
     */
    function handleDownloadAll() {
        const results = ImageProcessor.getProcessedImages();
        
        if (results.length === 0) {
            return;
        }
        
        // If only one image, just download it directly
        if (results.length === 1) {
            const link = document.createElement('a');
            link.href = results[0].negativeUrl;
            link.download = getDownloadName(results[0].name);
            link.click();
            return;
        }
        
        // For multiple images, check if JSZip is available
        if (typeof JSZip === 'undefined') {
            // If JSZip is not available, download each file individually
            results.forEach(result => {
                const link = document.createElement('a');
                link.href = result.negativeUrl;
                link.download = getDownloadName(result.name);
                link.click();
                
                // Add slight delay between downloads
                setTimeout(() => {}, 100);
            });
            return;
        }
        
        // Use JSZip to create a zip file
        const zip = new JSZip();
        
        // Add each blob to the zip
        const zipPromises = results.map(result => {
            return fetch(result.negativeUrl)
                .then(response => response.blob())
                .then(blob => {
                    zip.file(getDownloadName(result.name), blob);
                });
        });
        
        // When all files are added, generate and download the zip
        Promise.all(zipPromises)
            .then(() => {
                return zip.generateAsync({ type: 'blob' });
            })
            .then(zipBlob => {
                const zipUrl = URL.createObjectURL(zipBlob);
                const link = document.createElement('a');
                link.href = zipUrl;
                link.download = 'negative_images.zip';
                link.click();
                
                // Cleanup
                setTimeout(() => {
                    URL.revokeObjectURL(zipUrl);
                }, 1000);
            })
            .catch(error => {
                console.error('Error creating zip file:', error);
                alert('Could not create zip file. Downloading images individually...');
                
                // Fall back to individual downloads
                results.forEach(result => {
                    const link = document.createElement('a');
                    link.href = result.negativeUrl;
                    link.download = getDownloadName(result.name);
                    link.click();
                    
                    // Add slight delay between downloads
                    setTimeout(() => {}, 100);
                });
            });
    }
    
    /**
     * Handle process more button click
     */
    function handleProcessMore() {
        // Clear file input
        fileInput.value = '';
        
        // Show drop area again
        dropArea.style.display = 'block';
        processingSection.style.display = 'none';
        resultsSection.style.display = 'none';
    }
    
    // Public API
    return {
        init
    };
})();
