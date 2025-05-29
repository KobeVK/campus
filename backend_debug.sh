#!/bin/bash

# Backend Health Check and Fix Script
set +e  # Don't exit on errors

NAMESPACE="campus"
REGISTRY="campus1.jfrtpt.org/docker"

echo "🔧 Backend Health Check & Fix"
echo "============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}➤ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Get backend pod and service names
BACKEND_POD=$(kubectl get pods -n $NAMESPACE -l app.kubernetes.io/component=backend -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
BACKEND_SERVICE=$(kubectl get services -n $NAMESPACE -o name | grep backend | sed 's/service\///')

if [ -z "$BACKEND_POD" ]; then
    print_error "No backend pod found!"
    kubectl get pods -n $NAMESPACE
    exit 1
fi

if [ -z "$BACKEND_SERVICE" ]; then
    print_error "No backend service found!"
    kubectl get services -n $NAMESPACE
    exit 1
fi

echo "Backend Pod: $BACKEND_POD"
echo "Backend Service: $BACKEND_SERVICE"
echo ""

# 1. Check backend logs for errors
print_step "Analyzing backend logs..."
echo "Recent backend logs:"
kubectl logs $BACKEND_POD -n $NAMESPACE --tail=30
echo ""

# Look for specific errors
print_step "Checking for common issues..."
LOGS=$(kubectl logs $BACKEND_POD -n $NAMESPACE)

if echo "$LOGS" | grep -i "econnrefused\|connection refused\|connect ECONNREFUSED"; then
    print_error "Database connection refused - Database might be down or unreachable"
fi

if echo "$LOGS" | grep -i "listen EADDRINUSE\|port.*already in use"; then
    print_error "Port already in use - Backend might be trying to start multiple times"
fi

if echo "$LOGS" | grep -i "authentication failed\|password.*incorrect"; then
    print_error "Database authentication failed - Check DB credentials"
fi

if echo "$LOGS" | grep -i "getaddrinfo ENOTFOUND\|host.*not found"; then
    print_error "Database host not found - Check DB_HOST environment variable"
fi

if echo "$LOGS" | grep -i "timeout\|timed out"; then
    print_error "Database connection timeout - Check network connectivity"
fi

echo ""

# 2. Check environment variables
print_step "Checking backend environment variables..."
echo "Database configuration:"
kubectl exec $BACKEND_POD -n $NAMESPACE -- printenv | grep -E "^DB_|^NODE_ENV|^PORT" 2>/dev/null || print_warning "Cannot access environment variables"
echo ""

# 3. Test database connectivity
print_step "Testing database connectivity..."
DB_HOST=$(kubectl exec $BACKEND_POD -n $NAMESPACE -- printenv DB_HOST 2>/dev/null || echo "unknown")
DB_PORT=$(kubectl exec $BACKEND_POD -n $NAMESPACE -- printenv DB_PORT 2>/dev/null || echo "5432")

echo "Testing connection to $DB_HOST:$DB_PORT..."

# Try different methods to test connectivity
if kubectl exec $BACKEND_POD -n $NAMESPACE -- sh -c "timeout 5 nc -z $DB_HOST $DB_PORT" >/dev/null 2>&1; then
    print_success "Database host:port is reachable"
elif kubectl exec $BACKEND_POD -n $NAMESPACE -- sh -c "timeout 5 wget -q --spider telnet://$DB_HOST:$DB_PORT" >/dev/null 2>&1; then
    print_success "Database host:port is reachable (via wget)"
else
    print_error "Database host:port is NOT reachable"
    echo "This is likely the main issue!"
fi
echo ""

# 4. Test backend health endpoint
print_step "Testing backend health endpoint..."
kubectl port-forward svc/$BACKEND_SERVICE 8081:3001 -n $NAMESPACE &
BACKEND_PID=$!
sleep 5

HEALTH_RESPONSE=$(curl -s http://localhost:8081/health 2>/dev/null || echo "FAILED")
if echo "$HEALTH_RESPONSE" | grep -q "OK"; then
    print_success "Backend health endpoint is working!"
    echo "Response: $HEALTH_RESPONSE"
else
    print_error "Backend health endpoint failed!"
    echo "Response: $HEALTH_RESPONSE"
    
    # Check if any response at all
    if curl -s http://localhost:8081 >/dev/null 2>&1; then
        print_warning "Backend is responding but not to /health endpoint"
    else
        print_error "Backend is not responding at all"
    fi
fi

kill $BACKEND_PID >/dev/null 2>&1
echo ""

# 5. Check backend deployment status
print_step "Checking backend deployment status..."
BACKEND_DEPLOYMENT=$(kubectl get deployment -n $NAMESPACE -o name | grep backend)
if [ ! -z "$BACKEND_DEPLOYMENT" ]; then
    kubectl get $BACKEND_DEPLOYMENT -n $NAMESPACE
    echo ""
    echo "Deployment details:"
    kubectl describe $BACKEND_DEPLOYMENT -n $NAMESPACE | grep -A 10 -B 5 "Conditions\|Events"
else
    print_error "Backend deployment not found!"
fi
echo ""

# 6. Provide fix suggestions
print_step "Suggested fixes based on analysis..."
echo ""

# Database connectivity fixes
if ! kubectl exec $BACKEND_POD -n $NAMESPACE -- sh -c "timeout 5 nc -z $DB_HOST $DB_PORT" >/dev/null 2>&1; then
    print_warning "DATABASE CONNECTIVITY ISSUE DETECTED!"
    echo ""
    echo "Possible solutions:"
    echo "1. Check if the RDS database is running:"
    echo "   aws rds describe-db-instances --db-instance-identifier campus-db"
    echo ""
    echo "2. Check security groups allow connections from EKS cluster"
    echo "3. Verify the DB_HOST is correct: $DB_HOST"
    echo "4. Check if the database accepts connections on port $DB_PORT"
    echo ""
    echo "5. Test database connection manually:"
    echo "   kubectl run -it --rm debug --image=postgres:13 --restart=Never -n $NAMESPACE -- psql -h $DB_HOST -U campus_admin -d campus"
    echo ""
fi

# Backend restart
print_warning "Try restarting the backend deployment:"
echo "kubectl rollout restart $BACKEND_DEPLOYMENT -n $NAMESPACE"
echo ""

# Check if backend needs rebuild
print_warning "If backend code was changed, rebuild the image:"
echo "docker build -f Dockerfile.backend -t campus-backend:latest-arm64 ."
echo "docker tag campus-backend:latest-arm64 $REGISTRY/campus-backend:latest-arm64"
echo "docker push $REGISTRY/campus-backend:latest-arm64"
echo "kubectl rollout restart $BACKEND_DEPLOYMENT -n $NAMESPACE"
echo ""

# 7. Quick test command
print_step "Quick test commands..."
echo "To test backend manually:"
echo "kubectl port-forward svc/$BACKEND_SERVICE 8081:3001 -n $NAMESPACE"
echo "curl http://localhost:8081/health"
echo ""
echo "To check logs continuously:"
echo "kubectl logs -f $BACKEND_POD -n $NAMESPACE"
echo ""

print_step "Health check complete!"
echo "Address the issues identified above to fix the backend."