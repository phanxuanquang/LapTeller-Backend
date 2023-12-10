from flask import Flask, jsonify, request
import asyncio
from sydney import SydneyClient

app = Flask(__name__)

async def ask_sydney(question):
    async with SydneyClient() as sydney:
        response, recommended_questions = await sydney.ask(question, suggestions=True ,raw=False)
        return response, recommended_questions

@app.route('/ask', methods=['GET'])
def ask():
    question = request.args.get('question', default = "Hello", type = str)
    response, recommended_questions = asyncio.run(ask_sydney(question))
    return jsonify({'response': response, 'recommended_questions': recommended_questions})

if __name__ == "__main__":
    app.run(port=5000)