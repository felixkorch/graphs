namespace xycharts {
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

        put(key: K, value: V) {
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
        public stroke: string = "BLUE";
        public strokeWidth: number = 3;
    }
    
    class Properties {
        public pathProperties: PathProperties;
    }

    export class DataSet {
        public data: any[];
        public properties: Properties; 
        public xKey: string;
        public yKey: string;

        constructor(data?: any) {
            this.data = data ? data : [];
            this.properties = new Properties();
            this.xKey = '';
            this.yKey = '';
        }

        public addData(item: any, remove: number) {
            this.data.splice(0, remove);
            this.data.push(item);
        }

        public bounds() {
            if(!this.data)
                return { min: 0, max: 0 };
            let values = this.data.map(e => e.value);
            let max = Math.max(...values);
            let min = Math.min(...values);
            return { min: min, max: max };
        }

    }

    enum PathType {
        MOVETO,
        LINETO,
        LINEH,
        LINEV
    }

    class Path extends SVGComponent {

        public pathProperties: PathProperties;
        protected path: string;
        public currentPos: [ number, number ];
        protected dataPoints: { coords: [number, number], type: PathType }[];
    
        constructor(id: string, pathProperties?: PathProperties) {
            super(id);
            this.pathProperties = pathProperties ? pathProperties : new PathProperties();
            this.currentPos = [0, 0];
            this.dataPoints = [];
        }

        protected typeString(type: PathType, coords: [number, number]) {
            switch(type) {
                case PathType.MOVETO: return 'M ' + coords[0] + ' ' + coords[1] + ' ';
                case PathType.LINETO: return 'L ' + coords[0] + ' ' + coords[1] + ' ';
                case PathType.LINEH: return 'H ' + coords[0] + ' ';
                case PathType.LINEV: return 'V ' + coords[1] + ' ';
            }
        }

        public moveTo(x: number, y: number) {
            this.currentPos = [x, y];
            this.dataPoints.push({ coords: [x, y], type: PathType.MOVETO });
            return this;
        }
    
        public lineTo(x: number, y: number) {
            this.currentPos = [x, y];
            this.dataPoints.push({ coords: [x, y], type: PathType.LINETO });
            return this;
        }
    
        public LineH(x: number) {
            this.currentPos[0] = x;
            this.dataPoints.push({ coords: [x, 0], type: PathType.LINEH });
            return this;
        }
    
        public LineV(y: number) {
            this.currentPos[1] = y;
            this.dataPoints.push({ coords: [0, y], type: PathType.LINEV });
            return this;
        }

        public update() {
            let path = '';
            for(let x of this.dataPoints) {
                path += this.typeString(x.type, x.coords);
            }
            this.path = path;
        }
    
        public render(container: HTMLElement) {
            this.update();
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
                    '</text>';
        }
    
    }

    class SVGBatch extends SVGComponent {
        private _components: SVGComponent[];

        set components(list: SVGComponent[]) {
            this._components = list;
        }

        constructor(id: string) {
            super(id);
            this._components = [];
        }
        public render(container: HTMLElement) {
            if(!container.querySelector('#' + this.id))
                container.innerHTML += '<g id="' + this.id + '"></g>';
            let element = container.querySelector('#' + this.id);
            element.innerHTML = '';
            this._components.forEach( e => e.render(element as HTMLElement) );
        }
    }

    export abstract class XYChart {
        protected dataCollection: DataSet[];
        protected div: HTMLElement;
        protected dimensions: { width: number, height: number };
        protected components: Map<string, SVGComponent>;
    
        constructor(div: string) {
            this.div = document.getElementById(div);
            this.dimensions = { width: this.div.offsetWidth, height: this.div.offsetHeight };
            this.components = new Map();
            this.div.innerHTML = this.renderSVG();
            this.dataCollection = [];
        }

        protected abstract createGraph(set: DataSet): Path;
        protected abstract connectPoints(x: number, y: number, path: Path, set: DataSet): void;
    
        public createDataSet() {
            let set = new DataSet();
            this.dataCollection.push(set);
            return set;
        }
    
        protected renderSVG(content?: string) {
            return  '<svg id="' + SVG_DIV + '" '  +
                        'preserveAspectRatio="xMinYMin none" ' +
                        'width="100%" height="100%" ' +
                        'viewBox="0 0 ' + this.dimensions.width + ' ' + this.dimensions.height + '">' +
                    '</svg>';
        }

        protected createReferenceLines(): Path {
            let set = this.dataCollection[0];
            if(!set)
                return
            let pathProperties = { stroke: "#dbdbdb", strokeWidth: 0.5 };
            let halfStroke = pathProperties.strokeWidth / 2;
            let scaleV = this.dimensions.height / 8;
            let scaleH = this.dimensions.width / 30;
            let dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            let intervalX = dimensions.width / set.data.length;
            let path = new Path('refLines', pathProperties);
    
            for(let i = 1; i < set.data.length; i++) {
                path.moveTo(intervalX * i - halfStroke + scaleH, halfStroke + scaleV / 2);
                path.LineV(this.dimensions.height - halfStroke);
            }
    
            for(let i = 1; i < 11; i++) {
                path.moveTo(scaleH + halfStroke, dimensions.height / 10 * i + halfStroke + scaleV / 2);
                path.LineH(this.dimensions.width - halfStroke);
            }
    
            this.components.put(path.id, path);
            return path;
        }

        protected createXHeaders(): Path {
            return null;
        }

        protected createYHeaders(): Text[] {
            let set = this.dataCollection[0];
            if(!set)
                return;
            let result = [];
            let fontSize = this.dimensions.height / 35; // ratio of dimensions?
            let scaleV = this.dimensions.height / 8;
            let scaleH = this.dimensions.width / 30;
            let dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            for(let i = 0; i < 11; i++) {
                let content = (Math.floor(set.bounds().max - i * set.bounds().max / 10)).toString();
                result.push(new Text(content, fontSize, { x: 0, y: (dimensions.height / 10 * i + fontSize / 2) + this.dimensions.height / 17 }));
            }
            return result;
        }
    
        public draw() {
            this.createReferenceLines().render(this.div.querySelector('#' + SVG_DIV));
            for(let x of this.dataCollection)
                this.createGraph(x).render(this.div.querySelector('#' + SVG_DIV));
            //this.createYHeaders().forEach(el => el.render(this.div.querySelector('#' + SVG_DIV)));
            let yHeaders = new SVGBatch('yHeaders');
            yHeaders.components = this.createYHeaders();
            yHeaders.render(this.div.querySelector('#' + SVG_DIV));
        }

    }

    export class LineChart extends XYChart {

        constructor(div: string) {
            super(div);
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
    
        constructor(div: string) {
            super(div);
        }

        protected connectPoints(x: number, y: number, path: Path, set: DataSet) {
            let movingUp = y < path.currentPos[1];
            let halfStroke = set.properties.pathProperties.strokeWidth / 2;
    
            path
                .LineH(x)
                .moveTo(x - halfStroke, movingUp ? path.currentPos[1] + halfStroke : path.currentPos[1] - halfStroke)
                .LineV(movingUp ? y + halfStroke : y - halfStroke)
                .moveTo(path.currentPos[0] - halfStroke, path.currentPos[1]);
        }
    
        protected createGraph(set: DataSet): Path {
            let path = new Path('graph', set.properties.pathProperties);
            let scaleV = this.dimensions.height / 8;
            let scaleH = this.dimensions.width / 30;
            let dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            let intervalX = (dimensions.width) / set.data.length;
    
            path.moveTo(scaleH, dimensions.height - set.data[0][set.yKey] / set.bounds().max * dimensions.height - path.pathProperties.strokeWidth / 2 + scaleV / 2 );
            for(let i = 1; i < set.data.length; i++) {
                this.connectPoints(intervalX * i + scaleH, dimensions.height - set.data[i][set.yKey] / set.bounds().max * dimensions.height + scaleV / 2, path, set);
            }
            path.LineH(dimensions.width + path.pathProperties.strokeWidth / 2 + scaleH);
            this.components.put(path.id, path);
            return path;
        }
    }
    
    } // Namespace end