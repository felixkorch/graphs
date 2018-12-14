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
            return { min: Math.min.apply(Math, values), max: Math.max.apply(Math, values) };
        };
        DataSet.prototype.toHourMinute = function () {
            var _this = this;
            return this.data.map(function (e) { return new Date(e[_this.xKey]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); });
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
        Path.typeString = function (type, coords) {
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
                path += Path.typeString(x.type, x.coords);
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
            this.offsetX = this.div.offsetWidth * 0.04;
            this.offsetY = this.div.offsetHeight * 0.05;
            this.dimensions = { width: this.div.offsetWidth - this.offsetX, height: this.div.offsetHeight - this.offsetY };
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
            return '<svg id="' + "SVG_DIV" + '" ' +
                'width="100%" height="100%" ' +
                'viewBox=" 0 0 ' + this.div.offsetWidth + ' ' + this.div.offsetHeight + '">' +
                '<g id="' + SVG_DIV + '" transform="translate(' + this.offsetX / 2 + ' ' + this.offsetY / 2 + ')" ></g>' +
                '</svg>';
        };
        XYChart.prototype.createReferenceLines = function () {
            var set = this.dataCollection[0];
            if (!set)
                return;
            var density = set.properties.density;
            var pathProperties = { stroke: "#dbdbdb", strokeWidth: 0.5 };
            var halfStroke = pathProperties.strokeWidth / 2;
            var interval = this.dimensions.width / (set.data.length + 1);
            var path = new Path('refLines', pathProperties);
            for (var i = 0; i < set.data.length - 1; i++) {
                path.moveTo(interval * (i + 2) - halfStroke, halfStroke);
                path.LineV(this.dimensions.height - halfStroke);
            }
            for (var i = 0; i < density - 1; i++) {
                path.moveTo(halfStroke + interval, this.dimensions.height / density * (i + 1) + halfStroke);
                path.LineH(this.dimensions.width - halfStroke);
            }
            this.components.put(path.id, path);
            return path;
        };
        XYChart.prototype.createXHeaders = function () {
            var set = this.dataCollection[0];
            if (!set)
                return;
            var result = [];
            var fontSize = this.dimensions.height / 46;
            var intervalX = this.dimensions.width / (set.data.length + 1);
            var dates = set.toHourMinute();
            for (var i = 0; i < set.data.length; i++) {
                result.push(new Text(dates[i], fontSize, { x: intervalX * (i + 1), y: this.dimensions.height }));
            }
            return result;
        };
        XYChart.prototype.createYHeaders = function () {
            var set = this.dataCollection[0];
            if (!set)
                return;
            var result = [];
            var fontSize = this.dimensions.height / 35;
            var density = set.properties.density;
            var interval = this.dimensions.height / density;
            for (var i = 0; i < density; i++) {
                var content = (Math.floor(set.bounds().max - i * set.bounds().max / (density - 1))).toString();
                result.push(new Text(content, fontSize, { x: 0, y: interval * i + fontSize * 0.35 }));
            }
            return result;
        };
        XYChart.prototype.draw = function () {
            var mainSvg = this.div.querySelector('#' + SVG_DIV);
            this.createReferenceLines().render(mainSvg);
            for (var _i = 0, _a = this.dataCollection; _i < _a.length; _i++) {
                var set = _a[_i];
                this.createGraph(set).render(mainSvg);
            }
            var yHeaders = new SVGBatch('yHeaders');
            yHeaders.components = this.createYHeaders();
            yHeaders.render(mainSvg);
            var xHeaders = new SVGBatch('xHeaders');
            xHeaders.components = this.createXHeaders();
            xHeaders.render(mainSvg);
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
            var intervalX = this.dimensions.width / (set.data.length + 1);
            var intervalY = this.dimensions.height / set.properties.density;
            path.moveTo(intervalX, this.dimensions.height - set.data[0][set.yKey] / set.bounds().max * this.dimensions.height - intervalY);
            for (var i = 1; i < set.data.length; i++) {
                this.connectPoints(intervalX * (i + 1), (this.dimensions.height - intervalY) - set.data[i][set.yKey] / set.bounds().max * (this.dimensions.height - intervalY), path, set);
            }
            path.LineH(this.dimensions.width);
            this.components.put(path.id, path);
            return path;
        };
        return StepLineChart;
    }(XYChart));
    xycharts.StepLineChart = StepLineChart;
})(xycharts || (xycharts = {})); // Namespace end
//# sourceMappingURL=index.js.map