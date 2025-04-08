interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gasLimit: string;
    nonce: number;
    inputData: string;
    timestamp: number;
}

export type { Transaction };