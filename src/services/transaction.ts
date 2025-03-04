import type {
  GetLatestBlockResponse,
  GetBlockResponse,
  GetTransactionsByBlockNumber,
  GetTransactionsByAccount,
} from "../types";
import { BaseService } from "./base";

export class TransactionService extends BaseService {
  getLatestBlock = async (): Promise<GetLatestBlockResponse> => {
    if (!this.config.apiKey) {
      throw new Error("Invalid parameters");
    }

    if (!this.config.baseUrl) {
      throw new Error("Invalid network");
    }

    try {
      const url = new URL(`${this.config.baseUrl}/blocks/latest`);

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

      return data;
    } catch (error) {
      console.error("KaiaScan API Error:", error.message);
      throw error;
    }
  };

  getBlock = async (blockNumber: string): Promise<GetBlockResponse> => {
    if (!this.config.apiKey) {
      throw new Error("Invalid parameters");
    }

    if (!this.config.baseUrl) {
      throw new Error("Invalid network");
    }

    if (!blockNumber) {
      throw new Error("Invalid Block Number");
    }

    try {
      const url = new URL(`${this.config.baseUrl}/blocks/${blockNumber}`);

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

      return data;
    } catch (error) {
      console.error("KaiaScan API Error:", error.message);
      throw error;
    }
  };

  getTransactionsByBlockNumber = async (
    blockNumber: string
  ): Promise<GetTransactionsByBlockNumber> => {
    if (!this.config.apiKey) {
      throw new Error("Invalid parameters");
    }

    if (!this.config.baseUrl) {
      throw new Error("Invalid network");
    }

    if (!blockNumber) {
      throw new Error("Invalid Block Number");
    }

    try {
      const url = new URL(
        `${this.config.baseUrl}/transactions?blockNumberStart=${blockNumber}&blockNumberEnd=${blockNumber}`
      );

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

      return data;
    } catch (error) {
      console.error("KaiaScan API Error:", error.message);
      throw error;
    }
  };

  getTransactionsByAccount = async (
    address: string
  ): Promise<GetTransactionsByAccount> => {
    if (!this.config.apiKey) {
      throw new Error("Invalid parameters");
    }

    if (!this.config.baseUrl) {
      throw new Error("Invalid network");
    }

    if (!address) {
      throw new Error("Invalid Address");
    }

    try {
      const url = new URL(
        `${this.config.baseUrl}/accounts/${address}/transactions`
      );

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

      return data;
    } catch (error) {
      console.error("KaiaScan API Error:", error.message);
      throw error;
    }
  };
}
