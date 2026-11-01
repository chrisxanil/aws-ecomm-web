# Kubernetes Orchestration Guide (AWS EKS)

This directory contains production-grade Kubernetes manifests for deploying **NexaCart AI** onto an Amazon Elastic Kubernetes Service (EKS) cluster or local Minikube / Kind.

---

## 1. Directory Structure

- `namespace.yaml`: Creates isolated `nexacart` namespace.
- `configmap.yaml`: Non-sensitive configuration (DB host, ports, region).
- `secrets.yaml`: Base64-encoded secrets (database credentials, JWT secret).
- `mysql-pv-pvc.yaml`: Persistent volume claim backed by Amazon EBS `gp3`.
- `mysql-deployment.yaml`: MySQL 8.0 stateful pod and cluster service.
- `backend-deployment.yaml`: Node.js Express API with health probes (2 replicas).
- `frontend-deployment.yaml`: Vite/React Nginx reverse proxy pods (2 replicas).
- `ingress.yaml`: AWS Application Load Balancer (ALB) ingress controller configuration.
- `hpa.yaml`: Horizontal Pod Autoscaler (scales from 2 to 10 pods under traffic).

---

## 2. Deploying to Amazon EKS

### Step 1: Create the EKS Cluster
Using `eksctl`:

```bash
eksctl create cluster \
  --name nexacart-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 6 \
  --managed
```

### Step 2: Apply Manifests
Deploy the entire stack in sequence:

```bash
# 1. Namespace & Config
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml

# 2. Database Layer
kubectl apply -f mysql-pv-pvc.yaml
kubectl apply -f mysql-deployment.yaml

# 3. Application Services
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# 4. Autoscaling & Ingress
kubectl apply -f hpa.yaml
kubectl apply -f ingress.yaml
```

### Step 3: Verify Pods & Endpoints
```bash
kubectl get pods -n nexacart
kubectl get svc -n nexacart
kubectl get ingress -n nexacart
```

