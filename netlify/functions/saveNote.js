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
