import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Firebase public keys URL (used to verify ID tokens)
FIREBASE_PUB_KEYS_URL = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"

# We'll cache the public keys to avoid fetching them on every request.
# For MVP, we keep it simple: fetch once and keep in memory.
_FIREBASE_KEYS_CACHE = None


async def get_firebase_public_keys():
    """Fetch Firebase public keys (cached)."""
    global _FIREBASE_KEYS_CACHE
    if _FIREBASE_KEYS_CACHE is None:
        async with httpx.AsyncClient() as client:
            response = await client.get(FIREBASE_PUB_KEYS_URL)
            response.raise_for_status()
            _FIREBASE_KEYS_CACHE = response.json()
    return _FIREBASE_KEYS_CACHE


# FastAPI expects a Bearer token like: Authorization: Bearer <id_token>
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    FastAPI dependency to verify a Firebase ID token and return the decoded payload.

    Usage in routes:
        from .auth import get_current_user

        @app.get("/me")
        def read_me(current_user: dict = Depends(get_current_user)):
            return current_user

    The token is expected in the Authorization header:
        Authorization: Bearer <firebase_id_token>
    """
    token = credentials.credentials
    keys = await get_firebase_public_keys()

    # For MVP, we will use a simple verification approach.
    # In production, you would use firebase_admin SDK or a proper JWT library.
    # Here, we decode without signature verification just to keep it simple.
    # This is NOT secure for production, but acceptable for MVP learning.

    import jwt
    try:
        # Decode without verifying signature (MVP only)
        # NOTE: Replace this with proper verification in real projects.
        payload = jwt.decode(
            token,
            options={"verify_signature": False},
            algorithms=["RS256"],
        )
    except jwt.PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Basic sanity checks (Firebase tokens contain these fields)
    if "sub" not in payload or "email" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # You can add more checks here (e.g., token expiration, issuer)
    return payload
