variable "gcp_credentials" {
  type        = string
  description = "Location of the service account json key for GCP"
}

variable "gcp_project_id" {
  type        = string
  description = "GCP Project Id"
}

variable "gcp_region" {
  type        = string
  description = "GCP Region"
}

variable "gke_cluster_name" {
  type        = string
  description = "The name of the GKE cluster"
}

variable "gke_regional" {
  type        = bool
  description = ""
}

variable "gke_zones" {
  type = list(string)
  description = "List of zones in GKE Cluster"
}

variable "gke_network" {
  type        = string
  description = "VPC Network Name"
}

variable "gke_subnetwork" {
  type        = string
  description = "VPC Sub Network Name"
}
