# Project Clarity: Autonomous Orchestrator of Truth

Clarity is an advanced enterprise intelligence system designed to mitigate decision-making risk by providing continuous, verifiable, and objective sentiment analysis.

We replace slow, subjective human analysis with an autonomous pipeline of specialized AI agents, ensuring every data point is accompanied by an auditable trail of reasoning.

---

# Key Features & Business Value

Clarity is positioned as a critical infrastructure layer focused on high-stakes, risk-adjusted decision making.

## Autonomous, Verifiable Intelligence

Replaces subjective human analysis with an Explainable AI (XAI) pipeline, reducing compliance risk and accelerating market response time.

## Dual Revenue Model

High-growth, recurring revenue through a tiered SaaS model, coupled with a secondary, high-margin stream from licensing our validated "Verifiable Truth" data for third-party model training.

## Enterprise Scalability

Optimized for high-volume data consumption in regulated industries (Finance, Healthcare, Defense), allowing us to command premium pricing for long-term contracts.

## Structured Output

Guarantees structured JSON output for zero-latency integration with all major Business Intelligence (BI) and operational systems.

---

# Technology Stack Overview

Our architecture is engineered for enterprise-grade performance, scalability, and reliability, leveraging modern MLOps and cloud-native principles.

### Front-End / UI

**Technology:** NextJS  
**Rationale:** Delivers a highly responsive, performant, and SEO-friendly web and application interface.

### Agent Orchestration

**Technology:** LangGraph  
**Rationale:** Manages complex, multi-step agentic workflows and reasoning processes to ensure verifiable, non-hallucinated outcomes.

### Machine Learning Core

**Technology:** RoBERTa (Fine-Tuned)  
**Rationale:** Superior performance and nuanced understanding in core sentiment classification tasks.

### Backend API

**Technology:** FastAPI  
**Rationale:** High-throughput, asynchronous, and scalable backbone for serving ML models and API endpoints.

### Data Acquisition (Proprietary)

**Technology:** Golang Scraping Solution  
**Rationale:** Custom-built for efficiency and stability to build a clean data inventory from high-signal public forums (X, Quora, Reddit), overcoming limitations on premium data access.

---

# Getting Started

Follow these steps to run Clarity locally.

## 1. Clone the Repository

```bash
git clone https://github.com/Arinji2/mum-hacks
cd clarity
```

---

## 2. Setup Environment

Install dependencies for each component.

### Front-end (NextJS)

```bash
cd frontend
npm install
```

### Back-end (FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

---

## 3. Run Services

You can run services individually or via Docker Compose.

### Start the Golang Scraping Agent (optional)

```bash
go run scraper/main.go
```

### Start the FastAPI Backend

```bash
cd backend
uvicorn app.main:app --reload
```

### Start the NextJS Frontend

```bash
cd frontend
npm run dev
```

---
