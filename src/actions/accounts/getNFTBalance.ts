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
import { getNFTBalanceExamples } from "../../examples/getNFTBalance";
import { KaiaScanService } from "../../services";
import { API_DEFAULTS } from "../../constants";
import { GetAccountResponse, Contract } from "../../types";

export const getNFTBalanceAction: Action = {
    name: "GET_NFT_BALANCE",
    similes: [
        "NFT_BALANCE",
        "NFT",
        "KAIA_NFT_BALANCE",
        "CHECK_NFT_BALANCE",
        "CHECK_NFT",
        "NFTS",
        "NON_FUNGIBLE_TOKENS",
        "NON_FUNGIBLE_TOKEN_BALANCE",
    ],
    description: "Get the NFT balance for a given address",
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
        const nFTalanceContext = composeContext({
            state,
            template: getAddressTemplate,
        });

        // context -> content
        const content = await generateMessageResponse({
            runtime,
            context: nFTalanceContext,
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

        // Fetch NFT Balance & respond
        try {
            const kaiaScanData: GetAccountResponse = await kaiaScanService.getNFTBalance(
                String(content?.address || "")
            );
            elizaLogger.success(
                `Successfully fetched NFT for ${content.address}`
            );

            if (callback) {
                const totalCount = kaiaScanData.paging.total_count;
                let responseText = `Your account has ${totalCount} NFT Collections. They are as follows:\n`;

                kaiaScanData.results.forEach((item: Contract, index: number) => {
                    responseText += `${index + 1}. Contract address - ${item.contract.contract_address} | Token count - ${item.token_count}\n`;
                });

                callback({
                    text: responseText,
                    content: kaiaScanData,
                });

                return true;
            }
        } catch (error) {
            elizaLogger.error("Error in GET_NFT_BALANCE handler:", error);

            if(error instanceof Error) {
                callback({
                    text: `Error fetching NFT Balance: ${error.message}`,
                    content: { error: error.message },
                });
            }

            return false;
        }

        return;
    },
    examples: getNFTBalanceExamples as ActionExample[][],
} as Action;
