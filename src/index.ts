import express from "express";
import cors from "cors";
import multer from "multer";

const PORT = process.env.PORT || 2000;
const app = express();

const imageUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "images");
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    }),
});

app.use(cors({ origin: "*" }));
app.use("/images", express.static("images"));

app.get("/", (req, res) => {
    res.send("<h1>Image uploader API</h1>");
});

app.post("/", imageUpload.single("file"), (req, res) => {
    const host = req.get('host');
    const path = req.file?.path;

    const imageUrl = `${req.protocol}://${host}/${path}`;

    if (req.file) {
        res.send({ message: "Uploaded Succesfully!", path: imageUrl });
    }
    else {
        res.status(400).send({ message: "There was an error while uploading the image." });
    }
});

app.listen(+PORT, () => console.log(`Server running on: http://localhost:${PORT}`));