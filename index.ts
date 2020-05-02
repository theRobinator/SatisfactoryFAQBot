import * as Discord from 'discord.js';


// When a message is posted in a supported channel matching the regex, the bot will post the response value.
// Variable replacements can be used for dynamic messages - see replaceVariables()
const RESPONSES = new Map<RegExp, string>([
    [/missing sid(_p)?/i, 'Did you get a message about missing SID_p from your install? You need to install Satisfactory Item Dictionary from https://ficsit.app/mod/CkUs5KM9ShwVfr'],
    [/(where|how)\s+((can|do)\s+i|to)\s+(find|download|get|install)(\s+(the|a))?\s+mods?/i, 'Hey {{authorMention}}, this image should help: https://cdn.discordapp.com/attachments/562722542473969665/693831138598322176/GETMODS1.png'],
    [/((where|how)\s+((can|do)\s+i|to)|help\s*(me|(me\s*)?(with\s*)?)?)\s+(find(ing)?|download(ing)?|install(ing)?|get(ting)?|put|sav(e|ing))\s+(sml|xinput|satisfactory\s+mod\s+loader|mods?)/i, 'Hey {{authorMention}}, this image should help: https://cdn.discordapp.com/attachments/562722542473969665/693831138598322176/GETMODS1.png'],
    [/(where|how)\s+((can|do)\s+i|to)\s+((start|learn( to)?|get started)\s+)?(modding|mak(e|ing) mods?|mod making)/i, "Hey {{authorMention}}, here are some resources for getting started modding:\nHow to set up your environment:  https://www.youtube.com/watch?v=-HVw6-3Awqs\nDocumentation: https://docs.ficsit.app\nSatisfactory Headers: https://sf-headers.ficsit.app\nSDK Headers: https://sdk-headers.ficsit.app"],
    [/kronos.*(ready|release|work|crash|load|start|error|broke|updat|mess)/i, "Hi {{authorMention}}, the Kronos Mod hasn't been updated for update 3 yet. Kronos is working on it, but no release date has been announced. You might be interested in the Pak Utility Mod instead, which does a lot of the same things."],
]);

const MEDIA_ONLY_CHANNELS = new Set<string>([
    'art',
    'work-in-progress',
]);

const MEDIA_EXTENSIONS = '\.(jpe?g|gif|png|bmp|tiff|webp|svg|mp4|mov|webm|wmv|ogg|mp3|wav)'
const MEDIA_FILE_REGEX = new RegExp(MEDIA_EXTENSIONS + '$', 'i');
const LINK_REGEX = new RegExp('https?://\\S+' + MEDIA_EXTENSIONS + '(\\s|$)', 'i');
const WARNING_MESSAGE_DURATION = 10000;


function main(): void {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag} and ready to answer questions!`);
    });

    client.on('message', (message) => {
        if (!(message.channel instanceof Discord.TextChannel) || !isEligibleForResponse(message)) {
            return;
        }

        if (MEDIA_ONLY_CHANNELS.has(message.channel.name)) {
            respondToMediaChannelMessage(message);
        } else {
            const response = respondToTextChannelMessage(message);
            
        }
    });

    const auth = require(process.cwd() + '/auth.json');
    client.login(auth.token);
}


export function isEligibleForResponse(message: Discord.Message): boolean {
    if (message.author.bot || !message.member) {
        return false;
    }
    const authorRoles = message.member.roles;
    if (authorRoles.size !== 1 || authorRoles.first().name !== '@everyone') {
        return false;
    }
    return message.channel instanceof Discord.TextChannel;
}


export function respondToTextChannelMessage(message: Discord.Message): void {
    // Answer FAQs
    const content = message.content;
    let answer = '';
    for (const [regex, response] of RESPONSES) {
        if (regex.exec(content)) {
            answer = replaceVariables(message, response);
            break;
        }
    }
    if (answer) {
        message.channel.send(answer);
    }
}

export async function respondToMediaChannelMessage(message: Discord.Message): Promise<void> {
    if (!hasMediaAttachments(message)) {
        message.delete();
        const warning = replaceVariables(message, "Hi {{authorMention}}, only images and videos are allowed in this channel. Please post comments in #show-discussions instead.");
        const sentMessage = await message.channel.send(warning) as Discord.Message;
        setTimeout(() => sentMessage.delete(), WARNING_MESSAGE_DURATION);
    }
}


export function replaceVariables(sourceMessage: Discord.Message, rawString: string): string {
    // Variables on the left surrounded with {{ }} will be replaced with values on the right.
    // This can't be moved outside of this function as it actually renders the value of EVERY variable here to avoid using eval()
    const variableValues = new Map([
        ['authorMention', `<@${sourceMessage.author.id}>`],
    ]);

    return rawString.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
        return variableValues.get(varName) || varName;
    });
}

export function hasMediaAttachments(message: Discord.Message): boolean {
    for (const [_, attachment] of message.attachments) {
        if (attachment.filename.match(MEDIA_FILE_REGEX)) {
            return true;
        }
    }

    return !!LINK_REGEX.exec(message.content);
}


main();
