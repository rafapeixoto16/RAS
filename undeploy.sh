#!/bin/bash

set -e  # Parar o script se qualquer comando falhar

helm uninstall picturas

minikube stop