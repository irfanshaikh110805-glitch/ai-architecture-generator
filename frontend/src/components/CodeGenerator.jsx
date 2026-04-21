import { useState } from 'react';
import { Code2, Terminal, Cloud, Globe, Copy, Check, Download } from 'lucide-react';
import toast from 'react-hot-toast';

function generateDockerCompose(result) {
  const stack = result.architecture?.tech_stack || {};
  const dbService = stack.database?.toLowerCase().includes('mongo') ? `
  mongo:
    image: mongo:7
    container_name: mongo_db
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGO_USER:-admin}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_PASS:-secret}
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db` : `
  postgres:
    image: postgres:16-alpine
    container_name: postgres_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${DB_USER:-admin}
      POSTGRES_PASSWORD: \${DB_PASS:-secret}
      POSTGRES_DB: \${DB_NAME:-appdb}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data`;

  const volumeName = stack.database?.toLowerCase().includes('mongo') ? 'mongo_data' : 'postgres_data';

  return `version: '3.9'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend_app
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000
${dbService}

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend_api
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=\${DATABASE_URL}
      - SECRET_KEY=\${SECRET_KEY:-changeme}
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
    depends_on:
      - ${stack.database?.toLowerCase().includes('mongo') ? 'mongo' : 'postgres'}

  redis:
    image: redis:7-alpine
    container_name: redis_cache
    restart: unless-stopped
    ports:
      - "6379:6379"

  nginx:
    image: nginx:alpine
    container_name: nginx_proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend

volumes:
  ${volumeName}:
`;
}

function generateTerraform() {
  return `# Terraform - AWS Infrastructure
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

variable "app_name" {
  default = "ai-arch-app"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "\${var.app_name}-vpc" }
}

# Subnets
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.\${count.index}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  tags = { Name = "\${var.app_name}-public-\${count.index}" }
}

data "aws_availability_zones" "available" {}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "\${var.app_name}-cluster"
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier        = "\${var.app_name}-db"
  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  db_name           = "appdb"
  username          = var.db_username
  password          = var.db_password
  skip_final_snapshot = true
  vpc_security_group_ids = [aws_security_group.rds.id]
}

# ElastiCache Redis
resource "aws_elasticache_subnet_group" "main" {
  name       = "\${var.app_name}-cache-subnet"
  subnet_ids = aws_subnet.public[*].id
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "\${var.app_name}-cache"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.main.name
}

# S3 Bucket for static assets
resource "aws_s3_bucket" "static" {
  bucket = "\${var.app_name}-static-assets"
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  enabled = true
  origin {
    domain_name = aws_s3_bucket.static.bucket_regional_domain_name
    origin_id   = "s3-static"
  }
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-static"
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
  }
  restrictions {
    geo_restriction { restriction_type = "none" }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

variable "db_username" { default = "admin" }
variable "db_password" { sensitive = true }

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.main.domain_name
}
`;
}

function generateAPIStubs(result) {
  const stack = result.architecture?.tech_stack || {};
  const isNode = stack.backend?.toLowerCase().includes('node') || stack.backend?.toLowerCase().includes('express');

  if (isNode) {
    const routes = result.apis?.slice(0, 6).map(api => {
      const method = api.method.toLowerCase();
      const path = api.endpoint;
      return `
// ${api.description}
router.${method}('${path}', authenticate, async (req, res) => {
  try {
    // TODO: Implement ${api.description}
    const data = await ${api.endpoint.split('/').filter(Boolean).join('_')}Service(req);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});`;
    }).join('\n');

    return `// Express.js API Stubs
const express = require('express');
const router = express.Router();

// Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // TODO: Verify JWT token
  next();
};

${routes}

module.exports = router;
`;
  } else {
    const routes = result.apis?.slice(0, 6).map(api => {
      const method = api.method.toLowerCase();
      const path = api.endpoint.replace(/{([^}]+)}/g, ':$1');
      const funcName = path.split('/').filter(Boolean).map((p, i) =>
        i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)
      ).join('');
      return `
# ${api.description}
@router.${method}("${api.endpoint}")
async def ${funcName.replace(/[:-]/g, '_') || 'handler'}(
    ${api.method === 'GET' ? '' : 'body: dict,\n    '}current_user: dict = Depends(get_current_user)
):
    """${api.description}"""
    try:
        # TODO: Implement logic
        return {"success": True, "data": {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
`;
    }).join('');

    return `# FastAPI Route Stubs
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

async def get_current_user(token: str = None):
    """Dependency: Extract current user from JWT"""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    # TODO: Decode JWT and return user
    return {"id": "user_id", "email": "user@example.com"}

${routes}
`;
  }
}

const CODE_OUTPUTS = [
  { id: 'docker', label: 'Docker Compose', icon: Cloud, color: 'blue', generate: generateDockerCompose },
  { id: 'terraform', label: 'Terraform (AWS)', icon: Globe, color: 'orange', generate: generateTerraform },
  { id: 'api', label: 'API Stubs', icon: Code2, color: 'green', generate: generateAPIStubs },
];

function CodeGenerator({ result }) {
  const [active, setActive] = useState('docker');
  const [copied, setCopied] = useState(false);

  const current = CODE_OUTPUTS.find(c => c.id === active);
  const code = current ? current.generate(result) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Code copied!');
    });
  };

  const handleDownload = () => {
    const filename = active === 'docker' ? 'docker-compose.yml' : active === 'terraform' ? 'main.tf' : 'routes.js';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded!`);
  };

  return (
    <div className="card-premium overflow-hidden transition-all duration-300 stagger">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          <Terminal size={22} className="text-white/80" /> Code Infrastructure
        </h2>
        <p className="text-blue-100 text-sm mt-2 font-medium">Production-ready boilerplate & deployment scripts</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {CODE_OUTPUTS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold tracking-tight uppercase transition-all duration-300 ${
                active === tab.id
                  ? 'border-b-4 border-brand-500 text-brand-600 bg-brand-50/50'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-surface-50'
              }`}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Code area */}
      <div className="relative">
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-xs transition"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Download size={14} /> Export
          </button>
        </div>

        <pre className="bg-gray-900 dark:bg-gray-950 text-green-300 text-xs overflow-x-auto overflow-y-auto p-6 max-h-96 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default CodeGenerator;
