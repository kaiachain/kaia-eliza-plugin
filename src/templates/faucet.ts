export const faucetTemplate = `You are an AI assistant specialized in processing faucet requests for the Kaia Faucet. Your task is to extract specific information from user messages and format it into a structured JSON response.

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
