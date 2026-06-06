import os
import json
import logging
import asyncio
from google import genai
from google.genai import types
from dotenv import load_dotenv, find_dotenv
from schemas import ArchitectureResponse
from exceptions import QuotaExceededError, AIServiceError

# Force reload .env so the updated API key is always picked up on restart
load_dotenv(find_dotenv(), override=True)
logger = logging.getLogger(__name__)

# Lazy client — created on first real API call
_client: genai.Client | None = None


def get_client() -> genai.Client:
    """Return (and lazily create) the Gemini client using the current env key."""
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY is not configured in .env")
        _client = genai.Client(api_key=api_key)
        logger.info("Gemini client initialized successfully.")
    return _client


MODEL_ID = "gemini-2.5-flash"

SYSTEM_PROMPT = """You are a Principal Software Architect with expertise across multiple domains.

CRITICAL: Do NOT generate generic architectures. Each output must be UNIQUE and strictly tailored to the project idea.

ANALYSIS PHASE (Think through these BEFORE designing):
1. DOMAIN IDENTIFICATION
   - What domain is this? (e.g., edtech, healthtech, fintech, e-commerce, real-time systems, AI/ML, IoT, social media, etc.)
   - What are the domain-specific challenges?

2. SPECIAL REQUIREMENTS
   - Real-time needs? (WebSockets, event streaming, pub/sub)
   - AI/ML components? (model training, inference pipelines, vector databases)
   - Offline support? (PWA, local storage, sync mechanisms)
   - High concurrency? (load balancing, caching strategies, queue systems)
   - Media processing? (video/image pipelines, CDN, transcoding)
   - Geospatial features? (location services, mapping, proximity search)
   - Payment processing? (PCI compliance, payment gateways, fraud detection)
   - Compliance requirements? (HIPAA, GDPR, SOC2)

3. USER SCALE ESTIMATION
   - Small (< 1K users): Simple monolith, single database
   - Medium (1K-100K users): Modular monolith or microservices, caching, CDN
   - Large (> 100K users): Microservices, distributed systems, multiple data stores

ARCHITECTURE DESIGN RULES:
1. DOMAIN-SPECIFIC ARCHITECTURE
   - Choose architecture type based on actual needs, not defaults
   - Explain WHY this architecture fits THIS specific project
   - Examples:
     * Real-time chat -> Event-driven with WebSocket servers
     * AI recommendation -> Microservices with ML pipeline
     * Simple CRUD -> Monolith (don't over-engineer)
     * Multi-tenant SaaS -> Microservices with tenant isolation

2. UNIQUE SYSTEM COMPONENTS
   - Only include components that are NECESSARY for this project
   - Domain-specific examples:
     * EdTech: Video streaming service, progress tracking, quiz engine, LMS integration
     * HealthTech: FHIR API gateway, HL7 message broker, DICOM image storage, telemedicine service
     * FinTech: Payment processor, fraud detection engine, ledger service, KYC verification
     * E-commerce: Inventory service, order orchestrator, recommendation engine, cart service
     * Real-time: WebSocket server, message queue, presence service, notification dispatcher
     * AI/ML: Model training pipeline, inference API, feature store, vector database

3. SMART TECH STACK SELECTION
   - Choose technologies based on requirements, NOT popularity
   - Justify each choice:
     * Real-time -> Node.js/Go (event loop) or Elixir (actor model)
     * CPU-intensive -> Go/Rust (performance) or Python (ML libraries)
     * Rapid prototyping -> Python/Ruby/Node.js
     * High throughput -> Go/Rust/Java
     * ML/AI -> Python (ecosystem), with Go/Rust for serving
   - Database selection:
     * Relational (PostgreSQL/MySQL) -> Complex queries, transactions, relationships
     * Document (MongoDB) -> Flexible schema, nested data
     * Time-series (TimescaleDB/InfluxDB) -> Metrics, IoT data
     * Graph (Neo4j) -> Social networks, recommendations
     * Vector (Pinecone/Weaviate) -> AI embeddings, semantic search
     * Cache (Redis/Memcached) -> Session storage, rate limiting

4. DIFFERENTIATION FROM GENERIC CRUD
   - Explicitly identify what makes THIS system unique
   - Avoid generic "user management + CRUD" unless that's truly the core
   - Focus on the domain-specific value proposition

5. PROJECT-SPECIFIC SCALABILITY
   - Identify REAL bottlenecks for THIS system:
     * Video platform -> CDN, transcoding pipeline, storage costs
     * Social network -> Feed generation, graph queries, real-time updates
     * E-commerce -> Inventory consistency, payment processing, search performance
     * AI app -> Model inference latency, GPU costs, training pipeline
   - Don't mention generic "use caching" without context

6. ADVANCED FEATURES (2-3 suggestions)
   - Suggest features that elevate this system:
     * AI-powered recommendations
     * Real-time collaboration
     * Advanced analytics/insights
     * Predictive features
     * Automation capabilities
     * Integration ecosystem

OUTPUT FORMAT (return ONLY valid JSON, no markdown, no code fences):
{
  "features": [{ "name": "Domain-specific feature name", "priority": "Must|Should|Could|Won't" }],
  "database": [{ "table": "table_name", "fields": ["field1", "field2"], "relationships": ["FK -> other_table"] }],
  "apis": [{ "method": "GET|POST|PUT|DELETE|PATCH", "endpoint": "/api/path", "description": "What it does" }],
  "architecture": {
    "type": "Monolith|Microservices|Serverless|Event-Driven|Hybrid",
    "components": ["Component 1 (with purpose)", "Component 2 (with purpose)"],
    "tech_stack": {
      "frontend": "Technology + justification",
      "backend": "Technology + justification",
      "database": "Technology + justification"
    }
  },
  "erDiagram": "Valid Mermaid erDiagram syntax - see example below",
  "architectureDiagram": "Valid Mermaid graph TD syntax - see example below",
  "roadmap": [{ "phase": "Phase name with timeline", "tasks": ["Specific task 1", "Specific task 2"] }],
  "estimation": {
    "hours": "Range based on complexity",
    "team_size": "Number and roles",
    "cost": "USD range with breakdown"
  }
}

MERMAID DIAGRAM EXAMPLES:

erDiagram Example (CORRECT):
erDiagram
  USERS ||--o{ ORDERS : places
  USERS ||--o{ REVIEWS : writes
  ORDERS ||--|{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : includes
  PRODUCTS ||--o{ REVIEWS : receives
  
  USERS {
    string user_id
    string email
    string name
  }
  ORDERS {
    string order_id
    string user_id
    date order_date
  }

architectureDiagram Example (CORRECT):
graph TD
  A[Web App] --> B[API Gateway]
  B --> C[Auth Service]
  B --> D[User Service]
  B --> E[Order Service]
  C --> F[User DB]
  D --> F
  E --> G[Order DB]
  E --> H[Message Queue]
  H --> I[Email Service]
  
  style A fill:#f9f,stroke:#333
  style B fill:#bbf,stroke:#333
  style C fill:#bfb,stroke:#333

STRICT REQUIREMENTS:
- Output must be directly parsable with json.loads()
- NO markdown, NO backtick code fences, NO explanatory text outside JSON
- NO control characters (tabs, newlines within string values, etc.) - use spaces instead
- NO trailing commas in arrays or objects
- Ensure all strings are properly escaped
- Include 10-15 domain-specific features (not generic CRUD)
- Include 8-15 API endpoints that match the domain
- Include 4-10 database tables with proper normalization
- Architecture components must be specific to the project domain
- Tech stack must include justification in the string
- erDiagram must use valid Mermaid syntax (NO PK/FK/UK annotations - just field names)
- erDiagram MUST NOT include attribute keys like PK, FK, UK in field definitions
- architectureDiagram must show actual system components and data flow
- architectureDiagram node labels MUST NOT contain parentheses - use underscores instead
- Estimation must be realistic for the described complexity
- If two different project ideas are given, architectures MUST be different
- erDiagram relationship labels MUST NOT use single quotes — use plain unquoted words only (e.g., 'has' not \'has author\')
- erDiagram MUST use this exact format: ENTITY1 ||--o{ ENTITY2 : has
- erDiagram example: PATIENTS ||--o{ APPOINTMENTS : schedules (NOT: patient_id PK)"""


def _strip_markdown_fences(content: str) -> str:
    """Strip accidental markdown code fences from AI response."""
    content = content.strip()
    if content.startswith("```"):
        first_newline = content.find("\n")
        if first_newline != -1:
            content = content[first_newline + 1:]
        if content.endswith("```"):
            content = content[:-3]
    return content.strip()


def _sanitize_json_string(content: str) -> str:
    """
    Sanitize JSON string by removing invalid control characters.
    Control characters (0x00-0x1F except tab, newline, carriage return) are invalid in JSON strings.
    """
    import re
    
    # Remove control characters except \t (0x09), \n (0x0A), \r (0x0D)
    # This fixes "Invalid control character" errors
    sanitized = re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F]', '', content)
    
    # Fix common JSON issues:
    # 1. Remove any trailing commas before closing braces/brackets
    sanitized = re.sub(r',(\s*[}\]])', r'\1', sanitized)
    
    # 2. Ensure proper string escaping for quotes within strings
    # This is complex and may need more sophisticated handling
    
    # 3. Remove any BOM (Byte Order Mark) characters
    sanitized = sanitized.replace('\ufeff', '')
    
    return sanitized


import re

def _sanitize_mermaid(diagram: str) -> str:
    """
    Fix common Mermaid 10.x rendering failures:
      1. Quoted relationship labels
      2. Slashes in labels
      3. Multi-word unquoted labels
      4. Invalid cardinality tokens
      5. Attribute keys (PK, FK, UK)
      6. Parentheses in node labels
      7. Invalid node ID formats
      8. Subgraph syntax issues
    """
    if not diagram:
        return diagram

    # ── 1 & 2: strip quotes, fix slashes, collapse spaces in labels ──────────
    def _clean_label(m: re.Match) -> str:
        label = m.group(1)
        label = label.replace("/", "_").replace("\\", "_")
        label = re.sub(r"\s+", "_", label.strip())
        return ": " + label

    # single-quoted
    diagram = re.sub(r":\s*'([^']*)'\s*$", _clean_label, diagram, flags=re.MULTILINE)
    # double-quoted
    diagram = re.sub(r':\s*"([^"]*)"\s*$', _clean_label, diagram, flags=re.MULTILINE)

    # ── 3: fix unquoted multi-word / slash labels ──
    def _fix_unquoted_label(m: re.Match) -> str:
        label = m.group(1)
        label = label.replace("/", "_").replace("\\", "_")
        label = re.sub(r"\s+", "_", label.strip())
        return ": " + label

    diagram = re.sub(
        r":\s+([A-Za-z_][A-Za-z0-9_]*(?:[/ ][A-Za-z][A-Za-z0-9_]*)+)\s*$",
        _fix_unquoted_label,
        diagram,
        flags=re.MULTILINE,
    )

    # ── 4: fix invalid Mermaid 10 cardinality tokens ─────────────────────────
    diagram = re.sub(r"\|\|--\|\|\{", "||--|{", diagram)
    diagram = re.sub(r"\}\|--\|\|\{", "}|--|{", diagram)
    diagram = re.sub(r"\|\|--o\|\{",  "||--o{", diagram)
    diagram = re.sub(r"\}\|--o\|\{",  "}|--o{", diagram)

    # ── 5: Remove attribute keys (PK, FK, UK) from erDiagram ─────────────────
    diagram = re.sub(r'\s+(PK|FK|UK|NN|AI|UNIQUE|NOT NULL|AUTO_INCREMENT)\s*', ' ', diagram, flags=re.IGNORECASE)
    
    # ── 6: Fix parentheses in node labels (graph diagrams) ───────────────────
    def _fix_node_label(m: re.Match) -> str:
        node_id = m.group(1)
        label = m.group(2)
        # Remove parentheses and their content
        label = re.sub(r'\([^)]*\)', '', label)
        label = label.strip()
        if not label:  # If label becomes empty, use node_id
            label = node_id
        return f'{node_id}[{label}]'
    
    # Fix node labels with parentheses: A[Label (Text)] → A[Label Text]
    diagram = re.sub(r'([A-Z][A-Z0-9]*)\[([^\]]*\([^\)]*\)[^\]]*)\]', _fix_node_label, diagram)
    
    # ── 7: Fix invalid node IDs (must start with letter) ─────────────────────
    # Replace node IDs that start with numbers or special chars
    def _fix_node_id(m: re.Match) -> str:
        prefix = m.group(1) if m.group(1) else ''
        node_id = m.group(2)
        # If node_id starts with number, prefix with 'N'
        if node_id and node_id[0].isdigit():
            node_id = 'N' + node_id
        return prefix + node_id
    
    # Fix node definitions: 1[Label] → N1[Label]
    diagram = re.sub(r'(\s+|^)(\d+)(\[)', _fix_node_id, diagram, flags=re.MULTILINE)
    
    # ── 8: Fix subgraph syntax ───────────────────────────────────────────────
    # Ensure subgraph has proper format: subgraph Title
    diagram = re.sub(r'subgraph\s+([^\n]+)\s*\n', r'subgraph \1\n', diagram)

    return diagram.strip()


async def generate_architecture(idea: str) -> ArchitectureResponse:
    """
    Generate architecture using Gemini API.
    Raises typed exceptions on failure. No mock fallbacks.
    """
    max_retries = 3  # Increased from 2 to 3 for better reliability
    base_delay = 2  # seconds

    for attempt in range(max_retries + 1):
        try:
            logger.info(f"Attempt {attempt + 1}: calling Gemini API (model={MODEL_ID})")

            client = get_client()
            prompt = f"{SYSTEM_PROMPT}\n\nProject Idea: {idea}"

            # The google-genai SDK's generate_content is synchronous.
            # Run it in a thread executor to avoid blocking the async event loop.
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: client.models.generate_content(
                    model=MODEL_ID,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.4,
                        max_output_tokens=8192,
                    ),
                )
            )

            content = _strip_markdown_fences(response.text)
            # Sanitize JSON to remove invalid control characters
            content = _sanitize_json_string(content)
            logger.info(f"Gemini response received successfully: {content[:100]}...")

            try:
                data = json.loads(content)
            except json.JSONDecodeError as json_err:
                logger.error(f"JSON parse error on attempt {attempt + 1}: {json_err}")
                logger.error(f"Problematic content around error: {content[max(0, json_err.pos - 100):json_err.pos + 100]}")
                
                # Try to fix common JSON issues
                if attempt < max_retries:
                    # On JSON errors, retry with a fresh request
                    logger.info(f"Retrying due to JSON parse error...")
                    await asyncio.sleep(base_delay)
                    continue
                else:
                    raise AIServiceError(
                        "Failed to parse AI response after multiple attempts. "
                        "The AI service may be experiencing issues. Please try again later."
                    )
            
            # Sanitize Mermaid diagrams to fix render issues in Mermaid 10.x
            if "erDiagram" in data:
                data["erDiagram"] = _sanitize_mermaid(data["erDiagram"])
            if "architectureDiagram" in data:
                data["architectureDiagram"] = _sanitize_mermaid(data["architectureDiagram"])
            return ArchitectureResponse(**data)

        except json.JSONDecodeError as e:
            # This should not be reached due to inner try-catch, but kept for safety
            logger.error(f"JSON parse error on attempt {attempt + 1}: {e}")
            if attempt == max_retries:
                raise AIServiceError(
                    "Failed to parse AI response after multiple attempts. "
                    "The AI service may be experiencing issues. Please try again later."
                )

        except Exception as e:
            error_msg = str(e).lower()

            # Detect quota / rate-limit errors (429 RESOURCE_EXHAUSTED)
            if "429" in error_msg or "resource_exhausted" in error_msg or "quota" in error_msg:
                logger.error(f"API quota exceeded on attempt {attempt + 1}: {e}")
                raise QuotaExceededError(
                    "API quota exceeded. Please try again in a few minutes or upgrade your API plan."
                )

            logger.error(f"Error on attempt {attempt + 1}: {e}")

            # Exponential backoff for other transient errors
            if attempt < max_retries:
                delay = base_delay * (2 ** attempt)
                logger.info(f"Retrying in {delay} seconds...")
                await asyncio.sleep(delay)
            else:
                raise AIServiceError(
                    f"Failed to generate architecture after {max_retries + 1} attempts. "
                    f"Error: {str(e)}"
                )

    # Safety fallback — should never reach here
    raise AIServiceError("Unexpected error in architecture generation")
