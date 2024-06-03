from deepface import DeepFace
import os

# 新的圖片路徑
image_path = r"D:\DeepFaceTest\image-1717241383701.jpg"

# 測試 DeepFace 分析功能
try:
    if os.path.exists(image_path):
        print("圖片存在:", image_path)
        result = DeepFace.analyze(img_path=image_path, actions=['age'], enforce_detection=False)
        print("分析結果:", result)
    else:
        print("圖片不存在:", image_path)
except Exception as e:
    print("錯誤:", e)
