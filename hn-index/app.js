// Function to make API requests
async function fetchJSON(url) {
    const response = await fetch(url);
    return await response.json();
}

// Function to filter out irrelevant items
function filterItems(submittedItems) {
    return submittedItems.filter(item => !item.deleted && item.type === "story" && !item.dead);
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
        const fetchPromises = [];

        // Create an array of fetch promises
        for (const itemId of submittedItems) {
            fetchPromises.push(fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json`));
        }

        // Fetch and update progress bar asynchronously
        const scores = [];

        for (let i = 0; i < fetchPromises.length; i++) {
            const itemData = await fetchPromises[i];
            fetchedCount++;

            // Update progress bar for each fetched item
            
            updateProgressBar(fetchedCount, totalItems);

            if (!itemData.deleted && itemData.type === "story" && !itemData.dead) {
                scores.push(itemData.score);
            }

            // Add a small delay to allow UI update
            await new Promise(resolve => setTimeout(resolve, 0.1));
        }

        // Calculate H-Index
        const hIndex = calculateHIndex(scores);

        // Display result
        // murb
        // resultContainer.innerHTML = `<p>H-Index for ${scores} ${hIndex}</p>`;
        resultContainer.innerHTML = `<p>H-Index for ${userId}: ${hIndex}</p>`;

    } catch (error) {
        console.error('Error:', error);
        resultContainer.innerHTML = '<p>Error fetching user information. Please check the user ID.</p>';
    }
}