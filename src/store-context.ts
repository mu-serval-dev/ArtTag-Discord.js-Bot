import { ContextMenuCommandBuilder, InteractionContextType } from "discord.js";

// context menu version of store command
// right click image to open menu to add tag and store

const def = new ContextMenuCommandBuilder()
    .setName("store")
    .setContexts([InteractionContextType.Guild])