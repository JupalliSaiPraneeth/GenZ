import pandas as pd
import numpy as np
from typing import Dict, Any, List

class AnalyticsEngine:
    """
    Pandas & NumPy Statistical Analytics Engine.
    Computes response distributions, correlation matrices, and demographic segmentations.
    """

    @staticmethod
    def compute_category_analytics(responses_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not responses_list:
            return {"total_responses": 0, "distributions": {}}

        df = pd.DataFrame(responses_list)
        
        # Distribution by question
        distributions = {}
        if "question_code" in df.columns and "value" in df.columns:
            grouped = df.groupby("question_code")["value"].value_counts(normalize=True).unstack(fill_value=0)
            distributions = grouped.to_dict(orient="index")

        return {
            "total_responses": len(df),
            "unique_questions_analyzed": len(distributions),
            "distributions": distributions,
        }
