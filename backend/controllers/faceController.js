import multer from "multer";
import axios from "axios";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import FormData from "form-data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "D:/DeepFaceTest"; // 使用固定的英文路径
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + ".jpg";
    cb(null, "image-" + uniqueSuffix);
  },
});
const upload = multer({ storage: storage });

const faceChecker = async (req, res) => {
  try {
    const imagePath = path.join("D:/DeepFaceTest", req.file.filename); // 使用固定的英文路径
    console.log(`Image path: ${imagePath}`); // 输出文件路径以便调试

    // 检查文件是否存在
    if (!fs.existsSync(imagePath)) {
      console.error(`File does not exist: ${imagePath}`);
      return res
        .status(500)
        .json({ message: `File does not exist: ${imagePath}` });
    } else {
      console.log(`File exists: ${imagePath}`);
    }

    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    const response = await axios.post(
      "http://localhost:6000/analyze",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    // fs.unlinkSync(imagePath);

    res.json(response.data);
  } catch (error) {
    console.error("Error processing image:", error);
    console.error("Error stack trace:", error.stack);
    res.status(500).send(error.message);
  }
};

export { upload, faceChecker };
