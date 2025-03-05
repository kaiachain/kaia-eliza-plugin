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
import { getFTBalanceDetailsExamples } from "../../examples/getFTBalanceDetails";
import { KaiaScanService } from "../../services";
import { API_DEFAULTS } from "../../constants";
import { GetAccountResponse, Contract } from "../../types";

export const getFTBalanceDetailsAction: Action = {
    name: "GET_FT_BALANCE_DETAILS",
    similes: [
        "FUNGIBLE_TOKEN_BALANCE",
        "FT_BALANCE",
        "KAIA_FT_BALANCE",
        "CHECK_FT_BALANCE",
        "CHECK_FT",
        "FT",
    ],
    description: "Get the Fungible Balance for a given address",
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
        const fTBalanceContext = composeContext({
            state,
            template: getAddressTemplate,
        });

        // context -> content
        const content = await generateMessageResponse({
            runtime,
            context: fTBalanceContext,
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

        // Fetch Fungible Token Details & respond
        try {
            const kaiaScanData: GetAccountResponse = await kaiaScanService.getFTBalanceDetails(
                String(content?.address || "")
            );
            elizaLogger.success(
                `Successfully fetched FT for ${content.address}`
            );

            if (callback) {
                const totalCount = kaiaScanData.paging.total_count;
                let responseText: string = `Your account has ${totalCount} FTs. They are as follows:\n`;

                kaiaScanData.results.forEach((item: Contract, index: number) => {
                    responseText += `${index + 1}. Contract address = ${item.contract.contract_address} | symbol = ${item.contract.symbol} | name = ${item.contract.name} | total supply = ${item.contract.total_supply} | balance = ${item.balance}\n`;
                });

                callback({
                    text: responseText,
                    content: kaiaScanData,
                });

                return true;
            }
        } catch (error) {
            elizaLogger.error(
                "Error in GET_FT_BALANCE_DETAILS handler:",
                error
            );
            if(error instanceof Error) {
                callback({
                    text: `Error fetching FT Balance: ${error.message}`,
                    content: { error: error.message },
                });
            }

            return false;
        }

        return;
    },
    examples: getFTBalanceDetailsExamples as ActionExample[][],
} as Action;
