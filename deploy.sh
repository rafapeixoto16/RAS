#!/bin/bash

set -e  # Parar o script se qualquer comando falhar

minikube start
minikube addons enable ingress
minikube addons enable metrics-server

eval $(minikube docker-env)

./scripts/build-docker.sh

helm install picturas ./picturas-chart

minikube kubectl -- get ingress
