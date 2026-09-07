from typing import Dict, Any, List
import numpy as np

class DataQualityEngine:
    """
    Research-Grade Data Quality Validation Engine.
    Analyzes completion velocity, straight-lining variance, attention checks,
    and missing data to compute a composite score (0-100).
    """

    @staticmethod
    def calculate_quality_score(
        completion_seconds: int,
        total_questions: int,
        responses: List[Dict[str, Any]],
        attention_check_passed: bool = True
    ) -> Dict[str, Any]:
        
        if total_questions == 0:
            return {"overall_score": 100, "status": "excellent"}

        # 1. Velocity Analysis
        avg_seconds_per_q = completion_seconds / max(total_questions, 1)
        if avg_seconds_per_q < 2.0:
            time_score = 30 # Suspiciously fast (<2s/q)
        elif avg_seconds_per_q < 4.0:
            time_score = 70
        else:
            time_score = 100

        # 2. Straight-lining Detection (Variance of option values if numerical/indexed)
        numeric_answers = []
        for r in responses:
            val = r.get("value")
            if isinstance(val, (int, float)):
                numeric_answers.append(val)
            elif isinstance(val, str) and val.isdigit():
                numeric_answers.append(float(val))
        
        if len(numeric_answers) > 5:
            variance = float(np.var(numeric_answers))
            if variance < 0.05:
                pattern_score = 40 # High straight-lining
            elif variance < 0.2:
                pattern_score = 75
            else:
                pattern_score = 100
        else:
            pattern_score = 95

        # 3. Attention Check Score
        attention_score = 100 if attention_check_passed else 20

        # 4. Missing Data Score
        answered_ratio = len(responses) / max(total_questions, 1)
        missing_data_score = int(min(answered_ratio * 100, 100))

        # Composite Weighted Score
        overall_score = int(
            (time_score * 0.35) +
            (pattern_score * 0.30) +
            (attention_score * 0.20) +
            (missing_data_score * 0.15)
        )

        if overall_score >= 90:
            status = "excellent"
        elif overall_score >= 75:
            status = "good"
        elif overall_score >= 60:
            status = "acceptable"
        else:
            status = "review_required"

        return {
            "overall_score": overall_score,
            "completion_time_score": time_score,
            "pattern_score": pattern_score,
            "attention_score": attention_score,
            "missing_data_score": missing_data_score,
            "status": status,
            "avg_seconds_per_question": round(avg_seconds_per_q, 2),
        }
