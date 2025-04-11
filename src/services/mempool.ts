import { type PublicClient, decodeAbiParameters } from 'viem';
import { formatEther, parseAbiParameters } from 'viem';

// Common DEX method signatures for swaps
const SWAP_SIGNATURES = {
    // PancakeSwap, Uniswap, etc.
    'swapExactTokensForTokens': '0x38ed1739',
    'swapExactTokensForETH': '0x18cbafe5',
    'swapExactETHForTokens': '0x7ff36ab5',
    'swapTokensForExactTokens': '0x8803dbee',
    'swapExactTokensForTokensSupportingFeeOnTransferTokens': '0x5c11d795',
    'swapExactETHForTokensSupportingFeeOnTransferTokens': '0xb6f9de95',
    'swapExactTokensForETHSupportingFeeOnTransferTokens': '0x791ac947',
};

// Known DEX router addresses on BSC
const DEX_ROUTERS = {
    PANCAKESWAP_V2: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    PANCAKESWAP_V3: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
    BISWAP: '0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8',
    // Add more DEX routers as needed
};

// Then in the isSwapTransaction function:
const isSwapTransaction = (input: string, to: string): boolean => {
    if (!input || input.length < 10) return false;
    const methodSignature = input.slice(0, 10).toLowerCase();
    const isDexRouter = Object.values(DEX_ROUTERS).some(
        router => router.toLowerCase() === to.toLowerCase()
    );
    return isDexRouter && Object.values(SWAP_SIGNATURES).some(
        sig => sig.toLowerCase() === methodSignature
    );
};

export async function watchPendingTransactions(client: PublicClient) {
    console.log('Starting BSC mempool swap monitor...');

    try {
        const unwatch = await client.watchPendingTransactions({
            onTransactions: async (transactions) => {
                for (const hash of transactions) {
                    try {
                        const tx = await client.getTransaction({ hash });

                        // Skip if not a contract interaction or no input data
                        if (!tx.to || !tx.input || tx.input === '0x') continue;

                        // Check if it's a swap transaction
                        if (isSwapTransaction(tx.input, tx.to)) {
                            console.log({
                                timestamp: new Date().toISOString(),
                                hash: tx.hash,
                                from: tx.from,
                                to: tx.to,
                                value: formatEther(tx.value),
                                gasPrice: formatEther(tx.gasPrice || 0n),
                                methodSignature: tx.input.slice(0, 10),
                            });
                        }
                        else {
                            console.log(`Non-swap transaction detected: ${tx.hash}`);
                        }
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