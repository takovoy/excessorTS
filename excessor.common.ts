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

    export function clearContext (context: CanvasRenderingContext2D) {
        for (const key of Object.keys(contextClearingWorkers)) {
            contextClearingWorkers[key](context);
        }
    }

    export function setContext (context: CanvasRenderingContext2D, value) {
        for (const key of Object.keys(value)) {
            if (!contextChangeWorkers[key] || !value[key])continue;
            contextChangeWorkers[key](context, value[key]);
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
}