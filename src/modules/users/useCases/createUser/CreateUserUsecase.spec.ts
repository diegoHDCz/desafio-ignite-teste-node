import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepository: InMemoryUsersRepository;
let createUser: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUser = new CreateUserUseCase(usersRepository);
  });
  it("Should be able to create user", async () => {
    const user: ICreateUserDTO = await createUser.execute({
      name: "test",
      email: "email@email.com",
      password: "1234",
    });
    expect(user).toHaveProperty("id");
  });
  it("Should not be able users with same email", () => {
    expect(async () => {
      await usersRepository.create({
        name: "user1",
        email: "john@john.com",
        password: "5555",
      });

      await createUser.execute({
        name: "user2",
        email: "john@john.com",
        password: "3333",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
