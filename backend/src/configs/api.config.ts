export const apiConfig = {
    port: 8004,
    url: "localhost",
    getPatientFullInfo: "/patients/:id",
    patientFullInfo: "/patients", // DONE
    patientShortInfo: "/patients/all/short", // DONE
    postAuth: "/auth", // DONE
    addPost: "/post/add", // DONE
    allPosts: "/posts/all", // DONE
    updatePost: "/posts/update", // DONE
    addStaff: "/staff/add", // DONE
    updateStaff: "/staff/update", // DONE
    staffShort: "/staff/all/short", // DONE
    fullStaffInfo: "/staff/all/full", // DONE
    dismissStaff: "/staff/dismiss", // DONE
    addUser: "/users/add", // DONE
    addUserORM: "/users/addorm", // DONE
    updateUser: "/users/update", // DONE
    deleteUser: "/users/delete", // DONE
    systemUsersList: "/users/all/short", // DONE
    getSchedule: "/schedule/:id", // DONE
    allSchedules: "/schedules/all", // DONE
    newRecord: "/records/new", // DONE
    currentRecords: "/records/current", // DONE
    shortRecords: "/records/all/short", // DONE
    recordFull: "/record/full", // DONE
    agreement: "/agreement/:id",
}