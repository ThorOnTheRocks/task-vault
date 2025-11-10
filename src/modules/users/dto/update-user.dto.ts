export class UpdateUserDTO {
  constructor(
    public readonly name?: string,
    public readonly username?: string,
    public readonly email?: string,
    public readonly password?: string,
  ) {}
}
