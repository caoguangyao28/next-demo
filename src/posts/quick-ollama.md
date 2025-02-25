---
title: "通过 shell 脚本提速 Ollama 安装模型"
date: "2025-02-25"
description: "Ollama 安装模型老是开始快，然后越来越慢？暂停后再次启动又会变快，然后越来越慢～"
---

通过分段脚本的方式来执行 ollama 模型安装，因为 ollama 具备断点续传，所以可以暂停后再启动。
安装模型老是开始快，然后越来越慢？暂停后再次启动又会变快，然后越来越慢～，利用这个规律，通过 shell 脚本来优化安装速度。
新建一个 **.sh 文件，填入以下内容：
```bash
#!/bin/bash

# ollama pull 分段访问 脚本

MODEL_NAME="deepseek-r1:8b"
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    MODEL_EXISTS=$(ollama list | grep "$MODEL_NAME")
    if [ -n "$MODEL_EXISTS" ]; then
        echo "The model $MODEL_NAME is downloaded."
        exit 0
    fi

    echo "Attempting to run model $MODEL_NAME..."
    ollama run "$MODEL_NAME" &
    PID=$!
    sleep 120

    # 检查 ollama run 是否已经完成
    if kill -0 $PID 2>/dev/null; then
        echo "Terminating process $PID..."
        kill $PID
        wait $PID 2>/dev/null
    else
        echo "Process $PID has already finished."
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "Retrying in 3 seconds... (Attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 3
done

echo "Failed to download the model after $MAX_RETRIES attempts."
exit 1
```

`MODEL_NAME` 可以替换成你想要下载的模型名称。亲测好用，拿去不谢。

**注意**: macos 系统下 `.sh` 文件需要用 `chmod +x` 命令赋予执行权限。

例如：
```bash
chmod +x ollama-pull.sh
```
然后执行 该文件即可～
