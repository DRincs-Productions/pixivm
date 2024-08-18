import { CompleteCallback, Filter, filters, IMediaInstance, Options, Sound as PixiSound, PlayOptions } from "@pixi/sound";
import { narration } from "../managers";
import SoundManagerStatic from "../managers/SoundManagerStatic";

export default class Sound extends PixiSound {
    alias?: string;
    override pause(): this {
        if (!this.alias) {
            throw new Error("[Pixi'VN] The alias is not defined.");
        }
        let item = SoundManagerStatic.playInStepIndex[this.alias]
        if (!item) {
            throw new Error("[Pixi'VN] The alias is not found in the playInStepIndex.");
        }
        SoundManagerStatic.playInStepIndex[this.alias] = {
            ...item,
            paused: true
        }
        return super.pause();
    }
    override resume(): this {
        if (!this.alias) {
            throw new Error("[Pixi'VN] The alias is not defined.");
        }
        let item = SoundManagerStatic.playInStepIndex[this.alias]
        if (!item) {
            throw new Error("[Pixi'VN] The alias is not found in the playInStepIndex.");
        }
        SoundManagerStatic.playInStepIndex[this.alias] = {
            options: item.options,
            stepIndex: narration.lastStepIndex,
            paused: false
        }
        return super.resume();
    }
    override set filters(f: Filter[]) {
        super.filters = f.filter(f => {
            return !(f instanceof filters.Filter);
        })
    }
    override destroy(): void {
        if (this.alias) {
            delete SoundManagerStatic.playInStepIndex[this.alias];
        }
        return super.destroy();
    }
    override stop(): this {
        if (!this.alias) {
            throw new Error("[Pixi'VN] The alias is not defined.");
        }
        delete SoundManagerStatic.playInStepIndex[this.alias];
        return super.stop();
    }
    override play(alias: string, callback?: CompleteCallback): IMediaInstance | Promise<IMediaInstance>;
    override play(source?: string | PlayOptions, callback?: CompleteCallback): IMediaInstance | Promise<IMediaInstance>;
    override play(options?: string | PlayOptions, callback?: CompleteCallback): IMediaInstance | Promise<IMediaInstance> {
        if (typeof options === 'string') {
            this.alias = options;
        }
        if (!this.alias) {
            throw new Error("[Pixi'VN] The alias is not defined.");
        }
        SoundManagerStatic.playInStepIndex[this.alias] = {
            stepIndex: narration.lastStepIndex,
            options: options,
            paused: false
        }
        return super.play(options, callback);
    }

    /**
     * https://github.com/pixijs/sound/blob/main/src/Sound.ts#L235
     */
    public static from(source: string | string[] | Options | ArrayBuffer | HTMLAudioElement | AudioBuffer): Sound {
        let s = PixiSound.from(source);
        return new Sound(s.media, s.options);
    }
}
