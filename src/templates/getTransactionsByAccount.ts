export const getTransactionsByAccountTemplate = `Respond with a JSON object containing the "address" and "network". The address must be a valid Kaia EVM address provided in the input. 

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

