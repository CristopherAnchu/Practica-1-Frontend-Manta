#!/bin/bash
# Start All Microservices - Exam 2P

echo "🚀 Starting all microservices..."
echo ""

# Get the current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to start a service in a new terminal
start_service() {
    local service_name=$1
    local service_path=$2
    local command=$3
    
    echo "▶️  Starting $service_name..."
    
    # For different terminal emulators
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd '$service_path' && echo '🔹 $service_name' && $command; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd '$service_path' && echo '🔹 $service_name' && $command; bash" &
    elif command -v konsole &> /dev/null; then
        konsole -e bash -c "cd '$service_path' && echo '🔹 $service_name' && $command; exec bash" &
    else
        echo "⚠️  No supported terminal found. Running in background..."
        cd "$service_path" && $command &
    fi
    
    sleep 2
}

# Start Audit Service
start_service "Exam2P Audit Service" "$SCRIPT_DIR/audit-service" "npm run start:dev"

# Start API Gateway
start_service "API Gateway" "$SCRIPT_DIR/api-gateway" "npm run start:dev"

# Start MCP Tool
start_service "MCP Tool Server" "$SCRIPT_DIR/mcp-tool" "npm start"

echo ""
echo "✅ All microservices are starting!"
echo ""
echo "Services:"
echo "  • Exam2P Audit Service -> http://localhost:3000"
echo "  • API Gateway          -> http://localhost:3001"
echo "  • MCP Tool Server      -> http://localhost:3001"
echo ""
