#!/bin/bash

echo "🚀 启动黄金投资追踪器..."
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查端口是否被占用
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告：端口 3001 已被占用"
    echo "正在尝试终止占用进程..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 1
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  警告：端口 5173 已被占用"
    echo "正在尝试终止占用进程..."
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo "📦 启动后端服务器 (端口 3001)..."
cd server
npm run dev > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端服务器启动..."
sleep 3

# 检查后端是否启动成功
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ 后端服务器启动成功！"
else
    echo "❌ 后端服务器启动失败，请查看 server.log"
    exit 1
fi

echo "🌐 启动前端应用 (端口 5173)..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "✨ 应用启动成功！"
echo ""
echo "📊 后端服务器: http://localhost:3001"
echo "🖥️  前端应用: http://localhost:5173"
echo ""
echo "📝 日志文件:"
echo "   - 后端: server.log"
echo "   - 前端: frontend.log"
echo ""
echo "💡 提示："
echo "   - 按 Ctrl+C 停止所有服务"
echo "   - 或运行: ./stop-dev.sh"
echo ""

# 保存进程ID
echo $SERVER_PID > .server.pid
echo $FRONTEND_PID > .frontend.pid

# 等待用户按 Ctrl+C
trap "echo ''; echo '🛑 停止服务...'; kill $SERVER_PID $FRONTEND_PID 2>/dev/null; rm -f .server.pid .frontend.pid; echo '✅ 所有服务已停止'; exit 0" INT

# 保持脚本运行
echo "按 Ctrl+C 停止所有服务..."
wait
