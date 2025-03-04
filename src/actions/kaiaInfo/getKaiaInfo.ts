import { elizaLogger } from "@elizaos/core";
import {
    type Action,
    type ActionExample,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@elizaos/core";
import { validateKaiaScanConfig } from "../../environment";
import { getKaiaInfoExamples } from "../../examples/getKaiaInfo";
import { KaiaScanService } from "../../services";
import { API_DEFAULTS } from "../../constants";

export const getKaiaInfoAction: Action = {
    name: "GET_KAIA_INFO",
    similes: [
        "KAIA_INFO",
        "KAIA",
        "INFO",
        "KAIA_PRICE",
        "PRICE",
        "KAIA_MARKET",
        "MARKET",
        "KAIA_MARKET_INFO",
        "MARKET_INFO",
        "KAIA_USD_PRICE",
        "USD_PRICE",
        "KAIA_BTC_PRICE",
        "BTC_PRICE",
        "KAIA_MARKET_CAP",
        "KAIA_TOTAL_SUPPLY",
        "TOTAL_SUPPLY",
        "KAIA_VOLUME",
        "VOLUME",
        "KAIA_OVERVIEW",
        "OVERVIEW_OF_KAIA",
        "PRICE_OF_KAIA",
    ],
    description: "Get the current info about Kaia Token",
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

        // Instantiate API service
        const config = await validateKaiaScanConfig(runtime);
        const kaiaScanService = new KaiaScanService({
            apiKey: config.KAIA_KAIASCAN_API_KEY,
            baseUrl: API_DEFAULTS.BASE_URL.kaia,
        });

        // Fetch Account Balance & respond
        try {
            const kaiaScanData = await kaiaScanService.getKaiaInfo();
            elizaLogger.success(`Successfully fetched Kaia Token Info`);

            if (callback) {
                let responseText = `Kaia Token Info:\n`;
                responseText += `- USD Price: ${kaiaScanData.klay_price.usd_price}\n`;
                responseText += `- BTC Price: ${kaiaScanData.klay_price.btc_price}\n`;
                responseText += `- USD Price Changes: ${kaiaScanData.klay_price.usd_price_changes}\n`;
                responseText += `- Market Cap: ${kaiaScanData.klay_price.market_cap}\n`;
                responseText += `- Total Supply: ${kaiaScanData.klay_price.total_supply}\n`;
                responseText += `- Volume: ${kaiaScanData.klay_price.volume}\n`;
                callback({
                    text: responseText,
                    content: kaiaScanData,
                });

                return true;
            }
        } catch (error) {
            elizaLogger.error("Error in GET_KAIA_INFO handler:", error);

            callback({
                text: `Error fetching Kaia Info: ${error.message}`,
                content: { error: error.message },
            });

            return false;
        }

        return;
    },
    examples: getKaiaInfoExamples as ActionExample[][],
} as Action;
