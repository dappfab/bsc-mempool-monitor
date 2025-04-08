import { type PublicClient } from 'viem';
import { formatEther } from 'viem';

export async function watchPendingTransactions(client: PublicClient) {
    console.log('Starting BSC mempool monitor...');

    try {
        const unwatch = await client.watchPendingTransactions({
            onTransactions: async (transactions) => {
                for (const hash of transactions) {
                    try {
                        const tx = await client.getTransaction({ hash });
                        console.log({
                            timestamp: new Date().toISOString(),
                            hash: tx.hash,
                            from: tx.from,
                            to: tx.to,
                            value: formatEther(tx.value),
                            gasPrice: formatEther(tx.gasPrice || 0n),
                        });
                    } catch (error) {
                        console.error(`Error fetching transaction ${hash}:`, error);
                    }
                }
            },
            onError: (error) => {
                console.error('WebSocket error:', error);
            }
        });

        // Keep the process running
        await new Promise((resolve) => {
            process.on('SIGINT', () => {
                console.log('\nStopping mempool monitor...');
                unwatch();
                resolve(true);
            });
        });

    } catch (error) {
        console.error('Fatal error in mempool monitor:', error);
        throw error;
    }
}