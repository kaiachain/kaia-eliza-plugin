import type { Plugin } from "@elizaos/core";
import {
    getCurrentBalanceAction,
    getNFTBalanceAction,
    getFTBalanceDetailsAction,
    getAccountOverviewAction,
    faucetAction,
    getLatestBlockAction,
    transferAction,
    getBlockAction,
    getTransactionsByAccountAction,
    getKaiaInfoAction,
} from "./actions";
import { kaiaWalletProvider } from "./providers/wallet";

export * as actions from "./actions";

export const kaiaPlugin: Plugin = {
    name: "kaia",
    description: "Kaia blockchain integration plugin",
    actions: [
        getLatestBlockAction,
        getNFTBalanceAction,
        getFTBalanceDetailsAction,
        getCurrentBalanceAction,
        getAccountOverviewAction,
        faucetAction,
        transferAction,
        getBlockAction,
        getTransactionsByAccountAction,
        getKaiaInfoAction,
    ],
    evaluators: [],
    providers: [kaiaWalletProvider],
};
export default kaiaPlugin;
