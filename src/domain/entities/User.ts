export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public profilePicture?: string | null,
    public isAdmin = false,
    public createdAt = new Date(),
    public updatedAt = new Date()
  ) {}
}
