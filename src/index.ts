import { createPublicClient, webSocket, http } from 'viem';
import { bsc } from 'viem/chains';
import { watchPendingTransactions } from './services/mempool';
import * as dotenv from 'dotenv';

dotenv.config();

const WSS_ENDPOINT = 'wss://56.rpc.thirdweb.com/7q1C9RNJ5SjR0vwrZykqsZ90VxZALA64hYtbWhuQnGb7ht095xC0cgvB_zBQiGlSb-VsHKnD815Xh9LkqkYGfQ';
const HTTP_ENDPOINT = `https://bsc-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;

async function main() {
    const client = createPublicClient({
        chain: bsc,
        transport: http(HTTP_ENDPOINT)
        /*
        // Uncomment the following lines to use WebSocket transport
        transport: webSocket(WSS_ENDPOINT, {
            retryCount: 5,
            retryDelay: 1000,
        }),
        */
    });

    try {
        await watchPendingTransactions(client);
    } catch (error) {
        console.error('Application error:', error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Startup error:', error);
    process.exit(1);
});

// Prevent unhandled promise rejections from silently failing
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection:', error);
    process.exit(1);
});