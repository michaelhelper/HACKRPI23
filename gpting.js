const searchButton = document.getElementById("searc-button");
const searchInput = document.getElementById("searc-input");
const responseContainer = document.getElementById("response-container");

// Define the GPT API endpoint URL
const gptApiUrl = "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";

searchButton.addEventListener("click", async () => {
    // Get the text from the input element
    const searchText = searchInput.value;

    // Make a request to the GPT API
    try {
        const response = await fetch(gptApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: searchText }),
        });

        if (response.ok) {
            const responseData = await response.json();

            // Display the response in the response container
            responseContainer.textContent = responseData.response;
        } else {
            console.error("Failed to fetch data from the GPT API");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});