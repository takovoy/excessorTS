import { ExcessorCommon as Common } from '../excessor.common';
import { ExcessorArchitecture as Architecture } from '../excessor.namespace';

export class Draw implements Architecture.IDraw {
    public CanvasDOMObject = document.createElement('canvas');
    public SVGDOMObject = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    public canvasContext = this.CanvasDOMObject.getContext('2d');
    public stack = new Common.List();
    constructor(width: number, height: number) {
        this.CanvasDOMObject.width = width || 0;
        this.CanvasDOMObject.height = height || 0;
        this.SVGDOMObject.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    public renderCanvas() {
        for (const key of Object.keys(this.stack.list)) {
            this.renderCanvasObject(this.stack.list[key]);
        }
    }

    public renderSVG() {
        for (const key of Object.keys(this.stack.list)) {
            this.renderSVGObject(this.stack.list[key]);
        }
    }

    public renderCanvasObject(vectorObject) {
        this.canvasContext.beginPath();
        Common.clearContext(this.canvasContext);
        Common.setContext(this.canvasContext, vectorObject.state);
        vectorObject.render(this.canvasContext);
        Common.setContext(this.canvasContext, vectorObject.state);
        this.canvasContext.closePath();

        for (const key of Object.keys(vectorObject.children.list)) {
            this.renderCanvasObject(vectorObject.children.list[key]);
        }
    }

    public renderSVGObject(vectorObject) {
        Common.clearStyles(vectorObject.SVGDOMObject);
        vectorObject.renderSVG();
        Common.setStyles(vectorObject.SVGDOMObject, vectorObject.state);
        for (const key of Object.keys(vectorObject.children.list)) {
            this.renderSVGObject(vectorObject.children.list[key]);
        }
    }

    public append(vectorObject) {
        this.stack.append(vectorObject);
        this.SVGDOMObject.appendChild(vectorObject.SVGDOMObject);
    }

    public remove(vectorObject) {
        this.stack.remove(vectorObject.id);
        vectorObject.remove();
    }
}