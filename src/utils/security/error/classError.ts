
export class AppError extends Error {
        constructor( public message :any , public statuscode : number) { 
            super(message)
        }
    }