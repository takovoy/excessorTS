import { ExcessorArchitecture as Architecture } from '../excessor.namespace';
import { TRIGONOMETRY } from '../trigonometry';
import { Line } from './line';

export class Spline extends Line implements Architecture.ILine {
    public get points() {
        if (!this.services.points) {
            this.services.points = [];
        }

        const radian  = this.radian,
            sin     = Math.sin( radian ),
            cos     = Math.cos( radian );

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
        this.services.map   = TRIGONOMETRY.getMapOfSpline(value, this.state.step);
        this.services.length = 0;
        for (const key of this.services.map) {
            this.services.length += key;
        }
        this.state.points = value;
    }

    public renderCanvas(context) {
        const points = this.points;
        const center = [this.x, this.y];
        if (points.length < 2) {
            return
        }
        if (this.state.shift > 100) {
            this.state.shift = 100;
        }

        const splines = [[]];
        let splineIndex = 0;
        for (let index = 0; points[index]; index++) {
            if (points[index] === false) {
                splineIndex++;
                continue;
            }
            splines[splineIndex].push(points[index]);
        }

        for (splineIndex = 0; splines[splineIndex]; splineIndex++) {
            const spline = splines[splineIndex];
            context.moveTo(
                spline[0][0] + center[0],
                spline[0][1] + center[1]
            );
            let lastPoint = spline[0];
            for (let shift = 0; shift <= this.state.shift; shift += this.state.step) {
                const coord = TRIGONOMETRY.getPointOnSpline(shift, spline, this.services);
                if (Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1) {
                    continue;
                }
                lastPoint = coord;
                context.lineTo(coord[0] + center[0], coord[1] + center[1]);
            }
        }
    }
}