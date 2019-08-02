import { ExcessorArchitecture as Architecture } from '../excessor.namespace';
import { TRIGONOMETRY } from '../trigonometry';
import { VectorObject } from './vector-object';

export class Ellipse extends VectorObject implements Architecture.IEllipse {
    public SVGDOMObject = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    constructor(options: Architecture.IEllipseOptions) {
        super(options);
        this.state.step = options.step || 0.1;
        this.state.semiAxisX = options.semiAxisX;
        this.state.semiAxisY = options.semiAxisY;
    }

    public renderCanvas(context) {
        let shift = 0;
        const coord = TRIGONOMETRY.getPointOnEllipse(this.state.semiAxisX, this.state.semiAxisY, shift, this.state.radian, this.x, this.y);
        context.moveTo(coord[0], coord[1]);

        for (; shift <= Math.PI * 2; shift += this.state.step) {
            const coordinate = TRIGONOMETRY.getPointOnEllipse(
                this.state.semiAxisX,
                this.state.semiAxisY,
                shift,
                this.state.radian,
                this.x,
                this.y
            );
            context.lineTo(coordinate[0], coordinate[1]);
        }
        context.lineTo(coord[0], coord[1]);
    }

    public renderSVG() {
        let shift = 0;
        const coord = TRIGONOMETRY.getPointOnEllipse(this.state.semiAxisX, this.state.semiAxisY, shift, this.state.radian, this.x, this.y);
        const path: string[] = [`${coord[0]},${coord[1]}`];

        for (; shift <= Math.PI * 2; shift += this.state.step) {
            const coordinate = TRIGONOMETRY.getPointOnEllipse(
                this.state.semiAxisX,
                this.state.semiAxisY,
                shift,
                this.state.radian,
                this.x,
                this.y
            );
            path.push(`${coordinate[0]},${coordinate[1]}`);
        }
        path.push(`${coord[0]},${coord[1]}`);
        this.SVGDOMObject.setAttribute('points', path.join(' '));
    }
}