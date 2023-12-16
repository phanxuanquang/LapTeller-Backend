from flask import Flask, jsonify, request
import asyncio
from sydney import SydneyClient

app = Flask(__name__)

sydney = SydneyClient(style="precise")

async def ask_sydney(question):
     async with sydney:
        response, recommended_questions = await sydney.ask("Tell me a joke.")
        response, recommended_questions = await sydney.ask("Tell me another one.")
        #response, recommended_questions = await sydney.ask(question, suggestions=True ,raw=False, search=False)
        return response, recommended_questions

@app.route('/ask', methods=['GET'])
def ask():
    question = request.args.get('question', type = str)
    response, recommended_questions = asyncio.run(ask_sydney(question))
    return jsonify({'response': response, 'recommended_questions': recommended_questions})

if __name__ == "__main__":
   app.run(port=5000)