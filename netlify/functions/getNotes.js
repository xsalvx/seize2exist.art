const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  try {
    const notesPath = path.join(__dirname, '..', '..', 'data', 'notes.json');
    const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));

    return {
      statusCode: 200,
      body: JSON.stringify(notes),
    };
  } catch (error) {
    console.error("Error reading notes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not read notes" }),
    };
  }
};
