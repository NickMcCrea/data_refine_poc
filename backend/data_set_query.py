import json
from typing import List, Dict, Optional

class QueryState:
    def __init__(self, query: str):
        self.initial_query = query
        self.current_query: query
        self.target_system: Optional[Dict] = None
        self.data_set: Optional[Dict] = None
        self.filter_criteria: List[Dict] = []
        self.time_period: Optional[Dict] = None
        self.conversation_history: List[str] = [query]  # Include the initial query in the history


    def to_json(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
                          sort_keys=True, indent=4)

    @classmethod
    def from_json(cls, json_str):
        json_dict = json.loads(json_str)
        query_state = cls(json_dict['initial_query'])
        query_state.current_query = json_dict.get('current_query', json_dict['initial_query'])
        query_state.target_system = json_dict.get('target_system')
        query_state.data_set = json_dict.get('data_set')
        query_state.filter_criteria = json_dict.get('filter_criteria', [])
        query_state.time_period = json_dict.get('time_period')
        query_state.conversation_history = json_dict.get('conversation_history', [])
        return query_state
    
    def add_user_message(self, new_message: str):
        # Add the current query to the conversation history
        if self.current_query != self.initial_query:  # Avoid duplicating the initial query
            self.conversation_history.append(self.current_query)
       
        # Update the current query
        self.current_query = new_message
    

    
    @classmethod
    def get_test_json(cls):
        # Initialize the QueryState instance
        query_state = QueryState("Get me balances from the EMEA Regal trial balance for company code 0302, for year end 2023")

        # Set the target system
        query_state.target_system = {"name": "emea_regal"}

        # Set the dataset
        query_state.data_set = {"name": "trial_balance"}

        # Set the filter criteria
        query_state.filter_criteria = [{"field": "company_code", "value": "0302"}]

        # Set the time period
        query_state.time_period = {"single_date": "31-12-23"}

        # Convert to JSON and print
        query_state_json = query_state.to_json()
        return query_state_json
    
    @classmethod
    def simulate_next_classification(cls, current_state_json):
        current_state = cls.from_json(current_state_json)
        
        # Simulating the classification process
        if not current_state.target_system:
            # Identify the target system and dataset
            current_state.target_system = {"name": "identified_system"}
            current_state.data_set = {"name": "identified_dataset"}
        elif not current_state.filter_criteria:
            # Add filter criteria
            current_state.filter_criteria = [{"field": "some_field", "value": "some_value"}]
        elif not current_state.time_period:
            # Set the time period
            current_state.time_period = {"single_date": "some_date"}

        return current_state.to_json()




 