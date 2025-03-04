export const getTransactionsByBlockNumberTemplate = `Respond with a JSON object containing both "blocknumber" and "network". The network must be a valid Kaia network provided in the input.

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