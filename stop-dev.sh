#!/bin/bash

echo "🛑 停止黄金投资追踪器..."

# 停止通过启动脚本启动的进程
if [ -f ".server.pid" ]; then
    SERVER_PID=$(cat .server.pid)
    kill $SERVER_PID 2>/dev/null
    rm -f .server.pid
    echo "✅ 后端服务器已停止"
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    kill $FRONTEND_PID 2>/dev/null
    rm -f .frontend.pid
    echo "✅ 前端应用已停止"
fi

# 强制停止占用端口的进程
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "🔧 清理端口 3001..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "🔧 清理端口 5173..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
fi

echo "✨ 所有服务已停止！"
