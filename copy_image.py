import shutil
import os

source_path = r"D:\專題 購物網站\backend\face\image-1717238972201.jpg"
destination_dir = r"D:\DeepFaceTest"
destination_path = os.path.join(destination_dir, "image-1717238972201.jpg")

# 確保目標目錄存在
os.makedirs(destination_dir, exist_ok=True)

# 複製文件
shutil.copy(source_path, destination_path)

print(f"文件已複製到: {destination_path}")
