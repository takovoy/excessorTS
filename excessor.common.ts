import { ExcessorArchitecture as Architecture } from './excessor.namespace';

export namespace ExcessorCommon {
    export class List implements Architecture.IList<Architecture.IVectorObject<Architecture.IVectorObjectOptions>> {
        public list = {};
        constructor(
            public appendCallback = (parent, instance) => instance,
            public removeCallback = (parent, instance) => instance,
            public parent: any = null
        ) {}

        public append(object) {
            this.list[object.id] = object;
            return this.appendCallback(this.parent, object);
        }

        public remove(id) {
            const instance = this.list[id];
            delete this.list[id];
            return this.removeCallback(this.parent, instance);
        }
    }

    export function setContext (context: CanvasRenderingContext2D, value: Architecture.ContextSettings) {
        for (const key of Object.keys(value)) {
            if (!contextChangeWorkers[key] || !value[key])continue;
            contextChangeWorkers[key](context, value[key]);
        }
    }

    export function clearContext (context: CanvasRenderingContext2D) {
        for (const key of Object.keys(contextClearingWorkers)) {
            contextClearingWorkers[key](context);
        }
    }

    export function setStyles (svgElement: SVGElement, value: Architecture.ContextSettings) {
        for (const key of Object.keys(value)) {
            if (!styleChangeWorkers[key] || !value[key]) continue;
            styleChangeWorkers[key](svgElement, value[key]);
        }
    }

    export function clearStyles (svgElement: SVGElement) {
        for (const key of Object.keys(styleClearingWorkers)) {
            styleClearingWorkers[key](svgElement);
        }
    }

    export const contextChangeWorkers: Architecture.ContextChangeWorkers = {
        fill: (context, value: string) => {
            context.fillStyle = value;
            context.fill();
        },
        lineWidth: (context, value: number) => context.lineWidth = +value,
        lineCap: (context, value: 'butt' | 'round' | 'square') => context.lineCap = value,
        lineJoin: (context, value: 'bevel' | 'round' | 'miter') => context.lineJoin = value,
        lineDash: (context, value: number[]) => context.setLineDash(value),
        dashOffset: (context, value: number) => context.lineDashOffset = value,
        stroke: (context, value: string) => {
            context.strokeStyle = value;
            context.stroke();
        }
    };

    export const contextClearingWorkers: Architecture.ContextClearingWorkers = {
        fill: (context) => contextChangeWorkers.fill(context, 'transparent'),
        lineWidth: (context) => contextChangeWorkers.lineWidth(context, 0),
        lineCap: (context) => contextChangeWorkers.lineCap(context, 'butt'),
        lineJoin: (context) => contextChangeWorkers.lineJoin(context, 'miter'),
        lineDash: (context) => contextChangeWorkers.lineDash(context, []),
        dashOffset: (context) => contextChangeWorkers.dashOffset(context, 0),
        stroke: (context) => contextChangeWorkers.stroke(context, 'transparent')
    };

    export const styleChangeWorkers: Architecture.StyleChangeWorkers = {
        fill: (svgElement, value: string) => svgElement.setAttribute('fill', value),
        lineWidth: (svgElement, value: number) => svgElement.setAttribute('stroke-width', value.toString()),
        lineCap: (svgElement, value: 'butt' | 'round' | 'square') => svgElement.setAttribute('stroke-linecap', value),
        lineJoin: (svgElement, value: 'bevel' | 'round' | 'miter') => svgElement.setAttribute('stroke-linejoin', value),
        lineDash: (svgElement, value: number[]) => svgElement.setAttribute('stroke-dasharray', value.join(' ')),
        dashOffset: (svgElement, value: number) => svgElement.setAttribute('stroke-dashoffset', value.toString()),
        stroke: (svgElement, value: string) => svgElement.setAttribute('stroke', value)
    };

    export const styleClearingWorkers: Architecture.StyleClearingWorkers = {
        fill: (svgElement) => styleChangeWorkers.fill(svgElement, 'transparent'),
        lineWidth: (svgElement) => styleChangeWorkers.lineWidth(svgElement, 0),
        lineCap: (svgElement) => styleChangeWorkers.lineCap(svgElement, 'butt'),
        lineJoin: (svgElement) => styleChangeWorkers.lineJoin(svgElement, 'miter'),
        lineDash: (svgElement) => styleChangeWorkers.lineDash(svgElement, []),
        dashOffset: (svgElement) => styleChangeWorkers.dashOffset(svgElement, 0),
        stroke: (svgElement) => styleChangeWorkers.stroke(svgElement, 'transparent')
    };
}