# 🐳 Docker Deployment Guide

This guide will help you run HabitForge using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- At least 2GB of free RAM
- At least 5GB of free disk space

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Divyansh723/HabitForge.git
cd HabitForge
```

### 2. Configure Environment Variables

Create a `.env.docker.local` file from the template:

```bash
cp .env.docker .env.docker.local
```

Edit `.env.docker.local` and update the values:

```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password-here
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
```

**Important**: Use strong passwords and secrets in production!

### 3. Build and Start Services

```bash
# Build and start all services
docker-compose --env-file .env.docker.local up -d

# Or use the default values (not recommended for production)
docker-compose up -d
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **MongoDB**: localhost:27017

## Docker Compose Services

### Frontend (React + Vite)
- **Port**: 3000
- **Image**: Built from root Dockerfile
- **Purpose**: Serves the React application

### Backend (Node.js + Express)
- **Port**: 8000
- **Image**: Built from server/Dockerfile
- **Purpose**: REST API server

### MongoDB
- **Port**: 27017
- **Image**: mongo:7.0
- **Purpose**: Database
- **Data**: Persisted in Docker volume

## Common Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d frontend
docker-compose up -d backend
docker-compose up -d mongodb
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongodb

# Follow specific service logs
docker-compose logs -f backend
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Services

```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build frontend

# Rebuild and restart
docker-compose up -d --build
```

### Check Service Status

```bash
# List running containers
docker-compose ps

# Check service health
docker-compose ps
```

### Execute Commands in Containers

```bash
# Access backend shell
docker-compose exec backend sh

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123

# Run npm commands in backend
docker-compose exec backend npm run test
```

## Environment Variables

### Frontend Environment Variables

Set in `docker-compose.yml` under `frontend.environment`:

```yaml
VITE_API_BASE_URL: http://localhost:8000/api
VITE_APP_NAME: HabitForge
VITE_AI_SERVICE_ENABLED: true
VITE_COMMUNITY_FEATURES_ENABLED: true
VITE_ANALYTICS_ENABLED: true
```

### Backend Environment Variables

Set in `docker-compose.yml` under `backend.environment`:

```yaml
NODE_ENV: production
PORT: 8000
MONGODB_URI: mongodb://admin:password@mongodb:27017/habitforge?authSource=admin
JWT_SECRET: your-secret-key
JWT_EXPIRE: 7d
CORS_ORIGIN: http://localhost:3000
```

### MongoDB Environment Variables

Set in `docker-compose.yml` under `mongodb.environment`:

```yaml
MONGO_INITDB_ROOT_USERNAME: admin
MONGO_INITDB_ROOT_PASSWORD: password123
MONGO_INITDB_DATABASE: habitforge
```

## Data Persistence

MongoDB data is persisted in Docker volumes:

- `mongodb_data`: Database files
- `mongodb_config`: Configuration files

### Backup Database

```bash
# Create backup
docker-compose exec mongodb mongodump \
  --username admin \
  --password password123 \
  --authenticationDatabase admin \
  --db habitforge \
  --out /data/backup

# Copy backup to host
docker cp habitforge-mongodb:/data/backup ./mongodb-backup
```

### Restore Database

```bash
# Copy backup to container
docker cp ./mongodb-backup habitforge-mongodb:/data/backup

# Restore backup
docker-compose exec mongodb mongorestore \
  --username admin \
  --password password123 \
  --authenticationDatabase admin \
  --db habitforge \
  /data/backup/habitforge
```

## Production Deployment

### Security Considerations

1. **Change Default Credentials**
   - Use strong passwords for MongoDB
   - Generate secure JWT secret (min 32 characters)

2. **Use Environment Files**
   - Never commit `.env.docker.local` to version control
   - Use Docker secrets for sensitive data in production

3. **Enable HTTPS**
   - Use a reverse proxy (Nginx, Traefik)
   - Configure SSL certificates

4. **Network Security**
   - Don't expose MongoDB port publicly
   - Use firewall rules
   - Configure CORS properly

### Production docker-compose.yml

Create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    restart: always
    # Don't expose port publicly
    # ports:
    #   - "27017:27017"

  backend:
    restart: always
    environment:
      NODE_ENV: production
      # Use Docker secrets or env files

  frontend:
    restart: always
    # Add reverse proxy configuration
```

Run with:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs [service-name]

# Check container status
docker-compose ps

# Inspect container
docker inspect habitforge-[service-name]
```

### MongoDB Connection Issues

```bash
# Test MongoDB connection
docker-compose exec backend node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.error('Error:', err));
"
```

### Port Already in Use

```bash
# Find process using port
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use different host port
```

### Out of Disk Space

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything (WARNING: deletes all data)
docker system prune -a --volumes
```

### Rebuild from Scratch

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose rm -f
docker rmi habitforge-frontend habitforge-backend

# Rebuild and start
docker-compose up -d --build
```

## Development with Docker

### Hot Reload for Development

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      target: development
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    command: npm run dev

  backend:
    volumes:
      - ./server/src:/app/src
    command: npm run dev
```

Run with:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Monitoring

### Health Checks

Services include health checks:

```bash
# Check health status
docker-compose ps

# View health check logs
docker inspect habitforge-backend | grep -A 10 Health
```

### Resource Usage

```bash
# View resource usage
docker stats

# View specific container
docker stats habitforge-backend
```

## Scaling

### Scale Backend Instances

```bash
# Run multiple backend instances
docker-compose up -d --scale backend=3

# Requires load balancer configuration
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Review this documentation
3. Search existing [GitHub Issues](https://github.com/Divyansh723/HabitForge/issues)
4. Create a new issue with:
   - Docker version: `docker --version`
   - Docker Compose version: `docker-compose --version`
   - Error logs
   - Steps to reproduce

---

**Happy Dockerizing! 🐳**
