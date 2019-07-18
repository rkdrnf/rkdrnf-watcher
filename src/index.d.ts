
declare module "rkdrnf-watcher" {
    export interface Component {
        step(): void;
        watch(prop: string, func: IWatchCallback);
    }

    export type IWatchCallback = (arg: IWatchChanges) => void;
    export interface IWatchChanges {
        old: any,
        val: any
    }

    export var Component: {
        new(): Component;
    }
}
