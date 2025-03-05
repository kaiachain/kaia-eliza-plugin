var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/actions/index.ts
var actions_exports = {};
__export(actions_exports, {
  FaucetAction: () => FaucetAction,
  TransferAction: () => TransferAction,
  faucetAction: () => faucetAction,
  getAccountOverviewAction: () => getAccountOverviewAction,
  getBlockAction: () => getBlockAction,
  getCurrentBalanceAction: () => getCurrentBalanceAction,
  getFTBalanceDetailsAction: () => getFTBalanceDetailsAction,
  getKaiaInfoAction: () => getKaiaInfoAction,
  getLatestBlockAction: () => getLatestBlockAction,
  getNFTBalanceAction: () => getNFTBalanceAction,
  getTransactionsByAccountAction: () => getTransactionsByAccountAction,
  transferAction: () => transferAction
});

// src/actions/accounts/getCurrentBalance.ts
import { composeContext, elizaLogger } from "@elizaos/core";
import { generateMessageResponse } from "@elizaos/core";
import {
  ModelClass
} from "@elizaos/core";

// src/environment.ts
import { z } from "zod";
var kaiaScanEnvSchema = z.object({
  KAIA_KAIASCAN_API_KEY: z.string().min(1, "KaiaScan API key is required")
});
async function validateKaiaScanConfig(runtime) {
  try {
    const config = {
      KAIA_KAIASCAN_API_KEY: runtime.getSetting("KAIA_KAIASCAN_API_KEY")
    };
    return kaiaScanEnvSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n");
      throw new Error(
        `KaiaScan configuration validation failed:
${errorMessages}`
      );
    }
    throw error;
  }
}

// src/templates/getAddress.ts
var getAddressTemplate = `Respond with a JSON object containing the "address" and "network". The address must be a valid Kaia EVM address provided in the input. 

IMPORTANT: Response must ALWAYS include both "address" and "network" fields.

Example responses:
\`\`\`json
{
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "network": "kairos"
}
\`\`\`
\`\`\`json
{
    "address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "network": "kaia"
}
\`\`\`
\`\`\`json
{
    "address": "0x9876543210fedcba9876543210fedcba98765432",
    "network": "kairos"
}
\`\`\`
\`\`\`json
{
    "address": "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
    "network": "kaia"
}
\`\`
{{recentMessages}}

Extract the Kaia EVM address from the most recent message. Respond with a JSON markdown block containing both "address" and "network".

If there is no mention of network in the message, assume it's the kaia.`;

// src/examples/getCurrentBalance.ts
var getCurrentBalanceExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the kaia balance like right now?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "In which address?"
      }
    },
    {
      user: "{{user1}}",
      content: {
        text: "0x4d69770905f43c07d4085dfd296a03484d05280f"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me check the current balance in 0x4d69770905f43c07d4085dfd296a03484d05280f for you.",
        action: "GET_CURRENT_BALANCE"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the balance of 0x4d69770905f43c07d4085dfd296a03484d05280f?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the current balance in 0x4d69770905f43c07d4085dfd296a03484d05280f for you.",
        action: "GET_CURRENT_BALANCE"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Is there any funds in 0x4d69770905f43c07d4085dfd296a03484d05280f?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the current balance in 0x4d69770905f43c07d4085dfd296a03484d05280f.",
        action: "GET_CURRENT_BALANCE"
      }
    }
  ]
];

// src/services/base.ts
var BaseService = class {
  constructor(config) {
    this.config = config;
  }
};

// src/services/account.ts
var AccountService = class extends BaseService {
  constructor() {
    super(...arguments);
    this.getCurrentBalance = async (accountAddress) => {
      if (!this.config.apiKey || !accountAddress) {
        throw new Error("Invalid parameters");
      }
      if (!this.config.baseUrl) {
        throw new Error("Invalid network");
      }
      try {
        const url = new URL(`${this.config.baseUrl}/accounts/${accountAddress}`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
    this.getNFTBalance = async (accountAddress) => {
      if (!this.config.apiKey || !accountAddress) {
        throw new Error("Invalid parameters");
      }
      if (!this.config.baseUrl) {
        throw new Error("Invalid network");
      }
      try {
        const url = new URL(`${this.config.baseUrl}/accounts/${accountAddress}/nft-balances/kip17`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
    this.getFTBalanceDetails = async (accountAddress) => {
      if (!this.config.apiKey || !accountAddress) {
        throw new Error("Invalid parameters");
      }
      if (!this.config.baseUrl) {
        throw new Error("Invalid network");
      }
      try {
        const url = new URL(`${this.config.baseUrl}/accounts/${accountAddress}/token-details`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
    this.getAccountOverview = async (accountAddress) => {
      if (!this.config.apiKey || !accountAddress) {
        throw new Error("Invalid parameters");
      }
      if (!this.config.baseUrl) {
        throw new Error("Invalid network");
      }
      try {
        const url = new URL(`${this.config.baseUrl}/accounts/${accountAddress}`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
};

// src/services/transaction.ts
var TransactionService = class extends BaseService {
  constructor() {
    super(...arguments);
    this.getLatestBlock = async () => {
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
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
    this.getBlock = async (blockNumber) => {
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
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
    this.getTransactionsByBlockNumber = async (blockNumber) => {
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
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
    this.getTransactionsByAccount = async (address) => {
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
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
};

// src/services/kaiaInfo.ts
var KaiaInfoService = class extends BaseService {
  constructor() {
    super(...arguments);
    this.getKaiaInfo = async () => {
      if (!this.config.apiKey) {
        throw new Error("Invalid parameters");
      }
      try {
        const url = new URL(`${this.config.baseUrl}/kaia`);
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${this.config.apiKey}`
          }
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
};

// src/services/index.ts
var KaiaScanService = class {
  constructor(config) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl
    };
    this.accountService = new AccountService(this.config);
    this.transactionService = new TransactionService(this.config);
    this.kaiaInfoService = new KaiaInfoService(this.config);
  }
  async getCurrentBalance(accountAddress) {
    return this.accountService.getCurrentBalance(accountAddress);
  }
  async getLatestBlock() {
    return this.transactionService.getLatestBlock();
  }
  async getBlock(blockNumber) {
    return this.transactionService.getBlock(blockNumber);
  }
  async getTransactionsByBlockNumber(blockNumber) {
    return this.transactionService.getTransactionsByBlockNumber(blockNumber);
  }
  async getTransactionsByAccount(blockNumber) {
    return this.transactionService.getTransactionsByAccount(blockNumber);
  }
  async getNFTBalance(accountAddress) {
    return this.accountService.getNFTBalance(accountAddress);
  }
  async getFTBalanceDetails(accountAddress) {
    return this.accountService.getFTBalanceDetails(accountAddress);
  }
  async getAccountOverview(accountAddress) {
    return this.accountService.getAccountOverview(accountAddress);
  }
  async getKaiaInfo() {
    return this.kaiaInfoService.getKaiaInfo();
  }
};

// src/constants/index.ts
var API_DEFAULTS = {
  BASE_URL: {
    "kairos": "https://kairos-oapi.kaiascan.io/api/v1",
    "kaia": "https://mainnet-oapi.kaiascan.io/api/v1"
  },
  TIMEOUT: 3e4
};

// src/actions/accounts/getCurrentBalance.ts
var getCurrentBalanceAction = {
  name: "GET_CURRENT_BALANCE",
  similes: [
    "BALANCE",
    "KAIA_BALANCE",
    "CHECK_KAIA_BALANCE",
    "CHECK_BALANCE",
    "CHECKOUT_BALANCE",
    "CHECK_FUNDS",
    "FUNDS"
  ],
  description: "Get the current balance for a given address",
  validate: async (runtime) => {
    await validateKaiaScanConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    }
    state = await runtime.updateRecentMessageState(state);
    const balanceContext = composeContext({
      state,
      template: getAddressTemplate
    });
    const content = await generateMessageResponse({
      runtime,
      context: balanceContext,
      modelClass: ModelClass.SMALL
    });
    const hasAddress = content?.address && !content?.error;
    if (!hasAddress) {
      return;
    }
    const config = await validateKaiaScanConfig(runtime);
    const kaiaScanService = new KaiaScanService({
      apiKey: config.KAIA_KAIASCAN_API_KEY,
      baseUrl: API_DEFAULTS.BASE_URL[String(content.network)]
    });
    try {
      const kaiaScanData = await kaiaScanService.getCurrentBalance(
        String(content?.address || "")
      );
      elizaLogger.success(
        `Successfully fetched balance for ${content.address}`
      );
      if (callback) {
        callback({
          text: `The current balance of ${content.address} is ${kaiaScanData.balance} KAIA on ${String(content.network)}`,
          content: kaiaScanData
        });
        return true;
      }
    } catch (error) {
      elizaLogger.error("Error in GET_CURRENT_BALANCE handler:", error);
      if (error instanceof Error) {
        callback({
          text: `Error fetching balance: ${error.message}`,
          content: { error: error.message }
        });
      }
      return false;
    }
    return;
  },
  examples: getCurrentBalanceExamples
};

// src/actions/accounts/getNFTBalance.ts
import { composeContext as composeContext2, elizaLogger as elizaLogger2 } from "@elizaos/core";
import { generateMessageResponse as generateMessageResponse2 } from "@elizaos/core";
import {
  ModelClass as ModelClass2
} from "@elizaos/core";

// src/examples/getNFTBalance.ts
var getNFTBalanceExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the NFT balance of 0x4d69770905f43c07d4085dfd296a03484d05280f?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the NFT balance in 0x4d69770905f43c07d4085dfd296a03484d05280f for you.",
        action: "GET_NFT_BALANCE"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Which NFTs are in 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me see which NFTs are in 0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t.",
        action: "GET_NFT_BALANCE"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the balance of 0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4 on kaia mainnet?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the NFT balance in 0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4 on kaia mainnet for you.",
        action: "GET_NFT_BALANCE"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the non fungible tokens balance of 0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8 on kaia mainnet?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the non fungible tokens balance in 0x9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8 on kaia mainnet for you.",
        action: "GET_NFT_BALANCE"
      }
    }
  ]
];

// src/actions/accounts/getNFTBalance.ts
var getNFTBalanceAction = {
  name: "GET_NFT_BALANCE",
  similes: [
    "NFT_BALANCE",
    "NFT",
    "KAIA_NFT_BALANCE",
    "CHECK_NFT_BALANCE",
    "CHECK_NFT",
    "NFTS",
    "NON_FUNGIBLE_TOKENS",
    "NON_FUNGIBLE_TOKEN_BALANCE"
  ],
  description: "Get the NFT balance for a given address",
  validate: async (runtime) => {
    await validateKaiaScanConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    }
    state = await runtime.updateRecentMessageState(state);
    const nFTalanceContext = composeContext2({
      state,
      template: getAddressTemplate
    });
    const content = await generateMessageResponse2({
      runtime,
      context: nFTalanceContext,
      modelClass: ModelClass2.SMALL
    });
    const hasAddress = content?.address && !content?.error;
    if (!hasAddress) {
      return;
    }
    const config = await validateKaiaScanConfig(runtime);
    const kaiaScanService = new KaiaScanService({
      apiKey: config.KAIA_KAIASCAN_API_KEY,
      baseUrl: API_DEFAULTS.BASE_URL[String(content.network)]
    });
    try {
      const kaiaScanData = await kaiaScanService.getNFTBalance(
        String(content?.address || "")
      );
      elizaLogger2.success(
        `Successfully fetched NFT for ${content.address}`
      );
      if (callback) {
        const totalCount = kaiaScanData.paging.total_count;
        let responseText = `Your account has ${totalCount} NFT Collections. They are as follows:
`;
        kaiaScanData.results.forEach((item, index) => {
          responseText += `${index + 1}. Contract address - ${item.contract.contract_address} | Token count - ${item.token_count}
`;
        });
        callback({
          text: responseText,
          content: kaiaScanData
        });
        return true;
      }
    } catch (error) {
      elizaLogger2.error("Error in GET_NFT_BALANCE handler:", error);
      if (error instanceof Error) {
        callback({
          text: `Error fetching NFT Balance: ${error.message}`,
          content: { error: error.message }
        });
      }
      return false;
    }
    return;
  },
  examples: getNFTBalanceExamples
};

// src/actions/accounts/getFTBalanceDetails.ts
import { composeContext as composeContext3, elizaLogger as elizaLogger3 } from "@elizaos/core";
import { generateMessageResponse as generateMessageResponse3 } from "@elizaos/core";
import {
  ModelClass as ModelClass3
} from "@elizaos/core";

// src/examples/getFTBalanceDetails.ts
var getFTBalanceDetailsExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the fungible token balance of 0x4d69770905f43c07d4085dfd296a03484d05280f?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the fungible token balance in 0x4d69770905f43c07d4085dfd296a03484d05280f for you.",
        action: "GET_FT_BALANCE_DETAILS"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "How many FT tokens are in 0x4d69770905f43c07d4085dfd296a03484d05280f?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me see how many FT tokens are in 0x4d69770905f43c07d4085dfd296a03484d05280f.",
        action: "GET_FT_BALANCE_DETAILS"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the balance of 0x4d69770905f43c07d4085dfd296a03484d05280f on kaia mainnet?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the fungible token balance in 0x4d69770905f43c07d4085dfd296a03484d05280f on kaia mainnet for you.",
        action: "GET_FT_BALANCE_DETAILS"
      }
    }
  ]
];

// src/actions/accounts/getFTBalanceDetails.ts
var getFTBalanceDetailsAction = {
  name: "GET_FT_BALANCE_DETAILS",
  similes: [
    "FUNGIBLE_TOKEN_BALANCE",
    "FT_BALANCE",
    "KAIA_FT_BALANCE",
    "CHECK_FT_BALANCE",
    "CHECK_FT",
    "FT"
  ],
  description: "Get the Fungible Balance for a given address",
  validate: async (runtime) => {
    await validateKaiaScanConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    }
    state = await runtime.updateRecentMessageState(state);
    const fTBalanceContext = composeContext3({
      state,
      template: getAddressTemplate
    });
    const content = await generateMessageResponse3({
      runtime,
      context: fTBalanceContext,
      modelClass: ModelClass3.SMALL
    });
    const hasAddress = content?.address && !content?.error;
    if (!hasAddress) {
      return;
    }
    const config = await validateKaiaScanConfig(runtime);
    const kaiaScanService = new KaiaScanService({
      apiKey: config.KAIA_KAIASCAN_API_KEY,
      baseUrl: API_DEFAULTS.BASE_URL[String(content.network)]
    });
    try {
      const kaiaScanData = await kaiaScanService.getFTBalanceDetails(
        String(content?.address || "")
      );
      elizaLogger3.success(
        `Successfully fetched FT for ${content.address}`
      );
      if (callback) {
        const totalCount = kaiaScanData.paging.total_count;
        let responseText = `Your account has ${totalCount} FTs. They are as follows:
`;
        kaiaScanData.results.forEach((item, index) => {
          responseText += `${index + 1}. Contract address = ${item.contract.contract_address} | symbol = ${item.contract.symbol} | name = ${item.contract.name} | total supply = ${item.contract.total_supply} | balance = ${item.balance}
`;
        });
        callback({
          text: responseText,
          content: kaiaScanData
        });
        return true;
      }
    } catch (error) {
      elizaLogger3.error(
        "Error in GET_FT_BALANCE_DETAILS handler:",
        error
      );
      if (error instanceof Error) {
        callback({
          text: `Error fetching FT Balance: ${error.message}`,
          content: { error: error.message }
        });
      }
      return false;
    }
    return;
  },
  examples: getFTBalanceDetailsExamples
};

// src/actions/accounts/getAccountOverview.ts
import { composeContext as composeContext4, elizaLogger as elizaLogger4 } from "@elizaos/core";
import { generateMessageResponse as generateMessageResponse4 } from "@elizaos/core";
import {
  ModelClass as ModelClass4
} from "@elizaos/core";

// src/examples/getAccountOverview.ts
var getAccountOverviewExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Tell me about my account."
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Which account address would you like to check? Also, please provide the network."
      }
    },
    {
      user: "{{user1}}",
      content: {
        text: "0x840e00ffc46734c3ac97b0e88b1589f83b3874ec"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Noted, since you didn't provide the network, I'll assume it's kaia mainnet. Let me fetch the details for 0x840e00ffc46734c3ac97b0e88b1589f83b3874ec.",
        action: "GET_ACCOUNT_OVERVIEW"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you give me an overview of my account?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Sure, which account address would you like to check?"
      }
    },
    {
      user: "{{user1}}",
      content: {
        text: "0x840e00ffc46734c3ac97b0e88b1589f83b3874ec"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me fetch the details for 0x840e00ffc46734c3ac97b0e88b1589f83b3874ec on kaia mainnet.",
        action: "GET_ACCOUNT_OVERVIEW"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the overview of 0x840e00ffc46734c3ac97b0e88b1589f83b3874ec on kairos?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll get the account details for 0x840e00ffc46734c3ac97b0e88b1589f83b3874ec on kairos network.",
        action: "GET_ACCOUNT_OVERVIEW"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you show me the details of my portfolio?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Which account address would you like to check?"
      }
    },
    {
      user: "{{user1}}",
      content: {
        text: "0x840e00ffc46734c3ac97b0e88b1589f83b3874ec on kairos network."
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Fetching the portfolio details for 0x840e00ffc46734c3ac97b0e88b1589f83b3874ec on kairos network.",
        action: "GET_ACCOUNT_OVERVIEW"
      }
    }
  ]
];

// src/actions/accounts/getAccountOverview.ts
var getAccountOverviewAction = {
  name: "GET_ACCOUNT_OVERVIEW",
  similes: [
    "ACCOUNT_OVERVIEW",
    "KAIA_ACCOUNT_OVERVIEW",
    "CHECK_ACCOUNT_OVERVIEW",
    "CHECKOUT_ACCOUNT_OVERVIEW",
    "CHECK_ACCOUNT",
    "ACCOUNT",
    "OVERVIEW"
  ],
  description: "Get the Account Overview for a given address",
  validate: async (runtime) => {
    await validateKaiaScanConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    }
    state = await runtime.updateRecentMessageState(state);
    const accOverviewContext = composeContext4({
      state,
      template: getAddressTemplate
    });
    const content = await generateMessageResponse4({
      runtime,
      context: accOverviewContext,
      modelClass: ModelClass4.SMALL
    });
    const hasAddress = content?.address && !content?.error;
    if (!hasAddress) {
      return;
    }
    const config = await validateKaiaScanConfig(runtime);
    const kaiaScanService = new KaiaScanService({
      apiKey: config.KAIA_KAIASCAN_API_KEY,
      baseUrl: API_DEFAULTS.BASE_URL[String(content.network)]
    });
    try {
      const kaiaScanData = await kaiaScanService.getAccountOverview(
        String(content?.address || "")
      );
      elizaLogger4.success(
        `Successfully fetched Account Overview for ${content.address}`
      );
      if (callback) {
        let responseText = `Here are the details 
Account Details:
`;
        responseText += `Address: ${kaiaScanData.address}
`;
        responseText += `Account Type: ${kaiaScanData.account_type}
`;
        responseText += `Balance: ${kaiaScanData.balance}
`;
        responseText += `Total Transaction Count: ${kaiaScanData.total_transaction_count}
`;
        callback({
          text: responseText,
          content: kaiaScanData
        });
        return true;
      }
    } catch (error) {
      elizaLogger4.error("Error in GET_ACCOUNT_OVERVIEW handler:", error);
      if (error instanceof Error) {
        callback({
          text: `Error fetching account overview: ${error.message}`,
          content: { error: error.message }
        });
      }
      return false;
    }
    return;
  },
  examples: getAccountOverviewExamples
};

// src/actions/accounts/transfer.ts
import { formatEther, parseEther } from "viem";
import {
  composeContext as composeContext5,
  generateObjectDeprecated,
  ModelClass as ModelClass5
} from "@elizaos/core";

// src/providers/wallet.ts
import {
  createPublicClient,
  createWalletClient,
  formatUnits,
  http
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  elizaLogger as elizaLogger5
} from "@elizaos/core";
import * as viemChains from "viem/chains";
import NodeCache from "node-cache";
import * as path from "path";
var WalletProvider = class _WalletProvider {
  constructor(accountOrPrivateKey, cacheManager, chains) {
    this.cacheManager = cacheManager;
    this.cacheKey = "evm/wallet";
    this.currentChain = "mainnet";
    this.CACHE_EXPIRY_SEC = 5;
    this.chains = { ...viemChains };
    this.setAccount = (accountOrPrivateKey) => {
      if (typeof accountOrPrivateKey === "string") {
        this.account = privateKeyToAccount(accountOrPrivateKey);
      } else {
        this.account = accountOrPrivateKey;
      }
    };
    this.setChains = (chains) => {
      if (!chains) {
        return;
      }
      Object.keys(chains).forEach((chain) => {
        this.chains[chain] = chains[chain];
      });
    };
    this.setCurrentChain = (chain) => {
      this.currentChain = chain;
    };
    this.createHttpTransport = (chainName) => {
      const chain = this.chains[chainName];
      if (chain.rpcUrls.custom) {
        return http(chain.rpcUrls.custom.http[0]);
      }
      return http(chain.rpcUrls.default.http[0]);
    };
    this.setAccount(accountOrPrivateKey);
    this.setChains(chains);
    if (chains && Object.keys(chains).length > 0) {
      this.setCurrentChain(Object.keys(chains)[0]);
    }
    this.cache = new NodeCache({ stdTTL: this.CACHE_EXPIRY_SEC });
  }
  getAddress() {
    return this.account.address;
  }
  getCurrentChain() {
    return this.chains[this.currentChain];
  }
  getPublicClient(chainName) {
    const transport = this.createHttpTransport(chainName);
    const publicClient = createPublicClient({
      chain: this.chains[chainName],
      transport
    });
    return publicClient;
  }
  getWalletClient(chainName) {
    const transport = this.createHttpTransport(chainName);
    const walletClient = createWalletClient({
      chain: this.chains[chainName],
      transport,
      account: this.account
    });
    return walletClient;
  }
  getChainConfigs(chainName) {
    const chain = viemChains[chainName];
    if (!chain?.id) {
      throw new Error("Invalid chain name");
    }
    return chain;
  }
  async getWalletBalance() {
    const cacheKey = "walletBalance_" + this.currentChain;
    const cachedData = await this.getCachedData(cacheKey);
    if (cachedData) {
      elizaLogger5.log(
        "Returning cached wallet balance for chain: " + this.currentChain
      );
      return cachedData;
    }
    try {
      const client = this.getPublicClient(this.currentChain);
      const balance = await client.getBalance({
        address: this.account.address
      });
      const balanceFormatted = formatUnits(balance, 18);
      this.setCachedData(cacheKey, balanceFormatted);
      elizaLogger5.log(
        "Wallet balance cached for chain: ",
        this.currentChain
      );
      return balanceFormatted;
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return null;
    }
  }
  async getWalletBalanceForChain(chainName) {
    try {
      const client = this.getPublicClient(chainName);
      const balance = await client.getBalance({
        address: this.account.address
      });
      return formatUnits(balance, 18);
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return null;
    }
  }
  addChain(chain) {
    this.setChains(chain);
  }
  switchChain(chainName, customRpcUrl) {
    if (!this.chains[chainName]) {
      const chain = _WalletProvider.genChainFromName(
        chainName,
        customRpcUrl
      );
      this.addChain({ [chainName]: chain });
    }
    this.setCurrentChain(chainName);
  }
  async readFromCache(key) {
    const cached = await this.cacheManager.get(
      path.join(this.cacheKey, key)
    );
    return cached;
  }
  async writeToCache(key, data) {
    await this.cacheManager.set(path.join(this.cacheKey, key), data, {
      expires: Date.now() + this.CACHE_EXPIRY_SEC * 1e3
    });
  }
  async getCachedData(key) {
    const cachedData = this.cache.get(key);
    if (cachedData) {
      return cachedData;
    }
    const fileCachedData = await this.readFromCache(key);
    if (fileCachedData) {
      this.cache.set(key, fileCachedData);
      return fileCachedData;
    }
    return null;
  }
  async setCachedData(cacheKey, data) {
    this.cache.set(cacheKey, data);
    await this.writeToCache(cacheKey, data);
  }
  static genChainFromName(chainName, customRpcUrl) {
    const baseChain = viemChains[chainName];
    if (!baseChain?.id) {
      throw new Error("Invalid chain name");
    }
    const viemChain = customRpcUrl ? {
      ...baseChain,
      rpcUrls: {
        ...baseChain.rpcUrls,
        custom: {
          http: [customRpcUrl]
        }
      }
    } : baseChain;
    return viemChain;
  }
};
var genChainsFromRuntime = () => {
  const chainNames = ["kaia", "kairos"];
  const chains = {};
  chainNames.forEach((chainName) => {
    const chain = WalletProvider.genChainFromName(chainName);
    chains[chainName] = chain;
  });
  return chains;
};
var initWalletProvider = async (runtime) => {
  const chains = genChainsFromRuntime();
  const privateKey = runtime.getSetting(
    "KAIA_EVM_PRIVATE_KEY"
  );
  if (!privateKey) {
    throw new Error("KAIA_EVM_PRIVATE_KEY is missing");
  }
  return new WalletProvider(privateKey, runtime.cacheManager, chains);
};
var kaiaWalletProvider = {
  async get(runtime, _message, state) {
    try {
      const walletProvider = await initWalletProvider(runtime);
      const address = walletProvider.getAddress();
      const balance = await walletProvider.getWalletBalance();
      const chain = walletProvider.getCurrentChain();
      const agentName = state?.agentName || "The agent";
      return `${agentName}'s Kaia Wallet Address: ${address}
Balance: ${balance} ${chain.nativeCurrency.symbol}
Chain ID: ${chain.id}, Name: ${chain.name}`;
    } catch (error) {
      console.error("Error in Kaia wallet provider:", error);
      return null;
    }
  }
};

// src/templates/transfer.ts
var transferTemplate = `You are an AI assistant specialized in processing cryptocurrency transfer requests. Your task is to extract specific information from user messages and format it into a structured JSON response.

First, review the recent messages from the conversation:

<recent_messages>
{{recentMessages}}
</recent_messages>

Here's a list of supported chains:
<supported_chains>
{{supportedChains}}
</supported_chains>

Your goal is to extract the following information about the requested transfer:
1. Chain to execute on (must be one of the supported chains)
2. Amount to transfer (in ETH, without the coin symbol)
3. Recipient address (must be a valid Ethereum address)
4. Token symbol or address (if not a native token transfer)

Before providing the final JSON output, show your reasoning process inside <analysis> tags. Follow these steps:

1. Identify the relevant information from the user's message:
   - Quote the part of the message mentioning the chain.
   - Quote the part mentioning the amount.
   - Quote the part mentioning the recipient address.
   - Quote the part mentioning the token (if any).

2. Validate each piece of information:
   - Chain: List all supported chains and check if the mentioned chain is in the list.
   - Amount: Attempt to convert the amount to a number to verify it's valid.
   - Address: Check that it starts with "0x" and count the number of characters (should be 42).
   - Token: Note whether it's a native transfer or if a specific token is mentioned.

3. If any information is missing or invalid, prepare an appropriate error message.

4. If all information is valid, summarize your findings.

5. Prepare the JSON structure based on your analysis.

After your analysis, provide the final output in a JSON markdown block. All fields except 'token' are required. The JSON should have this structure:

\`\`\`json
{
    "fromChain": string,
    "amount": string,
    "toAddress": string,
    "token": string | null
}
\`\`\`

Remember:
- The chain name must be a string and must exactly match one of the supported chains.
- The amount should be a string representing the number without any currency symbol.
- The recipient address must be a valid Ethereum address starting with "0x".
- If no specific token is mentioned (i.e., it's a native token transfer), set the "token" field to null.

Now, process the user's request and provide your response.
`;

// src/examples/transfer.ts
var transferExamples = [
  [
    {
      user: "user",
      content: {
        text: "Transfer 1 ETH to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        action: "SEND_TOKENS"
      }
    },
    {
      user: "assistant",
      content: {
        text: "I'll help you transfer 1 ETH to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        action: "SEND_TOKENS"
      }
    }
  ]
];

// src/actions/accounts/transfer.ts
var TransferAction = class {
  constructor(walletProvider) {
    this.walletProvider = walletProvider;
  }
  async transfer(params) {
    console.log(
      `Transferring: ${params.amount} tokens to (${params.toAddress} on ${String(params.fromChain)})`
    );
    if (!params.data) {
      params.data = "0x";
    }
    this.walletProvider.switchChain(params.fromChain);
    const walletClient = this.walletProvider.getWalletClient(
      params.fromChain
    );
    try {
      const hash = await walletClient.sendTransaction({
        account: walletClient.account,
        to: params.toAddress,
        value: parseEther(params.amount),
        data: params.data,
        kzg: {
          blobToKzgCommitment: function() {
            throw new Error("Function not implemented.");
          },
          computeBlobKzgProof: function() {
            throw new Error("Function not implemented.");
          }
        },
        chain: void 0
      });
      return {
        hash,
        from: walletClient.account.address,
        to: params.toAddress,
        value: parseEther(params.amount),
        data: params.data
      };
    } catch (error) {
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }
};
var buildTransferDetails = async (state, runtime, wp) => {
  const chains = Object.keys(wp.chains);
  state.supportedChains = chains.map((item) => `"${item}"`).join("|");
  const context = composeContext5({
    state,
    template: transferTemplate
  });
  const transferDetails = await generateObjectDeprecated({
    runtime,
    context,
    modelClass: ModelClass5.SMALL
  });
  const existingChain = wp.chains[String(transferDetails.fromChain)];
  if (!existingChain) {
    throw new Error(
      "The chain " + String(transferDetails.fromChain) + " not configured yet. Add the chain or choose one from configured: " + chains.toString()
    );
  }
  return transferDetails;
};
var transferAction = {
  name: "TRANSFER",
  description: "Transfer tokens between addresses on the same chain",
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    } else {
      state = await runtime.updateRecentMessageState(state);
    }
    console.log("Transfer action handler called");
    const walletProvider = await initWalletProvider(runtime);
    const action = new TransferAction(walletProvider);
    const paramOptions = await buildTransferDetails(
      state,
      runtime,
      walletProvider
    );
    try {
      const transferResp = await action.transfer(paramOptions);
      if (callback) {
        callback({
          text: `Successfully transferred ${paramOptions.amount} KAIA on ${String(paramOptions.fromChain)} to ${paramOptions.toAddress}
Transaction Hash: ${transferResp.hash}`,
          content: {
            success: true,
            hash: transferResp.hash,
            amount: formatEther(transferResp.value),
            recipient: transferResp.to,
            chain: paramOptions.fromChain
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Error during token transfer:", error);
      if (callback && error instanceof Error) {
        callback({
          text: `Error transferring tokens: ${error.message}`,
          content: { error: error.message }
        });
      }
      return false;
    }
  },
  validate: async (runtime) => {
    const privateKey = runtime.getSetting("KAIA_EVM_PRIVATE_KEY");
    return typeof privateKey === "string" && privateKey.startsWith("0x");
  },
  examples: transferExamples,
  similes: ["SEND_TOKENS", "TOKEN_TRANSFER", "MOVE_TOKENS"]
};

// src/actions/accounts/faucet.ts
import { formatEther as formatEther2, parseEther as parseEther2 } from "viem";
import {
  composeContext as composeContext6,
  generateObjectDeprecated as generateObjectDeprecated2,
  ModelClass as ModelClass6
} from "@elizaos/core";

// src/templates/faucet.ts
var faucetTemplate = `You are an AI assistant specialized in processing faucet requests for the Kaia Faucet. Your task is to extract specific information from user messages and format it into a structured JSON response.

First, review the recent messages from the conversation:

<recent_messages>
{{recentMessages}}
</recent_messages>

Your goal is to extract the following information about the requested faucet transaction:
1. Recipient address (must be a valid Kaia address)

Before providing the final JSON output, show your reasoning process inside <analysis> tags. Follow these steps:

1. Identify the relevant information from the user's message:
   - Quote the part mentioning the recipient address.

2. Validate each piece of information:
   - Address: Check that it starts with "0x" and count the number of characters (should be 42).

3. If any information is missing or invalid, prepare an appropriate error message.

4. If all information is valid, summarize your findings.

5. Prepare the JSON structure based on your analysis.

After your analysis, provide the final output in a JSON markdown block. The JSON should have this structure:

\`\`\`json
{
    "toAddress": string
}
\`\`\`

Remember:
- The recipient address must be a valid Kaia address starting with "0x".

Now, process the user's request and provide your response.
`;

// src/examples/faucet.ts
var faucetExamples = [
  [
    {
      user: "user",
      content: {
        text: "Transfer some faucet kaia testnet tokens to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        action: "FAUCET"
      }
    },
    {
      user: "assistant",
      content: {
        text: "I'll help you send some Kaia testnet tokens to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        action: "FAUCET"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can i get some test tokens to 0x4d69770905f43c07d4085dfd296a03484d05280f?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "let me transfer test tokens to 0x4d69770905f43c07d4085dfd296a03484d05280f for you.",
        action: "FAUCET"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can i get faucets to 0x4d69770905f43c07d4085dfd296a03484d05280f?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "let me transfer some test tokens to 0x4d69770905f43c07d4085dfd296a03484d05280f for you.",
        action: "FAUCET"
      }
    }
  ]
];

// src/actions/accounts/faucet.ts
var fromChain = "kairos";
var DEFAULT_FAUCET_AMOUNT = "1";
var FaucetAction = class {
  constructor(walletProvider) {
    this.walletProvider = walletProvider;
  }
  async transfer(params) {
    console.log(
      `Transferring Some Kaia Test tokens to (${params.toAddress} on ${fromChain})`
    );
    if (!params.data) {
      params.data = "0x";
    }
    const walletClient = this.walletProvider.getWalletClient(fromChain);
    try {
      const hash = await walletClient.sendTransaction({
        account: walletClient.account,
        to: params.toAddress,
        value: parseEther2(params.amount),
        data: params.data,
        kzg: {
          blobToKzgCommitment: function() {
            throw new Error("Function not implemented.");
          },
          computeBlobKzgProof: function() {
            throw new Error("Function not implemented.");
          }
        },
        chain: void 0
      });
      return {
        hash,
        from: walletClient.account.address,
        to: params.toAddress,
        value: parseEther2(params.amount),
        data: params.data
      };
    } catch (error) {
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }
};
var buildTransferDetails2 = async (state, runtime, wp) => {
  const chains = Object.keys(wp.chains);
  state.supportedChains = chains.map((item) => `"${item}"`).join("|");
  const context = composeContext6({
    state,
    template: faucetTemplate
  });
  const transferDetails = await generateObjectDeprecated2({
    runtime,
    context,
    modelClass: ModelClass6.SMALL
  });
  const existingChain = wp.chains[fromChain];
  if (!existingChain) {
    throw new Error(
      "The chain " + fromChain + " not configured yet. Add the chain or choose one from configured: " + chains.toString()
    );
  }
  return transferDetails;
};
var faucetAction = {
  name: "FAUCET",
  description: "Transfer some kaia test tokens to an address on Kaia testnet",
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    } else {
      state = await runtime.updateRecentMessageState(state);
    }
    console.log("Faucet Transfer action handler called");
    const walletProvider = await initWalletProvider(runtime);
    const faucetAmount = runtime.getSetting("KAIA_FAUCET_AMOUNT") || DEFAULT_FAUCET_AMOUNT;
    const action = new FaucetAction(walletProvider);
    const paramOptions = await buildTransferDetails2(
      state,
      runtime,
      walletProvider
    );
    paramOptions.amount = faucetAmount;
    try {
      const transferResp = await action.transfer(paramOptions);
      if (callback) {
        callback({
          text: `Successfully transferred ${paramOptions.amount} test tokens to ${paramOptions.toAddress}
Transaction Hash: ${transferResp.hash}`,
          content: {
            success: true,
            hash: transferResp.hash,
            amount: formatEther2(transferResp.value),
            recipient: transferResp.to,
            chain: fromChain
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Error during faucet token transfer:", error);
      if (callback) {
        callback({
          text: `Error transferring faucet tokens: ${error.message}`,
          content: { error: error.message }
        });
      }
      return false;
    }
  },
  validate: async (runtime) => {
    const privateKey = runtime.getSetting("KAIA_EVM_PRIVATE_KEY");
    return typeof privateKey === "string" && privateKey.startsWith("0x");
  },
  examples: faucetExamples,
  similes: [
    "SEND_FAUCET_TOKENS",
    "GET_FAUCET_TOKENS",
    "MOVE_FAUCET_TOKENS",
    "SEND_TEST_TOKENS",
    "GET_TEST_TOKENS",
    "MOVE_TEST_TOKENS"
  ]
};

// src/actions/transactions/getLatestBlock.ts
import { composeContext as composeContext7, elizaLogger as elizaLogger6 } from "@elizaos/core";
import { generateMessageResponse as generateMessageResponse5 } from "@elizaos/core";
import {
  ModelClass as ModelClass7
} from "@elizaos/core";

// src/templates/getNetwork.ts
var getNetworkTemplate = `Respond with a JSON object containing the "network". The network must be a valid Kaia network provided in the input.

IMPORTANT: Response must ALWAYS include only "network" field.

Example response:
\`\`\`json
{
    "network": "kairos"
}
\`\`\`

{{recentMessages}}

Extract the network from the most recent message. Respond with a JSON markdown block containing only "network".`;

// src/examples/getLatestBlock.ts
var getLatestBlockExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's is the latest block number like right now?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "In which network?",
        action: "NONE"
      }
    },
    {
      user: "{{user1}}",
      content: {
        text: "kairos"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me check the latest block number in kairos for you.",
        action: "GET_LATEST_BLOCK"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "It's currently 1000000 block height. You can check the latest block number in kaia as well."
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the latest block number of kaia?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the current block height in kaia for you.",
        action: "GET_LATEST_BLOCK"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "It's currently 10000000 block height and can explore kaia minidapps."
      }
    }
  ]
];

// src/actions/transactions/getLatestBlock.ts
var getLatestBlockAction = {
  name: "GET_LATEST_BLOCK",
  similes: [
    "BLOCK_HEIGHT",
    "KAIA_BLOCK_HEIGHT",
    "CHECK_KAIA_LATEST_BLOCK",
    "CHECK_LATEST_BLOCK",
    "CHECK_KAIA_LATEST_BLOCK_HEIGHT",
    "CHECKOUT_LATEST_BLOCK",
    "CHECK_BLOCK_HEIGHT",
    "LATEST_BLOCK",
    "LATEST_BLOCK_NUMBER",
    "CHECK_LATEST_BLOCK_NUMBER",
    "CHECK_KAIA_LATEST_BLOCK_NUMBER"
  ],
  description: "Get the latest block number for a given network",
  validate: async (runtime) => {
    await validateKaiaScanConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    }
    state = await runtime.updateRecentMessageState(state);
    const txnContext = composeContext7({
      state,
      template: getNetworkTemplate
    });
    const content = await generateMessageResponse5({
      runtime,
      context: txnContext,
      modelClass: ModelClass7.SMALL
    });
    const hasNetwork = content?.network && !content?.error;
    if (!hasNetwork) {
      return;
    }
    const config = await validateKaiaScanConfig(runtime);
    const kaiaScanService = new KaiaScanService({
      apiKey: config.KAIA_KAIASCAN_API_KEY,
      baseUrl: API_DEFAULTS.BASE_URL[String(content.network)]
    });
    try {
      const kaiaScanData = await kaiaScanService.getLatestBlock();
      elizaLogger6.success(
        `Successfully fetched latest block number for ${content.network}`
      );
      if (callback) {
        callback({
          text: `The latest block number of ${content.network} is ${kaiaScanData.block_id}`,
          content: kaiaScanData
        });
        return true;
      }
    } catch (error) {
      elizaLogger6.error("Error in GET_LATEST_BLOCK handler:", error);
      callback({
        text: `Error fetching balance: ${error.message}`,
        content: { error: error.message }
      });
      return false;
    }
    return;
  },
  examples: getLatestBlockExamples
};

// src/actions/transactions/getBlockInfo.ts
import { composeContext as composeContext8, elizaLogger as elizaLogger7 } from "@elizaos/core";
import { generateMessageResponse as generateMessageResponse6 } from "@elizaos/core";
import {
  ModelClass as ModelClass8
} from "@elizaos/core";

// src/templates/getBlockNumber.ts
var getBlockNumberTemplate = `Respond with a JSON object containing both "blocknumber" and "network". The network must be a valid Kaia network provided in the input.

IMPORTANT: Response must ALWAYS include both "blocknumber" and "network" field.

Example response:
\`\`\`json
{
    "blocknumber": 123456,
    "network": "kairos"
}
\`\`\`

{{recentMessages}}

Extract the blocknumber and network from the most recent message. Respond with a JSON markdown block containing both "blocknumber" and "network".`;

// src/actions/transactions/getBlockInfo.ts
var getBlockAction = {
  name: "GET_BLOCK",
  similes: [
    "BLOCK_INFO",
    "KAIA_GET_BLOCK",
    "CHECK_KAIA_GET_BLOCK",
    "CHECK_GET_BLOCK"
  ],
  description: "Get the block info for a given block number",
  validate: async (runtime) => {
    await validateKaiaScanConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    }
    state = await runtime.updateRecentMessageState(state);
    const txnContext = composeContext8({
      state,
      template: getBlockNumberTemplate
    });
    const content = await generateMessageResponse6({
      runtime,
      context: txnContext,
      modelClass: ModelClass8.SMALL
    });
    const hasNetwork = content?.network && !content?.error;
    if (!hasNetwork) {
      return;
    }
    console.log(content);
    const hasBlockNumber = content?.blocknumber && !content?.error;
    if (!hasBlockNumber) {
      return;
    }
    const config = await validateKaiaScanConfig(runtime);
    const kaiaScanService = new KaiaScanService({
      apiKey: config.KAIA_KAIASCAN_API_KEY,
      baseUrl: API_DEFAULTS.BASE_URL[String(content.network)]
    });
    try {
      const kaiaScanData = await kaiaScanService.getBlock(
        String(content.blocknumber)
      );
      elizaLogger7.success(
        `Successfully fetched block info for ${content.blocknumber} on ${content.network}`
      );
      if (callback) {
        let blockInfo = `Block Number: ${kaiaScanData.block_id}
`;
        blockInfo += `Block Time: ${kaiaScanData.datetime}
`;
        blockInfo += `Block Hash: ${kaiaScanData.hash}
`;
        blockInfo += `Total Transaction Count: ${kaiaScanData.total_transaction_count}`;
        callback({
          text: `The block info for ${content.blocknumber} on ${content.network} is ${blockInfo}`,
          content: kaiaScanData
        });
        return true;
      }
    } catch (error) {
      elizaLogger7.error("Error in GET_BLOCK handler:", error);
      callback({
        text: `Error fetching block info: ${error.message}`,
        content: { error: error.message }
      });
      return false;
    }
    return;
  },
  examples: getLatestBlockExamples
};

// src/actions/transactions/getTransactionsByAccount.ts
import { composeContext as composeContext9, elizaLogger as elizaLogger8 } from "@elizaos/core";
import { generateMessageResponse as generateMessageResponse7 } from "@elizaos/core";
import {
  ModelClass as ModelClass9
} from "@elizaos/core";

// src/examples/getTransactionsByAccount.ts
var getTransactionsByAccountExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's are the transactions for address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e like right now?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "In which network?"
      }
    },
    {
      user: "{{user1}}",
      content: {
        text: "kairos"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me check the transactions for address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e in kairos for you.",
        action: "GET_TRANSACTIONS_BY_ACCOUNT"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "It's Block Number: 1234 \n Block Time: 10/10/2025 \n Block Hash: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e \n Block Size: 123. Please explore kaia ecosystem."
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the list of transactions for address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e on kaia?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e for transactions in kaia for you.",
        action: "GET_BLOCK"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "It's Block Number: 1234 \n Block Time: 10/10/2025 \n Block Hash: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e \n Block Size: 123. and can explore kaia minidapps."
      }
    }
  ]
];

// src/templates/getTransactionsByAccount.ts
var getTransactionsByAccountTemplate = `Respond with a JSON object containing the "address" and "network". The address must be a valid Kaia EVM address provided in the input. 

IMPORTANT: Response must ALWAYS include both "address" and "network" fields.

Example response:
\`\`\`json
{
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "network": "kairos"
}
\`\`\`

{{recentMessages}}

Extract the Kaia EVM address from the most recent message. Respond with a JSON markdown block containing both "address" and "network".`;

// src/actions/transactions/getTransactionsByAccount.ts
var getTransactionsByAccountAction = {
  name: "GET_TRANSACTIONS_BY_ACCOUNT",
  similes: [
    "GET_TRANSACTIONS_BY_ACCOUNT",
    "GET_TRANSACTIONS_BY_ACCOUNT",
    "KAIA_TRANSACTIONS_BY_ACCOUNT",
    "CHECK_TRANSACTIONS_BY_ACCOUNT",
    "CHECK_TRANSACTIONS_BY_ADDRESS",
    "KAIA_TRANSACTIONS_BY_ADDRESS",
    "GET_TRANSACTIONS_BY_ADDRESS",
    "GET_TRANSACTIONS_BY_ADDRESS"
  ],
  description: "Get the transactions by account",
  validate: async (runtime) => {
    await validateKaiaScanConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    }
    state = await runtime.updateRecentMessageState(state);
    const txnContext = composeContext9({
      state,
      template: getTransactionsByAccountTemplate
    });
    const content = await generateMessageResponse7({
      runtime,
      context: txnContext,
      modelClass: ModelClass9.SMALL
    });
    const hasNetwork = content?.network && !content?.error;
    if (!hasNetwork) {
      return;
    }
    const hasAddress = content?.address && !content?.error;
    if (!hasAddress) {
      return;
    }
    const config = await validateKaiaScanConfig(runtime);
    const kaiaScanService = new KaiaScanService({
      apiKey: config.KAIA_KAIASCAN_API_KEY,
      baseUrl: API_DEFAULTS.BASE_URL[String(content.network)]
    });
    try {
      const kaiaScanData = await kaiaScanService.getTransactionsByAccount(
        String(content.address)
      );
      elizaLogger8.success(
        `Successfully fetched transactions for ${content.address} on ${content.network}`
      );
      if (callback) {
        let AccountTransactions;
        if (kaiaScanData && kaiaScanData.results.length > 0) {
          kaiaScanData.results.map((transaction, index) => {
            if (index > 5) return;
            AccountTransactions += ` ----------------------------------- 
`;
            AccountTransactions += `${index + 1}:
`;
            AccountTransactions += `from: ${transaction.from},
`;
            AccountTransactions += `to: ${transaction.to}, 
`;
            AccountTransactions += `value: ${transaction.amount}, 
`;
            AccountTransactions += `type: ${transaction.transaction_type}, 
`;
            AccountTransactions += `hash: ${transaction.transaction_hash}
`;
          });
        } else {
          AccountTransactions = "No transactions found for this address";
        }
        console.log(AccountTransactions);
        callback({
          text: `The transactions for ${content.address} account on ${content.network} is ${AccountTransactions}`,
          content: kaiaScanData
        });
        return true;
      }
    } catch (error) {
      elizaLogger8.error(
        "Error in GET_TRANSACTIONS_BY_BLOCK_NUMBER handler:",
        error
      );
      callback({
        text: `Error fetching transactions of a block info: ${error.message}`,
        content: { error: error.message }
      });
      return false;
    }
    return;
  },
  examples: getTransactionsByAccountExamples
};

// src/actions/kaiaInfo/getKaiaInfo.ts
import { elizaLogger as elizaLogger9 } from "@elizaos/core";

// src/examples/getKaiaInfo.ts
var getKaiaInfoExamples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you give me overview of kaia?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Sure, let me fetch the Kaia details for you.",
        action: "GET_KAIA_INFO"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you tell me the Kaia price details?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Sure, let me fetch the Kaia price details for you.",
        action: "GET_KAIA_INFO"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the current market cap of Kaia?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me check the current market cap of Kaia for you.",
        action: "GET_KAIA_INFO"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "How much is the total supply of Kaia?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "I'll check the total supply of Kaia for you.",
        action: "GET_KAIA_INFO"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Can you provide the volume of Kaia?"
      }
    },
    {
      user: "{{agent}}",
      content: {
        text: "Let me fetch the volume of Kaia for you.",
        action: "GET_KAIA_INFO"
      }
    }
  ]
];

// src/actions/kaiaInfo/getKaiaInfo.ts
var getKaiaInfoAction = {
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
    "PRICE_OF_KAIA"
  ],
  description: "Get the current info about Kaia Token",
  validate: async (runtime) => {
    await validateKaiaScanConfig(runtime);
    return true;
  },
  handler: async (runtime, message, state, _options, callback) => {
    if (!state) {
      state = await runtime.composeState(message);
    }
    state = await runtime.updateRecentMessageState(state);
    const config = await validateKaiaScanConfig(runtime);
    const kaiaScanService = new KaiaScanService({
      apiKey: config.KAIA_KAIASCAN_API_KEY,
      baseUrl: API_DEFAULTS.BASE_URL.kaia
    });
    try {
      const kaiaScanData = await kaiaScanService.getKaiaInfo();
      elizaLogger9.success(`Successfully fetched Kaia Token Info`);
      if (callback) {
        let responseText = `Kaia Token Info:
`;
        responseText += `- USD Price: ${kaiaScanData.klay_price.usd_price}
`;
        responseText += `- BTC Price: ${kaiaScanData.klay_price.btc_price}
`;
        responseText += `- USD Price Changes: ${kaiaScanData.klay_price.usd_price_changes}
`;
        responseText += `- Market Cap: ${kaiaScanData.klay_price.market_cap}
`;
        responseText += `- Total Supply: ${kaiaScanData.klay_price.total_supply}
`;
        responseText += `- Volume: ${kaiaScanData.klay_price.volume}
`;
        callback({
          text: responseText,
          content: kaiaScanData
        });
        return true;
      }
    } catch (error) {
      elizaLogger9.error("Error in GET_KAIA_INFO handler:", error);
      callback({
        text: `Error fetching Kaia Info: ${error.message}`,
        content: { error: error.message }
      });
      return false;
    }
    return;
  },
  examples: getKaiaInfoExamples
};

// src/index.ts
var kaiaPlugin = {
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
    getKaiaInfoAction
  ],
  evaluators: [],
  providers: [kaiaWalletProvider]
};
var index_default = kaiaPlugin;
export {
  actions_exports as actions,
  index_default as default,
  kaiaPlugin
};
//# sourceMappingURL=index.js.map