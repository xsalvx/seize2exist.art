const { parse } = require('formidable');
const fs = require('fs');
const path = require('path');

// In-memory array to hold notes (You can replace it with a database)
let notes = [];

exports.handler = async function(event, context) {
    if (event.httpMethod === "POST") {
        const form = new formidable.IncomingForm();
        
        return new Promise((resolve, reject) => {
            form.parse(event.body, (err, fields, files) => {
                if (err) {
                    return reject({ statusCode: 500, body: "Error processing form" });
                }

                const noteText = fields.noteText; // The text submitted
                const imageFile = files.image ? files.image[0] : null; // The image file (optional)

                // Save the note text and image (if available)
                const note = {
                    text: noteText,
                    image: imageFile ? `/images/${imageFile.newFilename}` : null, // Save image path
                };

                // Store the image on Netlify's server (or use a cloud service)
                if (imageFile) {
                    const uploadPath = path.join(__dirname, '..', 'public', 'images', imageFile.newFilename);
                    fs.renameSync(imageFile.filepath, uploadPath);
                }

                // Save the note to the in-memory array (you could use a database here)
                notes.push(note);

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ success: true, message: "Note saved successfully!" })
                });
            });
        });
    } else {
        // Handle GET request (to fetch saved notes)
        return {
            statusCode: 200,
            body: JSON.stringify(notes),
        };
    }
};
