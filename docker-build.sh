#!/bin/bash

# Docker Hub Build and Push Script for HabitForge
# Usage: ./docker-build.sh <your-dockerhub-username>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if username is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Docker Hub username is required${NC}"
    echo "Usage: ./docker-build.sh <your-dockerhub-username>"
    exit 1
fi

DOCKER_USERNAME=$1
VERSION=${2:-latest}

echo -e "${GREEN}Building HabitForge Docker Images${NC}"
echo "Docker Hub Username: $DOCKER_USERNAME"
echo "Version: $VERSION"
echo ""

# Build Frontend
echo -e "${YELLOW}Building Frontend Image...${NC}"
docker build -t $DOCKER_USERNAME/habitforge-frontend:$VERSION -f Dockerfile .
docker tag $DOCKER_USERNAME/habitforge-frontend:$VERSION $DOCKER_USERNAME/habitforge-frontend:latest

# Build Backend
echo -e "${YELLOW}Building Backend Image...${NC}"
docker build -t $DOCKER_USERNAME/habitforge-backend:$VERSION -f server/Dockerfile ./server
docker tag $DOCKER_USERNAME/habitforge-backend:$VERSION $DOCKER_USERNAME/habitforge-backend:latest

echo -e "${GREEN}Build completed successfully!${NC}"
echo ""
echo "Images created:"
echo "  - $DOCKER_USERNAME/habitforge-frontend:$VERSION"
echo "  - $DOCKER_USERNAME/habitforge-frontend:latest"
echo "  - $DOCKER_USERNAME/habitforge-backend:$VERSION"
echo "  - $DOCKER_USERNAME/habitforge-backend:latest"
echo ""
echo -e "${YELLOW}To push to Docker Hub, run:${NC}"
echo "  docker push $DOCKER_USERNAME/habitforge-frontend:$VERSION"
echo "  docker push $DOCKER_USERNAME/habitforge-frontend:latest"
echo "  docker push $DOCKER_USERNAME/habitforge-backend:$VERSION"
echo "  docker push $DOCKER_USERNAME/habitforge-backend:latest"
echo ""
echo -e "${YELLOW}Or use the push script:${NC}"
echo "  ./docker-push.sh $DOCKER_USERNAME"
