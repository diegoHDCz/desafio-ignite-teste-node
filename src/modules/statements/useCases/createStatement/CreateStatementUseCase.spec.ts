import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("create statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementRepository
    );
  });
  it("Should be able to create a deposit", async () => {
    const user: User = await usersRepository.create({
      email: "jhondo@test.com",
      name: "john do",
      password: "1234",
    });
    const response: Statement = await createStatementUseCase.execute({
      amount: 100,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });
    expect(response).toHaveProperty("id");
  });
  it("should be able to create a withdraw statement", async () => {
    const user = await usersRepository.create({
      email: "test@test.com",
      name: "test",
      password: "1234",
    });

    await createStatementUseCase.execute({
      amount: 101,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const response = await createStatementUseCase.execute({
      amount: 100,
      description: "test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able to create a withdraw statement with funds", async () => {
    expect(async () => {
      const user = await usersRepository.create({
        email: "test@test.com",
        name: "test",
        password: "1234",
      });

      await createStatementUseCase.execute({
        amount: 100,
        description: "test",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should not be able to create a statement with a non-existent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100,
        description: "test",
        type: OperationType.WITHDRAW,
        user_id: "non-existent",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
