module "gke" {
  source            = "terraform-google-modules/kubernetes-engine/google"
  project_id        = var.gcp_project_id
  name              = var.gke_cluster_name
  region            = var.gcp_region
  regional          = var.gke_regional
  zones             = var.gke_zones
  network           = var.gke_network
  subnetwork        = var.gke_subnetwork
  ip_range_pods     = ""
  ip_range_services = ""

  http_load_balancing        = false
  network_policy             = false
  horizontal_pod_autoscaling = true
  filestore_csi_driver       = false
  dns_cache                  = false

  node_pools = [
    {
      name         = "default-node-pool"
      machine_type = "e2-highcpu-8"

      min_count       = 1
      max_count       = 5
      local_ssd_count = 0
      disk_size_gb    = 100
      disk_type       = "pd-standard"

      image_type         = "COS_CONTAINERD"
      enable_gcfs        = false
      enable_gvnic       = false
      logging_variant    = "DEFAULT"
      auto_repair        = true
      auto_upgrade       = true
      service_account = "terraform-sa@geometric-rock-440710-k5.iam.gserviceaccount.com"
      preemptible        = true
      initial_node_count = 2
      accelerator_count  = 0
    },
  ]

  node_pools_oauth_scopes = {
    all = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  node_pools_labels = {
    all = {}

    default-node-pool = {
      default-node-pool = true
    }
  }

  node_pools_metadata = {
    all = {}

    default-node-pool = {
      node-pool-metadata-custom-value = "my-node-pool"
    }
  }

  node_pools_taints = {
    all = []

    default-node-pool = [
      {
        key    = "default-node-pool"
        value  = true
        effect = "PREFER_NO_SCHEDULE"
      },
    ]
  }

  node_pools_tags = {
    all = []

    default-node-pool = [
      "default-node-pool",
    ]
  }
}

resource "kubernetes_manifest" "ingress_nginx" {
  depends_on = [module.gke]
  for_each = toset(local.manifests)
  manifest = yamldecode(each.value)
}

resource "google_artifact_registry_repository" "picturas" {
  location      = "us-central1"
  repository_id = "picturas"
  description   = "registry for picturas images"
  format        = "DOCKER"
}
