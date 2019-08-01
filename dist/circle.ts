import { ExcessorArchitecture as Architecture } from '../excessor.namespace';
import { VectorObject } from './vector-object';

export class Circle extends VectorObject implements Architecture.ICircle {
    constructor(options: Architecture.ICircleOptions) {
        super(options);
        this.state.radius = options.radius || 0;
        if (this.state.shift === 0 || options.shift === 0) {
            this.state.shift = 0;
        } else {
            this.state.shift = options.shift || 100;
        }
    }

    public renderCanvas(context) {
        const radian = this.radian;
        context.arc(this.x, this.y, this.state.radius, radian, Math.PI * 2 / 100 * this.state.shift + radian);
    }
}