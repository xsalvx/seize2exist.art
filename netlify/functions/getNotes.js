const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  try {
    const notesPath = path.join(__dirname, '..', '..', 'data', 'notes.json');

    // Check if file exists
    if (!fs.existsSync(notesPath)) {
      return {
        statusCode: 200,
        body: JSON.stringify([]), // Return an empty array if file doesn't exist
      };
    }

    const notes = JSON.parse(fs.readFileSync(notesPath, 'utf8'));

    // Ensure the data is an array
    if (!Array.isArray(notes)) {
      throw new Error('Notes data is not an array');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(notes),
    };
  } catch (error) {
    console.error("Error in getNotes function:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not load notes" }),
    };
  }
};
