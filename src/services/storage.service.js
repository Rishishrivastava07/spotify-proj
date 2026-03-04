const { ImageKit } = require("@imagekit/nodejs");

let imageKitClient;

function getImageKitClient() {
    if (imageKitClient) return imageKitClient;

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("Missing IMAGEKIT_PRIVATE_KEY environment variable");
    }

    imageKitClient = new ImageKit({ privateKey });
    return imageKitClient;
}

async function uploadFile(file) {
    const client = getImageKitClient();
    const result = await client.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "ut-backend/music",
    });
    return result;
}

module.exports = {
    uploadFile,
};
