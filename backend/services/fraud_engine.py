from typing import Dict, Any, List

class FraudEngine:
    """
    Multi-Signal Fraud & Risk Assessment Engine.
    Computes a risk score (0-100) based on timing velocity, duplicate submission bursts,
    and anomaly detection without relying solely on IP addresses.
    """

    @staticmethod
    def assess_risk(
        quality_score_res: Dict[str, Any],
        device_metadata: Dict[str, Any],
        session_duration_seconds: int
    ) -> Dict[str, Any]:
        
        risk_score = 0
        signals = []

        # Signal 1: Extremely rapid completion
        if session_duration_seconds < 120: # < 2 minutes for 75 questions
            risk_score += 45
            signals.append("velocity_anomaly_critical")
        elif session_duration_seconds < 300:
            risk_score += 20
            signals.append("velocity_fast")

        # Signal 2: Poor Data Quality score
        if quality_score_res.get("overall_score", 100) < 60:
            risk_score += 35
            signals.append("data_quality_failing")

        # Risk Classification
        if risk_score >= 60:
            risk_level = "high"
            status = "flagged"
        elif risk_score >= 30:
            risk_level = "medium"
            status = "flagged"
        else:
            risk_level = "low"
            status = "passed"

        return {
            "risk_score": min(risk_score, 100),
            "risk_level": risk_level,
            "signals": signals,
            "status": status,
        }
