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
import { getLatestBlockExamples } from "../../examples/getLatestBlock";
import { KaiaScanService } from "../../services";
import { API_DEFAULTS } from "../../constants";
import { getBlockNumberTemplate } from "../../templates/getBlockNumber";

export const getBlockAction: Action = {
    name: "GET_BLOCK",
    similes: [
        "BLOCK_INFO",
        "KAIA_GET_BLOCK",
        "CHECK_KAIA_GET_BLOCK",
        "CHECK_GET_BLOCK",
    ],
    description: "Get the block info for a given block number",
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
            template: getBlockNumberTemplate,
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
            const kaiaScanData = await kaiaScanService.getBlock(
                String(content.blocknumber)
            );
            elizaLogger.success(
                `Successfully fetched block info for ${content.blocknumber} on ${content.network}`
            );

            if (callback) {
                let blockInfo = `Block Number: ${kaiaScanData.block_id}\n`;
                blockInfo += `Block Time: ${kaiaScanData.datetime}\n`;
                blockInfo += `Block Hash: ${kaiaScanData.hash}\n`;
                blockInfo += `Total Transaction Count: ${kaiaScanData.total_transaction_count}`;
                callback({
                    text: `The block info for ${content.blocknumber} on ${content.network} is ${blockInfo}`,
                    content: kaiaScanData,
                });

                return true;
            }
        } catch (error) {
            elizaLogger.error("Error in GET_BLOCK handler:", error);

            callback({
                text: `Error fetching block info: ${error.message}`,
                content: { error: error.message },
            });

            return false;
        }

        return;
    },
    examples: getLatestBlockExamples as ActionExample[][],
} as Action;
