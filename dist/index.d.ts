import { Action, ICacheManager, Plugin } from '@elizaos/core';
import { Address, Hash, Chain, PrivateKeyAccount, PublicClient, HttpTransport, Account, WalletClient } from 'viem';
import * as viemChains from 'viem/chains';

declare const getCurrentBalanceAction: Action;

declare const getNFTBalanceAction: Action;

declare const getFTBalanceDetailsAction: Action;

declare const getAccountOverviewAction: Action;

declare const _SupportedChainList: Array<keyof typeof viemChains>;
type SupportedChain = (typeof _SupportedChainList)[number];
interface Transaction {
    hash: Hash;
    from: Address;
    to: Address;
    value: bigint;
    data?: `0x${string}`;
    chainId?: number;
}
interface TransferParams {
    fromChain: SupportedChain;
    toAddress: Address;
    amount: string;
    data?: `0x${string}`;
}

declare class WalletProvider {
    private cacheManager;
    private cache;
    private cacheKey;
    private currentChain;
    private CACHE_EXPIRY_SEC;
    chains: Record<string, Chain>;
    account: PrivateKeyAccount;
    constructor(accountOrPrivateKey: PrivateKeyAccount | `0x${string}`, cacheManager: ICacheManager, chains?: Record<string, Chain>);
    getAddress(): Address;
    getCurrentChain(): Chain;
    getPublicClient(chainName: SupportedChain): PublicClient<HttpTransport, Chain, Account | undefined>;
    getWalletClient(chainName: SupportedChain): WalletClient;
    getChainConfigs(chainName: SupportedChain): Chain;
    getWalletBalance(): Promise<string | null>;
    getWalletBalanceForChain(chainName: SupportedChain): Promise<string | null>;
    addChain(chain: Record<string, Chain>): void;
    switchChain(chainName: SupportedChain, customRpcUrl?: string): void;
    private readFromCache;
    private writeToCache;
    private getCachedData;
    private setCachedData;
    private setAccount;
    private setChains;
    private setCurrentChain;
    private createHttpTransport;
    static genChainFromName(chainName: string, customRpcUrl?: string | null): Chain;
}

declare class TransferAction {
    private walletProvider;
    constructor(walletProvider: WalletProvider);
    transfer(params: TransferParams): Promise<Transaction>;
}
declare const transferAction: Action;

declare class FaucetAction {
    private walletProvider;
    constructor(walletProvider: WalletProvider);
    transfer(params: TransferParams): Promise<Transaction>;
}
declare const faucetAction: Action;

declare const getLatestBlockAction: Action;

declare const getBlockAction: Action;

declare const getTransactionsByAccountAction: Action;

declare const getKaiaInfoAction: Action;

type index_FaucetAction = FaucetAction;
declare const index_FaucetAction: typeof FaucetAction;
type index_TransferAction = TransferAction;
declare const index_TransferAction: typeof TransferAction;
declare const index_faucetAction: typeof faucetAction;
declare const index_getAccountOverviewAction: typeof getAccountOverviewAction;
declare const index_getBlockAction: typeof getBlockAction;
declare const index_getCurrentBalanceAction: typeof getCurrentBalanceAction;
declare const index_getFTBalanceDetailsAction: typeof getFTBalanceDetailsAction;
declare const index_getKaiaInfoAction: typeof getKaiaInfoAction;
declare const index_getLatestBlockAction: typeof getLatestBlockAction;
declare const index_getNFTBalanceAction: typeof getNFTBalanceAction;
declare const index_getTransactionsByAccountAction: typeof getTransactionsByAccountAction;
declare const index_transferAction: typeof transferAction;
declare namespace index {
  export { index_FaucetAction as FaucetAction, index_TransferAction as TransferAction, index_faucetAction as faucetAction, index_getAccountOverviewAction as getAccountOverviewAction, index_getBlockAction as getBlockAction, index_getCurrentBalanceAction as getCurrentBalanceAction, index_getFTBalanceDetailsAction as getFTBalanceDetailsAction, index_getKaiaInfoAction as getKaiaInfoAction, index_getLatestBlockAction as getLatestBlockAction, index_getNFTBalanceAction as getNFTBalanceAction, index_getTransactionsByAccountAction as getTransactionsByAccountAction, index_transferAction as transferAction };
}

declare const kaiaPlugin: Plugin;

export { index as actions, kaiaPlugin as default, kaiaPlugin };
