// Function to make API requests
async function fetchJSON(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}


// Function to calculate H-Index
function calculateHIndex(scores) {
    const sortedScores = scores
        .sort((a, b) => b - a);

    let hIndex = 0;

    for (let i = 0; i < sortedScores.length; i++) {
        if (sortedScores[i] >= i + 1) {
            hIndex = i + 1;
        } else {
            break;
        }
    }

    return hIndex;
}

// Function to update progress bar
function updateProgressBar(fetched, total) {
    const progress = Math.round((fetched / total) * 100);
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    progressBar.value = progress;
    progressText.textContent = `${progress}% (${fetched} / ${total})`;
}

async function computeHIndex() {
    const userId = document.getElementById('userId').value;
    const resultContainer = document.getElementById('resultContainer');
    const progressBar = document.getElementById('progressBar');

    resultContainer.innerHTML = ''; // Clear previous results
    progressBar.value = 0; // Reset progress bar
    updateProgressBar(0, 1); // Initial update

    try {
        // Fetch user information
        const userURL = `https://hacker-news.firebaseio.com/v0/user/${userId}.json`;
        const userData = await fetchJSON(userURL);

        // Fetch submitted items
        const submittedItems = userData.submitted;
        const totalItems = submittedItems.length;

        let fetchedCount = 0;
        const scores = [];

        // Batch size and delay for throttling
        const batchSize = 250;
        const delayBetweenBatches = 10;

        for (let i = 0; i < totalItems; i += batchSize) {
            const batch = submittedItems.slice(i, i + batchSize);
            const batchPromises = [];

            for (const itemId of batch) {
                batchPromises.push(fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json`));
            }

            const batchResults = await Promise.all(batchPromises);

            for (const itemData of batchResults) {
                fetchedCount++;

                // Update progress bar for each fetched item
                updateProgressBar(fetchedCount, totalItems);

                if (itemData && itemData.type === "story" && itemData.hasOwnProperty("score") && itemData.hasOwnProperty("type") && !itemData.hasOwnProperty("deleted") && !itemData.hasOwnProperty("dead")) {
                    scores.push(itemData.score);
                }
            }

            // Delay between batches
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }

        // Calculate H-Index
        const hIndex = calculateHIndex(scores);

        // Display result
        resultContainer.innerHTML = `<p>H-Index for ${userId}: ${hIndex}</p>`;

    } catch (error) {
        console.error('Error:', error);
        resultContainer.innerHTML = error;
    }
}
