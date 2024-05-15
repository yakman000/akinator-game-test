const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  console.log('Starting fetchCharacters function'); // Log function start

  if (!apiKey) {
    console.error('Missing OpenAI API key'); // Log missing API key error
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

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

    console.log('Response received from OpenAI API'); // Log response received

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data received from OpenAI API:', data); // Log data received

    let characters;
    try {
      characters = JSON.parse(data.choices[0].message.content);
      console.log('Parsed characters:', characters); // Log parsed characters
    } catch (parseError) {
      console.error('Error parsing characters:', parseError); // Log parsing error
      throw new Error('Failed to parse characters');
    }

    res.status(200).json(characters);
  } catch (error) {
    console.error('Error in fetchCharacters function:', error.message); // Log any errors
    res.status(500).json({ error: error.message });
  }
};

