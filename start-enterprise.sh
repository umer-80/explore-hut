#!/bin/bash

echo "🚀 Starting Explore Hut Enterprise Edition"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Option selection
echo "Choose how to start:"
echo "1) Docker Compose (Full Stack - Recommended)"
echo "2) Local Development (Backend only)"
echo "3) Stop all services"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🐳 Starting with Docker Compose...${NC}"
        echo ""
        
        # Start services
        docker-compose up -d
        
        echo ""
        echo -e "${GREEN}✅ Services started!${NC}"
        echo ""
        echo "📊 Service Status:"
        docker-compose ps
        echo ""
        echo "🌐 Access your application:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:5000"
        echo "   Redis:    localhost:6379"
        echo ""
        echo "📝 View logs:"
        echo "   docker-compose logs -f"
        echo ""
        echo "🛑 Stop services:"
        echo "   docker-compose down"
        ;;
        
    2)
        echo ""
        echo -e "${YELLOW}💻 Starting Local Development...${NC}"
        echo ""
        
        # Check if Redis is running
        if ! docker ps | grep -q redis; then
            echo "Starting Redis container..."
            docker run -d -p 6379:6379 --name explorehut-redis redis:7-alpine
            echo -e "${GREEN}✅ Redis started${NC}"
        else
            echo -e "${GREEN}✅ Redis already running${NC}"
        fi
        
        echo ""
        echo "📦 Installing backend dependencies..."
        cd backend
        npm install
        
        echo ""
        echo -e "${GREEN}✅ Ready to start!${NC}"
        echo ""
        echo "🚀 Start backend:"
        echo "   cd backend && npm run dev"
        echo ""
        echo "🚀 Start frontend (in another terminal):"
        echo "   cd frontend && npm start"
        ;;
        
    3)
        echo ""
        echo -e "${YELLOW}🛑 Stopping all services...${NC}"
        echo ""
        
        # Stop Docker Compose services
        docker-compose down
        
        # Stop standalone Redis if running
        docker stop explorehut-redis 2>/dev/null
        docker rm explorehut-redis 2>/dev/null
        
        echo -e "${GREEN}✅ All services stopped${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "🎉 Done!"
