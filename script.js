const token = process.env.OPENAI_API_KEY;

tinymce.init({
  selector: 'textarea',  // Change this value according to your HTML
  plugins: 'ai',
  toolbar: 'aidialog aishortcuts',
  ai_request: (request, respondWith) => {
    const openAiOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 800,
        messages: [{ role: 'user', content: request.prompt }],
      })
    };
    respondWith.string((signal) => window.fetch('https://api.openai.com/v1/chat/completions', { signal, ...openAiOptions })
      .then((response) => response.ok ? response.json() : response.text())
      .then((data) => {
        if (typeof data === 'string') {
          Promise.reject(`Failed to communicate with the ChatGPT API. ${data}`);
        } else if (data.error) {
          Promise.reject(`Failed to communicate with the ChatGPT API because of ${data.error.type} error: ${data.error.message}`);
        } else {
          // Extract the response content from the data returned by the API
          return data?.choices[0]?.message?.content?.trim();
        }
      })
    );
  }
});