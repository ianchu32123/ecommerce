from flask import Flask, request, jsonify
from deepface import DeepFace
import os

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    file = request.files['image']
    image_path = os.path.join("D:/DeepFaceTest", file.filename)
    file.save(image_path)

    try:
        if os.path.exists(image_path):
            print("圖片存在:", image_path)
            print("開始分析圖像...")
            result = DeepFace.analyze(img_path=image_path, actions=['age'], enforce_detection=False)
            print("分析結果:", result)
            return jsonify(result)
        else:
            print("圖片不存在:", image_path)
            return jsonify({"error": "圖片不存在"}), 404
    except Exception as e:
        print("錯誤處理圖像:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=6000, debug=True)
