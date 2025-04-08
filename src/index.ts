import { createPublicClient, webSocket } from 'viem';
import { bsc } from 'viem/chains';
import { watchPendingTransactions } from './services/mempool';

const WSS_ENDPOINT = 'wss://bsc-rpc.publicnode.com';

async function main() {
    const client = createPublicClient({
        chain: bsc,
        transport: webSocket(WSS_ENDPOINT, {
            retryCount: 5,
            retryDelay: 1000,
        }),
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