export class User {

    constructor(
        public idToken: string,
        public email: string,
        public expirationDateTime: Date,
        public localId: string
    ) { }
}