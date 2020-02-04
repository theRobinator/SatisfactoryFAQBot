import {respondToMessage} from '../index';
import * as Discord from 'discord.js'


describe('Response parsing', () => {
    const fakeChannel = new Discord.TextChannel({} as any, {});
    fakeChannel.name = 'i-need-help';

    it('responds to questions about mod support in multiplayer', () => {
        const messages = [
            'do mods work in multiplayer?',
            'Can I use mods in multiplayer?',
            'Is this mod functional in multiplayer?',
            "The elevator mod doesn't work with multiplayer",
            "The elevator mod does not work with multiplayer",
            "Help! Mods aren't working for multiplayer",
            "Help! Mods are not working for multiplayer",
            "Do we have mod support for multiplayer yet",
            'MODS ARE NOT WORK IN MP!!!!!',
            "I can't get this mod working in multiplayer, please help",
            "hey y'all, mods aren't working for me in multiplayer",
        ];
        
        for (const m of messages) {
            const messageObject: any = {
                author: {
                    id: '12345',
                },
                content: m,
                channel: fakeChannel,
            };
            expect(respondToMessage(messageObject)).toBe("Hey <@12345>, mods don't work in multiplayer.");
        }
    });

    it('Does not respond to questions unrelated to FAQs', () => {
        const messages = [
            "Anybody want to play multiplayer?",
            "Mods aren't working for me",
            "Somebody help, I'm lost in the forest",
        ];
        
        for (const m of messages) {
            const messageObject: any = {
                author: {
                    id: '12345',
                },
                content: m,
                channel: fakeChannel,
            };
            expect(respondToMessage(messageObject)).toBe(null);
        }
    });
});
