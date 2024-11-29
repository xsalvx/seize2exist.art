const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const dataPath = path.join(__dirname, "../../data/notes.json");
    const notes = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    const newNote = JSON.parse(event.body);
    notes.push(newNote);

    fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Note saved!" }),
    };
  } catch (error) {
    console.error("Error saving note:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
