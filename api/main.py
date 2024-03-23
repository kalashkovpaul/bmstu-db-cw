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

class Passport(BaseModel):
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

class ShortPassport(BaseModel):
    passport_id: int
    surname: str
    middlename: str
    lastname: str

class Post(BaseModel):
    post_id: int
    title: str
    salary: int

class Staff(BaseModel):
    staff_id: int
    passport: int
    post: int
    employment_date: str
    dismissal_date: str | None = None

class Schedule(BaseModel):
    schedule_id: int
    staff_id: int
    workstart: str
    workend: str
    week_day: str
    office: int | None = None

class MiddleSchedule(BaseModel):
    schedule_id: int
    workstart: str
    workend: str
    week_day: str
    office: int | None = None

class ShortSchedule(BaseModel):
    workstart: str
    workend: str
    week_day: str
    office: int | None = None

class PostAuthModel(BaseModel):
    username: str
    access_level: str
    passport: Passport
    post: Post
    staff: Staff
    password: str
    schedule: list[Schedule]

class PutPatientModelIn(BaseModel):
    patient_id: int
    address_id: int
    passport_id: int

class AddPostModel(BaseModel):
    post_id: int

class ShortStaffModel(BaseModel):
    surname: str
    middlename: str
    lastname: str
    title: str
    dismissal_date: str | None = None
    employment_date: str
    staff_id: int

class FullStaffModel(BaseModel):
    staff: Staff
    post: Post
    passport: Passport

class UserModelInfo(BaseModel):
    staff: Staff
    post: Post
    passport: ShortPassport

class FullUserModel(BaseModel):
    access_id: int
    username: str
    access_level: str
    staff: UserModelInfo

class ShortPost(BaseModel):
    post_id: int
    title: str

class NameInfo(BaseModel):
    surname: str
    middlename: str
    lastname: str

class ScheduleStaff(BaseModel):
    staff_id: int
    post: ShortPost
    passport: NameInfo

class AllScheduleInfo(BaseModel):
    staff: ScheduleStaff
    schedule: list[MiddleSchedule]

class ShortName(BaseModel):
    surname: str
    middlename: str

class ShortRecordInfo(BaseModel):
    record_id: int
    record_date: str
    surname: str
    middlename: str

class DoctorInfo(BaseModel):
    staff_id: int
    surname: str
    middlename: str
    lastname: str

class PatientInfo(BaseModel):
    patient_id: int
    surname: str
    middlename: str
    lastname: str

class SessionInfo(BaseModel):
    session_id: int
    state_id: int
    dynamics: str
    prescription: str
    node: str | None = None

class FullRecordInfo(BaseModel):
    record_id: int
    record_date: str
    doctor: DoctorInfo
    patient: PatientInfo
    session: SessionInfo

class AgreementInfo(BaseModel):
    agreement_id: int
    patient_id: int
    code: str
    conclusion_date: str
    expiration_date: str
    renewal_date: str | None = None

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

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


@app.get("/patients/:id", response_model=GetPatientModel)
def patientFullInfo(patient_id: int):
    print(patient_id)
    password = auth()
    r = requests.get(host + "/patients/" + str(patient_id), headers={'Authorization': 'Explicit: ' + password,})
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
    r = requests.post(host + "/patients", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/auth", response_model=PostAuthModel)
def PostAuth(username: str, password: str):
    data = {
        "username": username,
        "password": password
    }
    headers={
        'Content-type':'text/plain',
    }

    r = requests.post(host + "/auth", data=json.dumps(data), headers=headers)
    body = r.json()
    return body

@app.put("/patients/all/short")
def patientFullInfo(patient_id: int, phone: str, home_phone: Union[str, None] = None, email: Union[str, None] = None):
    print(id)
    data = {
        "patient_id": patient_id,
        "phone": phone,
        "home_phone": home_phone,
        "email": email
    }
    password = auth()
    r = requests.put(host + "/patients/all/short", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/post/add", response_model=AddPostModel)
def patientFullInfo(title: str, salary: int):
    print(id)
    data = {
        "title": title,
        "salary": salary,
    }
    password = auth()
    r = requests.post(host + "/post/add", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.get("/posts/all")
def patientFullInfo() -> list[Post]:
    print(id)
    password = auth()
    r = requests.get(host + "/posts/all", headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.put("/posts/update")
def updatePost(post_id: int, title: str, salary: int):
    print(id)
    data = {
        "post_id": post_id,
        "title": title,
        "salary": salary,
    }
    password = auth()
    r = requests.put(host + "/posts/update", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/staff/add")
def addStaff(post_id, surname: str, middlename: str, lastname: str, birthdate: str, gender: str, series: str, num: str, issue_date: str, issue_place: str, employment_date: str, dismissal_date: str | None = None):
    print(id)
    data = {
        "post": {
            "post_id": post_id
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
        },
        "schedule": [],
        "employment_date": employment_date,
        "dismissal_date": dismissal_date
    }
    password = auth()
    r = requests.post(host + "/staff/add", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.put("/staff/update")
def updateStaff(kind: str, staff_id: int, post: int, passport_id: int, surname: str, middlename: str, lastname: str, birthdate: str, gender: str, series: str, num: str, issue_date: str, issue_place: str):
    print(id)
    data = {
        "type": kind,
        "staff_id": staff_id,
        "post": post,
        "passport_id": passport_id,
        "surname": surname,
        "middlename": middlename,
        "lastname": lastname,
        "birth_date": birthdate,
        "gender": gender,
        "series": series,
        "num": num,
        "issue_date": issue_date,
        "issue_location": issue_place,
        "schedule": []
    }
    password = auth()
    r = requests.put(host + "/staff/update", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.get("/staff/all/short")
def shortStaffInfo() -> list[ShortStaffModel]:
    print(id)
    password = auth()
    r = requests.get(host + "/staff/all/short", headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.get("/staff/all/full")
def fullStaffInfo() -> list[FullStaffModel]:
    print(id)
    password = auth()
    r = requests.get(host + "/staff/all/full", headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/staff/dismiss")
def updatePost(staff_id: int, dismissal_date: str):
    print(id)
    data = {
        "staff_id": staff_id,
        "dismissal_date": dismissal_date,
    }
    password = auth()
    r = requests.post(host + "/staff/dismiss", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/users/add")
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

@app.post("/users/addorm")
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
    r = requests.post(host + "/users/addorm", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/users/update")
def updateUser(access_id: int, username: str | None = None, password: str | None = None, access_level: str | None = None):
    print(id)
    data = {
        "access_id": access_id,
        "username": username,
        "password": password,
        "access_level": access_level,
    }
    password = auth()
    r = requests.post(host + "/users/update", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/users/delete")
def updateUser(access_id: int):
    print(id)
    data = {
        "access_id": access_id,
    }
    password = auth()
    r = requests.post(host + "/users/delete", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.get("/users/all/short")
def systemUserList() -> list[FullUserModel]:
    print(id)
    password = auth()
    r = requests.get(host + "/users/all/short", headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.get("/schedule/:id")
def getScheduleInfo(staff_id: int) -> list[ShortSchedule]:
    print(staff_id)
    password = auth()
    r = requests.get(host + "/schedule/" + str(staff_id), headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.get("/schedules/all")
def allSchedules() -> list[AllScheduleInfo]:
    print(id)
    password = auth()
    r = requests.get(host + "/schedules/all", headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/records/new")
def patientFullInfo(doctor_id: int, patient_id: int, record_id: int, session_date: str, dynamics: str, prescription: str, note: str, general_condition: str, height: int, patient_weight: int, pulse: int, pressure: str, temperature: int, other: str):
    password = auth()
    data = {
        "doctor_id": doctor_id,
        "patient_id": patient_id,
        "record_id": record_id,
        "session_date": session_date,
        "dynamics": dynamics,
        "prescription": prescription,
        "note": note,
        "state": {
            "general_condition": general_condition,
            "height": height,
            "patient_weight": patient_weight,
            "pulse": pulse,
            "pressure": pressure,
            "temperature": temperature,
            "other": other
        }
    }
    r = requests.post(host + "/records/new", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()


@app.post("/records/current")
def updateUser(next_date: str) -> list[ShortName]:
    print(id)
    data = {
        "date": next_date,
    }
    password = auth()
    r = requests.post(host + "/records/current", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()


@app.get("/records/all/short")
def shortRecords() -> list[ShortRecordInfo]:
    print(id)
    password = auth()
    r = requests.get(host + "/records/all/short", headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.post("/record/full")
def fullRecord(record_id: int) -> list[FullRecordInfo]:
    print(id)
    data = {
        "record_id": record_id,
    }
    password = auth()
    r = requests.post(host + "/record/full", data=json.dumps(data), headers={'Content-type':'text/plain','Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()

@app.get("/agreement/:id")
def agreementInfo(patient_id: int) -> AgreementInfo:
    print(patient_id)
    password = auth()
    r = requests.get(host + "/agreement/" + str(patient_id), headers={'Authorization': 'Explicit: ' + password,})
    print(r)
    return r.json()
