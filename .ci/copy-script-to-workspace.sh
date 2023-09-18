# 将根目录下的main.js 和 manifest.json 复制到 /Users/modao/Desktop/GitHub/note/.obsidian/plugins/$ID 路径下

# 获取根目录名称
ROOT_DIR="$(pwd)"

# 获取 manifest.json 文件中的 id 值
ID=$(grep -o '"id": *"[^"]*"' "manifest.json" | sed 's/"id": *"\([^"]*\)"/\1/')

# 复制 main.js 和 manifest.json 文件到目标路径
cp "$ROOT_DIR/main.js" "/Users/modao/Desktop/GitHub/note/.obsidian/plugins/$ID/"
cp "$ROOT_DIR/manifest.json" "/Users/modao/Desktop/GitHub/note/.obsidian/plugins/$ID/"

echo "复制成功！"
