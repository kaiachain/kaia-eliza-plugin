import type { GetKaiaInfoResponse } from "../types/kaiaInfo";
import { BaseService } from "./base";

export class KaiaInfoService extends BaseService {
    getKaiaInfo = async (): Promise<GetKaiaInfoResponse> => {
        if (!this.config.apiKey) {
            throw new Error("Invalid parameters");
        }
        
        try {
            const url = new URL(`${this.config.baseUrl}/kaia`);
        
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${this.config.apiKey}`,
                },
            });
        
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }
        
            const data = await response.json();
        
            return data ;
        } catch (error) {
            console.error("KaiaScan API Error:", error.message);
            throw error;
        }
    }
}