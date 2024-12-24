/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import type { Protocol } from "aws-cdk-lib/aws-ecs";
import type { Port } from "aws-cdk-lib/aws-ec2";

import { z } from "zod";

/**
 * Transform a string into a boolean (`"true"` => true, `"false"` => false).
 * Throws if the input is a non-string or some unexpected string.
 * You can make this more lenient if needed.
 */
export const booleanStringSchema = z.string().transform((val) => {
  const lower = val.toLowerCase();
  if (lower === "true") return true;
  if (lower === "false") return false;
  throw new Error(`Expected "true" or "false", got "${val}"`);
});

/**
 * Transform a string to a number.
 * Throws if the string is not a valid integer.
 * If you need floats, adjust parseInt => parseFloat.
 */
export const stringToNumberSchema = z.string().transform((val) => {
  const parsed = parseInt(val, 10);
  if (isNaN(parsed)) {
    throw new Error(`Expected number, received "${val}"`);
  }
  return parsed;
});

export const stringIsNumberSchema = z.string().refine(
  (val) => {
    const num = Number(val);
    return !isNaN(num) && val.length > 0;
  },
  { message: "Invalid number" },
);

export const stringIsBooleanSchema = z
  .string()
  .refine(
    (val) =>
      val === "true" || val === "false" || val === "TRUE" || val === "FALSE",
    {
      message: "Invalid boolean",
    },
  );

interface TwilioConfig {
  /**
   * Your twilio phone number.
   * @example
   * `+1XXXYYYZZZZ`
   */
  phoneFrom: string;
  /**
   * Phone number to receive text notifications at.
   * @example
   * `+1XXXYYYZZZZ`
   */
  phoneTo: string;
  /**
   * Twilio account ID
   */
  accountId: string;
  /**
   * Twilio auth code
   */
  authCode: string;
}

export type MinecraftEdition = "java" | "bedrock";

export interface StackConfig {
  /**
   * **Required**. Domain name of existing Route53 Hosted Zone
   *
   */
  domainName: string;
  /**
   * Name of the subdomain part to be used for creating a delegated hosted zone
   * (minecraft.example.com) and an NS record on your existing (example.com)
   * hosted zone. This subdomain should not already be in use.
   * @default "minecraft"
   */
  subdomainPart: string;
  /**
   * The AWS region to deploy your minecraft server in.
   * @default "us-east-1"
   */
  serverRegion: string;
  /**
   * Edition of Minecraft server to run. Accepted values are are `java` or `bedrock` for [Minecraft Java Docker] or
   * [Minecraft Bedrock Docker], respectively.
   * @default "java"
   */
  minecraftEdition: MinecraftEdition;
  /**
   * Number of minutes to wait for a connection after starting before terminating (optional, default "10")
   * @default "10"
   */
  startupMinutes: string;
  /**
   * Number of minutes to wait after the last client disconnects before terminating (optional, default "20")
   * @default "20"
   */
  shutdownMinutes: string;
  /**
   * Sets the preference for Fargate Spot.
   *
   * If you leave it 'false', your tasks will launch under the FARGATE strategy
   * which currently will run about 5 cents per hour. You can switch it to true
   * to enable FARGATE_SPOT, and pay 1.5 cents per hour. While this is cheaper,
   * technically AWS can terminate your instance at any time if they need the
   * capacity. The watchdog is designed to intercept this termination command
   * and shut down safely, so it's fine to use Spot to save a few pennies, at
   * the extremely low risk of game interruption.
   * @default false
   */
  useFargateSpot: boolean;
  /**
   * The number of cpu units used by the task running the Minecraft server.
   *
   * Valid values, which determines your range of valid values for the memory parameter:
   *
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   *
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   *
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   *
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   *
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   * @default 1024 1 vCPU
   */
  taskCpu: number;
  /**
   * The amount (in MiB) of memory used by the task running the Minecraft server.
   *
   * 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB) - Available cpu values: 256 (.25 vCPU)
   *
   * 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB) - Available cpu values: 512 (.5 vCPU)
   *
   * 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB) - Available cpu values: 1024 (1 vCPU)
   *
   * Between 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB) - Available cpu values: 2048 (2 vCPU)
   *
   * Between 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB) - Available cpu values: 4096 (4 vCPU)
   * @default 2048 2 GB
   */
  taskMemory: number;
  /**
   * The ID of an already existing VPC to deploy the server to. When this valueis not set, a new VPC is automatically created by default.
   */
  vpcId: string;
  /**
   * The email address you would like to receive notifications at.
   *
   * If this value is specified, an SNS topic is created and you will receive
   * email notifications each time the minecraft server is launched and ready.
   */
  snsEmailAddress: string;
  twilio: TwilioConfig;
  /**
   * Additional environment variables to be passed to the
   * [Minecraft Docker Server](https://github.com/itzg/docker-minecraft-server/blob/master/README.md)
   * [Minecraft Bedrock Docker](https://github.com/itzg/docker-minecraft-bedrock-server/blob/master/README.md)
   */
  minecraftImageEnv: MinecraftJavaImageConfig;
  /**
   * Setting to `true` enables debug mode.
   *
   * This will enable the following:
   * - CloudWatch Logs for the `minecraft-server` ECS Container
   * - CloudWatch Logs for the `minecraft-ecsfargate-watchdog` ECS Container
   */
  debug: boolean;
}

export interface MinecraftEditionConfig {
  /**
   * Name of the docker image to pull for the Minecraft server
   * @example 'itzg/minecraft-server'
   */
  image: string;
  /**
   * Port number to run the Minecraft server on
   */
  port: number;
  /**
   * Protocol for the Minecraft server
   */
  protocol: Protocol;
  /**
   * The ingress rule port to be used for the service security group
   */
  ingressRulePort: Port;
}

// Minecraft Server Configuration Schema using Zod

/**
 * Enum representing the difficulty levels for the Minecraft server.
 */
const DifficultyEnum = z.enum(["peaceful", "easy", "normal", "hard"]);

/**
 * Enum representing the behavior when an existing whitelist file is present.
 */
const ExistingFileBehaviorEnum = z.enum([
  "SKIP",
  "SYNCHRONIZE",
  "MERGE",
  "SYNC_FILE_MERGE_LIST",
]);

/**
 * Enum representing the user API providers.
 */
const UserApiProviderEnum = z.enum(["playerdb", "mojang"]);

/**
 * Enum representing the game modes.
 */
const GameModeEnum = z.enum(["creative", "survival", "adventure", "spectator"]);

/**
 * Enum representing the level types.
 */
const LevelTypeEnum = z.enum([
  "DEFAULT",
  "FLAT",
  "LARGEBIOMES",
  "AMPLIFIED",
  "CUSTOMIZED",
  "DEBUG",
]);

/**
 * Enum representing the default version types for Modrinth modpacks.
 */
const ModrinthDefaultVersionTypeEnum = z.enum(["release", "beta", "alpha"]);

/**
 * Enum representing the mod loader types for Modrinth modpacks.
 */
const ModrinthLoaderEnum = z.enum(["forge", "fabric", "quilt"]);

/**
 * Zod schema for the minecraft-server java docker configuration.
 */
export const minecraftJavaImageConfigSchema = z
  .object({
    // Required
    EULA: z.literal("TRUE"),

    /**
     * To use a different Minecraft version, pass the VERSION environment variable (case sensitive), which can have the value
     *
     * -    LATEST (the default)
     * -    SNAPSHOT
     * -    a specific version, such as "1.7.9"
     * -    or an alpha and beta version, such as "b1.7.3" (server download might not exist)
     *
     * For example, to use the latest snapshot:
     *      "SNAPSHOT"
     * or a specific version:
     *      "1.7.9"
     */
    VERSION: z.string().optional(),

    /**
     * Message of the Day (MOTD) displayed in the client UI.
     * Supports placeholders like %VAR% or %date:FMT%.
     * Example: "Running %MODPACK_NAME% version %env:MODPACK_VERSION%"
     */
    MOTD: z.string().optional(),

    /**
     * Difficulty level of the server.
     * Valid values: 'peaceful', 'easy', 'normal', 'hard'.
     * Default: 'easy'
     */
    DIFFICULTY: DifficultyEnum.optional(),

    /**
     * Whether to override the server.properties file with environment variables.
     * Set to false to manually manage server.properties.
     * Default: true
     */
    OVERRIDE_SERVER_PROPERTIES: stringIsBooleanSchema.optional(),

    /**
     * Whether to skip the creation of the server.properties file.
     * Set to true to manage server.properties manually.
     * Default: false
     */
    SKIP_SERVER_PROPERTIES: stringIsBooleanSchema.optional(),

    /**
     * Environment variables to dump server.properties before startup.
     * Set to true to output server.properties contents.
     */
    DUMP_SERVER_PROPERTIES: stringIsBooleanSchema.optional(),

    /**
     * Whitelist of players as a comma or newline-separated string.
     * Example:
     * WHITELIST: "user1\nuser2\nuser3"
     */
    WHITELIST: z.string().optional(),

    /**
     * URL or container path to a whitelist file.
     */
    WHITELIST_FILE: z.string().optional(),

    /**
     * Behavior when an existing whitelist file is present.
     * Default: SYNC_FILE_MERGE_LIST
     */
    EXISTING_WHITELIST_FILE: ExistingFileBehaviorEnum.optional(),

    /**
     * Enforce whitelist changes immediately when whitelist commands are used.
     */
    ENFORCE_WHITELIST: stringIsBooleanSchema.optional(),

    /**
     * Enable whitelist if managing the whitelist file manually.
     */
    ENABLE_WHITELIST: stringIsBooleanSchema.optional(),

    /**
     * User API provider for resolving usernames.
     * Default: PlayerDB
     */
    USER_API_PROVIDER: UserApiProviderEnum.optional(),

    /**
     * Operators (admins) as a comma or newline-separated string.
     * Example:
     * OPS: "admin1\nadmin2\nadmin3"
     */
    OPS: z.string().optional(),

    /**
     * URL or container path to an ops file.
     */
    OPS_FILE: z.string().optional(),

    /**
     * Behavior when an existing ops file is present.
     * Default: SYNC_FILE_MERGE_LIST
     */
    EXISTING_OPS_FILE: ExistingFileBehaviorEnum.optional(),

    /**
     * Enable ops if managing the ops file manually.
     */
    ENABLE_OPS: stringIsBooleanSchema.optional(),

    /**
     * Initial datapacks to enable before world creation.
     * Comma-separated list.
     */
    INITIAL_ENABLED_PACKS: z.string().optional(),

    /**
     * Initial datapacks to disable before world creation.
     * Comma-separated list.
     */
    INITIAL_DISABLED_PACKS: z.string().optional(),

    /**
     * URL to a server icon image.
     */
    ICON: z.string().optional(),

    /**
     * Whether to override the existing server icon.
     * Default: false
     */
    OVERRIDE_ICON: stringIsBooleanSchema.optional(),

    /**
     * Enable RCON for remote console access.
     * Default: true
     */
    ENABLE_RCON: stringIsBooleanSchema.optional(),

    /**
     * RCON password.
     * If not set, a random password is generated on startup.
     */
    RCON_PASSWORD: z.string().optional(),

    /**
     * RCON port.
     * Default: 25575
     */
    RCON_PORT: stringIsNumberSchema.optional(),

    /**
     * Enable the GameSpy query protocol.
     * Default: false
     */
    ENABLE_QUERY: stringIsBooleanSchema.optional(),

    /**
     * Query port (UDP).
     * Default: 25565
     */
    QUERY_PORT: stringIsNumberSchema.optional(),

    /**
     * Maximum number of players.
     * Default: 20
     */
    MAX_PLAYERS: stringIsNumberSchema.optional(),

    /**
     * Maximum world size in blocks (radius).
     */
    MAX_WORLD_SIZE: stringIsNumberSchema.optional(),

    /**
     * Allow players to travel to the Nether.
     * Default: true
     */
    ALLOW_NETHER: stringIsBooleanSchema.optional(),

    /**
     * Announce player achievements in chat.
     * Default: false
     */
    ANNOUNCE_PLAYER_ACHIEVEMENTS: stringIsBooleanSchema.optional(),

    /**
     * Enable command blocks.
     * Default: false
     */
    ENABLE_COMMAND_BLOCK: stringIsBooleanSchema.optional(),

    /**
     * Force players to join in the default game mode.
     * Default: false
     */
    FORCE_GAMEMODE: stringIsBooleanSchema.optional(),

    /**
     * Define whether structures will be generated in new chunks.
     * Default: true
     */
    GENERATE_STRUCTURES: stringIsBooleanSchema.optional(),

    /**
     * Enable hardcore mode where players are set to spectator on death.
     * Default: false
     */
    HARDCORE: stringIsBooleanSchema.optional(),

    /**
     * Enable or disable the snooper (data collection).
     * Default: true
     */
    SNOOPER_ENABLED: stringIsBooleanSchema.optional(),

    /**
     * Maximum build height.
     * Default: 256
     */
    MAX_BUILD_HEIGHT: stringIsNumberSchema.optional(),

    /**
     * Maximum tick time in milliseconds before the server is forcibly shutdown.
     * Set to -1 to disable the watchdog.
     * Default: 60000
     */
    MAX_TICK_TIME: stringIsNumberSchema.optional(),

    /**
     * Allow animals to spawn.
     * Default: true
     */
    SPAWN_ANIMALS: stringIsBooleanSchema.optional(),

    /**
     * Allow monsters to spawn.
     * Default: true
     */
    SPAWN_MONSTERS: stringIsBooleanSchema.optional(),

    /**
     * Allow NPCs (villagers) to spawn.
     * Default: true
     */
    SPAWN_NPCS: stringIsBooleanSchema.optional(),

    /**
     * Set spawn protection area radius.
     * Non-ops cannot edit within this area.
     * Set to 0 to disable.
     * Default: 0
     */
    SPAWN_PROTECTION: stringIsNumberSchema.optional(),

    /**
     * View distance in chunks (radius).
     * Determines server-side viewing distance.
     * Default: 10
     */
    VIEW_DISTANCE: stringIsNumberSchema.optional(),

    /**
     * Seed for world generation.
     * Can be a positive or negative number.
     * Example: "1785852800490497919" or "-1785852800490497919"
     */
    SEED: z.string().optional(),

    /**
     * Game mode for the server.
     * Default: 'survival'
     */
    MODE: GameModeEnum.optional(),

    /**
     * Enable or disable player-vs-player (PVP) mode.
     * Default: true
     */
    PVP: stringIsBooleanSchema.optional(),

    /**
     * Level type for world generation.
     * Default: 'DEFAULT'
     */
    LEVEL_TYPE: LevelTypeEnum.optional(),

    /**
     * JSON string for generator settings.
     * Example for superflat:
     * {
     *   "layers": [
     *     { "block": "minecraft:bedrock", "height": 1 },
     *     { "block": "minecraft:stone", "height": 2 },
     *     { "block": "minecraft:sandstone", "height": 15 }
     *   ],
     *   "biome": "minecraft:desert"
     * }
     */
    GENERATOR_SETTINGS: z.string().optional(),

    /**
     * URL to a custom resource pack.
     */
    RESOURCE_PACK: z.string().optional(),

    /**
     * SHA1 checksum of the custom resource pack.
     */
    RESOURCE_PACK_SHA1: z.string().optional(),

    /**
     * Enforce the resource pack on clients.
     * Default: false
     */
    RESOURCE_PACK_ENFORCE: stringIsBooleanSchema.optional(),

    /**
     * Name of the world save.
     * Default: 'world'
     */
    LEVEL: z.string().optional(),

    /**
     * Online mode for authentication.
     * Default: true
     */
    ONLINE_MODE: stringIsBooleanSchema.optional(),

    /**
     * Allow flight for players with mods.
     * Default: false
     */
    ALLOW_FLIGHT: stringIsBooleanSchema.optional(),

    /**
     * Name of the server (e.g., for BungeeCord).
     */
    SERVER_NAME: z.string().optional(),

    /**
     * Server port.
     * Only change if necessary and ensure port mappings are updated.
     * Default: 25565
     */
    SERVER_PORT: stringIsNumberSchema.optional(),

    /**
     * Custom server properties as newline-delimited name=value pairs.
     * Example:
     * "custom1=value1\ncustom2=value2"
     */
    CUSTOM_SERVER_PROPERTIES: z.string().optional(),

    /*
     * =================================
     * === Modrinth Modpacks Section ===
     * =================================
     */

    /**
     * Specifies the Modrinth modpack project.
     * Can be a slug, project ID, project URL, custom URL to mrpack file, or container path to local mrpack file.
     */
    MODRINTH_MODPACK: z.string().optional(),

    /**
     * Platform for the modpack. Setting to "MODRINTH" enables automatic installation.
     * Alternatively, set MOD_PLATFORM or TYPE to "MODRINTH".
     */
    MODPACK_PLATFORM: z.string().optional(), // Alternatively, consider defining as an enum if applicable.

    /**
     * Alternative platform setting for the modpack. Setting to "MODRINTH" enables automatic installation.
     */
    MOD_PLATFORM: z.string().optional(), // Alternatively, define as enum.

    /**
     * Alternative type setting for the modpack. Setting to "MODRINTH" enables automatic installation.
     */
    TYPE: z.string().optional(), // Alternatively, define as enum.

    /**
     * Specifies the desired modpack version type when VERSION is "LATEST" or "SNAPSHOT".
     * Valid values: 'release', 'beta', 'alpha'.
     */
    MODRINTH_DEFAULT_VERSION_TYPE: ModrinthDefaultVersionTypeEnum.optional(),

    /**
     * Specifies the mod loader type for the modpack.
     * Valid values: 'forge', 'fabric', 'quilt'.
     */
    MODRINTH_LOADER: ModrinthLoaderEnum.optional(),

    /**
     * Specifies which files to ignore if they are missing during installation.
     * Comma or newline delimited list.
     */
    MODRINTH_IGNORE_MISSING_FILES: z.string().optional(),

    /**
     * Specifies files to exclude from the modpack installation.
     * Comma or newline delimited list of partial file names.
     */
    MODRINTH_EXCLUDE_FILES: z.string().optional(),

    /**
     * Specifies files to force include in the modpack installation.
     * Comma or newline delimited list of partial file names.
     */
    MODRINTH_FORCE_INCLUDE_FILES: z.string().optional(),

    /**
     * Forces synchronization of include/exclude files.
     * Useful when iterating on compatible sets of mods.
     * Default: false
     */
    MODRINTH_FORCE_SYNCHRONIZE: stringIsBooleanSchema.optional(),

    /**
     * Disables default exclude/include settings maintained by the image.
     * Set to an empty string to disable defaults.
     */
    MODRINTH_DEFAULT_EXCLUDE_INCLUDES: z.string().optional(),

    /**
     * Specifies overrides exclusions using ant-style paths relative to the overrides or /data directory.
     * Comma or newline delimited list of ant-style paths.
     */
    MODRINTH_OVERRIDES_EXCLUSIONS: z.string().optional(),
  })
  .catchall(z.string());

/**
 * TypeScript type inferred from the MinecraftServerConfigSchema.
 */
export type MinecraftJavaImageConfig = z.infer<
  typeof minecraftJavaImageConfigSchema
>;
