const apiKey = process.env.MY_API_KEY;

if (!apiKey) {
  console.error('The MY_API_KEY environment variable is not set.');
  process.exit(1); // Exit the application with an error code
}

// Now you can use the apiKey in your code
console.log(`API Key: ${apiKey}`);
