#!/bin/bash

# School Management System - Build and Deploy Script
# Builds and deploys separate frontend and backend containers

set -e

REGISTRY="campus0507.jfrtpt.org/docker"
# Generate unique tag with timestamp to avoid caching
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
TAG="0607new"
NAMESPACE="campus"

echo "🏫 School Management System - Build and Deploy"
echo "================================================"
echo "🏷️  Using unique tag: $TAG"
echo "🧹 Cleaning Docker cache..."

echo "📦 Building separate containers with no cache..."

# Function to build and push image
build_and_push() {
    local dockerfile=$1
    local image_name=$2
    local context=$3
    
    echo "🔨 Building $image_name..."
    # Force no cache and pull latest base images
    docker build --platform linux/arm64 \
        --no-cache \
        --pull \
        --force-rm \
        -f $dockerfile \
        -t $image_name:$TAG \
        $context
    
    echo "🏷️  Tagging $image_name..."
    docker tag $image_name:$TAG $REGISTRY/$image_name:$TAG
    
    echo "📤 Pushing $image_name..."
    docker push $REGISTRY/$image_name:$TAG
    
    echo "✅ $image_name built and pushed successfully!"
    echo ""
}

# Build frontend (using Dockerfile.frontend)
build_and_push "Dockerfile.frontend" "campus" "."

# Build backend (using Dockerfile.backend)
build_and_push "Dockerfile.backend" "campus-backend" "."

echo "🚀 Deploying separate containers..."

# Update helm with new image tags
helm upgrade --install campus-website ./helm \
    --set frontend.image.tag=$TAG \
    --set backend.image.tag=$TAG \
    -n $NAMESPACE

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 IMPORTANT: Update your helm values.yaml with new tag: $TAG"
echo ""
echo "📊 Check status:"
echo "kubectl get pods -n $NAMESPACE"
echo "kubectl get services -n $NAMESPACE"
echo "kubectl get ingress -n $NAMESPACE"
echo ""
echo "📝 View logs:"
echo "kubectl logs -f deployment/campus-website-frontend -n $NAMESPACE"
echo "kubectl logs -f deployment/campus-website-backend -n $NAMESPACE"
echo ""
echo "🌐 Access your application:"
echo "Frontend: https://your-domain.com"
echo "Backend API: https://your-domain.com/api"
echo "Health Check: https://your-domain.com/health"
echo ""
echo "🔧 Debug commands:"
echo "kubectl describe ingress campus-website -n $NAMESPACE"
echo "kubectl get events -n $NAMESPACE --sort-by='.lastTimestamp' | tail -10"

# notes:
# create jat gpt env
# create namespace
# create new token
# create secret with token
# create repo caleld docker
# get rds sdm port
# change env name in all files
# change port in .env
# run ./runall.sh


# teacher admin credentials:
# Username: admin
# Password: pwd1234