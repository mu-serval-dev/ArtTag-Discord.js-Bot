# ArtTag-Discord.js-Bot
Discord.js bot for storing art image links from various websites, along with emote reactions as tags. Art links will be queried and viewed using these tags.

### Concept
Users that post images or links that embed an image in a discord channel that the bot has access to will be able to have the bot save and associate that image with a particular emote by adding an emote reaction to the image message. Images that have been "tagged" with a particular emote can later be viewed in an image gallery embed by using a special slash-command that provides the desired emote. The image gallery can be clicked through to view each image tagged with the given emote from most recent to least recent.

The goal of this bot is to provide a tagging function such that a discord server in which art is frequently posted can sort of organize and retrieve images quickly.

###  Tools
- PostgreSQL for Link Database
- Discord.js Discord API wrapper
- Javascript

### How To: Setup

# config.json
- bot token
- dbstring
- dbobj
- schema
- prefix
