import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Should be able to show user", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });
  it("Should be able to show user", async () => {
    const user = await usersRepository.create({
      name: "test",
      email: "test@test.com",
      password: "2356",
    });
    const response = await showUserProfileUseCase.execute(user.id as string);
    expect(response).toBe(user);
  });
  it("Should not be able to show unexistent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("non-existent-id");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
