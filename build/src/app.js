import configjson from '../config.json' assert { type: 'json' };
import { Events, GatewayIntentBits } from 'discord.js';
import fs, { Dirent } from 'node:fs';
import path from 'node:path';
import { CommandClient, isCommand } from './types.js';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client = new CommandClient({
    intents: [
        GatewayIntentBits.Guilds
    ],
});
const main_folder = path.join(__dirname, "commands");
const command_files = fs.readdirSync(main_folder, { "recursive": true, "withFileTypes": true }).filter(ent => ent.isFile() && ent.name.endsWith(".js"));
for (let i = 0; i < command_files.length; i++) {
    const file = command_files[i];
    console.info(`[INFO] Found command file ${file.name}`);
    const fpath = path.join(file.parentPath, file.name);
    const rel_path = "./" + path.relative(__dirname, fpath);
    // console.debug(`${rel_path}`)
    // const command = await import(rel_path);
    console.info(`[INFO] Importing ${fpath}`);
    const module = await import("file://" + fpath);
    const command = module.default;
    if (!isCommand(command)) {
        console.warn(`[WARN] Command file ${file.name} is missing some props, skipping`);
        continue;
    }
}
client.once(Events.ClientReady, client => {
    console.info(`[INFO] Ready! Logged in as ${client.user.tag}`);
    // TODO: register commands
});
// client.login(configjson.token);
