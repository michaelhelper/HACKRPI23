const api_key = "68r83o9poe4v486tnff0u32lv9esr7t53limuhtkbmuxm0n6"

   tinymce.init({
        selector: 'textarea',
        ...//content omitted for brevity
        height: '700px',
                ai_request: (request, respondWith) => {
                    const openAiOptions = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${api_key}`
                        },
                        body: JSON.stringify(
                            {
                                model: 'gpt-3.5-turbo',
                                temperature: 0.7,
                                max_tokens: 800,
                                messages: [
                                    {
                                        role: 'user',
                                        content: request.prompt
                                    }
                                ]
                            }
                        )
                    };


            respondWith.string((signal) => window.fetch('https://api.openai.com/v1/chat/completions', {
                        signal,
                        ... openAiOptions
                    }).then(async (response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            return Promise.reject(`Failed to communicate with the OpenAI API. ${
                                await response.text()
                            }`);
                        }
                    }).then((data) => data.error ? Promise.reject(`Failed to communicate with the ChatGPT API because of ${
                        data.error.type
                    } error: ${
                        data.error.message
                    }`) : data).then((data) =>
                        data ?. choices[0] ?. message ?. content ?. trim()));
                }