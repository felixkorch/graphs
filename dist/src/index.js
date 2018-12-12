var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var xycharts;
(function (xycharts) {
    var WHITE = "#FFFFFF";
    var RED = "#FF0000";
    var BLUE = "#0000FF";
    var Map = /** @class */ (function () {
        function Map() {
            this.object = {};
        }
        Map.prototype.put = function (key, value) {
            this.object[key] = value;
        };
        Map.prototype.get = function (key) {
            return this.object[key];
        };
        return Map;
    }());
    var SVG_DIV = 'main';
    var SVGComponent = /** @class */ (function () {
        function SVGComponent(id) {
            this.id = id ? id : '';
        }
        return SVGComponent;
    }());
    var PathProperties = /** @class */ (function () {
        function PathProperties() {
            this.stroke = "BLUE";
            this.strokeWidth = 3;
        }
        return PathProperties;
    }());
    var Properties = /** @class */ (function () {
        function Properties() {
        }
        return Properties;
    }());
    var DataSet = /** @class */ (function () {
        function DataSet(data) {
            this.data = data ? data : [];
            this.properties = new Properties();
            this.xKey = '';
            this.yKey = '';
        }
        DataSet.prototype.addData = function (item, remove) {
            this.data.splice(0, remove);
            this.data.push(item);
        };
        DataSet.prototype.bounds = function () {
            if (!this.data)
                return { min: 0, max: 0 };
            var values = this.data.map(function (e) { return e.value; });
            var max = Math.max.apply(Math, values);
            var min = Math.min.apply(Math, values);
            return { min: min, max: max };
        };
        return DataSet;
    }());
    xycharts.DataSet = DataSet;
    var PathType;
    (function (PathType) {
        PathType[PathType["MOVETO"] = 0] = "MOVETO";
        PathType[PathType["LINETO"] = 1] = "LINETO";
        PathType[PathType["LINEH"] = 2] = "LINEH";
        PathType[PathType["LINEV"] = 3] = "LINEV";
    })(PathType || (PathType = {}));
    var Path = /** @class */ (function (_super) {
        __extends(Path, _super);
        function Path(id, pathProperties) {
            var _this = _super.call(this, id) || this;
            _this.pathProperties = pathProperties ? pathProperties : new PathProperties();
            _this.currentPos = [0, 0];
            _this.dataPoints = [];
            return _this;
        }
        Path.prototype.typeString = function (type, coords) {
            switch (type) {
                case PathType.MOVETO: return 'M ' + coords[0] + ' ' + coords[1] + ' ';
                case PathType.LINETO: return 'L ' + coords[0] + ' ' + coords[1] + ' ';
                case PathType.LINEH: return 'H ' + coords[0] + ' ';
                case PathType.LINEV: return 'V ' + coords[1] + ' ';
            }
        };
        Path.prototype.moveTo = function (x, y) {
            this.currentPos = [x, y];
            this.dataPoints.push({ coords: [x, y], type: PathType.MOVETO });
            return this;
        };
        Path.prototype.lineTo = function (x, y) {
            this.currentPos = [x, y];
            this.dataPoints.push({ coords: [x, y], type: PathType.LINETO });
            return this;
        };
        Path.prototype.LineH = function (x) {
            this.currentPos[0] = x;
            this.dataPoints.push({ coords: [x, 0], type: PathType.LINEH });
            return this;
        };
        Path.prototype.LineV = function (y) {
            this.currentPos[1] = y;
            this.dataPoints.push({ coords: [0, y], type: PathType.LINEV });
            return this;
        };
        Path.prototype.update = function () {
            var path = '';
            for (var _i = 0, _a = this.dataPoints; _i < _a.length; _i++) {
                var x = _a[_i];
                path += this.typeString(x.type, x.coords);
            }
            this.path = path;
        };
        Path.prototype.render = function (container) {
            this.update();
            var element = container.querySelector('#' + this.id);
            if (element) {
                element.setAttribute('d', this.path);
                return;
            }
            container.innerHTML +=
                '<path id="' + this.id + '" d="' + this.path + '"' +
                    'stroke=' + this.pathProperties.stroke + ' stroke-width=' + this.pathProperties.strokeWidth + ' />';
        };
        return Path;
    }(SVGComponent));
    var Text = /** @class */ (function (_super) {
        __extends(Text, _super);
        function Text(content, fontSize, position, id) {
            var _this = _super.call(this, id) || this;
            _this.content = content;
            _this.fontSize = fontSize;
            _this.position = position;
            return _this;
        }
        Text.prototype.render = function (container) {
            if (this.id) {
                container.querySelector('#' + this.id).innerHTML = this.content;
                return;
            }
            container.innerHTML +=
                '<text id="' + this.id + '" font-size="' + this.fontSize + '"' +
                    'x="' + this.position.x + '" ' +
                    'y="' + this.position.y + '" ' + 'class="small">'
                    + this.content +
                    '</text>';
        };
        return Text;
    }(SVGComponent));
    var SVGBatch = /** @class */ (function (_super) {
        __extends(SVGBatch, _super);
        function SVGBatch(id) {
            var _this = _super.call(this, id) || this;
            _this._components = [];
            return _this;
        }
        Object.defineProperty(SVGBatch.prototype, "components", {
            set: function (list) {
                this._components = list;
            },
            enumerable: true,
            configurable: true
        });
        SVGBatch.prototype.render = function (container) {
            if (!container.querySelector('#' + this.id))
                container.innerHTML += '<g id="' + this.id + '"></g>';
            var element = container.querySelector('#' + this.id);
            element.innerHTML = '';
            this._components.forEach(function (e) { return e.render(element); });
        };
        return SVGBatch;
    }(SVGComponent));
    var XYChart = /** @class */ (function () {
        function XYChart(div) {
            this.div = document.getElementById(div);
            this.dimensions = { width: this.div.offsetWidth, height: this.div.offsetHeight };
            this.components = new Map();
            this.div.innerHTML = this.renderSVG();
            this.dataCollection = [];
        }
        XYChart.prototype.createDataSet = function () {
            var set = new DataSet();
            this.dataCollection.push(set);
            return set;
        };
        XYChart.prototype.renderSVG = function (content) {
            return '<svg id="' + SVG_DIV + '" ' +
                'preserveAspectRatio="xMinYMin none" ' +
                'width="100%" height="100%" ' +
                'viewBox="0 0 ' + this.dimensions.width + ' ' + this.dimensions.height + '">' +
                '</svg>';
        };
        XYChart.prototype.createReferenceLines = function () {
            var set = this.dataCollection[0];
            if (!set)
                return;
            var pathProperties = { stroke: "#dbdbdb", strokeWidth: 0.5 };
            var halfStroke = pathProperties.strokeWidth / 2;
            var scaleV = this.dimensions.height / 8;
            var scaleH = this.dimensions.width / 30;
            var dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            var intervalX = dimensions.width / set.data.length;
            var path = new Path('refLines', pathProperties);
            for (var i = 1; i < set.data.length; i++) {
                path.moveTo(intervalX * i - halfStroke + scaleH, halfStroke + scaleV / 2);
                path.LineV(this.dimensions.height - halfStroke);
            }
            for (var i = 1; i < 11; i++) {
                path.moveTo(scaleH + halfStroke, dimensions.height / 10 * i + halfStroke + scaleV / 2);
                path.LineH(this.dimensions.width - halfStroke);
            }
            this.components.put(path.id, path);
            return path;
        };
        XYChart.prototype.createXHeaders = function () {
            return null;
        };
        XYChart.prototype.createYHeaders = function () {
            var set = this.dataCollection[0];
            if (!set)
                return;
            var result = [];
            var fontSize = this.dimensions.height / 35; // ratio of dimensions?
            var scaleV = this.dimensions.height / 8;
            var scaleH = this.dimensions.width / 30;
            var dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            for (var i = 0; i < 11; i++) {
                var content = (Math.floor(set.bounds().max - i * set.bounds().max / 10)).toString();
                result.push(new Text(content, fontSize, { x: 0, y: (dimensions.height / 10 * i + fontSize / 2) + this.dimensions.height / 17 }));
            }
            return result;
        };
        XYChart.prototype.draw = function () {
            this.createReferenceLines().render(this.div.querySelector('#' + SVG_DIV));
            for (var _i = 0, _a = this.dataCollection; _i < _a.length; _i++) {
                var x = _a[_i];
                this.createGraph(x).render(this.div.querySelector('#' + SVG_DIV));
            }
            //this.createYHeaders().forEach(el => el.render(this.div.querySelector('#' + SVG_DIV)));
            var yHeaders = new SVGBatch('yHeaders');
            yHeaders.components = this.createYHeaders();
            yHeaders.render(this.div.querySelector('#' + SVG_DIV));
        };
        return XYChart;
    }());
    xycharts.XYChart = XYChart;
    var LineChart = /** @class */ (function (_super) {
        __extends(LineChart, _super);
        function LineChart(div) {
            return _super.call(this, div) || this;
        }
        LineChart.prototype.connectPoints = function (x, y, path) {
            path.lineTo(x, y).moveTo(x, y);
        };
        LineChart.prototype.createGraph = function () {
            var path = new Path('graph');
            path.moveTo(0, 0);
            path.lineTo(100, 100);
            return path;
        };
        return LineChart;
    }(XYChart));
    xycharts.LineChart = LineChart;
    var StepLineChart = /** @class */ (function (_super) {
        __extends(StepLineChart, _super);
        function StepLineChart(div) {
            return _super.call(this, div) || this;
        }
        StepLineChart.prototype.connectPoints = function (x, y, path, set) {
            var movingUp = y < path.currentPos[1];
            var halfStroke = set.properties.pathProperties.strokeWidth / 2;
            path
                .LineH(x)
                .moveTo(x - halfStroke, movingUp ? path.currentPos[1] + halfStroke : path.currentPos[1] - halfStroke)
                .LineV(movingUp ? y + halfStroke : y - halfStroke)
                .moveTo(path.currentPos[0] - halfStroke, path.currentPos[1]);
        };
        StepLineChart.prototype.createGraph = function (set) {
            var path = new Path('graph', set.properties.pathProperties);
            var scaleV = this.dimensions.height / 8;
            var scaleH = this.dimensions.width / 30;
            var dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            var intervalX = (dimensions.width) / set.data.length;
            path.moveTo(scaleH, dimensions.height - set.data[0][set.yKey] / set.bounds().max * dimensions.height - path.pathProperties.strokeWidth / 2 + scaleV / 2);
            for (var i = 1; i < set.data.length; i++) {
                this.connectPoints(intervalX * i + scaleH, dimensions.height - set.data[i][set.yKey] / set.bounds().max * dimensions.height + scaleV / 2, path, set);
            }
            path.LineH(dimensions.width + path.pathProperties.strokeWidth / 2 + scaleH);
            this.components.put(path.id, path);
            return path;
        };
        return StepLineChart;
    }(XYChart));
    xycharts.StepLineChart = StepLineChart;
})(xycharts || (xycharts = {})); // Namespace end
//# sourceMappingURL=index.js.map