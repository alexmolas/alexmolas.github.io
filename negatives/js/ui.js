/**
 * UI Module
 * Handles all user interface interactions for cyanotype negative creation
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
    
    // Default settings from ImageProcessor
    const defaultSettings = ImageProcessor.defaultSettings;
    
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
        
        // Process with default settings
        processFilesWithSettings(files, defaultSettings);
    }
    
    /**
     * Process files with specific settings
     * @param {FileList} files - The files to process
     * @param {Object} settings - The processing settings
     */
    function processFilesWithSettings(files, settings) {
        if (files.length === 0) return;
        
        // Show processing section
        dropArea.style.display = 'none';
        processingSection.style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Reset progress
        updateProgress(0);
        
        // Clear previous results
        ImageProcessor.clearProcessedImages();
        
        // Process images with settings
        // Convert FileList to array
        const fileArray = Array.from(files).filter(file => {
            return file.type.match(/^image\//);
        });
        
        if (fileArray.length === 0) {
            alert('No valid image files were selected');
            handleProcessMore();
            return Promise.reject(new Error('No valid image files were selected'));
        }
        
        // Process each file
        const results = [];
        let completed = 0;
        
        const promises = fileArray.map(file => {
            return ImageProcessor.createNegative(file, settings)
                .then(result => {
                    results.push(result);
                    completed++;
                    
                    // Update progress
                    updateProgress(completed / fileArray.length);
                })
                .catch(error => {
                    console.error(`Error processing ${file.name}:`, error);
                    completed++;
                    
                    // Update progress even on error
                    updateProgress(completed / fileArray.length);
                });
        });
        
        return Promise.all(promises)
            .then(() => {
                displayResults(results);
                return results;
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
        originalImg.className = 'preview-image';
        
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
        negativeImg.alt = 'Cyanotype Negative';
        negativeImg.className = 'preview-image';
        
        const negativeLabel = document.createElement('div');
        negativeLabel.className = 'image-label';
        negativeLabel.textContent = 'Cyanotype Negative';
        
        negativeContainer.appendChild(negativeImg);
        negativeContainer.appendChild(negativeLabel);
        
        comparison.appendChild(originalContainer);
        comparison.appendChild(negativeContainer);
        
        // Create per-image settings section
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'image-settings';
        
        // Image name and download
        const nameAndDownload = document.createElement('div');
        nameAndDownload.className = 'result-header';
        
        const name = document.createElement('div');
        name.className = 'result-name';
        name.title = result.name;
        name.textContent = result.name;
        
        const downloadLink = document.createElement('a');
        downloadLink.className = 'download-link';
        downloadLink.textContent = 'Download';
        downloadLink.href = result.negativeUrl;
        downloadLink.download = getDownloadName(result.name);
        
        nameAndDownload.appendChild(name);
        nameAndDownload.appendChild(downloadLink);
        
        // Settings controls
        const settingsControls = document.createElement('div');
        settingsControls.className = 'image-settings-controls';
        
        // Contrast slider
        const contrastGroup = document.createElement('div');
        contrastGroup.className = 'setting-group';
        
        const contrastLabel = document.createElement('label');
        contrastLabel.textContent = 'Contrast: ';
        
        const contrastValue = document.createElement('span');
        contrastValue.className = 'setting-value';
        contrastValue.textContent = result.settings.contrast.toFixed(1);
        
        const contrastSlider = document.createElement('input');
        contrastSlider.type = 'range';
        contrastSlider.min = '0.5';
        contrastSlider.max = '3';
        contrastSlider.step = '0.1';
        contrastSlider.value = result.settings.contrast;
        contrastSlider.className = 'image-slider';
        
        const contrastReset = document.createElement('button');
        contrastReset.className = 'reset-button';
        contrastReset.textContent = 'Reset';
        contrastReset.dataset.setting = 'contrast';
        contrastReset.dataset.default = defaultSettings.contrast;
        
        contrastLabel.appendChild(contrastValue);
        
        const contrastControls = document.createElement('div');
        contrastControls.className = 'slider-container';
        contrastControls.appendChild(contrastSlider);
        contrastControls.appendChild(contrastReset);
        
        contrastGroup.appendChild(contrastLabel);
        contrastGroup.appendChild(contrastControls);
        
        // Density slider
        const densityGroup = document.createElement('div');
        densityGroup.className = 'setting-group';
        
        const densityLabel = document.createElement('label');
        densityLabel.textContent = 'Density: ';
        
        const densityValue = document.createElement('span');
        densityValue.className = 'setting-value';
        densityValue.textContent = result.settings.density.toFixed(1);
        
        const densitySlider = document.createElement('input');
        densitySlider.type = 'range';
        densitySlider.min = '0.8';
        densitySlider.max = '2';
        densitySlider.step = '0.1';
        densitySlider.value = result.settings.density;
        densitySlider.className = 'image-slider';
        
        const densityReset = document.createElement('button');
        densityReset.className = 'reset-button';
        densityReset.textContent = 'Reset';
        densityReset.dataset.setting = 'density';
        densityReset.dataset.default = defaultSettings.density;
        
        densityLabel.appendChild(densityValue);
        
        const densityControls = document.createElement('div');
        densityControls.className = 'slider-container';
        densityControls.appendChild(densitySlider);
        densityControls.appendChild(densityReset);
        
        densityGroup.appendChild(densityLabel);
        densityGroup.appendChild(densityControls);
        
        // Flip checkbox
        const flipGroup = document.createElement('div');
        flipGroup.className = 'setting-group checkbox-group';
        
        const flipLabel = document.createElement('label');
        
        const flipCheckbox = document.createElement('input');
        flipCheckbox.type = 'checkbox';
        flipCheckbox.checked = result.settings.flipHorizontal;
        
        const flipText = document.createTextNode('Flip Horizontally');
        
        flipLabel.appendChild(flipCheckbox);
        flipLabel.appendChild(flipText);
        
        flipGroup.appendChild(flipLabel);
        
        // Add all controls to the settings panel
        settingsControls.appendChild(contrastGroup);
        settingsControls.appendChild(densityGroup);
        settingsControls.appendChild(flipGroup);
        
        settingsPanel.appendChild(nameAndDownload);
        settingsPanel.appendChild(settingsControls);
        
        // Create a reference to track this specific item's settings separately
        const settingsRef = {
            current: JSON.parse(JSON.stringify(result.settings))
        };
        
        // Add event listeners for settings controls
        contrastSlider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            contrastValue.textContent = value.toFixed(1);
            
            // Debounce the update to avoid too many operations
            clearTimeout(this.updateTimer);
            this.updateTimer = setTimeout(() => {
                // Only update if value actually changed
                if (value !== settingsRef.current.contrast) {
                    // Only send the specific setting that changed
                    const singleSetting = { contrast: value };
                    console.log(`UI: Updating ONLY contrast to ${value}`);
                    
                    updateImageSettings(result.id, singleSetting, negativeImg, downloadLink)
                        .then(newResult => {
                            // Update our reference
                            settingsRef.current = JSON.parse(JSON.stringify(newResult.settings));
                            console.log(`UI: Updated settings reference:`, settingsRef.current);
                        })
                        .catch(err => {
                            // Reset UI to match actual value if there was an error
                            contrastSlider.value = settingsRef.current.contrast;
                            contrastValue.textContent = settingsRef.current.contrast.toFixed(1);
                        });
                }
            }, 200);
        });
        
        densitySlider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            densityValue.textContent = value.toFixed(1);
            
            // Debounce the update to avoid too many operations
            clearTimeout(this.updateTimer);
            this.updateTimer = setTimeout(() => {
                // Only update if value actually changed
                if (value !== settingsRef.current.density) {
                    // Only send the specific setting that changed
                    const singleSetting = { density: value };
                    console.log(`UI: Updating ONLY density to ${value}`);
                    
                    updateImageSettings(result.id, singleSetting, negativeImg, downloadLink)
                        .then(newResult => {
                            // Update our reference
                            settingsRef.current = JSON.parse(JSON.stringify(newResult.settings));
                            console.log(`UI: Updated settings reference:`, settingsRef.current);
                        })
                        .catch(err => {
                            // Reset UI to match actual value if there was an error
                            densitySlider.value = settingsRef.current.density;
                            densityValue.textContent = settingsRef.current.density.toFixed(1);
                        });
                }
            }, 200);
        });
        
        flipCheckbox.addEventListener('change', function() {
            const checked = this.checked;
            
            // Only update if value actually changed
            if (checked !== settingsRef.current.flipHorizontal) {
                // Only send the specific setting that changed
                const singleSetting = { flipHorizontal: checked };
                console.log(`UI: Updating ONLY flipHorizontal to ${checked}`);
                
                updateImageSettings(result.id, singleSetting, negativeImg, downloadLink)
                    .then(newResult => {
                        // Update our reference
                        settingsRef.current = JSON.parse(JSON.stringify(newResult.settings));
                        console.log(`UI: Updated settings reference:`, settingsRef.current);
                    })
                    .catch(err => {
                        // Reset UI to match actual value if there was an error
                        flipCheckbox.checked = settingsRef.current.flipHorizontal;
                    });
            }
        });
        
        contrastReset.addEventListener('click', function() {
            const defaultValue = parseFloat(this.dataset.default);
            contrastSlider.value = defaultValue;
            contrastValue.textContent = defaultValue.toFixed(1);
            
            // Only update if value actually changed
            if (defaultValue !== settingsRef.current.contrast) {
                // Only send the specific setting that changed
                const singleSetting = { contrast: defaultValue };
                console.log(`UI: Resetting ONLY contrast to ${defaultValue}`);
                
                updateImageSettings(result.id, singleSetting, negativeImg, downloadLink)
                    .then(newResult => {
                        // Update our reference
                        settingsRef.current = JSON.parse(JSON.stringify(newResult.settings));
                        console.log(`UI: Updated settings reference:`, settingsRef.current);
                    });
            }
        });
        
        densityReset.addEventListener('click', function() {
            const defaultValue = parseFloat(this.dataset.default);
            densitySlider.value = defaultValue;
            densityValue.textContent = defaultValue.toFixed(1);
            
            // Only update if value actually changed
            if (defaultValue !== settingsRef.current.density) {
                // Only send the specific setting that changed
                const singleSetting = { density: defaultValue };
                console.log(`UI: Resetting ONLY density to ${defaultValue}`);
                
                updateImageSettings(result.id, singleSetting, negativeImg, downloadLink)
                    .then(newResult => {
                        // Update our reference
                        settingsRef.current = JSON.parse(JSON.stringify(newResult.settings));
                        console.log(`UI: Updated settings reference:`, settingsRef.current);
                    });
            }
        });
        
        // Add sections to item
        item.appendChild(comparison);
        item.appendChild(settingsPanel);
        
        return item;
    }
    
    /**
     * Update settings for a specific image
     * @param {string} id - The image ID
     * @param {Object} newSettings - New settings to apply
     * @param {HTMLImageElement} imgElement - The image element to update
     * @param {HTMLAnchorElement} downloadLink - The download link to update
     * @returns {Promise} - Resolves with the updated result
     */
    function updateImageSettings(id, newSettings, imgElement, downloadLink) {
        // Show loading state
        imgElement.style.opacity = 0.5;
        
        // Update the image with new settings
        return ImageProcessor.updateImageSettings(id, newSettings)
            .then(result => {
                // Update the image and download link
                imgElement.src = result.negativeUrl;
                imgElement.style.opacity = 1;
                downloadLink.href = result.negativeUrl;
                
                // Return the updated result for UI updates
                return result;
            })
            .catch(error => {
                console.error('Error updating image settings:', error);
                imgElement.style.opacity = 1;
                alert('Could not update image settings: ' + error.message);
                throw error; // Re-throw to propagate the error
            });
    }
    
    /**
     * Get download filename for negative image
     * @param {string} originalName - Original filename
     * @returns {string} - New filename with '_cyanotype' appended
     */
    function getDownloadName(originalName) {
        const dotIndex = originalName.lastIndexOf('.');
        if (dotIndex === -1) {
            return originalName + '_cyanotype';
        }
        
        const nameWithoutExt = originalName.substring(0, dotIndex);
        const extension = originalName.substring(dotIndex);
        return nameWithoutExt + '_cyanotype' + extension;
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
                link.download = 'cyanotype_negatives.zip';
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
