// Simple note-saving function for Netlify
let notes = []; // In-memory store (only lasts during function execution)

exports.handler = async (event, context) => {
    if (event.httpMethod === "POST") {
        // Parse incoming request body
        const body = JSON.parse(event.body);
        const noteText = body.text;

        if (!noteText) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Note text is required" })
            };
        }

        // Save the note to memory
        notes.push(noteText);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Note saved successfully!", notes })
        };
    }

    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
};

