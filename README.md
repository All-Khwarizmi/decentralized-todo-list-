# TodoList Smart Contract 📝

A blockchain-based Todo list implementation with fee-based creation and refundable deletion functionality. Built with Hardhat and deployed on Sepolia testnet.

## 🌟 Features

- Create todos with a small fee (0.01 ETH)
- Update todo status and definition
- Delete todos with fee refund
- Ownership controls for security
- Event emission for tracking changes

## 🔗 Deployment Information

- **Network**: Sepolia Testnet
- **Contract Address**: `0xC8b741ac7BA75e49aE2Bfd7E5e3446df45f4DA9B` [View on Etherscan](https://sepolia.etherscan.io/address/0xC8b741ac7BA75e49aE2Bfd7E5e3446df45f4DA9B#code)


## 🛠 Technical Details

### Contract Structure

```solidity
enum Status { TODO, DOING, DONE }

struct Todo {
    string definition;
    Status status;
    uint256 createdAt;
}
```

### Key Functions

- `createTodo(string calldata todoDefinition)` - Create a new todo (requires 0.01 ETH)
- `updateTodo(uint256 index, Status status, string calldata todoDefinition)` - Update existing todo
- `deleteTodo(uint256 index)` - Delete todo and receive refund
- `getNumOfTodos()` - Get total number of todos

## 📦 Installation & Deployment

This contract was deployed using Hardhat and Ignition. For detailed deployment instructions, check our [Smart Contract Deployment Guide](https://gist.github.com/All-Khwarizmi/ce94a819bd28fb301a46e6d98eadec8c).

### Quick Start

```bash
# Install dependencies
npm install

# Deploy contract
npx hardhat run ./ignition/modules/TodoList.ts --network sepolia

# Verify contract
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS

# Deploy and verify contract
npx hardhat run ./ignition/modules/TodoList.ts --network sepolia --verify
```

## 🔍 Contract Verification

The contract is verified on Etherscan. You can interact with it directly through the [Etherscan interface](https://sepolia.etherscan.io/address/your-contract-address#code).

### Verification Details

- Solidity Version: 0.8.28
- Optimizer: Enabled (200 runs)
- License: MIT

## 🧪 Testing

```bash
# Run tests
npx hardhat test

# Run coverage
npx hardhat coverage
```

## 📜 Events

The contract emits the following events:

- `CreateTodo(bytes32 todo)`
- `DeleteTodo()`
- `UpdateTodo(bytes32 todo)`

## 🔒 Security Considerations

- Ownable pattern implementation
- Fee-based spam prevention
- Safe refund mechanism
- Input validation
- Reentrancy protection through state management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For any questions or feedback, please open an issue or contact us at:

- Email: contact@jason-suarez.com
- Twitter: [@swarecito](https://twitter.com/swarecito)
