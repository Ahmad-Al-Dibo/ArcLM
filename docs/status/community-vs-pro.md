# Community Versus Pro Recommendation

This split is a recommendation based on current repository reality. It is not a final licensing or packaging decision.

| Feature | Current Status | Recommended Product | Reason |
| ------- | -------------- | ------------------- | ------ |
| Native ArcLM model building | Implemented | Community | Core educational/model-building value |
| Tokenizers | Implemented/Partial | Community | Basic local NLP workflow |
| Dataset loading | Implemented | Community | Essential core utility |
| Dataset cleaning | Implemented | Community | Essential data quality workflow |
| Exact deduplication | Implemented | Community | Small, local and broadly useful |
| Streaming datasets | Implemented | Community | Useful for local scale without enterprise complexity |
| Data pipelines and custom steps | Implemented | Community | Extension point for developers |
| Single-device training | Implemented | Community | Core training workflow |
| Training checkpoints and resume | Implemented | Community | Required for reliable local training |
| Mixed precision | Partially Implemented | Shared Core | Useful for Community, but CUDA-heavy validation may live in Pro CI |
| Full fine-tuning | Implemented | Community | Core fine-tuning workflow |
| Basic SFT | Implemented | Community | Core LLM library feature |
| Model and tokenizer adapters | Implemented for SFT | Community | Keeps ArcLM model-agnostic |
| Basic evaluation | Implemented | Community | Required to validate training |
| Basic inference | Implemented | Community | Expected local model use |
| Simple CLI | Partially Implemented | Community | Should be a simple entry point once fixed/tested |
| Compatibility shims | Implemented | Community | Protects existing users |
| Plugin protocol | Interface Only | Community | Lightweight extension point |
| YAML/JSON config support | Implemented | Community | Basic developer experience |
| Type marker `py.typed` | Implemented | Community | Library quality signal |
| Legacy Hugging Face SFT helper | Experimental | Shared Core | Useful bridge, but optional dependency and needs stabilization |
| Hugging Face model loading | Partially Implemented | Shared Core | Common user expectation; keep optional |
| LoRA | Experimental | Pro | Requires PEFT automation, compatibility matrix and GPU-oriented workflows |
| QLoRA | Not Implemented | Pro | Quantized adapter training is advanced and hardware-sensitive |
| Other PEFT methods | Not Implemented | Pro | Advanced fine-tuning automation |
| DDP/FSDP/Multi-GPU | Not Implemented | Pro | Operational complexity and hardware orchestration |
| DeepSpeed-style training | Not Implemented | Pro | Advanced distributed stack |
| Hyperparameter search | Not Implemented | Pro | Experiment management and resource scheduling |
| Curriculum learning | Not Implemented | Pro | Advanced training workflow |
| DPO/RLHF/GRPO | Not Implemented | Pro | Advanced alignment stack |
| Reward model training | Not Implemented | Pro | Alignment-specific workflow |
| Experiment tracking integrations | Experimental | Pro | External-service integrations and team workflows |
| Visual dashboards | Not Implemented | Pro | Product/UI feature beyond library core |
| Production model serving | Not Implemented | Pro | Operational reliability, scaling and monitoring |
| Dynamic/continuous batching | Not Implemented | Pro | Production inference optimization |
| KV-cache optimization | Not Implemented | Pro | Advanced inference performance feature |
| Quantization automation | Experimental/Not Implemented | Pro | Hardware/backend-specific optimization |
| ONNX/TensorRT/GGUF export | Not Implemented | Pro | Deployment/export tooling requiring artifact validation |
| Cloud deployment | Not Implemented | Pro | Operational automation |
| Docker/Kubernetes/Helm | Not Implemented | Pro | Deployment infrastructure |
| Large benchmark suites | Not Implemented | Pro | Dataset management, downloads and reporting |
| LLM-as-a-judge | Not Implemented | Pro | Provider integration and cost/control concerns |
| Accuracy/model comparison dashboards | Not Implemented | Pro | Productized evaluation UI |
| Enterprise authentication/RBAC | Not Implemented | Pro | Team/security feature |
| Billing/license management | Not Implemented | Pro | Commercial platform feature |
| Audit logs and org management | Not Implemented | Pro | Enterprise governance |
| Secret management | Not Implemented | Pro | Security/ops concern |
| Local preprocess pipeline | Partially Implemented | Community | Useful local data cleaning, but old pipeline should be aligned |
| Simple Flask web UI | Experimental | Pro | Useful demo now; stable serving/UI should be Pro |
| External checkpoint loaders | Partially Implemented | Shared Core | Useful bridge between Community and Pro model-source workflows |

## Product Notes

- Community should stay strong for local, inspectable, CPU-friendly workflows.
- Pro should focus on operational complexity: distributed training, serving, optimization, cloud, dashboards, team management and enterprise governance.
- Shared Core should contain optional bridges that are common but dependency-heavy, such as Hugging Face loading.
