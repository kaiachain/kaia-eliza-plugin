import { ByteArray, formatEther, parseEther, type Hex } from "viem";
import {
    Action,
    ActionExample,
    composeContext,
    generateObjectDeprecated,
    HandlerCallback,
    ModelClass,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core";

import { initWalletProvider, WalletProvider } from "../../providers/wallet";
import type {
    Transaction,
    TransferParams,
    SupportedChain,
} from "../../types/account";
import { faucetTemplate } from "../../templates/faucet";
import { faucetExamples } from "../../examples/faucet";

const fromChain: SupportedChain = "kairos";
const DEFAULT_FAUCET_AMOUNT = "1"; // in KAIA

// Exported for tests
export class FaucetAction {
    constructor(private walletProvider: WalletProvider) {}

    async transfer(params: TransferParams): Promise<Transaction> {
        console.log(
            `Transferring Some Kaia Test tokens to (${params.toAddress} on ${fromChain})`
        );

        if (!params.data) {
            params.data = "0x";
        }

        const walletClient = this.walletProvider.getWalletClient(fromChain);

        try {
            const hash = await walletClient.sendTransaction({
                account: walletClient.account,
                to: params.toAddress,
                value: parseEther(params.amount),
                data: params.data as Hex,
                kzg: {
                    blobToKzgCommitment: function (): ByteArray {
                        throw new Error("Function not implemented.");
                    },
                    computeBlobKzgProof: function (): ByteArray {
                        throw new Error("Function not implemented.");
                    },
                },
                chain: undefined,
            });

            return {
                hash,
                from: walletClient.account.address,
                to: params.toAddress,
                value: parseEther(params.amount),
                data: params.data as Hex,
            };
        } catch (error) {
            throw new Error(`Transfer failed: ${error.message}`);
        }
    }
}

const buildTransferDetails = async (
    state: State,
    runtime: IAgentRuntime,
    wp: WalletProvider
): Promise<TransferParams> => {
    const chains = Object.keys(wp.chains);
    state.supportedChains = chains.map((item) => `"${item}"`).join("|");

    const context = composeContext({
        state,
        template: faucetTemplate,
    });

    const transferDetails = (await generateObjectDeprecated({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    })) as TransferParams;

    const existingChain = wp.chains[fromChain];

    if (!existingChain) {
        throw new Error(
            "The chain " +
                fromChain +
                " not configured yet. Add the chain or choose one from configured: " +
                chains.toString()
        );
    }

    return transferDetails;
};

export const faucetAction: Action = {
    name: "FAUCET",
    description: "Transfer some kaia test tokens to an address on Kaia testnet",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        } else {
            state = await runtime.updateRecentMessageState(state);
        }

        console.log("Faucet Transfer action handler called");
        const walletProvider = await initWalletProvider(runtime);
        const faucetAmount = runtime.getSetting("KAIA_FAUCET_AMOUNT") || DEFAULT_FAUCET_AMOUNT;
        const action = new FaucetAction(walletProvider);

        // Compose transfer context
        const paramOptions = await buildTransferDetails(
            state,
            runtime,
            walletProvider
        );

        paramOptions.amount = faucetAmount;

        try {
            const transferResp = await action.transfer(paramOptions);
            if (callback) {
                callback({
                    text: `Successfully transferred ${paramOptions.amount} test tokens to ${paramOptions.toAddress}\nTransaction Hash: ${transferResp.hash}`,
                    content: {
                        success: true,
                        hash: transferResp.hash,
                        amount: formatEther(transferResp.value),
                        recipient: transferResp.to,
                        chain: fromChain,
                    },
                });
            }
            return true;
        } catch (error) {
            console.error("Error during faucet token transfer:", error);
            if (callback) {
                callback({
                    text: `Error transferring faucet tokens: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    validate: async (runtime: IAgentRuntime) => {
        const privateKey = runtime.getSetting("KAIA_EVM_PRIVATE_KEY");
        return typeof privateKey === "string" && privateKey.startsWith("0x");
    },
    examples: faucetExamples as ActionExample[][],
    similes: [
        "SEND_FAUCET_TOKENS",
        "GET_FAUCET_TOKENS",
        "MOVE_FAUCET_TOKENS",
        "SEND_TEST_TOKENS",
        "GET_TEST_TOKENS",
        "MOVE_TEST_TOKENS",
    ],
};
