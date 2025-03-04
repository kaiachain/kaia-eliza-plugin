# @elizaos-plugins/plugin-kaia

Core Kaia plugin providing essential services, actions for token operations and wallet management.

## Description

The Kaia plugin provides comprehensive functionality for interacting with Kaia Mainnet and Kairos testnet, including native token transfers, fetching FTs/NFTs and faucet test tokens on Kaia networks.

## Features

- Transfer KAIA tokens between wallets
- Query wallet balances and KAIA price values
- Manage wallet interactions with Kaia network
- Block and Transaction Information

## Installation

```bash
npm install @elizaos-plugins/plugin-kaia
```

## Configuration

1. Get your API key from [KaiaScan](https://docs.kaiascan.io/create-api-key)

2. Set up your environment variables:

```bash
KAIA_EVM_PRIVATE_KEY=your_private_key # Used for onchain interactions like TRANSFER
KAIA_FAUCET_AMOUNT=fixed_test_tokens_to_be_sent # Ex: 1 - Sends 1 KAIA test tokens to user faucet request on kairos network
KAIA_KAIASCAN_API_KEY=your_kaiascan_api_key # Used for all fetch actions
```

3. Register the plugin in your Eliza configuration:

```typescript
import { kaiaPlugin } from "@elizaos-plugins/plugin-kaia";

export default {
    plugins: [kaiaPlugin],
    // ... other configuration
};
```

## Usage

### Get KAIA Price and Marketcap information

Receives Kaia Price, Supply and Volume:

```typescript
// Example conversation
User: "give me kaia information";
Assistant: "Kaia Token info is USD: 0.14, Total Supply: 5936109217, Volume: 63994146";
```

### Get Test tokens

Receives Kaia Testnet tokens for given address:

```typescript
// Example conversation
User: "give me some test tokens to 0x40453b61a3da4eceaa8b6e810dad433fb57c0e61";
Assistant: "I'll send few KAIA testnet tokens...";
```

### Send KAIA tokens

Transfer KAIA tokens to another address for provided network(kaia/kairos):

```typescript
// Example conversation
User: "Send 1 KAIA to 0x40453b61a3da4eceaa8b6e810dad433fb57c0e61 on kairos";
Assistant: "I'll send 1 KAIA token now...";
```

### Check Account Overview

Query account overview for given address for provided network(kaia/kairos):

```typescript
// Example conversation
User: "What's my account overview of 0x40453b61a3da4eceaa8b6e810dad433fb57c0e61 on kairos?";
Assistant: "Your account overview details are Account Type: EOA, Balance: 10, Total Transaction Count: 12";
```

### Check Current Balance

Query current balance and portfolio value for provided network(kaia/kairos):

```typescript
// Example conversation
User: "What's my current balance of 0x40453b61a3da4eceaa8b6e810dad433fb57c0e61 on kairos?";
Assistant: "Your balance contains 12 KAIA";
```

### Check FT Balances

Query fungible token balances for given address on provided network(kaia/kairos):

```typescript
// Example conversation
User: "What's ft balance of 0x40453b61a3da4eceaa8b6e810dad433fb57c0e61 on kaia?";
Assistant: "Your have total 5 FTs";
```

### Check NFT Balances

Query non fungible token balances for given address on provided network(kaia/kairos):

```typescript
// Example conversation
User: "What's nft balance of 0x40453b61a3da4eceaa8b6e810dad433fb57c0e61 on kaia?";
Assistant: "Your have total 2 NFT Collections";
```

### Check Block Info

Query block info for provided Block number on provided network(kaia/kairos):

```typescript
// Example conversation
User: "What's block info for 100000 block number on kaia?";
Assistant: "Block info for 100000 is Block Time: 2019-06-26, Block Hash: 0xc..., Total Transaction Count: 0";
```

### Get Latest Block

Query Latest block on provided network(kaia/kairos):

```typescript
// Example conversation
User: "What is the latest block number of kaia?";
Assistant: "The latest block number for kaia is 176629207";
```

### Get Transactions by account

Query transactions list by account on provided network(kaia/kairos):

```typescript
// Example conversation
User: "What are the transactions for 0x40453b61a3da4eceaa8b6e810dad433fb57c0e61 on kairos?";
Assistant: "The transactions for account is empty";
```

## API Reference

### Actions

- `FAUCET`: Fetch Kairos tokens to provided address
- `GET_ACCOUNT_OVERVIEW`: Get the Account Overview for a given address
- `GET_CURRENT_BALANCE`: Get the current balance for a given address
- `GET_FT_BALANCE_DETAILS`: Get the Fungible Balance for a given address
- `GET_NFT_BALANCE`: Get the NFT balance for a given address
- `TRANSFER`: Transfer tokens between addresses on the same chain
- `GET_KAIA_INFO`: Get the current price and volume of Kaia Token
- `GET_BLOCK`: Get the block info for a given block number
- `GET_LATEST_BLOCK`: Get the latest block number for a given network (kaia/kairos)
- `GET_BLOCK`: Get the block info for a given block number
- `GET_TRANSACTIONS_BY_ACCOUNT`: Get the transactions by account

### Environment Variables

| Variable              | Description           | Required |
| --------------------- | --------------------- | -------- |
| KAIA_KAIASCAN_API_KEY | Your KaiaScan API key | Yes      |
| KAIA_FAUCET_AMOUNT    | Test Tokens amount    | Yes      |
| KAIA_EVM_PRIVATE_KEY  | Your Private key      | Yes      |

### Providers

- `walletProvider`: Manages wallet interactions with the Kaia network, including balance queries and on-chain transactions

## Development

### Building

```bash
npm run build
```

## Dependencies

- `viem`: JS library to interact with Kaia EVM Blockchain
- `node-cache`: Caching implementation
- Other standard dependencies listed in package.json

## Future Enhancements

The following features and improvements are planned for future releases:

1. **Wallet Integration**

    - Account abstraction
    - Transaction history tracking

2. **Smart Contract Features**

    - Contract deployment tools
    - Testing framework
    - Security analysis

3. **Token Operations**

    - Batch token transfers
    - NFT support enhancement
    - Token metadata handling
    - Custom token standards
    - Collection management
    - Integration with Bridges and Oracle services

4. **Developer Tools**

    - Enhanced debugging
    - CLI improvements
    - Documentation generator
    - Integration templates
    - Performance monitoring

5. **Transaction Management**

    - Batch transaction processing
    - Transaction simulation
    - Custom transaction builders

We welcome community feedback and contributions to help prioritize these enhancements.

For more information about Kaia blockchain capabilities:

- [Kaia Documentation](https://docs.kaia.io/)
- [Kaia Developer Portal](https://kaia.io/developers)
- [KaiaScan Explorer](https://kaiascan.io/)
- [KaiaScan APIs](https://docs.kaiascan.io/)
- [Kaia GitHub Repository](https://github.com/kaiachain)

## License

This plugin is part of the Eliza project. See the main project repository for license information.
