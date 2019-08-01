import { ExcessorCommon as Common } from '../excessor.common';
import { ExcessorArchitecture as Architecture } from '../excessor.namespace';

export class VectorObject implements Architecture.IVectorObject<Architecture.IVectorObjectOptions> {
    public id = '' + Math.random();
    public SVGDOMObject = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    public children = new Common.List(
        (self, object) => {
            object.parent = this;
            this.operationContext = object;
            return this;
        },
        (self) => this,
        this
    );
    public parent;
    public state;
    public services;
    public operationContext: any;
    public get x() {
        if ( this.parent ) {
            return (
                this.state.x * Math.cos( this.parent.radian ) -
                this.state.y * Math.sin( this.parent.radian ) +
                this.parent.x
            );
        }
        return +this.state.x;
    }
    public set x(value: number) {
        this.state.x = +value;
    }
    public get y() {
        if (this.parent) {
            return (
                this.state.x * Math.sin( this.parent.radian ) +
                this.state.y * Math.cos( this.parent.radian ) +
                this.parent.y
            );
        }
        return +this.state.y;
    }
    public set y(value: number) {
        this.state.y = value;
    }
    public get radian() {
        if (this.parent) {
            return +this.parent.radian + +this.state.radian;
        }
        return +this.state.radian;
    }
    public set radian(value: number) {
        this.state.radian = +value;
    }

    constructor(options: Architecture.IVectorObjectOptions) {
        options = options || {};
        this.id = options.id || '' + Math.random();
        this.state = options.settings || {};
        this.state.x = options.x || 0;
        this.state.y = options.y || 0;
        this.state.radian = options.radian || 0;
    }

    public renderCanvas(context) {};
    public renderSVG(context) {};

    public append(object) {
        return this.children.append(object);
    }
    public remove(object) {
        return this.children.remove(object.id);
    }
}