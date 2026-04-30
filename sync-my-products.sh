#!/bin/bash

# ==============================================================================
# Script to sync my-products component across all projects in the directory
# ==============================================================================

# Source directory (current project's component)
SOURCE_DIR="/Users/meetqy/Desktop/meetqy/meetqy-template/src/components/my-products"
# Root directory to search for other projects
SEARCH_ROOT="/Users/meetqy/Desktop/meetqy"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: Source directory $SOURCE_DIR not found!"
    exit 1
fi

echo "🚀 Starting synchronization of 'my-products' component..."
echo "📂 Source: $SOURCE_DIR"
echo "🔍 Searching in: $SEARCH_ROOT"
echo "--------------------------------------------------"

# Count updated projects
count=0

# Find all directories named 'my-products' under the search root, excluding the source itself
# Also exclude node_modules to speed up search and avoid false positives
find "$SEARCH_ROOT" -type d -name "my-products" -not -path "*/node_modules/*" | while read -r target_dir; do
    # Skip the source directory
    if [[ "$target_dir" == "$SOURCE_DIR"* ]]; then
        continue
    fi

    echo "更新项目: $target_dir"
    
    # Copy index.tsx, index.css and utils.ts
    cp "$SOURCE_DIR/index.tsx" "$target_dir/"
    cp "$SOURCE_DIR/index.css" "$target_dir/"
    cp "$SOURCE_DIR/utils.ts" "$target_dir/"
    
    echo "✅ 已同步 $target_dir"
    ((count++))
done

echo "--------------------------------------------------"
echo "✨ 同步完成！"
echo "💡 提示: 请确保目标项目已安装 'marked' 依赖 (pnpm add marked)"
