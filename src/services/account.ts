import type { GetAccountResponse } from "../types/account";
import { BaseService } from "./base";

export class AccountService extends BaseService {

    getCurrentBalance = async (
        accountAddress: string
      ): Promise<GetAccountResponse> => {
        if (!this.config.apiKey || !accountAddress) {
          throw new Error("Invalid parameters");
        }

        if(!this.config.baseUrl) {
            throw new Error("Invalid network");
        }
        
        try {
          const url = new URL(`${this.config.baseUrl}/accounts/${accountAddress}`);
      
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

      getNFTBalance = async (
        accountAddress: string
      ): Promise<GetAccountResponse> => {
        if (!this.config.apiKey || !accountAddress) {
          throw new Error("Invalid parameters");
        }

        if(!this.config.baseUrl) {
            throw new Error("Invalid network");
        }
              
        try {
          const url = new URL(`${this.config.baseUrl}/accounts/${accountAddress}/nft-balances/kip17`);
      
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

      getFTBalanceDetails = async (
        accountAddress: string
      ): Promise<GetAccountResponse> => {
        if (!this.config.apiKey || !accountAddress) {
          throw new Error("Invalid parameters");
        }

        if(!this.config.baseUrl) {
            throw new Error("Invalid network");
        }
              
        try {
          const url = new URL(`${this.config.baseUrl}/accounts/${accountAddress}/token-details`);
      
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

      getAccountOverview = async (
        accountAddress: string
      ): Promise<GetAccountResponse> => {
        if (!this.config.apiKey || !accountAddress) {
          throw new Error("Invalid parameters");
        }

        if(!this.config.baseUrl) {
            throw new Error("Invalid network");
        }
              
        try {
          const url = new URL(`${this.config.baseUrl}/accounts/${accountAddress}`);
      
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