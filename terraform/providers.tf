terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.13.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.35.0"
    }
    http = {
      source  = "hashicorp/http"
      version = "3.4.5"
    }
  }
}

provider "http" {}

provider "google" {
  credentials = file(var.gcp_credentials)
  project = var.gcp_project_id
  region  = var.gcp_region
}

data "google_client_config" "default" {}

data "http" "ingress_nginx_yaml" {
  url = "https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.0/deploy/static/provider/cloud/deploy.yaml"
}

locals {
  manifests = split("---", data.http.ingress_nginx_yaml.response_body)
}

provider "kubernetes" {
  host  = "https://${module.gke.endpoint}"
  token = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(module.gke.ca_certificate)
}
