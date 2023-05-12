export const menu = {
    invitation: "Выберите пункт меню: \n",
    options: [
        "Получить информацию о человеке",
        "Получить список умений",
        "Получить информацию о конкретном умениии",
        "Послать событие авторизации",
        "Проверить наличие прав на изменение",
        "Сохранить новую информацию о человеке",
        "Создать новое умение",
        "Удалить умение",
        "Сохранить новую информацию об умении"
    ],
    wrongOption: "Пожалуйста, введите номер одного из указанных выше пунктов",
    exitOption: "Завершить работу",
    exitMessage: "Спасибо, что пользовались данной программой",
}

export const NO_CHOICE = "-1";
export const EXIT_CHOICE  = "0";

export const apiConfig = {
    port: 8004,
    url: "localhost",
    postAuth: "/auth",
    patientShortInfo: "/patients/all/short",
    addPost: "/post/add",
    allPosts: "/posts/all",
    updatePost: "/posts/update",
    addStaff: "/staff/add",
    updateStaff: "/staff/update",
    staffShort: "/staff/all/short",
    fullStaffInfo: "/staff/all/full",
    dismissStaff: "/staff/dismiss",
    addUser: "/users/add",
    updateUser: "/users/update",
    deleteUser: "/users/delete",
    systemUsersList: "/users/all/short",
    postSchedule: "/schedule",
    allSchedules: "/schedules/all",
    newRecord: "/records/new",
    currentRecords: "/records/current",
    shortRecords: "/records/all/short",
    recordFull: "/record/full",
}

export const statuses = {
    SUCCESS: 200,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    INVALID_ARGS: 422,
    FORBIDDEN: 403,
}