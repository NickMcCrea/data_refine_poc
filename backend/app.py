from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from uuid import uuid4
from data_set_query import QueryState
import json
import logging
import llm_wrapper
import os
import openai
from dotenv import load_dotenv

load_dotenv()


app = Flask(__name__)
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*", logger=False, engineio_logger=False)

openai.api_key = os.getenv("OPENAI_KEY")

logging.getLogger('socketio').setLevel(logging.ERROR)
logging.getLogger('engineio').setLevel(logging.ERROR)
logging.getLogger('werkzeug').setLevel(logging.ERROR)



user_sessions = {}

@socketio.on("connect")
def on_connect():
    # Access the session_id from the Flask session
    session_id = session.get("session_id", str(uuid4()))
    # Save the session_id back to the session to persist it
    session["session_id"] = session_id

    print(f"Session {session_id} has connected.")
    
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

@app.route('/test', methods=['POST'])
def test_endpoint():
   
    data = request.json
    input_query = data.get('input')
    session_id = data.get('session_id')
    print("session id: ", session_id)

    socketio.emit("test received", data, room=session.get("session_id"))
   
    #return a json response with an object called reply containing the input query preceded by the string "You said: "
    return jsonify({"reply": "You said: " + input_query})

@app.route('/submit_query', methods=['POST'])
def submit_query():

   
    #session_id = session.get("session_id")
    #print("submit_query called for session id",session_id)

    # Retrieve the query from the request body
    data = request.json
    input_query = data.get('input')
    session_id = data.get('session_id')
    print("session id: ", session_id)

    # Check if there's an existing QueryState for this session
    if session_id in user_sessions:
        # Retrieve the existing QueryState and update it
        query_state_json = user_sessions[session_id]
        query_state = QueryState.from_json(query_state_json)
       
        query_state.add_user_message(input_query)
    else:
        # Initialize a new QueryState for the first query
        query_state = QueryState(input_query)
       

    # Update the user_sessions with the new state
    user_sessions[session_id] = query_state.to_json()

    # Simulate the classification of the query
    updated_query_state_json = QueryState.simulate_next_classification(query_state.to_json())

    # Update the session with the new state
    user_sessions[session_id] = updated_query_state_json

    # Emit the updated query state to the client
  
    socketio.emit("submit_query_update", json.loads(updated_query_state_json), room=session_id)
    print("socketio roomid: ", session_id)

    # Return the updated query state
    return jsonify(json.loads(updated_query_state_json))


@app.route('/simple_chat', methods=['POST'])
def simple_chat():
    data = request.json
    input_query = data.get('input')
    session_id = data.get('session_id')
    print("session id: ", session_id)

    messages = llm_wrapper.build_basic_message_list(input_query)
    response = llm_wrapper.llm_call(messages)
    print("response: ", response)
    return jsonify({"reply": response})


if __name__ == '__main__':
    socketio.run(app, debug=False, port=5001)
