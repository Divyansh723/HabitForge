# 🐳 Docker Hub Deployment Guide

This guide will help you build and publish HabitForge Docker images to Docker Hub.

## Prerequisites

1. **Docker Desktop** installed and running
2. **Docker Hub account** - Create one at [hub.docker.com](https://hub.docker.com)
3. **Git Bash** (for Windows users running .sh scripts)

## Quick Start

### Step 1: Login to Docker Hub

Open your terminal and login:

```bash
docker login
```

Enter your Docker Hub username and password when prompted.

### Step 2: Build Images

**Windows (PowerShell/CMD):**
```bash
docker-build.bat YOUR_DOCKERHUB_USERNAME
```

**Linux/Mac/Git Bash:**
```bash
chmod +x docker-build.sh
./docker-build.sh YOUR_DOCKERHUB_USERNAME
```

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub username.

### Step 3: Push to Docker Hub

**Windows (PowerShell/CMD):**
```bash
docker-push.bat YOUR_DOCKERHUB_USERNAME
```

**Linux/Mac/Git Bash:**
```bash
chmod +x docker-push.sh
./docker-push.sh YOUR_DOCKERHUB_USERNAME
```

### Step 4: Verify on Docker Hub

Visit your Docker Hub profile:
- `https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/habitforge-frontend`
- `https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/habitforge-backend`

## Detailed Instructions

### Building with Version Tags

You can specify a version tag (default is `latest`):

```bash
# Build with version 1.0.0
docker-build.bat YOUR_USERNAME 1.0.0

# Push with version 1.0.0
docker-push.bat YOUR_USERNAME 1.0.0
```

This creates tags:
- `YOUR_USERNAME/habitforge-frontend:1.0.0`
- `YOUR_USERNAME/habitforge-frontend:latest`
- `YOUR_USERNAME/habitforge-backend:1.0.0`
- `YOUR_USERNAME/habitforge-backend:latest`

### Manual Build and Push

If you prefer manual commands:

```bash
# Build Frontend
docker build -t YOUR_USERNAME/habitforge-frontend:latest -f Dockerfile .

# Build Backend
docker build -t YOUR_USERNAME/habitforge-backend:latest -f server/Dockerfile ./server

# Push Frontend
docker push YOUR_USERNAME/habitforge-frontend:latest

# Push Backend
docker push YOUR_USERNAME/habitforge-backend:latest
```

## Using Published Images

### Update docker-compose.yml

Replace the `build` sections with `image`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    # ... rest of config

  backend:
    image: YOUR_USERNAME/habitforge-backend:latest
    # Remove the 'build' section
    # ... rest of config

  frontend:
    image: YOUR_USERNAME/habitforge-frontend:latest
    # Remove the 'build' section
    # ... rest of config
```

### Pull and Run

```bash
# Pull images
docker pull YOUR_USERNAME/habitforge-frontend:latest
docker pull YOUR_USERNAME/habitforge-backend:latest

# Run with docker-compose
docker-compose up -d
```

## Docker Hub Repository Setup

### 1. Create Repositories

Go to Docker Hub and create two repositories:
- `habitforge-frontend`
- `habitforge-backend`

### 2. Add Repository Description

**Frontend Repository:**
```
HabitForge Frontend - A modern, gamified habit tracking application

Built with React, TypeScript, and Tailwind CSS. Features include:
- Gamification with XP and levels
- Advanced analytics
- Dark mode support
- Responsive design

GitHub: https://github.com/Divyansh723/HabitForge
```

**Backend Repository:**
```
HabitForge Backend - REST API for habit tracking

Built with Node.js, Express, and MongoDB. Features include:
- JWT authentication
- RESTful API
- Gamification logic
- Analytics engine

GitHub: https://github.com/Divyansh723/HabitForge
```

### 3. Add README to Docker Hub

Create a `README.md` in each repository with usage instructions:

```markdown
# HabitForge Frontend

## Quick Start

```bash
docker pull YOUR_USERNAME/habitforge-frontend:latest
docker run -p 3000:3000 YOUR_USERNAME/habitforge-frontend:latest
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:8000/api)

## Full Stack Deployment

See the [GitHub repository](https://github.com/Divyansh723/HabitForge) for complete docker-compose setup.
```

## Automated Builds with GitHub Actions

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  DOCKER_USERNAME: YOUR_DOCKERHUB_USERNAME

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Extract metadata
      id: meta-frontend
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.DOCKER_USERNAME }}/habitforge-frontend
        tags: |
          type=ref,event=branch
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
    
    - name: Build and push Frontend
      uses: docker/build-push-action@v4
      with:
        context: .
        file: ./Dockerfile
        push: true
        tags: ${{ steps.meta-frontend.outputs.tags }}
        labels: ${{ steps.meta-frontend.outputs.labels }}
    
    - name: Extract metadata
      id: meta-backend
      uses: docker/metadata-action@v4
      with:
        images: ${{ env.DOCKER_USERNAME }}/habitforge-backend
        tags: |
          type=ref,event=branch
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
    
    - name: Build and push Backend
      uses: docker/build-push-action@v4
      with:
        context: ./server
        file: ./server/Dockerfile
        push: true
        tags: ${{ steps.meta-backend.outputs.tags }}
        labels: ${{ steps.meta-backend.outputs.labels }}
```

### Setup GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

## Image Size Optimization

Current image sizes (approximate):
- Frontend: ~150MB (Alpine-based)
- Backend: ~120MB (Alpine-based)

### Tips to Reduce Size

1. **Use .dockerignore**
   - Already configured in the project
   - Excludes node_modules, tests, docs

2. **Multi-stage builds**
   - Frontend already uses multi-stage build
   - Separates build and runtime dependencies

3. **Alpine Linux**
   - Both images use Alpine for minimal size

## Troubleshooting

### Build Fails

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker build --no-cache -t YOUR_USERNAME/habitforge-frontend:latest .
```

### Push Fails - Authentication

```bash
# Logout and login again
docker logout
docker login
```

### Push Fails - Rate Limit

Docker Hub has rate limits:
- Anonymous: 100 pulls per 6 hours
- Free account: 200 pulls per 6 hours
- Pro account: Unlimited

Wait or upgrade your account.

### Image Not Found

Make sure:
1. Repository exists on Docker Hub
2. Repository is public (or you're logged in)
3. Image name matches exactly

## Best Practices

### Tagging Strategy

```bash
# Development
YOUR_USERNAME/habitforge-frontend:dev

# Staging
YOUR_USERNAME/habitforge-frontend:staging

# Production
YOUR_USERNAME/habitforge-frontend:1.0.0
YOUR_USERNAME/habitforge-frontend:latest

# Feature branches
YOUR_USERNAME/habitforge-frontend:feature-auth
```

### Security

1. **Don't include secrets in images**
   - Use environment variables
   - Use Docker secrets in production

2. **Scan images for vulnerabilities**
   ```bash
   docker scan YOUR_USERNAME/habitforge-frontend:latest
   ```

3. **Use specific base image versions**
   - Instead of `node:18-alpine`
   - Use `node:18.19.0-alpine3.19`

### Maintenance

1. **Regular updates**
   - Update base images monthly
   - Rebuild and push new versions

2. **Clean up old tags**
   - Remove unused tags from Docker Hub
   - Keep last 5-10 versions

3. **Monitor image size**
   - Check size after each build
   - Optimize if it grows significantly

## Support

- **Docker Hub**: [hub.docker.com](https://hub.docker.com)
- **Docker Docs**: [docs.docker.com](https://docs.docker.com)
- **GitHub Issues**: [HabitForge Issues](https://github.com/Divyansh723/HabitForge/issues)

---

**Happy Dockerizing! 🐳**
