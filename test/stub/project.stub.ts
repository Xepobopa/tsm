export class ProjectStub {
    createProject() {
        return {
            title: "Management system",
            desc: "Develop management system for business",
        }
    }

    createTask() {
        return {
                title: "Validation",
                desc: "Add a validation to the auth",
                status: "New",
                userTodo: "ismartsdn47@gmail.com"
            }
    }

    createUser() {
        return {
            email: "ismartsdn47@gmail.com",
            password: "KJH)(&sjdkb565"
        }
    }

    addTask() {
        return {
                title: "Validation2",
                desc: "Add a validation to the auth2",
                status: "Done",
                userTodo: "ismartsdn47@gmail.com"
            }
    }
}