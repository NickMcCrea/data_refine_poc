from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return "Welcome to the Flask App!"

@app.route('/test', methods=['GET'])
def test_endpoint():
   
    #return some table data, where it's a list of key value pairs, where key is the column name and value is the value
    data = [
        {
            'id': 1,
            'name': 'John Doe',
            'age': 25
        },
        {
            'id': 2,
            'name': 'Jane Doe',
            'age': 22
        }
    ]

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
