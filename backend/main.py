from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from services.quality_engine import DataQualityEngine
from services.fraud_engine import FraudEngine
from services.analytics_engine import AnalyticsEngine
from services.certificate_service import CertificateService
from services.insight_engine import InsightEngine

app = FastAPI(
    title="Gen Z Voices — Research Intelligence API",
    description="Backend API platform powering Data Quality Engine, Fraud Detection, Certificate Generation, and AI Insights.",
    version="1.0.0"
)

# Enable CORS for frontend Vite app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request / Response Schemas
class QualityAnalysisRequest(BaseModel):
    session_id: str
    completion_seconds: int
    total_questions: int = 207
    responses: List[Dict[str, Any]]
    attention_check_passed: bool = True

class FraudAnalysisRequest(BaseModel):
    session_id: str
    completion_seconds: int
    quality_score: Dict[str, Any]
    device_metadata: Optional[Dict[str, Any]] = {}

class CertificateRequest(BaseModel):
    participant_name: str
    session_id: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "platform": "Gen Z Voices Research Intelligence Engine",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/quality/analyze")
def analyze_quality(req: QualityAnalysisRequest):
    try:
        result = DataQualityEngine.calculate_quality_score(
            completion_seconds=req.completion_seconds,
            total_questions=req.total_questions,
            responses=req.responses,
            attention_check_passed=req.attention_check_passed
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/fraud/analyze")
def analyze_fraud(req: FraudAnalysisRequest):
    try:
        result = FraudEngine.assess_risk(
            quality_score_res=req.quality_score,
            device_metadata=req.device_metadata or {},
            session_duration_seconds=req.completion_seconds
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/certificate/generate")
def generate_certificate(req: CertificateRequest):
    try:
        record = CertificateService.create_certificate_record(
            participant_name=req.participant_name,
            session_id=req.session_id
        )
        return {"status": "success", "data": record}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/overview")
def get_analytics_overview():
    sample_stats = {"total_responses": 10920}
    insight = InsightEngine.generate_research_insight("Career & Employment", sample_stats)
    return {
        "status": "success",
        "total_participants": 12480,
        "completed_surveys": 10920,
        "completion_rate_percentage": 87.5,
        "average_quality_score": 94,
        "latest_ai_insight": insight,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
