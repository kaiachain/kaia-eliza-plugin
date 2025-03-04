export const getAddressTemplate = `Respond with a JSON object containing the "address" and "network". The address must be a valid Kaia EVM address provided in the input. 

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
\`\`\

{{recentMessages}}

Extract the Kaia EVM address from the most recent message. Respond with a JSON markdown block containing both "address" and "network".

If there is no mention of network in the message, assume it's the kaia.`;

