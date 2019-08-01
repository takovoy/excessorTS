import { ExcessorArchitecture as Architecture } from '../excessor.namespace';
import { TRIGONOMETRY } from '../trigonometry';
import { VectorObject } from './vector-object';

export class Rect extends VectorObject implements Architecture.IRect {
    public SVGDOMObject = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    constructor(options: Architecture.IRectOptions) {
        super(options);
        this.state.width = this.state.width || options.width || 0;
        this.state.height = this.state.height || options.height || this.state.width;
    }

    public renderCanvas(context) {
        const radian = this.radian;
        let coord  = [this.x, this.y];
        context.moveTo(coord[0], coord[1]);
        coord = TRIGONOMETRY.getPointOnCircle(radian, this.state.width, coord[0], coord[1]);
        context.lineTo(coord[0], coord[1]);
        coord = TRIGONOMETRY.getPointOnCircle(radian + Math.PI / 2, this.state.height, coord[0], coord[1]);
        context.lineTo(coord[0], coord[1]);
        coord = TRIGONOMETRY.getPointOnCircle(radian + Math.PI / 2, this.state.height, this.x, this.y);
        context.lineTo(coord[0], coord[1]);
        context.lineTo(this.x, this.y);
    }

    public renderSVG() {}
}