from typing import Union

from fastapi import FastAPI
from pydantic import BaseModel
import requests
import json
app = FastAPI()
host = "http://localhost:8004"

class GetPatientModel(BaseModel):
    patient_id: int
    address_id: int
    passport: int
    phone: str
    home_phone: str | None = None
    email: str | None = None
    passport_id: int
    surname: str
    middlename: str
    lastname: str
    birth_date: str
    gender: str
    series: str
    num: str
    issue_date: str
    issue_location: str
    country: str
    city: str
    street: str
    house: str
    flat: str | None = None

class PutPatientModelIn(BaseModel):
    patient_id: int
    address_id: int
    passport_id: int

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
    password = body["password"]
    return password

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/patients/:id", response_model=GetPatientModel)
def patientFullInfo(id: int):
    print(id)
    password = auth()
    r = requests.get(host + "/patients/" + str(id), headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.put("/patients")
def patientFullInfo(patient_id: int, address_id: int, passport_id: int, surname: str, middlename: str, lastname: str, birthdate: str, gender: str, series: str, num: str, issue_date: str, issue_place: str, phone: str, country: str, city: str, street: str, house: str, flat: Union[str, None] = None, home_phone: Union[str, None] = None, email: Union[str, None] = None):
    print(id)
    password = auth()
    data = {
        "patient_id": patient_id,
        "phone": phone,
        "home_phone": home_phone,
        "email": email,
        "address": {
            "address_id": address_id,
            "country": country,
            "city": city,
            "street": street,
            "house": house,
            "flat": flat
        },
        "passport": {
            "passport_id": passport_id,
            "surname": surname,
            "middlename": middlename,
            "lastname": lastname,
            "birth_date": birthdate,
            "gender": gender,
            "series": series,
            "num": num,
            "issue_date": issue_date,
            "issue_location": issue_place
        }
    }
    r = requests.put(host + "/patients", data=json.dumps(data), headers={ 'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/patients")
def patientFullInfo(surname: str, middlename: str, lastname: str, birthdate: str, gender: str, series: str, num: str, issue_date: str, issue_place: str, phone: str, country: str, city: str, street: str, house: str, flat: Union[str, None] = None, home_phone: Union[str, None] = None, email: Union[str, None] = None):
    print(id)
    password = auth()
    data = {
        "phone": phone,
        "home_phone": home_phone,
        "email": email,
        "address": {
            "country": country,
            "city": city,
            "street": street,
            "house": house,
            "flat": flat
        },
        "passport": {
            "surname": surname,
            "middlename": middlename,
            "lastname": lastname,
            "birth_date": birthdate,
            "gender": gender,
            "series": series,
            "num": num,
            "issue_date": issue_date,
            "issue_location": issue_place
        }
    }
    r = requests.post(host + "/patients", data=json.dumps(data), headers={ 'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()