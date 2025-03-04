import type { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const kaiaScanEnvSchema = z.object({
    KAIA_KAIASCAN_API_KEY: z.string().min(1, "KaiaScan API key is required"),
});

export type KaiaScanConfig = z.infer<typeof kaiaScanEnvSchema>;

export async function validateKaiaScanConfig(
    runtime: IAgentRuntime
): Promise<KaiaScanConfig> {
    try {
        const config = {
            KAIA_KAIASCAN_API_KEY: runtime.getSetting("KAIA_KAIASCAN_API_KEY"),
        };

        return kaiaScanEnvSchema.parse(config);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `KaiaScan configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
