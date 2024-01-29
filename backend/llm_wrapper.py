import openai

running_cost = 0
running_prompt_tokens = 0
running_completion_tokens = 0

model4="gpt-4-1106-preview"
model3="gpt-3.5-turbo-1106"
current_model = model3
COSTS = {
    "gpt-3.5-turbo-1106": {"input": 0.001 / 1000, "output": 0.002 / 1000},
    "gpt-4-1106-preview": {"input": 0.01 / 1000, "output": 0.03 / 1000},
}

def build_basic_message_list(prompt):
    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    messages.append({"role": "user", "content": prompt})
    return messages

def llm_call(messages):
   
    response = openai.chat.completions.create(
        model=current_model,
        messages=messages
    )

   
    return response.choices[0].message.content
