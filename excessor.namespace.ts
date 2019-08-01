export namespace ExcessorArchitecture {
    export enum AvailableContextSettings {
        fill = 'fill',
        lineWidth = 'lineWidth',
        lineCap = 'lineCap',
        lineJoin = 'lineJoin',
        lineDash = 'lineDash',
        dashOffset = 'dashOffset',
        stroke = 'stroke'
    }

    export type ContextChangeWorkers = {[key in AvailableContextSettings]: (context: CanvasRenderingContext2D, value: any) => void};
    export type ContextClearingWorkers = {[key in AvailableContextSettings]: (context: CanvasRenderingContext2D) => void};
    export type ContextSettings = {[key in AvailableContextSettings]?: string | number | number[]};

    export interface IList<ItemType> {
        list: {[key: string]: ItemType};
        appendCallback: (parent: ItemType, instance: ItemType) => ItemType,
        removeCallback: (parent: ItemType, instance: ItemType) => ItemType,
        parent: ItemType;
        append(object: ItemType): ItemType;
        remove(id: string);
    }

    export interface IVectorObjectOptions {
        id?: string;
        x?: number;
        y?: number;
        radian?: number;
        settings?: ContextSettings;
    }

    export interface ICircleOptions extends IVectorObjectOptions {
        radius: number;
        shift?: number;
    }

    export interface ILineOptions extends IVectorObjectOptions {
        points: Array<number | boolean>[];
        step?: number;
        shift?: number;
    }

    export interface IEllipseOptions extends IVectorObjectOptions {
        step?: number;
        semiAxisX: number;
        semiAxisY: number;
    }

    export interface IPolygonOptions extends IVectorObjectOptions {
        sidesCount: number;
        radius: number;
    }

    export interface IRectOptions extends IVectorObjectOptions {
        width: number;
        height: number;
    }

    export interface IVectorObject<OptionsBundle extends IVectorObjectOptions> {
        id: string;
        SVGDOMObject: SVGElement;
        children: IList<IVectorObject<OptionsBundle>>;
        parent: IVectorObject<OptionsBundle>;
        state: OptionsBundle & ContextSettings;
        services: any;
        operationContext: any;
        x: number;
        y: number;
        radian: number;
        renderCanvas(context: CanvasRenderingContext2D);
        renderSVG();
        append(object: IVectorObject<OptionsBundle>);
        remove(object: IVectorObject<OptionsBundle>);
    }
    export interface ICircle extends IVectorObject<ICircleOptions> {}
    export interface IEllipse extends IVectorObject<IEllipseOptions> {}
    export interface IPolygon extends IVectorObject<IPolygonOptions> {}
    export interface IRect extends IVectorObject<IRectOptions> {}
    export interface ILine extends IVectorObject<ILineOptions> {
        points: Array<number | boolean>[];
    }

    export interface IDraw {
        CanvasDOMObject: HTMLCanvasElement;
        SVGDOMObject: SVGSVGElement;
        canvasContext: CanvasRenderingContext2D;
        stack: IList<IVectorObject<IVectorObjectOptions>>;
        renderCanvas();
        renderSVG();
        renderCanvasObject(vectorObject: IVectorObject<IVectorObjectOptions>);
        renderSVGObject(vectorObject: IVectorObject<IVectorObjectOptions>);
        append(vectorObject: IVectorObject<IVectorObjectOptions>);
        remove(vectorObject: IVectorObject<IVectorObjectOptions>);
    }
}
