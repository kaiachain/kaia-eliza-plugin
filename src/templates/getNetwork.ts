export const getNetworkTemplate = `Respond with a JSON object containing the "network". The network must be a valid Kaia network provided in the input.

IMPORTANT: Response must ALWAYS include only "network" field.

Example response:
\`\`\`json
{
    "network": "kairos"
}
\`\`\`

{{recentMessages}}

Extract the network from the most recent message. Respond with a JSON markdown block containing only "network".`;