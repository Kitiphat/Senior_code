from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS module
from chatBotModel import ChatbotModel

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the chatbot model
chatbot_model = ChatbotModel()

# Save the tag for the next location.
location_list = []

@app.route('/query', methods=['POST'])
def query():
    # Receive input from frontend
    data = request.get_json()
    question = data['question']

    # Process the input using the chatbot model
    global location_list  # Add global variable declarations to be used in functions.
    answer, predict_label, next_location, img_list = chatbot_model.process_text_input(location_list, question)
    location_list = next_location
    prompts = chatbot_model.create_prompt(predict_label, location_list)

    # Format the result
    result = chatbot_model.format_result(answer)
    print(result)

    # Return the result to the frontend
    return jsonify({'answer': result, 'location_list': location_list, 'prompts': prompts, 'img_list': img_list})

if __name__ == '__main__':
    app.run(debug=True)