export type address = {
    address_id?: number,
    country: string,
    city: string,
    street: string,
    house: string,
    flat?: string
};

export type gender_t = 'Male'|'Female'|'Other';

export type passport = {
    passport_id?: number,
    surname: string,
    middlename: string,
    lastname: string,
    birth_date: string,
    gender: gender_t,
    series: string,
    num: string,
    issue_date: string,
    issue_location: string
};

export type client = {
    patient_id?: number,
    address_id: number,
    passport: number,
    phone: string,
    home_phone?: string,
    email?: string,
}