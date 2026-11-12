const cloudinary = require("../config/cloudinary");

function uploadImage(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "roadwatch/potholes",
                resource_type: "image",
                transformation: [
                    { width: 1200, height: 1200, crop: "limit" },
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });
}

module.exports = { uploadImage };