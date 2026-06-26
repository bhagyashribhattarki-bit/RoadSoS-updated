from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

services = {
    "ambulance": {
        "name": "Ambulance Service",
        "phone": "108"
    },
    "police": {
        "name": "Police Station",
        "phone": "100"
    },
    "fire": {
        "name": "Fire Service",
        "phone": "101"
    },
    "emergency": {
        "name": "National Emergency",
        "phone": "112"
    }
}

@app.route('/services')
def get_services():
    return jsonify(services)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data['message'].lower()

    if "ambulance" in message or "accident" in message:
        response = "Call Ambulance: 108"
    elif "police" in message:
        response = "Call Police: 100"
    elif "fire" in message:
        response = "Call Fire Service: 101"
    else:
        response = "Please specify Ambulance, Police or Fire."

    return jsonify({"response": response})

@app.route('/severity', methods=['POST'])
def severity():
    data = request.json
    speed = int(data['speed'])

    if speed < 40:
        risk = "Low"
    elif speed < 80:
        risk = "Medium"
    else:
        risk = "High"

    return jsonify({"risk": risk})

if __name__ == '__main__':
    app.run(debug=True)