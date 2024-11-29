const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

let notes = [];  // In-memory store for notes (use a database if you want persistence)

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

                const note = {
                    text: noteText,
                    image: imageFile ? `/images/${imageFile.newFilename}` : null,
                };

                // Save the image (if any) to the public/images folder
                if (imageFile) {
                    const uploadPath = path.join(__dirname, '..', 'public', 'images', imageFile.newFilename);
                    fs.renameSync(imageFile.filepath, uploadPath);
                    console.log("Image saved to path:", uploadPath);
                }

                notes.push(note);

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ success: true, message: "Note saved successfully!" })
                });
            });
        });
    } else {
        console.log("GET request received");
        return {
            statusCode: 200,
            body: JSON.stringify(notes),
        };
    }
};
