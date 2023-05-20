import requests
import json
host = "http://localhost:8004"

data = {
    "username": "admin",
    "password": "qwerty"
}
authHeader={
    'Content-type':'text/plain',
}


r = requests.post(host + "/auth", data=json.dumps(data), headers=authHeader)
body = r.json()
password = body["password"]
print(password)

headers={
    'Authorization': 'Explicit: ' + password,
}
r = requests.get(host + "/patients", headers=headers)
print(r)
print(r.json())