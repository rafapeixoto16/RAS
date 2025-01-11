#!/bin/bash
set -e

# Update and install prerequisites
apt-get update
apt-get install -y curl apt-transport-https ca-certificates software-properties-common

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Enable and start Docker
systemctl enable docker
systemctl start docker

# Install kubeadm, kubelet, and kubectl
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | tee /etc/apt/sources.list.d/kubernetes.list
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl

# Enable CRI in containerd
sed -i 's/^disabled_plugins = \["cri"\]/#disabled_plugins = ["cri"]/' /etc/containerd/config.toml
systemctl restart containerd

# Disable swap
echo 'KUBELET_EXTRA_ARGS="--fail-swap-on=false"' | tee /etc/default/kubelet > /dev/null

# Initialize Kubernetes Cluster
kubeadm init --pod-network-cidr=192.168.0.0/16

# Setup kubectl for the user
mkdir -p $HOME/.kube
cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
chown $(id -u):$(id -g) $HOME/.kube/config

# Setup Networking (Flannel)
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml

# Install Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0-beta.0/deploy/static/provider/baremetal/deploy.yaml

echo "Cluster setup complete."
