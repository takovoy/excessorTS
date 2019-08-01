import { ExcessorArchitecture as Architecture } from '../excessor.namespace';
import { TRIGONOMETRY } from '../trigonometry';
import { Line } from './line';

export class Curve extends Line implements Architecture.ILine {
    public get points() {
        if (!this.services.points) {
            this.services.points = [];
        }

        const radian = this.radian,
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
        this.services.length = TRIGONOMETRY.getLengthOfCurve(value, this.state.step);
        this.state.points = value;
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
            const coord = TRIGONOMETRY.getPointOnCurve(i, points);
            if (Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1) {
                continue
            }
            lastPoint = coord;
            context.lineTo(coord[0] + center[0], coord[1] + center[1]);
        }
    }
}