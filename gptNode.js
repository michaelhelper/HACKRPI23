const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: "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",
});


exports.chatReq = async (req, res) => {
  try {
    const message = "Which is the capital of Albania?";
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0,
      max_tokens: 1000,
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err.message);
  }
};