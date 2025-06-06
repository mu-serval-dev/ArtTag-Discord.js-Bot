import config from '../config.json' with { type: 'json' };
import {AutocompleteInteraction, ChatInputCommandInteraction, Events, GatewayIntentBits, type CacheType, type Interaction } from 'discord.js';
import fs, { Dirent } from 'node:fs'
import  path from 'node:path'
import { CommandClient, type Command, isCommand } from './types.js';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const client = new CommandClient({
	intents: [
		GatewayIntentBits.Guilds,
	],
});

const main_folder = path.join(__dirname, "commands");
const command_files:Array<Dirent> = fs.readdirSync(main_folder, {"recursive" : true, "withFileTypes": true}).filter(ent => ent.isFile() && ent.name.endsWith(".js"));

for (let i = 0; i < command_files.length; i++) {
	const file = command_files[i]
	console.info(`[INFO] Importing command definition \`${file.name}\``)
	const fpath = path.join(file.parentPath, file.name);
	const rel_path =  "./" + path.relative(__dirname, fpath);
	// console.info(`[INFO] Importing ${fpath}`)
	const module = await import("file://" + fpath);
	const command:Command = module.default;
	if (!isCommand(command)) {
		console.warn(`[WARN] Command definition \`${file.name}\` is missing some props, skipping`)
		continue
	}
	// add command to client's collection
	client.commands.set(command.data.name, command)
}

async function handleSlashCommand(interaction: ChatInputCommandInteraction<CacheType>) {
	const client = interaction.client as CommandClient
	const command = client.commands.get(interaction.commandName)

	if (!command) {
		console.error(`[ERROR] No definition found for command \`${interaction.commandName}\``)
		return
	}

	try {
		await command.execute(interaction)
		console.log(`[INFO] Responded to \`${interaction.commandName}\` command`)
	}
	catch (error) {
		console.error(`[ERROR] Error when executing command \`${interaction.commandName}\``)
		console.error(error)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({content: 'There was an error executing this command!', ephemeral: true})
		}
		else {
			await interaction.reply({content: 'There was an error executing this command!', ephemeral: true})
		}
	}
}

async function handleAutocomplete(interaction: AutocompleteInteraction<CacheType>) {
	const client = interaction.client as CommandClient
	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`[ERROR] No definition found for command \`${interaction.commandName}\``);
		return;
	}

	if (!command.autocomplete) {
		console.error(`[ERROR] Command \`${interaction.commandName}\` has no autocomplete functionality`);
		return;
	}

	try {
		await command.autocomplete(interaction);
	} catch (error) {
		console.error(`[ERROR] Error when executing command \`${interaction.commandName}\``)
		console.error(error);
	}
}


client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()){
		handleSlashCommand(interaction)
	}
	else if (interaction.isAutocomplete()) {
		handleAutocomplete(interaction)
	}
})


client.once(Events.ClientReady, client => {
    console.info(`[INFO] Ready! Logged in as ${client.user.tag}`);
})

client.login(config.token);