namespace xycharts {
    type Color = "#FFFFFF" | "#FF0000" | "#0000FF" | "#67B6DB";
    export const WHITE: Color = "#FFFFFF";
    export const RED: Color = "#FF0000";
    export const BLUE: Color = "#0000FF";
    export const NICE_BLUE: Color = "#67B6DB";

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

    type Point = { x: number, y: number };
    type Rect = { x: number, y: number, width: number, height: number };

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
        public density: number;
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
            let values = this.data.map(e => e[this.yKey]);
            return { min: Math.min(...values), max: Math.max(...values) };
        }

        public toHourMinute() { // Add options
            return this.data.map(e => new Date(e[this.xKey]).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit', hour12: false })); // TODO: Add Locale specifics
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

        protected static typeString(type: PathType, coords: [number, number]) {
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
                path += Path.typeString(x.type, x.coords);
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
            container.querySelector('#' + this.id).classList.add('transition');
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

        protected readonly offsetY: number;
        protected readonly offsetX: number;
    
        constructor(div: string) {
            this.div = document.getElementById(div);

            this.offsetX = this.div.offsetWidth * 0.05; // Arbitrary constant
            this.offsetY = this.div.offsetHeight * 0.05;
            this.dimensions = { width: this.div.offsetWidth - this.offsetX, height:  this.div.offsetHeight - this.offsetY };

            this.components = new Map();
            this.dataCollection = [];

            this.renderSVG(this.div);

            // Temporary -------------------------------
            let head = document.head;
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.transition { transition: all .4s ease-out; }';
            head.appendChild(style);
            // -----------------------------------------

        }

        protected abstract connectPoints(from: Point, to: Point, path: Path, set: DataSet): void;
    
        public createDataSet() {
            let set = new DataSet();
            this.dataCollection.push(set);
            return set;
        }
    
        protected renderSVG(container: HTMLElement) {
            
            /*
            let svg = document.createElement('svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%')
            svg.setAttribute('viewBox', '0 0 ' + this.div.offsetWidth + ' ' + this.div.offsetHeight);

            let mainContainer = document.createElement('g');
            mainContainer.id = SVG_DIV;
            mainContainer.setAttribute('transform', 'translate(' + this.offsetX / 2 + ' ' + this.offsetY / 2 + ')');

            svg.appendChild(mainContainer);
            container.appendChild(svg); */

            container.innerHTML = 
                    '<svg id="' + "SVG_DIV" + '" '  +
                        'width="100%" height="100%" ' +
                        'viewBox=" 0 0 ' + this.div.offsetWidth + ' ' + this.div.offsetHeight + '">' +
                        '<g id="' + SVG_DIV + '" transform="translate(' + this.offsetX / 2 + ' ' + this.offsetY / 2 + ')" ></g>' +
                    '</svg>';
        }

        protected createReferenceLines(bounds: Rect, set: DataSet): Path {
            
            const density = set.properties.density;
            const pathProperties = { stroke: "#dbdbdb", strokeWidth: 0.5 };
            let path = new Path('refLines', pathProperties);
    
            for(let i = 1; i < density; i++) {
                path.moveTo(bounds.x, i * bounds.height / density)
                    .LineH(bounds.x + bounds.width);
            }

            for(let i = 1; i < set.data.length; i++) {
                path.moveTo(bounds.width / set.data.length * i + bounds.x, bounds.y)
                    .LineV(bounds.y + bounds.height);
            }
    
            this.components.put(path.id, path);
            return path;
        }

        protected createXHeaders(bounds: Rect, set: DataSet): Text[] {
            let result = [];
            const fontSize = this.dimensions.height / 40; // arbitrary
            const interval = bounds.width / set.data.length;
            const dates = set.toHourMinute();

            for(let i = 0; i < set.data.length; i++) {
                result.push(new Text(dates[i], fontSize, { x: bounds.x + interval * i, y: this.dimensions.height }));
            }
            return result;
        }

        protected createYHeaders(bounds: Rect, set: DataSet): Text[] {
            let result = [];
            const fontSize = this.dimensions.height / 35; // arbitrary
            const density = set.properties.density;
            const interval = bounds.height / density;

            for(let i = 0; i < density + 1; i++) {
                let content = (Math.floor(set.bounds().max - i * (set.bounds().max - set.bounds().min) / density)).toString();
                result.push(new Text(content, fontSize, { x: 0, y: interval * i + fontSize / 4 }));
            }
            return result;
        }

        protected generateCoordinates(bounds: Rect, set: DataSet) {
            const intervalX = bounds.width / set.data.length
            let coords = [];
            for(let i = 0; i < set.data.length; i++) {
                coords.push({ x: intervalX * i + bounds.x,
                              y: bounds.height - (set.data[i][set.yKey] - set.bounds().min) / (set.bounds().max - set.bounds().min) * bounds.height });
            }
            coords.push({ x: this.dimensions.width, y: coords[set.data.length - 1].y });

            return coords;
        }
    
        protected createGraph(bounds: Rect, set: DataSet): Path {
            let path = new Path('graph', set.properties.pathProperties);
            let coords = this.generateCoordinates(bounds, set);

            for(let i = 0; i < coords.length - 1; i++) {
                let from = { x: coords[i].x, y: coords[i].y };
                let to = { x: coords[i + 1].x, y: coords[i + 1].y };
                this.connectPoints(from, to, path, set);
            }

            this.components.put(path.id, path);
            return path;
        }
    
        public draw() {
            let mainSvg: HTMLElement = this.div.querySelector('#' + SVG_DIV);

            let bounds: Rect = { x: this.offsetX, y: 0, width: this.dimensions.width - this.offsetX, height: this.dimensions.height - this.offsetY };

            this.createReferenceLines(bounds, this.dataCollection[0]).render(mainSvg);
            this.createGraph(bounds, this.dataCollection[0]).render(mainSvg);

            let yHeaders = new SVGBatch('yHeaders');
            yHeaders.components = this.createYHeaders(bounds, this.dataCollection[0]);
            yHeaders.render(mainSvg);

            let xHeaders = new SVGBatch('xHeaders');
            xHeaders.components = this.createXHeaders(bounds, this.dataCollection[0]);
            xHeaders.render(mainSvg);
        }

    }

    export class LineChart extends XYChart {

        constructor(div: string) {
            super(div);
        }

        protected connectPoints(from: Point, to: Point, path: Path, set: DataSet) {
            for(let i = 0; i < set.data.length; i++) {
                path.moveTo(from.x, from.y)
                    .lineTo(to.x, to.y);
            }
        }

    }
    
    export class StepLineChart extends XYChart {
    
        constructor(div: string) {
            super(div);
        }

        protected connectPoints(from: Point, to: Point, path: Path, set: DataSet) {
            let movingUp = to.y < from.y;
            let halfStroke = set.properties.pathProperties.strokeWidth / 2;
            
            path
                .moveTo(from.x - halfStroke, from.y)
                .LineH(to.x)
                .moveTo(to.x - halfStroke, movingUp ? from.y + halfStroke : from.y - halfStroke)
                .LineV(movingUp ? to.y - halfStroke : to.y + halfStroke)
        }
    }
    
    } // Namespace end