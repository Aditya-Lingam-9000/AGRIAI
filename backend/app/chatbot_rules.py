# Rule-based chatbot engine (MVP version).
# No NLP/AI here—just keyword matching and predefined answers.

# ------------------------------
# 1) Q&A knowledge base
# ------------------------------
# Each entry has:
# - keywords: list of words/phrases to match (case-insensitive)
# - answer: the response to return

QA_KNOWLEDGE_BASE = [
    {
        "keywords": ["fertilizer", "fertilizers", "which fertilizer", "what fertilizer"],
        "answer": "Common fertilizers used are Urea, DAP, MOP, SSP, and Gypsum. The exact schedule depends on the crop and land area.",
    },
    {
        "keywords": ["duration", "crop duration", "how long", "days"],
        "answer": "Crop durations vary: Paddy ~120 days, Cotton ~160 days, Maize ~90 days, Groundnut ~100 days.",
    },
    {
        "keywords": ["water", "irrigation", "water requirement", "how much water"],
        "answer": "Water needs depend on crop and stage. Paddy requires more water; crops like Groundnut need less. Check your field plan for a tailored schedule.",
    },
    {
        "keywords": ["cost", "investment", "how much", "price"],
        "answer": "Estimated cost per acre: Paddy ~8000, Cotton ~12000, Maize ~7000, Groundnut ~6000 (in local currency).",
    },
    {
        "keywords": ["yield", "production", "output", "how much yield"],
        "answer": "Expected yield per acre: Paddy ~2.5 tons, Cotton ~1.8 tons, Maize ~2.0 tons, Groundnut ~1.2 tons.",
    },
    {
        "keywords": ["schedule", "fertilizer schedule", "when to apply"],
        "answer": "Fertilizer is applied at specific weeks after sowing. For example, Urea at week 1, DAP at week 4, MOP at week 8 for Paddy.",
    },
    {
        "keywords": ["pest", "pesticide", "disease", "attack"],
        "answer": "Common pests include bollworm in cotton and stem borer in paddy. Use recommended pesticides and consult local agriculture officers.",
    },
    {
        "keywords": ["organic", "organic farming", "natural"],
        "answer": "Organic options include compost, vermicompost, and bio-fertilizers. They improve soil health but may require more volume.",
    },
    {
        "keywords": ["help", "support", "contact", "expert"],
        "answer": "For detailed help, contact your local agriculture office or use the app’s crop planning feature for personalized guidance.",
    },
]

# ------------------------------
# 2) Simple keyword matching
# ------------------------------
def match_answer(question: str) -> str:
    """Return the best-matched answer for a given question.

    If no keywords match, return a default fallback response.
    """
    # Normalize: lowercase and strip spaces
    question_normalized = question.lower().strip()

    # Try to find a match
    for entry in QA_KNOWLEDGE_BASE:
        for kw in entry["keywords"]:
            if kw in question_normalized:
                return entry["answer"]

    # Fallback if nothing matches
    return (
        "I’m not sure how to answer that. Try asking about fertilizer, duration, water, cost, yield, or schedule."
    )
