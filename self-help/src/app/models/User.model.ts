export class User {
    constructor(
        public idToken: string,
        public email: string,
        public expiresIn: string,
        public localId: string
    ) {}
}