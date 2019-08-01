import { ExcessorArchitecture as Architecture } from '../excessor.namespace';
import { TRIGONOMETRY } from '../trigonometry';
import { VectorObject } from './vector-object';

export class Line extends VectorObject implements Architecture.ILine {
    public get points() {
        if (!this.services.points) {
            this.services.points = [];
        }

        const radian  = this.radian,
            sin = Math.sin( radian ),
            cos = Math.cos( radian );

        for (let key = 0; this.state.points[key]; key++) {
            const coordinate = this.state.points[key];
            this.services.points[key] = [
                coordinate[0] * cos - coordinate[1] * sin,
                coordinate[0] * sin + coordinate[1] * cos,
                coordinate[2]
            ]
        }

        return this.services.points;
    }
    public set points(value: any) {
        this.state.points = value;
    }

    constructor(options: Architecture.ILineOptions) {
        super(options);
        this.state.step = options.step || 1;
        this.points = options.points || [];
        this.services.points = [];
        if (options.shift === 0) {
            this.state.shift = 0;
        } else {
            this.state.shift = options.shift || 100;
        }
    }

    public renderCanvas(context) {
        const points = this.points;
        const center = [this.x, this.y];
        if (points.length < 2) {
            return
        }
        context.moveTo(
            points[0][0] + center[0],
            points[0][1] + center[1]
        );
        if (this.state.shift > 100) {
            this.state.shift = 100;
        }
        let lastPoint = points[0];
        for (let i = 0; i <= this.state.shift; i += this.state.step) {
            const coord = TRIGONOMETRY.getPointOnLine(i, this.points);
            if (Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1) {
                continue
            }
            lastPoint = coord;
            context.lineTo(coord[0] + this.x, coord[1] + this.y);
        }
    }
}