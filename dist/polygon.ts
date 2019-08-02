import { ExcessorArchitecture as Architecture } from '../excessor.namespace';
import { TRIGONOMETRY } from '../trigonometry';
import { VectorObject } from './vector-object';

export class Polygon extends VectorObject implements Architecture.IPolygon {
    public SVGDOMObject: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    constructor(options: Architecture.IPolygonOptions) {
        super(options);
        this.state.sidesCount = options.sidesCount || 3;
        this.state.radius = options.radius || 0;
    }

    public renderCanvas(context) {
        if (this.state.sidesCount < 3) {
            return false;
        }
        const start = TRIGONOMETRY.getPointOnCircle(this.radian, this.state.radius, this.x, this.y);
        context.moveTo( start[0], start[1] );
        for (let i = 0; i < this.state.sidesCount; i++) {
            const coordinate = TRIGONOMETRY.getPointOnCircle(
                Math.PI * 2 / this.state.sidesCount * i + this.radian,
                this.state.radius,
                this.x,
                this.y
            );
            context.lineTo( coordinate[0], coordinate[1] );
        }
        context.lineTo(start[0], start[1]);
    }

    public renderSVG() {
        if (this.state.sidesCount < 3) {
            return false;
        }
        const start = TRIGONOMETRY.getPointOnCircle(this.radian, this.state.radius, this.x, this.y);
        const path: string[] = [`${start[0]},${start[1]}`];
        for (let i = 0; i < this.state.sidesCount; i++) {
            const coordinate = TRIGONOMETRY.getPointOnCircle(
                Math.PI * 2 / this.state.sidesCount * i + this.radian,
                this.state.radius,
                this.x,
                this.y
            );
            path.push(`${coordinate[0]},${coordinate[1]}`);
        }
        this.SVGDOMObject.setAttribute('points', path.join(' '));
    }
}