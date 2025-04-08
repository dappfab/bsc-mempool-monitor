# Mempool Monitor

This project is a TypeScript application that monitors the mempool of a blockchain network using the viem library. It allows users to subscribe to pending transactions and process them in real-time.

## Project Structure

```
mempool-monitor
├── src
│   ├── index.ts          # Entry point of the application
│   ├── config
│   │   └── networks.ts   # Configuration settings for blockchain networks
│   ├── services
│   │   └── mempool.ts    # Functions related to monitoring the mempool
│   ├── types
│   │   └── transaction.ts # TypeScript interfaces for blockchain transactions
│   └── utils
│       └── logger.ts     # Utility functions for logging
├── package.json           # npm configuration file
├── tsconfig.json          # TypeScript configuration file
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mempool-monitor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

## Usage

Once the application is running, it will start monitoring the mempool for pending transactions. The application will log transaction details to the console as they are detected.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.