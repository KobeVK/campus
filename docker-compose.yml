version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000/api
    networks:
      - school-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
    environment:
      - DATABASE_URL=postgres://postgres:postgres@postgres:5432/schooldb
      - JWT_SECRET=your_jwt_secret_here_change_in_production
      - NODE_ENV=development
    networks:
      - school-network

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=schooldb
    networks:
      - school-network

networks:
  school-network:
    driver: bridge

volumes:
  postgres_data: