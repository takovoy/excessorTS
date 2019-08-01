import { ExcessorArchitecture as Architecture } from '../excessor.namespace';
import { TRIGONOMETRY } from '../trigonometry';
import { Line } from './line';

export class Path extends Line implements Architecture.ILine {
    public get points() {
        if (!this.services.points) {
            this.services.points = [];
        }

        const radian = this.radian,
            sin = Math.sin( radian ),
            cos = Math.cos( radian );

        for (let key = 0; this.state.points[key]; key++) {
            const coordinate = this.state.points[key];
            if (this.state.points[key].length > 3) {
                this.services.points[key] = this.state.points[key];
                this.services.points[key][4] = (this.services.points[key][4] || 0) + radian;
                continue;
            }
            this.services.points[key] = [
                coordinate[0] * cos - coordinate[1] * sin,
                coordinate[0] * sin + coordinate[1] * cos,
                coordinate[2]
            ]
        }

        return this.services.points;
    }
    public set points(value: any) {
        this.services.map = TRIGONOMETRY.getMapOfPath(value, this.state.step);
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

        const paths = [[]];
        let pathIndex = 0;
        for (let index = 0; points[index]; index++) {
            if (points[index] === false) {
                if (points[index + 1] && points[index + 1].length <= 3) {
                    pathIndex++;
                }
                continue;
            }
            paths[pathIndex].push(points[index]);
        }
        for (pathIndex = 0; paths[pathIndex]; pathIndex++) {
            const path = paths[pathIndex];

            let toMovePoint = points[0];
            if (toMovePoint.length > 3) {
                toMovePoint = [0, 0];
            }
            context.moveTo(
                toMovePoint[0] + center[0],
                toMovePoint[1] + center[1]
            );
            let lastPoint = points[0];
            for (let i = 0; i <= this.state.shift; i += this.state.step) {
                const coord = TRIGONOMETRY.getPointOnPath(i, points, this.services);
                if (Math.abs(lastPoint[0] - coord[0]) < 1 && Math.abs(lastPoint[1] - coord[1]) < 1) {
                    continue
                }
                lastPoint = coord;
                context.lineTo(coord[0] + center[0], coord[1] + center[1]);
            }
        }
    }
}