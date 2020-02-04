import * as Discord from 'discord.js'


// Bot will only respond to messages in these channels
const SUPPORTED_CHANNELS = new Set([
    'i-need-help',
    'general',
]);

// When a message is posted in a supported channel matching the regex, the bot will post the response value.
// Variable replacements can be used for dynamic messages - see replaceVariables()
const RESPONSES = new Map<RegExp, string>([
    [/mods?\s+((doesn't|don't|does not|not|are not|aren't)\s+)?((work(ing|s)?|function(al|ing|s)?|compatible|support(ed)?)\s+)?(in|with|on|for)\s+(me (on|in)\s+)?(multiplayer|mp)/i, "Hey {{authorMention}}, mods don't work in multiplayer."],
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


export function respondToMessage(message: Discord.Message): string {
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

    return rawString.replace(/\{\{([^}]+)\}\}/, (match, varName) => {
        return variableValues.get(varName) || varName;
    });
}


main();
