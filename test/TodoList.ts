import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("TodoList", () => {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const TodoList = await hre.ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    const FEE = ethers.parseEther("0.01");

    return { owner, otherAccount, todoList, FEE };
  }

  async function createTodoFixture() {
    const { todoList, FEE, ...props } = await loadFixture(deployFixture);

    await todoList.createTodo("Go to the gym", { value: FEE });

    return { todoList, FEE, ...props };
  }
  describe("Deployment", () => {
    it("Should deploy the TodoListPayable contract", async () => {
      const { todoList, FEE } = await loadFixture(deployFixture);

      expect(await todoList.FEE()).to.equal(FEE);
    });
  });

  describe("Create Todo", () => {
    it("Should throw if we do not send the exact amount of ETH", async () => {
      const { todoList } = await loadFixture(deployFixture);

      await expect(
        todoList.createTodo("", { value: ethers.parseEther("0.002") })
      ).to.revertedWith("Must send 0.01 ETH to create a Todo");
      await expect(
        todoList.createTodo("", { value: ethers.parseEther("1") })
      ).to.revertedWith("Must send 0.01 ETH to create a Todo");
    });
    it("Only the owner of the contract can create a Todo", async () => {
      const { todoList, FEE, otherAccount } = await loadFixture(deployFixture);

      await expect(
        todoList
          .connect(otherAccount)
          .createTodo("Go to the gym", { value: FEE })
      )
        .to.revertedWithCustomError(
          {
            interface: todoList.interface,
          },
          "OwnableUnauthorizedAccount"
        )
        .withArgs(otherAccount);
    });
    it("Should be able to create a Todo with the passed `todoDefinition` and with `status` set to TODO (0)", async () => {
      const { todoList, FEE } = await loadFixture(deployFixture);

      await todoList.createTodo("Go to the gym", { value: FEE });

      const todo = await todoList.todoList(0);

      expect(todo[0]).to.equal("Go to the gym");
      expect(todo[1]).to.equal(BigInt(0));
    });

    it("A Create Todo event should be emitted", async () => {
      const { todoList, FEE } = await loadFixture(deployFixture);

      expect(
        await todoList.createTodo("Go to the gym", { value: FEE })
      ).to.emit(
        {
          interface: todoList.interface,
        },
        "CreateTodo"
      );
    });
  });

  describe("Update Todo", () => {
    it("Should be able to modify any of the fields of the Todo at the given index", async () => {
      const { todoList } = await loadFixture(createTodoFixture);

      await todoList.updateTodo(0, BigInt(1), "Go to the gym twice");
      const todo = await todoList.todoList(0);
      expect(todo[0]).to.equal("Go to the gym twice");
      expect(todo[1]).to.equal(BigInt(1));
    });

    it("Should emit an UpdateTodo event", async () => {
      const { todoList } = await loadFixture(createTodoFixture);

      expect(
        await todoList.updateTodo(0, BigInt(1), "Go to the gym trice")
      ).to.emit(
        {
          interface: todoList.interface,
        },
        "UpdateTodo"
      );
    });
  });

  describe("Delete Todo", () => {
    it("Should delete the Todo at the given index", async () => {
      const { todoList } = await loadFixture(createTodoFixture);

      await todoList.deleteTodo(0);
      await expect(todoList.todoList(0)).to.revertedWithoutReason();
    });
    it("Should emit the DeletedTodo event", async () => {
      const { todoList } = await loadFixture(createTodoFixture);
      expect(await todoList.deleteTodo(0)).to.emit(
        {
          interface: todoList.interface,
        },
        "DeleteTodo"
      );
    });
  });

  describe("Get Number of Todos", () => {
    it("Should get back the length of the array of Todos", async () => {
      const { todoList } = await loadFixture(createTodoFixture);

      expect(await todoList.getNumOfTodos()).to.equal(1);
    });
  });
});
