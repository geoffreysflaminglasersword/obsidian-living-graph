import { WorkspaceLeaf } from "obsidian";

type F_X = (x: number, u: number, v: number, d: number) => number;
type F_XC = (x: number, u: number, v: number, d: number, cf: Coefs) => number;
type FArgs = Parameters<F_X>;
export type Coefs = [number, number][];

export interface Functor {
    (x: number, min: number, max: number, delta: number): number;
    period(dilation: number): number;
}

export class PeriodicFunctory<Func extends Function> {
    protected _scale = 1;
    protected constructor(protected _func: Func) { }

    public call(x: number, min: number, max: number, delta: number) { return this._func.apply(this, arguments); }

    public period(dilation: number) { return (dilation / this._scale) * Math.PI; }

    protected static createHelp<Func extends Function, Derived extends PeriodicFunctory<Func>>(
        type: { new(...args: any[]): Derived; }, ...args: any[]): Functor {
        const instance = new type(...args);
        return Object.assign(
            (...innerargs: FArgs) => instance.call(...innerargs),
            { period: (dilation: number) => instance.period(dilation) }
        );
    }
    public static create<Func extends Function>(...args: any[]) {
        return PeriodicFunctory.createHelp(FunctoryStandin, ...args);
    }
}

class FunctoryStandin<Func extends Function> extends PeriodicFunctory<Func> {
    constructor(func: Func) {
        super(func);
    }
}

export class WaveFunctory<Func extends F_XC> extends PeriodicFunctory<Func> {
    public constructor(func: Func, private coefficients: Coefs,normalize = true) {
        super(func);
        this._scale = normalize ? coefficients.reduce((a, b) => a + Math.abs(b[1]), 0) : 1;
    }
    public call(x: number, min: number, max: number, delta: number) {
        return this._func.apply(this, [x, min, max, delta, this.coefficients]);
    }

    public static create<Func extends F_XC, Derived extends WaveFunctory<Func>>(...args: any[]) {
        return super.createHelp(WaveFunctory, ...args);
    }

}


export function scaledWave(x: number, min: number, max: number, delta: number, coefficients: Coefs,normalize=true) {
    return min + (max - min) * wave.apply(this, [Math.sin,x, coefficients,normalize]);
}
export function iscaledWave(x: number, min: number, max: number, delta: number, coefficients: Coefs,normalize=true) {
    return min + (max - min) * wave.apply(this, [Math.cos,x, coefficients,normalize]);
}

// wave sumation, accepts any number of coefficient pairs and reduces them to p1.1*sin(x*p1.0)+p2.1*sin(x*p2.0)+...
export function wave(func:any,x: number, coefficients: Coefs,normalize=true) {
    if(normalize) x *= this._scale * 2;
    let sum = coefficients.reduce((a, b) => [a[0] + b[1] * func(x * b[0]), 0], [0, 0])[0];
    return normalize ? ((sum / this._scale) + 1) / 2 : sum;
}

