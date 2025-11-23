@echo off
REM Docker Hub Push Script for HabitForge (Windows)
REM Usage: docker-push.bat <your-dockerhub-username> [version]

if "%1"=="" (
    echo Error: Docker Hub username is required
    echo Usage: docker-push.bat ^<your-dockerhub-username^> [version]
    exit /b 1
)

set DOCKER_USERNAME=%1
set VERSION=%2
if "%VERSION%"=="" set VERSION=latest

echo Pushing HabitForge Images to Docker Hub
echo Docker Hub Username: %DOCKER_USERNAME%
echo Version: %VERSION%
echo.

echo Pushing Frontend Image...
docker push %DOCKER_USERNAME%/habitforge-frontend:%VERSION%
docker push %DOCKER_USERNAME%/habitforge-frontend:latest

echo.
echo Pushing Backend Image...
docker push %DOCKER_USERNAME%/habitforge-backend:%VERSION%
docker push %DOCKER_USERNAME%/habitforge-backend:latest

echo.
echo Successfully pushed all images to Docker Hub!
echo.
echo Images available at:
echo   - https://hub.docker.com/r/%DOCKER_USERNAME%/habitforge-frontend
echo   - https://hub.docker.com/r/%DOCKER_USERNAME%/habitforge-backend
echo.
echo To use these images:
echo   docker pull %DOCKER_USERNAME%/habitforge-frontend:latest
echo   docker pull %DOCKER_USERNAME%/habitforge-backend:latest
