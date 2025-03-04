import { composeContext, elizaLogger } from "@elizaos/core";
import { generateMessageResponse } from "@elizaos/core";
import {
    type Action,
    type ActionExample,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
} from "@elizaos/core";
import { validateKaiaScanConfig } from "../../environment";
import { getTransactionsByBlockExamples } from "../../examples/getTransactionsByBlock";
import { KaiaScanService } from "../../services";
import { API_DEFAULTS } from "../../constants";
import { getTransactionsByBlockNumberTemplate } from "../../templates/getTransactionsByBlockNumber";

export const getTransactionsByBlockNumberAction: Action = {
    name: "GET_TRANSACTIONS_BY_BLOCK_NUMBER",
    similes: [
        "GET_TRANSACTIONS_BY_BLOCK_NUMBER",
        "GET_TRANSACTIONS_BY_BLOCK",
        "KAIA_TRANSACTIONS_BY_BLOCK",
        "CHECK_TRANSACTIONS_BY_BLOCK_NUMBER",
    ],
    description: "Get the transactions by block number",
    validate: async (runtime: IAgentRuntime) => {
        await validateKaiaScanConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        // Initialize/update state
        if (!state) {
            state = (await runtime.composeState(message)) as State;
        }
        state = await runtime.updateRecentMessageState(state);

        // state -> context
        const txnContext = composeContext({
            state,
            template: getTransactionsByBlockNumberTemplate,
        });

        // context -> content
        const content = await generateMessageResponse({
            runtime,
            context: txnContext,
            modelClass: ModelClass.SMALL,
        });

        // parse content
        const hasNetwork = content?.network && !content?.error;

        if (!hasNetwork) {
            return;
        }
        console.log(content);
        const hasBlockNumber = content?.blocknumber && !content?.error;

        if (!hasBlockNumber) {
            return;
        }

        // Instantiate API service
        const config = await validateKaiaScanConfig(runtime);
        const kaiaScanService = new KaiaScanService({
            apiKey: config.KAIA_KAIASCAN_API_KEY,
            baseUrl: API_DEFAULTS.BASE_URL[String(content.network)],
        });

        // Fetch Account Balance & respond
        try {
            const kaiaScanData =
                await kaiaScanService.getTransactionsByBlockNumber(
                    String(content.blocknumber)
                );
            elizaLogger.success(
                `Successfully fetched transactions for ${content.blocknumber} on ${content.network}`
            );

            if (callback) {
                let BlockTransactions;
                if (kaiaScanData && kaiaScanData.results.length > 0) {
                    kaiaScanData.results.map((transaction, index) => {
                        if (index > 5) return;
                        BlockTransactions += ` ----------------------------------- \n`;
                        BlockTransactions += `${index + 1}:\n`;
                        BlockTransactions += `from: ${transaction.from},\n`;
                        BlockTransactions += `to: ${transaction.to}, \n`;
                        BlockTransactions += `value: ${transaction.amount}, \n`;
                        BlockTransactions += `type: ${transaction.transaction_type}, \n`;
                        BlockTransactions += `hash: ${transaction.transaction_hash}\n`;
                    });
                } else {
                    BlockTransactions = "No transactions found for this block";
                }
                console.log(BlockTransactions);
                callback({
                    text: `The transactions in a block for ${content.blocknumber} on ${content.network} is ${BlockTransactions}`,
                    content: kaiaScanData,
                });

                return true;
            }
        } catch (error) {
            elizaLogger.error(
                "Error in GET_TRANSACTIONS_BY_BLOCK_NUMBER handler:",
                error
            );

            callback({
                text: `Error fetching transactions of a block info: ${error.message}`,
                content: { error: error.message },
            });

            return false;
        }

        return;
    },
    examples: getTransactionsByBlockExamples as ActionExample[][],
} as Action;
