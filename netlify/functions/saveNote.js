const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

// Initialize the notes array (or load from a JSON file)
let notes = [];

// Path to the notes JSON file
const notesFilePath = path.join(__dirname, '..', 'data', 'notes.json');

exports.handler = async function(event, context) {
    console.log("Request received:", event);

    if (event.httpMethod === "POST") {
        const form = new formidable.IncomingForm();
        
        return new Promise((resolve, reject) => {
            form.parse(event.body, (err, fields, files) => {
                if (err) {
                    console.log("Error processing form:", err);
                    return reject({ statusCode: 500, body: "Error processing form" });
                }

                const noteText = fields.noteText;
                const imageFile = files.image ? files.image[0] : null;
                console.log("Note text:", noteText);
                console.log("Image file:", imageFile);

                // Define note object
                const note = {
                    text: noteText,
                    image: imageFile ? `/images/${imageFile.newFilename}` : null,
                };

                // Save image file (if provided) to the public/images folder
                if (imageFile) {
                    const uploadPath = path.join(__dirname, '..', 'public', 'images', imageFile.newFilename);
                    fs.renameSync(imageFile.filepath, uploadPath);
                    console.log("Image saved to path:", uploadPath);
                }

                // Save the note to the in-memory array (or load and save to notes.json file)
                notes.push(note);

                // Save notes to the JSON file
                fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ success: true, message: "Note saved successfully!" })
                });
            });
        });
    } else {
        console.log("GET request received");

        // Read notes from the saved file
        let storedNotes = [];
        try {
            storedNotes = JSON.parse(fs.readFileSync(notesFilePath, 'utf8'));
        } catch (err) {
            console.log("Error reading notes file:", err);
        }

        return {
            statusCode: 200,
            body: JSON.stringify(storedNotes),
        };
    }
};
