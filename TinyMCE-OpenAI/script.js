 tinymce.init({
    selector: 'textarea',
    plugins: 'ai advtable powerpaste casechange searchreplace autolink advcode image link codesample table tableofcontents insertdatetime advlist link lists checklist wordcount tinymcespellchecker',
    toolbar: 'undo redo print spellcheckdialog formatpainter | bold italic underline forecolor backcolor | link | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist | removeformat | aidialog aishortcuts',
  height: '700px'
  });


 height: '700px', 
        ai_request: (request, respondWith) => {
          const openAiOptions = {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer 68r83o9poe4v486tnff0u32lv9esr7t53limuhtkbmuxm0n6`
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
  respondWith.string((signal) =>
            window.fetch('https://api.openai.com/v1/chat/completions', {
                signal, 
                ... openAiOptions
            }).then(async(response) => {
                if (response.ok){
                return response.json(); 
                } else {
                    return Promise.reject(`Failed to communicate with the OpenAI API. ${
                    await response.text()
                }`);
                }
            }).then((data)=> data.error ? 
            Promise.reject(`Failed to communicate with ChatGPT API because of ${
                data.error.type
            } error: ${
                data.error.message
            }`) : data).then((data) =>
                data?.choices[0]?.message?.content?.trim()));
        }
    }
);
