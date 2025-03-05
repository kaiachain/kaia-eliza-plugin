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
import { getAccountOverviewExamples } from "../../examples/getAccountOverview";
import { KaiaScanService } from "../../services";
import { API_DEFAULTS } from "../../constants";

export const getAccountOverviewAction: Action = {
    name: "GET_ACCOUNT_OVERVIEW",
    similes: [
        "ACCOUNT_OVERVIEW",
        "KAIA_ACCOUNT_OVERVIEW",
        "CHECK_ACCOUNT_OVERVIEW",
        "CHECKOUT_ACCOUNT_OVERVIEW",
        "CHECK_ACCOUNT",
        "ACCOUNT",
        "OVERVIEW",
    ],
    description: "Get the Account Overview for a given address",
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
        const accOverviewContext = composeContext({
            state,
            template: getAddressTemplate,
        });

        // context -> content
        const content = await generateMessageResponse({
            runtime,
            context: accOverviewContext,
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

        // Fetch Account Overview & respond
        try {
            const kaiaScanData = await kaiaScanService.getAccountOverview(
                String(content?.address || "")
            );
            elizaLogger.success(
                `Successfully fetched Account Overview for ${content.address}`
            );

            if (callback) {
                let responseText = `Here are the details \nAccount Details:\n`;
                responseText += `Address: ${kaiaScanData.address}\n`;
                responseText += `Account Type: ${kaiaScanData.account_type}\n`;
                responseText += `Balance: ${kaiaScanData.balance}\n`;
                responseText += `Total Transaction Count: ${kaiaScanData.total_transaction_count}\n`;

                callback({
                    text: responseText,
                    content: kaiaScanData,
                });

                return true;
            }
        } catch (error) {
            elizaLogger.error("Error in GET_ACCOUNT_OVERVIEW handler:", error);

            if(error instanceof Error) {
                callback({
                    text: `Error fetching account overview: ${error.message}`,
                    content: { error: error.message },
                });
            }
            

            return false;
        }

        return;
    },
    examples: getAccountOverviewExamples as ActionExample[][],
} as Action;
