#!/bin/bash

# Docker Hub Push Script for HabitForge
# Usage: ./docker-push.sh <your-dockerhub-username>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if username is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Docker Hub username is required${NC}"
    echo "Usage: ./docker-push.sh <your-dockerhub-username>"
    exit 1
fi

DOCKER_USERNAME=$1
VERSION=${2:-latest}

echo -e "${GREEN}Pushing HabitForge Images to Docker Hub${NC}"
echo "Docker Hub Username: $DOCKER_USERNAME"
echo "Version: $VERSION"
echo ""

# Check if logged in to Docker Hub
if ! docker info | grep -q "Username: $DOCKER_USERNAME"; then
    echo -e "${YELLOW}Not logged in to Docker Hub. Please login first:${NC}"
    echo "  docker login"
    exit 1
fi

# Push Frontend
echo -e "${YELLOW}Pushing Frontend Image...${NC}"
docker push $DOCKER_USERNAME/habitforge-frontend:$VERSION
docker push $DOCKER_USERNAME/habitforge-frontend:latest

# Push Backend
echo -e "${YELLOW}Pushing Backend Image...${NC}"
docker push $DOCKER_USERNAME/habitforge-backend:$VERSION
docker push $DOCKER_USERNAME/habitforge-backend:latest

echo ""
echo -e "${GREEN}Successfully pushed all images to Docker Hub!${NC}"
echo ""
echo "Images available at:"
echo "  - https://hub.docker.com/r/$DOCKER_USERNAME/habitforge-frontend"
echo "  - https://hub.docker.com/r/$DOCKER_USERNAME/habitforge-backend"
echo ""
echo -e "${YELLOW}To use these images:${NC}"
echo "  docker pull $DOCKER_USERNAME/habitforge-frontend:latest"
echo "  docker pull $DOCKER_USERNAME/habitforge-backend:latest"
