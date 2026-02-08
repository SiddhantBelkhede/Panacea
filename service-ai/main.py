from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import uvicorn
# import os

load_dotenv()

app = FastAPI()

# Initialize LLM
llm = ChatGroq(
    model_name='openai/gpt-oss-120b',
    temperature=0,
)

class QueryRequest(BaseModel):
    history_context: str
    user_question: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get("/")
def home():
    return {"message": "Panacea AI Service is Running"}

@app.post("/ask")
async def ask_ai(request: QueryRequest):
    try:
        # Define the Persona and Context
        system_prompt = """
        You are "Panacea AI", a helpful medical assistant for parents.

        CONTEXT PROVIDED:
        {context}

        INSTRUCTIONS:
        1. Answer the parent's question based strictly on the context provided above (vaccination history, age, etc.).
        2. If the answer is not in the context, provide general medical advice but state that it is general.
        3. Be reassuring, polite, and concise.
        4. Do not make up fake medical records.
        """

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{question}"),
        ])

        chain = prompt | llm

        response = await chain.ainvoke({
            "context": request.history_context,
            "question": request.user_question
        })

        return {"answer": response.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)