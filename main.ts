import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';
import { PeriodicFunctory, WaveFunctory, scaledWave } from "Functories";
import { getScaleConversion, iGraphSetting, setCenterForce, setLinkDistance, setLinkStrength, setRepelStrength } from "graphManip";

import { Interval } from "interval";

function scaledSine(x: number, min: number, max: number, delta: number) {
	return min + (max - min) * Math.sin(x);
}
function simpleSine2(x: number, min: number, max: number, delta: number) {
	return min + (max - min) * (2 * Math.sin(x));
}
function scaledTest(x: number, min: number, max: number, delta: number) {
	return min + (max - min) * (2*(1-Math.cos(x)));
}

const intervals: iGraphSetting[] = [
	{
		name: "Breathing",
		repelForce: 15.33 / 20,
		linkForce: .12,
		linkDistance: 0.2,
		intervals: [
			{
				lower: 0.25,
				upper: 0.4,
				timeDilation: 2,
				g_x: setCenterForce,
				f_x: WaveFunctory.create(scaledWave, [[1, .5]], false),
			},

		],
	},
	{
		name: "Breathing Network",
		repelForce: 18.5 / 20,
		linkForce: .92,
		linkDistance: 0.1,
		intervals: [
			{
				lower: 0.25,
				upper: 0.4,
				timeDilation: 2,
				g_x: setCenterForce,
				f_x: WaveFunctory.create(scaledWave, [[1, .5]], false),
			},

		],
	},
	{
		name: "Breathing Colonies",
		intervals: [
			{
				lower: 0.7,
				upper: 0.99,
				timeDilation: .35,
				g_x: setLinkDistance,
				f_x: PeriodicFunctory.create(scaledSine),
			},
			{
				lower: 0.45,
				upper: 0.5,
				timeDilation: .6,
				g_x: setCenterForce,
				f_x: WaveFunctory.create(scaledWave, [[1, 1], [2, 1], [.5, 1]]),
			},
			{
				lower: 0.7,
				upper: 0.99,
				timeDilation: .35,
				g_x: setLinkStrength,
				f_x: PeriodicFunctory.create(scaledSine),
			},
			{
				lower: 0.5,
				upper: 0.55,
				timeDilation: .6,
				g_x: setRepelStrength,
				f_x: WaveFunctory.create(scaledWave, [[1, 1], [2, 1], [.5, 1]]),
			},

		],
	},
	{
		name: "Jellyfish Bloom",
		centerForce: 0.1,
		linkDistance: 1,
		intervals: [
			{
				lower: 0.1,
				upper: 0.99,
				timeDilation: 50,
				g_x: setLinkStrength,
				f_x: WaveFunctory.create(scaledWave, [[3, 1], [5, 1], [7, 1]]),
			},
			{
				lower: 0.85,
				upper: 0.99,
				timeDilation: 60,
				g_x: setRepelStrength,
				f_x: WaveFunctory.create(scaledWave, [[3, 1], [5, 1], [7, 1]]),
			},
		],
	},
	{
		name: "Muscle",
		centerForce: .35,
		linkForce: .75,
		linkDistance: 0.1,
		intervals: [
			{
				lower: 0.6,
				upper: 1.2,
				timeDilation: 1.5,
				g_x: setRepelStrength,
				f_x: WaveFunctory.create(scaledWave, [[1, .5]], false),
			},
			{
				lower: 0.2,
				upper: 0.5,
				multiplier: 1.5,
				timeDilation: 1.5,
				g_x: setCenterForce,
				f_x: WaveFunctory.create(scaledWave, [[1, .5]], false),
			},

		],
	},
	{
		name: "Heart",
		intervals: [
			{
				lower: 0.7,
				upper: 1.1,
				timeDilation: .35 * 4,
				invert: true,
				g_x: setLinkDistance,
				f_x: PeriodicFunctory.create(simpleSine2),
			},
			{
				lower: 0.4,
				upper: 0.45,
				timeDilation: .6 * 4,
				multiplier: 1.5,
				g_x: setCenterForce,
				f_x: WaveFunctory.create(scaledWave, [[1, 1], [2, 1], [0.5, 1]]),
			},
			{
				lower: 0.7,
				upper: 1.1,
				timeDilation: .35 * 4,
				invert: true,
				g_x: setLinkStrength,
				f_x: PeriodicFunctory.create(simpleSine2),
			},
			{
				lower: 0.9,
				upper: 0.99,
				verticalOffset: -0.2,
				multiplier: 2,
				timeDilation: .6 * 4,
				g_x: setRepelStrength,
				f_x: WaveFunctory.create(scaledWave, [[1, 1], [2, 1], [0.5, 1]]),
			},

		],
	},
	{
		name: "Squid",
		intervals: [
			{
				lower: 0.0,
				upper: 1.0,
				timeDilation: 40,
				g_x: setLinkStrength,
				f_x: WaveFunctory.create(scaledWave, [[3, 2], [5, 5], [4.5, -6]]),
			},
			{
				lower: 0.3,
				upper: 1.0,
				timeDilation: 40,
				g_x: setRepelStrength,
				f_x: WaveFunctory.create(scaledWave, [[3, 2], [5, 5], [4.5, -6]]),
			},
			{
				lower: 0.2,
				upper: 0.35,
				timeDilation: 40,
				invert: true,
				g_x: setCenterForce,
				f_x: WaveFunctory.create(scaledWave, [[3, 2], [5, 5], [4.5, -6]]),
			},
			{
				lower: 0.0,
				upper: 1.0,
				invert: true,
				timeDilation: 40,
				g_x: setLinkDistance,
				f_x: WaveFunctory.create(scaledWave, [[3, 2], [5, 5], [4.5, -6]]),
			},
		],
	},
	{
		name: "Organism",
		centerForce: 0.47,
		linkDistance: 0.35,
		intervals: [
			{
				lower: 0.15,
				upper: 1,
				timeDilation: 50,
				g_x: setLinkStrength,
				f_x: WaveFunctory.create(scaledWave, [[3, 5], [5, 4], [7, 2]]),
			},
			{
				lower: 0.87,
				upper: 1,
				timeDilation: 60,
				relativeOfsset: 0.5,
				g_x: setRepelStrength,
				f_x: WaveFunctory.create(scaledWave, [[3, 5], [5, 4], [7, 2]]),
			},
		],
	},
	{
		name: "Jump Roping",
		intervals: [
			{
				lower: 0.7,
				upper: 0.99,
				timeDilation: .4,
				g_x: setLinkDistance,
				f_x: PeriodicFunctory.create(scaledSine),
			},
			{
				lower: 0.4,
				upper: 0.55,
				timeDilation: 1,
				g_x: setCenterForce,
				f_x: WaveFunctory.create(scaledWave, [[1, 1], [2, 1], [.5, 1]]),
			},
			{
				lower: 0.7,
				upper: 0.99,
				timeDilation: .35,
				g_x: setLinkStrength,
				f_x: PeriodicFunctory.create(scaledSine),
			},
			{
				lower: 0.9,
				upper: 0.99,
				timeDilation: .6,
				g_x: setRepelStrength,
				f_x: WaveFunctory.create(scaledWave, [[1, 1], [2, 1], [.5, 1]]),
			},

		],
	},
	{
		name: "I like to move it",
		centerForce: .6,
		linkForce: 1,
		linkDistance: .3,
		intervals: [
			{
				lower: 0.3,
				upper: 1.2,
				timeDilation: 1.9,
				multiplier:1.2,
				g_x: setRepelStrength,
				// f_x: PeriodicFunctory.create(scaledSine),
				f_x: WaveFunctory.create(scaledWave, [[1, 1], [3, 1 / 3], [5, 1 / 5]]),
			},
		],
	},
	{
		name: "Boo!",
		centerForce: .5,
		linkForce: 1,
		linkDistance: 1,
		intervals: [
			{
				lower: 0.3,
				upper: 1,
				timeDilation: 2.8,
				multiplier:5,
				g_x: setRepelStrength,
				// f_x: PeriodicFunctory.create(scaledSine),
				f_x: WaveFunctory.create(scaledWave, [[1, 1], [3, 1 / 3], [5, 1 / 5],[7, 1 / 7],[9, 1 / 9],[11, 1 / 11],[13, 1 / 13]]),
			},

		],
	},
	{
		name: "Panting",
		intervals: [
			{
				lower: 0.3,
				upper: 1.0,
				timeDilation: -20,
				g_x: setLinkStrength,
				f_x: WaveFunctory.create(scaledWave, [[3, 2], [5, 3], [4.5, -6]]),
			},
			{
				lower: 0.3,
				upper: 1.0,
				timeDilation: 20,
				g_x: setRepelStrength,
				f_x: WaveFunctory.create(scaledWave, [[3, 2], [5, 3], [4.5, -6]]),
			},
			{
				lower: 0.1,
				upper: 0.25,
				timeDilation: -20,
				g_x: setCenterForce,
				f_x: WaveFunctory.create(scaledWave, [[3, 2], [5, 3], [4.5, -6]]),
			},
			{
				lower: 0.0,
				upper: 1.0,
				timeDilation: -20,
				g_x: setLinkDistance,
				f_x: WaveFunctory.create(scaledWave, [[3, 2], [5, 3], [4.5, -6]]),
			},
		],
	},



];


export default class LivingGraphPlugin extends Plugin {
	settings: LivingGraphSettings;
	graphLeaves: WorkspaceLeaf[];
	intervals: Interval[];
	activeGraphSetting: iGraphSetting;

	public startIntervals() {
		let ags = this.activeGraphSetting;
		let setAttribute = (value: number, func: (a: number, b: WorkspaceLeaf[]) => void) => {
			let [low, high] = getScaleConversion(func.name, [0, 1]);
			func(value * (high - low) + low, this.graphLeaves);
		};
		if (ags.centerForce) setAttribute(ags.centerForce, setCenterForce);
		if (ags.linkForce) setAttribute(ags.linkForce, setLinkStrength);
		if (ags.repelForce) setAttribute(ags.repelForce, setRepelStrength);
		if (ags.linkDistance) setAttribute(ags.linkDistance, setLinkDistance);
		if (this.intervals.first().isActive()) setTimeout(this.clearIntervals.bind(this), 1500);
		else this.intervals.forEach(i => i.start(this.graphLeaves));
	}

	public clearIntervals() {
		this.intervals?.forEach(i => i.clear());
	}
	public refreshLeaves() {
		// this.graphLeaves = this.app.workspace.getLeavesOfType("graph") ?? this.graphLeaves;
		this.graphLeaves = [].concat(this.app.workspace.getLeavesOfType("graph") ?? [])
			.concat(this.settings.includeLocal ? this.app.workspace.getLeavesOfType("localgraph") ?? []: []);
	}

	async onload() {

		await this.loadData();
		this.addSettingTab(new LivingGraphSettingTab(this.app, this));

		this.registerEvent(this.app.workspace.on('layout-change', this.refreshLeaves.bind(this)));
		this.app.workspace.onLayoutReady(this.refreshLeaves.bind(this));
		this.refreshLeaves();

		this.addCommand({
			id: 'toggle',
			name: 'Living Graph - Toggle',
			callback: this.startIntervals.bind(this),
		});

		this.updateIntervals();

	}

	public async onunload() {
		this.clearIntervals();
	}

	public async loadData() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await super.loadData());
	}

	public async saveData() {
		await super.saveData(this.settings);
	}

	public updateIntervals(which?: Set<string>) {
		which ??= new Set(this.settings.activeComposites);
		this.clearIntervals();
		this.refreshLeaves();
		this.intervals = intervals.filter(c => {
			let use = which.has(c.name);
			if (use) this.activeGraphSetting = c;
			return use;
		}).map(c => c.intervals.map(i => new Interval(i, this))).flat();

	}
}



interface LivingGraphSettings {
	activeComposites: string[],
	includeLocal:boolean;
}

const DEFAULT_SETTINGS: LivingGraphSettings = {
	activeComposites: [intervals[0].name],
	includeLocal:true,
};


class LivingGraphSettingTab extends PluginSettingTab {
	plugin: LivingGraphPlugin;

	constructor(app: App, plugin: LivingGraphPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Living Graph' });
		let saveAndRestart = (()  =>  {
			let wasActive = this.plugin.intervals?.first().isActive();
			this.plugin.updateIntervals();
			if (wasActive)
				this.plugin.startIntervals();
			this.plugin.saveData();
		}).bind(this);

		new Setting(containerEl)
			.setName('Presets')
			.setDesc('Activate a living graph preset')
			.addDropdown(cb => {
				// add options for each composit interval
				intervals.map(i => i.name).forEach(name => cb.addOption(name, name));
				cb.onChange(async (name: string) => {
					this.plugin.settings.activeComposites = [name];
					saveAndRestart();
				});
				cb.setValue(this.plugin.settings.activeComposites[0]);
			});

		// add a toggle setting for include local
		new Setting(containerEl)
			.setName('Include Local Graphs')
			.addToggle(cb => {
				cb.onChange(async (value: boolean) => {
					this.plugin.settings.includeLocal = value;
					saveAndRestart();
				});
				cb.setValue(this.plugin.settings.includeLocal);
			}
		);

	}
}






