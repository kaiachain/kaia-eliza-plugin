import type { WalletClientBase } from "@goat-sdk/core";
import { viem } from "@goat-sdk/wallet-viem";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { kaia, kairos } from "viem/chains";

// Add the chain you want to use, remember to update also
// the EVM_PROVIDER_URL to the correct one for the chain

export function getWalletClient(
    config: any
) {
    const privateKey = config.KAIA_EVM_PRIVATE_KEY;
    if (!privateKey) return null;

    const chain = config.KAIA_NETWORK == "kaia" ? kaia : kairos;

    const provider = chain.rpcUrls.default.http[0];
    
    const wallet = createWalletClient({
        account: privateKeyToAccount(privateKey as `0x${string}`),
        chain: chain,
        transport: http(provider),
    });

    return viem(wallet);
}

export function getWalletProvider(walletClient: WalletClientBase) {
    return {
        async get(): Promise<string | null> {
            try {
                const address = walletClient.getAddress();
                const balance = await walletClient.balanceOf(address);
                return `EVM Wallet Address: ${address}\nBalance: ${balance} ETH`;
            } catch (error) {
                console.error("Error in EVM wallet provider:", error);
                return null;
            }
        },
    };
}
