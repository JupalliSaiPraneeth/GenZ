import os
from typing import Dict, Any

class CertificateService:
    """
    Certificate Generation & Verification Engine.
    Generates unique verification codes and handles certificate validation metadata.
    """

    @staticmethod
    def generate_verification_code() -> str:
        import random
        return f"GZ2026-{random.randint(100000, 999999)}"

    @staticmethod
    def create_certificate_record(participant_name: str, session_id: str) -> Dict[str, Any]:
        code = CertificateService.generate_verification_code()
        return {
            "session_id": session_id,
            "verification_code": code,
            "recipient_name": participant_name,
            "issued_at": "2026-09-05T00:00:00Z",
            "status": "valid",
            "certificate_url": f"/api/certificate/download/{code}.pdf",
        }
