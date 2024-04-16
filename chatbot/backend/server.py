from flask import Flask, request, jsonify
from chatbotModel import ChatbotModel

app = Flask(__name__)
chatbot = ChatbotModel()

@app.route('/api/chatbot', methods=['POST'])
def chatbot_endpoint():
    data = request.json
    user_input = data['user_input']

    # Process user input and generate response
    answer, location_list = chatbot.process_text_input(next_location, user_input)
    next_location = location_list

    # Format and return the response
    result = chatbot.format_result(answer)
    return jsonify({'response': result})

if __name__ == '__main__':
    app.run(debug=True)
