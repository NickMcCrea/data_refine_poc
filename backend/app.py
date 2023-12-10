from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from uuid import uuid4



app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, cors_allowed_origins="*")

user_sessions = {}

@socketio.on("connect")
def on_connect():
    # Access the session_id from the Flask session
    session_id = session.get("session_id", str(uuid4()))
    # Save the session_id back to the session to persist it
    session["session_id"] = session_id
    # Join the room with the session_id
    join_room(session_id)
    emit("connected", {"message": "Connected to WebSocket", "session_id": session_id})

@socketio.on("disconnect")
def on_disconnect():
    session_id = session.get("session_id")
    if session_id:
        leave_room(session_id)
        # Perform additional cleanup if needed, e.g., removing session from user_sessions dict
        user_sessions.pop(session_id, None)
        print(f"Session {session_id} has disconnected.")



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

    socketio.emit("test", {}, room=session.get("session_id"))

    return jsonify(data)


#method that is called on a loop every 5 seconds

if __name__ == '__main__':
    app.run(debug=True)
