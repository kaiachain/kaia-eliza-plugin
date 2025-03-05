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
import { getAddressTemplate } from "../../templates/getAddress";
import { getCurrentBalanceExamples } from "../../examples/getCurrentBalance";
import { KaiaScanService } from "../../services";
import { API_DEFAULTS } from "../../constants";

export const getCurrentBalanceAction: Action = {
    name: "GET_CURRENT_BALANCE",
    similes: [
        "BALANCE",
        "KAIA_BALANCE",
        "CHECK_KAIA_BALANCE",
        "CHECK_BALANCE",
        "CHECKOUT_BALANCE",
        "CHECK_FUNDS",
        "FUNDS",
    ],
    description: "Get the current balance for a given address",
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
        const balanceContext = composeContext({
            state,
            template: getAddressTemplate,
        });

        // context -> content
        const content = await generateMessageResponse({
            runtime,
            context: balanceContext,
            modelClass: ModelClass.SMALL,
        });

        // parse content
        const hasAddress = content?.address && !content?.error;

        if (!hasAddress) {
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
            const kaiaScanData = await kaiaScanService.getCurrentBalance(
                String(content?.address || "")
            );
            elizaLogger.success(
                `Successfully fetched balance for ${content.address}`
            );

            if (callback) {
                callback({
                    text: `The current balance of ${content.address} is ${kaiaScanData.balance} KAIA on ${String(content.network)}`,
                    content: kaiaScanData,
                });

                return true;
            }
        } catch (error) {
            elizaLogger.error("Error in GET_CURRENT_BALANCE handler:", error);
            if(error instanceof Error) {
                callback({
                    text: `Error fetching balance: ${error.message}`,
                    content: { error: error.message },
                });
            }

            return false;
        }

        return;
    },
    examples: getCurrentBalanceExamples as ActionExample[][],
} as Action;
