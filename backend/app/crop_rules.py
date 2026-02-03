# Rule-based crop planning engine (MVP version).
# No ML or AI here—just deterministic logic based on predefined rules.

# ------------------------------
# 1) Crop database (simple dictionary)
# ------------------------------
# For MVP, we keep a small set of common crops.
# Each crop has:
# - duration_days
# - fertilizer_schedule (list of {week, fertilizer, quantity_per_acre})
# - estimated_cost_per_acre
# - expected_yield_per_acre (tons)

CROP_DATA = {
    "paddy": {
        "duration_days": 120,
        "fertilizer_schedule": [
            {"week": 1, "fertilizer": "Urea", "quantity_per_acre_kg": 20},
            {"week": 4, "fertilizer": "DAP", "quantity_per_acre_kg": 50},
            {"week": 8, "fertilizer": "MOP", "quantity_per_acre_kg": 30},
        ],
        "estimated_cost_per_acre": 8000,
        "expected_yield_per_acre_tons": 2.5,
    },
    "cotton": {
        "duration_days": 160,
        "fertilizer_schedule": [
            {"week": 1, "fertilizer": "Urea", "quantity_per_acre_kg": 25},
            {"week": 5, "fertilizer": "SSP", "quantity_per_acre_kg": 60},
            {"week": 10, "fertilizer": "MOP", "quantity_per_acre_kg": 40},
        ],
        "estimated_cost_per_acre": 12000,
        "expected_yield_per_acre_tons": 1.8,
    },
    "maize": {
        "duration_days": 90,
        "fertilizer_schedule": [
            {"week": 1, "fertilizer": "Urea", "quantity_per_acre_kg": 30},
            {"week": 3, "fertilizer": "DAP", "quantity_per_acre_kg": 40},
            {"week": 6, "fertilizer": "MOP", "quantity_per_acre_kg": 20},
        ],
        "estimated_cost_per_acre": 7000,
        "expected_yield_per_acre_tons": 2.0,
    },
    "groundnut": {
        "duration_days": 100,
        "fertilizer_schedule": [
            {"week": 1, "fertilizer": "Gypsum", "quantity_per_acre_kg": 150},
            {"week": 4, "fertilizer": "SSP", "quantity_per_acre_kg": 50},
        ],
        "estimated_cost_per_acre": 6000,
        "expected_yield_per_acre_tons": 1.2,
    },
}

# ------------------------------
# 2) Simple suitability rules (MVP)
# ------------------------------
# For MVP, we allow any crop for any water/investment level.
# Later you can add constraints like:
# - low water -> only certain crops
# - high investment -> high-value crops

def is_crop_suitable(crop: str, water: str, investment: str) -> bool:
    """Return True if the crop is suitable for given water/investment.
    
    MVP: always True. Later, add real constraints.
    """
    return True

# ------------------------------
# 3) Generate crop plan
# ------------------------------
def generate_crop_plan(
    crop: str,
    land_area_acres: float,
    water_availability: str,
    investment_level: str,
) -> dict:
    """Generate a deterministic crop plan based on rules.

    Returns a dict with:
    - crop
    - land_area_acres
    - duration_days
    - fertilizer_schedule (scaled by acres)
    - estimated_total_cost
    - expected_total_yield
    """
    if crop not in CROP_DATA:
        raise ValueError(f"Unsupported crop: {crop}")

    if not is_crop_suitable(crop, water_availability, investment_level):
        raise ValueError(f"Crop {crop} not suitable for water={water_availability}, investment={investment_level}")

    base = CROP_DATA[crop]

    # Scale fertilizer schedule by land area
    fertilizer_schedule_scaled = [
        {
            "week": entry["week"],
            "fertilizer": entry["fertilizer"],
            "quantity_per_acre_kg": entry["quantity_per_acre_kg"],
            "total_quantity_kg": round(entry["quantity_per_acre_kg"] * land_area_acres, 2),
        }
        for entry in base["fertilizer_schedule"]
    ]

    plan = {
        "crop": crop,
        "land_area_acres": land_area_acres,
        "duration_days": base["duration_days"],
        "fertilizer_schedule": fertilizer_schedule_scaled,
        "estimated_total_cost": round(base["estimated_cost_per_acre"] * land_area_acres, 2),
        "expected_total_yield_tons": round(base["expected_yield_per_acre_tons"] * land_area_acres, 2),
    }

    return plan
