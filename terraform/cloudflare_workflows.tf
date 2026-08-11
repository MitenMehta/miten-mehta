# Workflows Terraform (provider v5.11.0+)
resource "cloudflare_workflow" "orchestrai_workflow" {
  account_id    = var.cf_account_id
  workflow_name = "orchestrai-durable-workflow"
  class_name    = "OrchestrAIWorkflow"
  script_name   = "orchestrai-workflow-worker"
}
