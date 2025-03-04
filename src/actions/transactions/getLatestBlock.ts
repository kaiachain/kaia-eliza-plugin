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
import { getNetworkTemplate } from "../../templates/getNetwork";
import { getLatestBlockExamples } from "../../examples/getLatestBlock";
import { KaiaScanService } from "../../services";
import { API_DEFAULTS } from "../../constants";

export const getLatestBlockAction: Action = {
    name: "GET_LATEST_BLOCK",
    similes: [
        "BLOCK_HEIGHT",
        "KAIA_BLOCK_HEIGHT",
        "CHECK_KAIA_LATEST_BLOCK",
        "CHECK_LATEST_BLOCK",
        "CHECK_KAIA_LATEST_BLOCK_HEIGHT",
        "CHECKOUT_LATEST_BLOCK",
        "CHECK_BLOCK_HEIGHT",
        "LATEST_BLOCK",
        "LATEST_BLOCK_NUMBER",
        "CHECK_LATEST_BLOCK_NUMBER",
        "CHECK_KAIA_LATEST_BLOCK_NUMBER",
    ],
    description: "Get the latest block number for a given network",
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
            template: getNetworkTemplate,
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

        // Instantiate API service
        const config = await validateKaiaScanConfig(runtime);
        const kaiaScanService = new KaiaScanService({
            apiKey: config.KAIA_KAIASCAN_API_KEY,
            baseUrl: API_DEFAULTS.BASE_URL[String(content.network)],
        });

        // Fetch Account Balance & respond
        try {
            const kaiaScanData = await kaiaScanService.getLatestBlock();
            elizaLogger.success(
                `Successfully fetched latest block number for ${content.network}`
            );

            if (callback) {
                callback({
                    text: `The latest block number of ${content.network} is ${kaiaScanData.block_id}`,
                    content: kaiaScanData,
                });

                return true;
            }
        } catch (error) {
            elizaLogger.error("Error in GET_LATEST_BLOCK handler:", error);

            callback({
                text: `Error fetching balance: ${error.message}`,
                content: { error: error.message },
            });

            return false;
        }

        return;
    },
    examples: getLatestBlockExamples as ActionExample[][],
} as Action;
