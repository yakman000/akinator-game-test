const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: `Provide a list of characters in JSON format, where each character has the following attributes: wizard (boolean), student (boolean), male (boolean). For example: 
          {
              "Harry Potter": {"wizard": true, "student": true, "male": true},
              "Hermione Granger": {"wizard": true, "student": true, "male": false},
              "Ron Weasley": {"wizard": true, "student": true, "male": true}
          }`
        }]
      })
    });

    const data = await response.json();
    const characters = JSON.parse(data.choices[0].message.content);
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

