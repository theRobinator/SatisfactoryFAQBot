import * as Discord from 'discord.js';


// Bot will only respond to messages in these channels
const SUPPORTED_CHANNELS = new Set([
    'i-need-help',
]);

const doesNotWorkRegexBase = "mods?\\s+((doesn't|don't|does not|not|are not|aren't)\\s+)?((work(ing|s)?|function(al|ing|s)?|compatible|support(ed)?)\\s+)?(in|with|on|for)\\s+(me (on|in)\\s+)?";

// When a message is posted in a supported channel matching the regex, the bot will post the response value.
// Variable replacements can be used for dynamic messages - see replaceVariables()
const RESPONSES = new Map<RegExp, string>([
    [new RegExp(doesNotWorkRegexBase + '(multiplayer|mp)', 'i'), "Hey {{authorMention}}, mods don't work in multiplayer yet. Wait for SML 1.1+ to come out."],
    [new RegExp(doesNotWorkRegexBase + '(the\\s+)?experimental', 'i'), "Hey {{authorMention}}, mods don't work in experimental yet. Wait for SML 1.1+ to come out, and use Early Access until then."],
    [/missing sid_p/i, 'Did you get a message about missing SID_p from your install? You need to install Satisfactory Item Dictionary from https://ficsit.app/mod/CkUs5KM9ShwVfr'],
    [/(where|how)\s+((can|do)\s+i|to)\s+(find|download|get)(\s+(the|a))?\s+mods?/i, 'Hey {{authorMention}}, you can find mods to download at https://ficsit.app'],
    [/((where|how)\s+((can|do)\s+i|to)|help\s*(me|(me\s*)?(with\s*)?)?)\s+(find(ing)?|download(ing)?|install(ing)?|get(ting)?|put|sav(e|ing))\s+(sml|xinput|satisfactory\s+mod\s+loader)/i, 'Hey {{authorMention}}, check out this video tutorial: https://www.youtube.com/watch?v=OTIIhwZG1Wk'],
    [/(where|how)\s+((can|do)\s+i|to)\s+(start|learn( to)?|get started)\s+(modding|mak(e|ing) mods?|mod making)/i, "Hey {{authorMention}}, here are some resources for getting started modding:\nDocumentation: https://docs.ficsit.app\nSatisfactory Headers: https://sf-headers.ficsit.app\nSDK Headers: https://sdk-headers.ficsit.app"],
]);


function main(): void {
    const client = new Discord.Client();

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag} and ready to answer questions!`);
    });

    client.on('message', (message) => {
        if (message.author.bot) {
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


export function respondToMessage(message: Discord.Message): string|null {
    if (message.channel instanceof Discord.TextChannel && SUPPORTED_CHANNELS.has(message.channel.name)) {
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
