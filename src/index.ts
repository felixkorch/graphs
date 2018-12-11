namespace graphy {
    type Color = "#FFFFFF" | "#FF0000" | "#0000FF";
    const WHITE: Color = "#FFFFFF";
    const RED: Color = "#FF0000";
    const BLUE: Color = "#0000FF";

    class Map<K, V> {
        key: K;
        value: V;
        object: any;

        constructor() {
            this.object = {};
        }

        put(key: K, value: V): void {
            this.object[key] = value;
        }

        get(key: K): V {
            return this.object[key];
        }
    }

    const SVG_DIV = 'main';

    abstract class SVGComponent {
        abstract render(container: HTMLElement): void;
        id: string;

        constructor(id?: string) {
            this.id = id ? id : '';
        }
    }
    
    class PathProperties {
        stroke: string = "BLUE";
        strokeWidth: number = 3;
    }
    
    class Path extends SVGComponent {
        pathProperties: PathProperties;
        path: string;
        coordinates:[ number, number ][];
        currentPos: [ number, number ];
    
        constructor(id: string, pathProperties?: PathProperties, path?: string) {
            super(id);
            this.path = path ? path : ''; 
            this.pathProperties = pathProperties ? pathProperties : new PathProperties();
            this.coordinates = [];
            this.currentPos = [0, 0];
        }
    
        public moveTo(x: number, y: number) {
            this.coordinates.push([x, y]);
            this.currentPos = [x, y];
            this.path += 'M ' + x + ' ' + y + ' ';
            return this;
        }
    
        public lineTo(x: number, y: number) {
            this.currentPos = [x, y];
            this.path += 'L ' + x + ' ' + y + ' ';
            return this;
        }
    
        public LineH(x: number) {
            this.currentPos[0] = x;
            this.path += 'H ' + x + ' ';
            return this;
        }
    
        public LineV(y: number) {
            this.currentPos[1] = y;
            this.path += 'V ' + y + ' ';
            return this;
        }
    
        public render(container: HTMLElement) {
            let element = container.querySelector('#' + this.id);
            if(element) {
                element.setAttribute('d', this.path);
                return;
            }
            container.innerHTML +=
                '<path id="' + this.id + '" d="' + this.path + '"' +
                'stroke='+ this.pathProperties.stroke + ' stroke-width=' + this.pathProperties.strokeWidth + ' />';
        }
    }
    
    class Text extends SVGComponent {
        content: string;
        fontSize: number;
        position: { x: number, y: number };
    
        constructor(content: string, fontSize: number, position: { x: number, y: number }, id?: string ) {
            super(id);
            this.content = content;
            this.fontSize = fontSize;
            this.position = position;
        }
        
        public render(container: HTMLElement) {
            if(this.id) {
                container.querySelector('#' + this.id).innerHTML = this.content;
                return;
            }
            container.innerHTML +=
                    '<text id="' + this.id + '" font-size="' + this.fontSize + '"' +
                        'x="' + this.position.x + '" ' +
                        'y="' + this.position.y + '" ' + 'class="small">'
                        + this.content +
                    '</text>'
        }
    
    }
    
    interface DataObject {
        key: any;
        value: number;
    }

    export abstract class XYChart {
        protected _data: DataObject[];
        protected div: HTMLElement;
        protected dimensions: { width: number, height: number };
        protected components: Map<string, SVGComponent>;
        public graphProps: PathProperties;
    
        constructor(div: string, data?: DataObject[]) {
            this._data = data ? data : [];
            this.div = document.getElementById(div);
            this.dimensions = { width: this.div.offsetWidth, height: this.div.offsetHeight };
            this.graphProps = new PathProperties();
            this.components = new Map();
            this.div.innerHTML = this.renderSVG();
        }

        protected abstract createGraph(): Path;
        protected abstract addPoint(point: DataObject, index?: number): void;
        protected abstract removePoint(index: number): void;
        protected abstract connectPoints(x: number, y: number, path: Path): void;
    
        set data(data: DataObject[]) {
            this._data = data;
        }
    
        protected boundsOfData(dataObject: DataObject[]) {
            if(!dataObject)
                return { min: 0, max: 0 };
            let values = dataObject.map(el => {
                return el.value;
            });
            let max = Math.max(...values);
            let min = Math.min(...values);
            return { min: min, max: max };
        }
    
        protected renderSVG(content?: string) {
            return  '<svg id="' + SVG_DIV + '" '  +
                        'preserveAspectRatio="xMinYMin none" ' +
                        'width="100%" height="100%" ' +
                        'viewBox="0 0 ' + this.dimensions.width + ' ' + this.dimensions.height + '">' +
                    '</svg>';
        }

        protected createReferenceLines(): Path {
            let pathProperties = { stroke: "#dbdbdb", strokeWidth: 0.5 };
            let halfStroke = pathProperties.strokeWidth / 2;
            let scaleV = this.dimensions.height / 8;
            let scaleH = this.dimensions.width / 30;
            let dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            let intervalX = (dimensions.width) / this._data.length;
            let path = new Path('refLines', pathProperties);
    
            for(let i = 1; i < this._data.length; i++) {
                path.moveTo(intervalX * i - halfStroke + scaleH, halfStroke + scaleV / 2);
                path.LineV(this.dimensions.height - halfStroke);
            }
    
            for(let i = 1; i < 10; i++) {
                path.moveTo(scaleH + halfStroke, this.dimensions.height / 10 * i + halfStroke + scaleV / 2);
                path.LineH(this.dimensions.width - halfStroke);
            }
    
            this.components.put(path.id, path);
            return path;
        }

        protected createXHeaders(): Path {
            return null;
        }

        protected createYHeaders(): Text[] {
            let bounds =  this.boundsOfData(this._data);
            let result = [];
            let fontSize = this.dimensions.height / 30; // ratio of dimensions?
            for(let i = 0; i < 10; i++) {
                let content = (Math.floor(bounds.max - i * bounds.max / 10)).toString();
                result.push(new Text(content, fontSize, { x: 0, y: (this.dimensions.height / 10 * i + fontSize / 2) + this.dimensions.height / 17 }));
            }
            return result;
        }
    
        public draw() {
            this.createReferenceLines().render(this.div.querySelector('#' + SVG_DIV));
            this.createGraph().render(this.div.querySelector('#' + SVG_DIV));
            this.createYHeaders().forEach(el => el.render(this.div.querySelector('#' + SVG_DIV)));
        }

    }

    export class LineChart extends XYChart {

        constructor(div: string, data?: DataObject[]) {
            super(div, data);
        }

        protected addPoint(point: DataObject, index?: number): void {
            throw new Error("Method not implemented.");
        }
        protected removePoint(index: number): void {
            throw new Error("Method not implemented.");
        }
        protected connectPoints(x: number, y: number, path: Path) {
            path.lineTo(x, y).moveTo(x, y);
        }

        protected createGraph(): Path {
            let path = new Path('graph');
            path.moveTo(0, 0);
            path.lineTo(100, 100);
            return path;
        }

    }
    
    export class StepLineChart extends XYChart {
    
        constructor(div: string, data?: DataObject[]) {
            super(div, data);
        }
    
        public addPoint(point: DataObject, index?: number) {
            if (index == null) {
                this._data.push(point);
                return;
            }
            this._data.splice(index, 0, point);
            //let graph = this.div.querySelector('#' + 'graph');
            //graph.setAttribute('d', graph.getAttribute('d') + this.components['graph'].);
        }
    
        public removePoint(index: number) {
            this._data.splice(index, 1);
        }

        protected connectPoints(x: number, y: number, path: Path): void {
            let movingUp = y < path.currentPos[1];
            let halfStroke = this.graphProps.strokeWidth / 2;
    
            path
                .LineH(x)
                .moveTo(x - halfStroke, movingUp ? path.currentPos[1] + halfStroke : path.currentPos[1] - halfStroke)
                .LineV(movingUp ? y + halfStroke : y - halfStroke)
                .moveTo(path.currentPos[0] - halfStroke, path.currentPos[1]);
        }
    
        protected createGraph(): Path {
            let path = new Path('graph', this.graphProps);
            let scaleV = this.dimensions.height / 8;
            let scaleH = this.dimensions.width / 30;
            let dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            let intervalX = (dimensions.width) / this._data.length;
            let bounds = this.boundsOfData(this._data);
    
            path.moveTo(scaleH, dimensions.height - this._data[0].value / bounds.max * dimensions.height + path.pathProperties.strokeWidth / 2 + scaleV / 2 );
            for(let i = 1; i < this._data.length; i++) {
                this.connectPoints(intervalX * i + scaleH, dimensions.height - this._data[i].value / bounds.max * dimensions.height + scaleV / 2, path);
            }
            path.LineH(dimensions.width + path.pathProperties.strokeWidth / 2 + scaleH);
            this.components.put(path.id, path);
            return path;
        }
    }
    
    } // Namespace end