#!/bin/bash

# School Management System - Build and Deploy Script
# Builds and deploys separate frontend and backend containers

set -e

REGISTRY="campus2.jfrtpt.org/docker"
TAG="latest-arm64"
NAMESPACE="campus"

echo "🏫 School Management System - Build and Deploy"
echo "================================================"
echo "📦 Building separate containers..."

# Function to build and push image
build_and_push() {
    local dockerfile=$1
    local image_name=$2
    local context=$3
    
    echo "🔨 Building $image_name..."
    docker build --platform linux/arm64 -f $dockerfile -t $image_name:$TAG $context
    
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
helm upgrade --install campus-website ./helm -n $NAMESPACE

echo ""
echo "🎉 Deployment completed!"
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