import requests
import json
host = "http://localhost:8004"


def auth():
    data = {
        "username": "admin",
        "password": "qwerty"
    }
    headers={
        'Content-type':'text/plain',
    }

    r = requests.post(host + "/auth", data=json.dumps(data), headers=headers)
    body = r.json()
    print(r, body)
    password = body["password"]
    return password


def addUser(staff_id: int, username: str, password: str, access_level: str):
    print(id)
    data = {
        "staff": {
            "staff_id": staff_id,
        },
        "username": username,
        "password": password,
        "access_level": access_level,
    }
    password = auth()
    r = requests.post(host + "/users/add", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

def test(times):
    staff_id = 1
    username = 'user1'
    password = 'user1'
    access_level = 'doctor'

    for _ in range(times):
        addUser(staff_id, username, password, access_level)

test(100)