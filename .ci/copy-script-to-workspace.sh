# 将根目录下的main.js 和 manifest.json 复制到 /Users/modao/Desktop/GitHub/note/.obsidian/plugins/$ID 路径下

# 获取根目录名称
ROOT_DIR="$(pwd)"

# 获取 manifest.json 文件中的 id 值
ID=$(grep -o '"id": *"[^"]*"' "manifest.json" | sed 's/"id": *"\([^"]*\)"/\1/')

# 复制 main.js 和 manifest.json 文件到目标路径
TARGET_DIR="/Users/modao/Desktop/GitHub/note/.obsidian/plugins/$ID"
if [ ! -d "$TARGET_DIR" ]; then
  mkdir "$TARGET_DIR"
fi

cp "$ROOT_DIR/main.js" "$TARGET_DIR"
cp "$ROOT_DIR/manifest.json" "$TARGET_DIR"

echo "复制成功！"
