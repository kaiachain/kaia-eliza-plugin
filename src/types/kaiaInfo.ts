export interface GetKaiaInfoResponse {
    klay_price: {
        usd_price: string;
        btc_price: string;
        usd_price_changes: string;
        market_cap: string;
        total_supply: string;
        volume: string;
    };
}