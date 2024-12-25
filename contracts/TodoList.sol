// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TodoList Smart Contract
 * @dev A simple Todo list implementation with fee-based creation and refundable deletion
 * @custom:security-contact https://github.com/All-Khwarizmi/
 */
contract TodoList is Ownable {
    /// @notice Represents the current status of a Todo item
    enum Status {
        TODO,
        DOING,
        DONE
    }

    /// @notice Structure representing a Todo item
    struct Todo {
        string definition; // Description of the todo
        Status status; 
        uint256 createdAt; 
    }

    /// @notice Array storing all Todo items
    Todo[] public todoList;

    /// @notice Fee required to create a new Todo (0.01 ETH)
    uint256 public constant FEE = 0.01 ether;

    /// @notice Emitted when a new Todo is created
    /// @param todo Hash of the todo definition
    event CreateTodo(bytes32 todo);

    /// @notice Emitted when a Todo is deleted
    event DeleteTodo();

    /// @notice Emitted when a Todo is updated
    /// @param todo Hash of the updated todo definition
    event UpdateTodo(bytes32 todo);

    constructor() Ownable(msg.sender) {}

    function createTodo(
        string calldata todoDefinition
    ) public payable onlyOwner {
        require(msg.value == FEE, "Must send 0.01 ETH to create a Todo");
        Todo memory todo = Todo(todoDefinition, Status.TODO, block.timestamp);
        todoList.push(todo);

        emit CreateTodo(keccak256(abi.encodePacked(todoDefinition)));
    }

    function updateTodo(
        uint256 index,
        Status status,
        string calldata todoDefinition
    ) external onlyOwner {
        todoList[index].status = status;
        todoList[index].definition = todoDefinition;

        emit UpdateTodo(keccak256(abi.encodePacked(todoDefinition)));
    }

    function deleteTodo(uint256 index) external onlyOwner {
        // Remove Todo and avoid blank having blank Todos
        todoList[index] = todoList[todoList.length - 1];
        todoList.pop();

        (bool success, ) = payable(msg.sender).call{value: FEE}("");
        require(success, "Refund failed");

        emit DeleteTodo();
    }

    function getNumOfTodos() external view returns (uint256) {
        return todoList.length;
    }
}
