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

        public toHourMinute() { // Fix options
            return this.data.map(e => new Date(e[this.xKey]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
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

            this.offsetX = this.div.offsetWidth * 0.04;
            this.offsetY = this.div.offsetHeight * 0.05;
            this.dimensions = { width: this.div.offsetWidth - this.offsetX, height:  this.div.offsetHeight - this.offsetY };

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
            return  '<svg id="' + "SVG_DIV" + '" '  +
                        'width="100%" height="100%" ' +
                        'viewBox=" 0 0 ' + this.div.offsetWidth + ' ' + this.div.offsetHeight + '">' +
                        '<g id="' + SVG_DIV + '" transform="translate(' + this.offsetX / 2 + ' ' + this.offsetY / 2 + ')" ></g>' +
                    '</svg>';
        }

        protected createReferenceLines(): Path {
            let set = this.dataCollection[0];
            if(!set)
                return
            
            const density = set.properties.density;
            const pathProperties = { stroke: "#dbdbdb", strokeWidth: 0.5 };
            const halfStroke = pathProperties.strokeWidth / 2;
            const interval = this.dimensions.width / (set.data.length + 1);
            let path = new Path('refLines', pathProperties);
    
            for(let i = 0; i < set.data.length - 1; i++) {
                path.moveTo(interval * (i + 2) - halfStroke, halfStroke);
                path.LineV(this.dimensions.height - halfStroke);
            }
    
            for(let i = 0; i < density - 1; i++) {
                path.moveTo(halfStroke + interval, this.dimensions.height / density * (i + 1) + halfStroke);
                path.LineH(this.dimensions.width - halfStroke);
            }
    
            this.components.put(path.id, path);
            return path;
        }

        protected createXHeaders(): Text[] {
            let set = this.dataCollection[0];
            if(!set)
                return;

            let result = [];
            const fontSize = this.dimensions.height / 46;
            const intervalX = this.dimensions.width / (set.data.length + 1);
            const dates = set.toHourMinute();

            for(let i = 0; i < set.data.length; i++) {
                result.push(new Text(dates[i], fontSize, { x: intervalX * (i + 1), y: this.dimensions.height }));
            }
            return result;
        }

        protected createYHeaders(): Text[] {
            let set = this.dataCollection[0];
            if(!set)
                return;

            let result = [];
            const fontSize = this.dimensions.height / 35;
            const density = set.properties.density;
            const interval = this.dimensions.height / density;

            for(let i = 0; i < density; i++) {
                let content = (Math.floor(set.bounds().max - i * (set.bounds().max - set.bounds().min) / (density - 1))).toString();
                result.push(new Text(content, fontSize, { x: 0, y: interval * i + fontSize * 0.35 }));
            }
            return result;
        }
    
        public draw() {
            let mainSvg: HTMLElement = this.div.querySelector('#' + SVG_DIV);

            this.createReferenceLines().render(mainSvg);

            for(let set of this.dataCollection)
                this.createGraph(set).render(mainSvg);

            let yHeaders = new SVGBatch('yHeaders');
            yHeaders.components = this.createYHeaders();
            yHeaders.render(mainSvg);

            let xHeaders = new SVGBatch('xHeaders');
            xHeaders.components = this.createXHeaders();
            xHeaders.render(mainSvg);
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
            const intervalX = this.dimensions.width / (set.data.length + 1)
            const intervalY = this.dimensions.height / set.properties.density;
    
            path.moveTo(intervalX, this.dimensions.height - (set.data[0][set.yKey] - set.bounds().min) / set.bounds().max * this.dimensions.height - intervalY );
            for(let i = 1; i < set.data.length; i++) {
                this.connectPoints(intervalX * (i + 1), (this.dimensions.height - intervalY) - (set.data[i][set.yKey] - set.bounds().min) / (set.bounds().max - set.bounds().min) * (this.dimensions.height - intervalY), path, set);
            }
            path.LineH(this.dimensions.width);
            this.components.put(path.id, path);
            return path;
        }
    }
    
    } // Namespace end