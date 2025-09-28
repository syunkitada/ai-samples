import requests

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        break
    res = requests.post("http://localhost:8000/chat", json={"message": user_input})
    print("Bot:", res.json()["reply"])
