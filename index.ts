import * as Discord from 'discord.js';



// When a message is posted in a supported channel matching the regex, the bot will post the response value.
// Variable replacements can be used for dynamic messages - see replaceVariables()
const RESPONSES = new Map<RegExp, string>([
    [/missing sid(_p)?/i, 'Did you get a message about missing SID_p from your install? You need to install Satisfactory Item Dictionary from https://ficsit.app/mod/CkUs5KM9ShwVfr'],
    [/(where|how)\s+((can|do)\s+i|to)\s+(find|download|get)(\s+(the|a))?\s+mods?/i, 'Hey {{authorMention}}, you can find mods to download at https://ficsit.app'],
    [/((where|how)\s+((can|do)\s+i|to)|help\s*(me|(me\s*)?(with\s*)?)?)\s+(find(ing)?|download(ing)?|install(ing)?|get(ting)?|put|sav(e|ing))\s+(sml|xinput|satisfactory\s+mod\s+loader)/i, 'Hey {{authorMention}}, check out this video tutorial: https://www.youtube.com/watch?v=OTIIhwZG1Wk'],
    [/(where|how)\s+((can|do)\s+i|to)\s+((start|learn( to)?|get started)\s+)?(modding|mak(e|ing) mods?|mod making)/i, "Hey {{authorMention}}, here are some resources for getting started modding:\nDocumentation: https://docs.ficsit.app\nSatisfactory Headers: https://sf-headers.ficsit.app\nSDK Headers: https://sdk-headers.ficsit.app"],
    [/kronos.*(ready|release|work|crash|load|start|error)/i, "Hi {{authorMention}}, the Kronos Mod hasn't been updated for update 3 yet. Kronos is working on it, but no release date has been announced. Pinging him won't make him work faster."],
]);


function main(): void {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag} and ready to answer questions!`);
    });

    client.on('message', (message) => {
        if (!isEligibleForResponse(message)) {
            return;
        }
        const response = respondToMessage(message);
        if (response) {
            message.channel.send(response);
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
    if (authorRoles.size === 1 && authorRoles.first().name === '@everyone') {
        return true;
    }
    return false;
}


export function respondToMessage(message: Discord.Message): string|null {
    if (message.channel instanceof Discord.TextChannel) {
        const content = message.content;
        for (const [regex, response] of RESPONSES) {
            if (regex.exec(content)) {
                return replaceVariables(message, response);
            }
        }
    }
    return null;
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


main();
