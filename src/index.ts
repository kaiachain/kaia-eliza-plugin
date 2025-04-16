import type { Plugin } from "@elizaos/core";
import { getOnChainActions } from "./actions";
import { getWalletClient, getWalletProvider } from "./wallet";

async function createKaiaPlugin(
    config: any
): Promise<Plugin> {
    const walletClient = getWalletClient(config);
    const actions = await getOnChainActions(walletClient, config);
    console.log(actions);

    return {
        name: "kaia",
        description: "Kaia blockchain integration plugin",
        providers: [getWalletProvider(walletClient)],
        evaluators: [],
        services: [],
        actions: actions,
    };
}

export default createKaiaPlugin;
