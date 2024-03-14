import { EmbedBuilder } from 'discord.js';
import { BaseClass } from './BaseClass';

export abstract class BaseCommand extends BaseClass {
    public embed = new EmbedBuilder().setColor('Green');
}
