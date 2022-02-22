import { Functor } from "Functories";
import LivingGraphPlugin from "main";
import { WorkspaceLeaf } from "obsidian";
import { getScaleConversion } from "graphManip";

type G_F_X = (value: number, graphs: WorkspaceLeaf[]) => void;

export interface iInterval {
    lower: number;
    upper: number;
    g_x: G_F_X;
    f_x: Functor;
    timeDilation: number;
    relativeOfsset?:number;
    invert?:boolean;
    multiplier?:number;
    verticalOffset?:number;
    preventClamp?:boolean;
}




        

export class Interval implements iInterval {
    lower: number;
    upper: number;
    timeDilation: number;
    relativeOfsset?:number;
    invert?:boolean;
    multiplier?:number;
    verticalOffset?:number;
    preventClamp?:boolean;
    g_x: G_F_X;
    f_x: Functor;
    evaluator: (time: number) => number;
    private _interval: any = null;
    private _memoized: number[];
    private _periodMs: number;
    private _updatePeriodMs: number;
    private _updatesPerSecond: number;
    private _tslices: number;
    private _desiredUpdatesPerPeriod: number = 24;
    private _desiredUpdatesPerSecond: number = 5;
    private _maxUpdatesPerSecond = 27;
    private _inversionCenter: number;
    

    //constructor
    constructor(interval: iInterval, public plugin: LivingGraphPlugin) {
        Object.assign(this, interval);
        [this.lower, this.upper] = getScaleConversion(this.g_x.name, [this.lower, this.upper]);
        this._inversionCenter = (this.lower + this.upper) / 2;
        this._periodMs = this.f_x.period(this.timeDilation) * 1000;
        this._updatesPerSecond = Math.min(this._maxUpdatesPerSecond,
            Math.max(this._desiredUpdatesPerSecond, Math.ceil((1000 * this._desiredUpdatesPerPeriod) / this._periodMs)
            ));
        this._updatePeriodMs = 1000 / this._updatesPerSecond;
        this._tslices = Math.ceil(this._periodMs / this._updatePeriodMs);
        this.evaluator = this._tslices > 10 ? this.memodEvaluate.bind(this) : this.evaluate.bind(this);
        if (this._tslices > 10) this.memoizeInterval();

    }

    public isActive() { return this._interval !== null; }

    public start(leaves: WorkspaceLeaf[]) {
        if (this._interval) return;
        let offset = (Date.now() % this._periodMs) + (this.relativeOfsset??0)*this._periodMs??0; // offset to start at x=0
        this._interval = setInterval(() => {
            this.g_x(this.evaluator(Date.now()-offset), leaves);
        }, this._updatePeriodMs);
    }

    public clear() {
        clearInterval(this._interval);
        this._interval = null;
    }

    private evaluate(time: number): number {
        let res = this.f_x(time / (this.timeDilation * 1000), this.lower, this.upper,this._updatePeriodMs);
        res = this.invert ? this._inversionCenter +(this._inversionCenter-res) : res;
        res = this.multiplier ? ((res-this._inversionCenter) * this.multiplier+this._inversionCenter) : res;
        return (this.verticalOffset ?? 0) + (this.preventClamp ? res : Math.clamp(res, this.lower, this.upper));
    }

    private memodEvaluate(time: number) {
        if (!this._memoized) this.memoizeInterval();
        return this._memoized[Math.floor(time % this._periodMs / this._updatePeriodMs)];
    }

    private memoizeInterval() {
        this._memoized = [];
        for (let i = 0, time = 0; i < this._tslices; i++, time += this._updatePeriodMs) this._memoized.push(this.evaluate(time));
    }

}
// returns the size in kilobytes of the array passed in
function getObjectSize(obj: any) {
    let size = 0;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size * 8;
}