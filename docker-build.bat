@echo off
REM Docker Hub Build Script for HabitForge (Windows)
REM Usage: docker-build.bat <your-dockerhub-username> [version]

if "%1"=="" (
    echo Error: Docker Hub username is required
    echo Usage: docker-build.bat ^<your-dockerhub-username^> [version]
    exit /b 1
)

set DOCKER_USERNAME=%1
set VERSION=%2
if "%VERSION%"=="" set VERSION=latest

echo Building HabitForge Docker Images
echo Docker Hub Username: %DOCKER_USERNAME%
echo Version: %VERSION%
echo.

echo Building Frontend Image...
docker build -t %DOCKER_USERNAME%/habitforge-frontend:%VERSION% -f Dockerfile .
docker tag %DOCKER_USERNAME%/habitforge-frontend:%VERSION% %DOCKER_USERNAME%/habitforge-frontend:latest

echo.
echo Building Backend Image...
docker build -t %DOCKER_USERNAME%/habitforge-backend:%VERSION% -f server/Dockerfile ./server
docker tag %DOCKER_USERNAME%/habitforge-backend:%VERSION% %DOCKER_USERNAME%/habitforge-backend:latest

echo.
echo Build completed successfully!
echo.
echo Images created:
echo   - %DOCKER_USERNAME%/habitforge-frontend:%VERSION%
echo   - %DOCKER_USERNAME%/habitforge-frontend:latest
echo   - %DOCKER_USERNAME%/habitforge-backend:%VERSION%
echo   - %DOCKER_USERNAME%/habitforge-backend:latest
echo.
echo To push to Docker Hub, run:
echo   docker-push.bat %DOCKER_USERNAME%
