import {respondToTextChannelMessage} from '../index';
import * as Discord from 'discord.js'


describe('Response parsing', () => {
    const fakeChannel = new Discord.TextChannel({} as any, {});
    fakeChannel.name = 'i-need-help';

    function makeMessage(text: string): Discord.Message {
        return {
            author: {
                id: '12345',
            },
            content: text,
            channel: fakeChannel,
        } as any;
    }

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
            const messageObject = makeMessage(m);
            expect(respondToTextChannelMessage(messageObject)).toBe("Hey <@12345>, mods don't work in multiplayer yet. Wait for SML 1.1+ to come out.");
        }
    });

    it('responds to questions about mod support in experimental', () => {
        const messages = [
            'do mods work in experimental?',
            'Can I use mods in the experimental build?',
            'Is this mod functional in experimental?',
        ];
        
        for (const m of messages) {
            const messageObject = makeMessage(m);
            expect(respondToTextChannelMessage(messageObject)).toBe("Hey <@12345>, mods don't work in experimental yet. Wait for SML 1.1+ to come out, and use Early Access until then.");
        }
    });

    it('responds to questions about installing SML', () => {
        const messages = [
            'i need help installing sml',
            'Can somebody please help me with installing SML?',
            'How do I install xinput1_3.dll?',
            'how can i get sml',
            "I can't figure out where to put xinput1_3.dll",
            "show me where to download satisfactory mod loader",
        ];
        
        for (const m of messages) {
            const messageObject = makeMessage(m);
            expect(respondToTextChannelMessage(messageObject)).toBe("Hey <@12345>, check out this video tutorial: https://www.youtube.com/watch?v=OTIIhwZG1Wk");
        }
    });

    it('responds to questions about missing SID_p', () => {
        const messages = [
            'You are missing SID_p from your install!',
        ];
        
        for (const m of messages) {
            const messageObject = makeMessage(m);
            expect(respondToTextChannelMessage(messageObject)).toBe("Did you get a message about missing SID_p from your install? You need to install Satisfactory Item Dictionary from https://ficsit.app/mod/CkUs5KM9ShwVfr");
        }
    });

    it('responds to questions about where to download mods', () => {
        const messages = [
            'where do i get mods?',
            'how can i download mods?',
            'Please help with where to find the mods, thanks',
        ];
        
        for (const m of messages) {
            const messageObject = makeMessage(m);
            expect(respondToTextChannelMessage(messageObject)).toBe("Hey <@12345>, you can find mods to download at https://ficsit.app");
        }
    });

    it('responds to questions about getting started in modding', () => {
        const messages = [
            'How do i get started modding?',
            'Can someone tell me how to start making mods?',
            'Where can I learn to make mods?',
            'How do I start making mods?',
            "how do i make mods?",
        ];
        
        for (const m of messages) {
            const messageObject = makeMessage(m);
            expect(respondToTextChannelMessage(messageObject)).toBe("Hey <@12345>, here are some resources for getting started modding:\nDocumentation: https://docs.ficsit.app\nSatisfactory Headers: https://sf-headers.ficsit.app\nSDK Headers: https://sdk-headers.ficsit.app");
        }
    });

    it('Does not respond to questions unrelated to FAQs', () => {
        const messages = [
            "Anybody want to play multiplayer?",
            "When is SML 2.0 coming out?",
            "Mods aren't working for me",
            "Somebody help, I'm lost in the forest",
            "I'm having trouble downloading mods",
        ];
        
        for (const m of messages) {
            const messageObject = makeMessage(m);
            expect(respondToTextChannelMessage(messageObject)).toBe(null);
        }
    });
});
