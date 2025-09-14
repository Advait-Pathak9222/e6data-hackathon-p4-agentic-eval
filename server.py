# server.py
import json
import uvicorn
from typing import Optional, Any
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from api_wrapper import run_evaluation

app = FastAPI(title="Agentic Eval API")

# Allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvalRequest(BaseModel):
    prompt: str
    response: str
    metadata: Optional[Any] = None

@app.post("/evaluate")
async def evaluate(req: EvalRequest):
    print("Incoming request:", req.dict())
    # Normalize metadata to string for the evaluator (it expects text)
    if isinstance(req.metadata, dict):
        metadata_str = json.dumps(req.metadata)
    elif req.metadata is None:
        metadata_str = ""
    else:
        metadata_str = str(req.metadata)

    try:
        scores, explanation_text, raw_details = run_evaluation(req.prompt, req.response, metadata_str)
        response = {"scores": scores, "explanation": explanation_text, "details": raw_details}
        print("Outgoing response:", response)
        return response
    except Exception as e:
        print("Evaluation error:", e)
        return {"error": str(e)}
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
