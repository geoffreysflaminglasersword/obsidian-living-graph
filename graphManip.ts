import { WorkspaceLeaf } from "obsidian";
import { iInterval } from "interval";

// different graph forces have different scales, this converts everything to a 0-1 scale
export function getScaleConversion(from: string, for_:[number, number]) {
    const scaleConversions: Map<string, [number, number]> = new Map([
        ["setRepelStrength", [0, 20]],
        ["setLinkDistance", [30, 500]],
    ]);

    let [low, high] = scaleConversions.get(from.replace(/bound /, '')) ?? [0, 1];
    let [lower,upper] = for_;
    lower *= (high - low);
    upper *= (high - low);
    return [lower, upper];
}


export function setCenterForce(centerForce: number, leaves: WorkspaceLeaf[]) {
    leaves.forEach((leaf) => getEngine(leaf).forceOptions.optionListeners.centerStrength(centerForce));
}
export function setLinkDistance(linkDistance: number, leaves: WorkspaceLeaf[]) {
    leaves.forEach((leaf) => getEngine(leaf).forceOptions.optionListeners.linkDistance(linkDistance));
}
export function setLinkStrength(linkStrength: number, leaves: WorkspaceLeaf[]) {
    leaves.forEach((leaf) => getEngine(leaf).forceOptions.optionListeners.linkStrength(linkStrength));
}
export function setRepelStrength(repelStrength: number, leaves: WorkspaceLeaf[]) {
    leaves.forEach((leaf) => getEngine(leaf).forceOptions.optionListeners.repelStrength(repelStrength));
}

function getEngine(leaf: WorkspaceLeaf): any {
    return leaf.view.dataEngine ?? leaf.view.engine;
}

// the interface CompositInterval holds several iIntervals and can create Intervals from them, also has a name and a description
export interface iGraphSetting {
    intervals: iInterval[];
    name: string;
    description?: string;
    centerForce?: number;
    linkDistance?: number;
    linkForce?: number;
    repelForce?: number;
}