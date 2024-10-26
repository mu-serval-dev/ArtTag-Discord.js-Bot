import config from '../config.json' assert { type: 'json' };
import fs, { Dirent } from 'node:fs'
import  path from 'node:path'
import { type Command, isCommand } from './types.js';
import { fileURLToPath } from 'node:url';
import { REST, Routes, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands:Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];

const main_folder = path.join(__dirname, "commands");
const command_files:Array<Dirent> = fs.readdirSync(main_folder, {"recursive" : true, "withFileTypes": true}).filter(ent => ent.isFile() && ent.name.endsWith(".js"));

for (let i = 0; i < command_files.length; i++) {
	const file = command_files[i];
	console.info(`[INFO] Found command file ${file.name}`);
	const fpath = path.join(file.parentPath, file.name);
	const rel_path =  "./" + path.relative(__dirname, fpath);
	console.info(`[INFO] Importing ${fpath}`);
	const module = await import("file://" + fpath);
	const command:Command = module.default;
	if (!isCommand(command)) {
		console.warn(`[WARN] Command file ${file.name} is missing some props, skipping`);
		continue;
	}
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(config["token"]);

(async () => {
    try {
        console.log(`[INFO] Started registering ${commands.length} application (/) commands.`);
        // TODO: register command in every guild bot is in, not just test one
        const data = await rest.put(
            Routes.applicationGuildCommands(config["clientId"], config["guildId"]),
            { body: commands }
        );

        if (data != null && typeof data === "object" && "length" in data) {
            console.log(`[SUCCESS] Successfully registered ${data.length} application (/) commands.`);
        }
        else {
            console.warn(`[WARNING] Unable to interpret API response`)
        }
    }
    catch (error) {
        console.error(`[FAILURE] Encountered an error`);
        console.error(error);
    }
})();

