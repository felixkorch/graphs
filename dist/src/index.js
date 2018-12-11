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
var graphy;
(function (graphy) {
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
    var Path = /** @class */ (function (_super) {
        __extends(Path, _super);
        function Path(id, pathProperties, path) {
            var _this = _super.call(this, id) || this;
            _this.path = path ? path : '';
            _this.pathProperties = pathProperties ? pathProperties : new PathProperties();
            _this.coordinates = [];
            _this.currentPos = [0, 0];
            return _this;
        }
        Path.prototype.moveTo = function (x, y) {
            this.coordinates.push([x, y]);
            this.currentPos = [x, y];
            this.path += 'M ' + x + ' ' + y + ' ';
            return this;
        };
        Path.prototype.lineTo = function (x, y) {
            this.currentPos = [x, y];
            this.path += 'L ' + x + ' ' + y + ' ';
            return this;
        };
        Path.prototype.LineH = function (x) {
            this.currentPos[0] = x;
            this.path += 'H ' + x + ' ';
            return this;
        };
        Path.prototype.LineV = function (y) {
            this.currentPos[1] = y;
            this.path += 'V ' + y + ' ';
            return this;
        };
        Path.prototype.render = function (container) {
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
    var XYChart = /** @class */ (function () {
        function XYChart(div, data) {
            this._data = data ? data : [];
            this.div = document.getElementById(div);
            this.dimensions = { width: this.div.offsetWidth, height: this.div.offsetHeight };
            this.graphProps = new PathProperties();
            this.components = new Map();
            this.div.innerHTML = this.renderSVG();
        }
        Object.defineProperty(XYChart.prototype, "data", {
            set: function (data) {
                this._data = data;
            },
            enumerable: true,
            configurable: true
        });
        XYChart.prototype.boundsOfData = function (dataObject) {
            if (!dataObject)
                return { min: 0, max: 0 };
            var values = dataObject.map(function (el) {
                return el.value;
            });
            var max = Math.max.apply(Math, values);
            var min = Math.min.apply(Math, values);
            return { min: min, max: max };
        };
        XYChart.prototype.renderSVG = function (content) {
            return '<svg id="' + SVG_DIV + '" ' +
                'preserveAspectRatio="xMinYMin none" ' +
                'width="100%" height="100%" ' +
                'viewBox="0 0 ' + this.dimensions.width + ' ' + this.dimensions.height + '">' +
                '</svg>';
        };
        XYChart.prototype.createReferenceLines = function () {
            var pathProperties = { stroke: "#dbdbdb", strokeWidth: 0.5 };
            var halfStroke = pathProperties.strokeWidth / 2;
            var scaleV = this.dimensions.height / 8;
            var scaleH = this.dimensions.width / 30;
            var dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            var intervalX = (dimensions.width) / this._data.length;
            var path = new Path('refLines', pathProperties);
            for (var i = 1; i < this._data.length; i++) {
                path.moveTo(intervalX * i - halfStroke + scaleH, halfStroke + scaleV / 2);
                path.LineV(this.dimensions.height - halfStroke);
            }
            for (var i = 1; i < 10; i++) {
                path.moveTo(scaleH + halfStroke, this.dimensions.height / 10 * i + halfStroke + scaleV / 2);
                path.LineH(this.dimensions.width - halfStroke);
            }
            this.components.put(path.id, path);
            return path;
        };
        XYChart.prototype.createXHeaders = function () {
            return null;
        };
        XYChart.prototype.createYHeaders = function () {
            var bounds = this.boundsOfData(this._data);
            var result = [];
            var fontSize = this.dimensions.height / 30; // ratio of dimensions?
            for (var i = 0; i < 10; i++) {
                var content = (Math.floor(bounds.max - i * bounds.max / 10)).toString();
                result.push(new Text(content, fontSize, { x: 0, y: (this.dimensions.height / 10 * i + fontSize / 2) + this.dimensions.height / 17 }));
            }
            return result;
        };
        XYChart.prototype.draw = function () {
            var _this = this;
            this.createReferenceLines().render(this.div.querySelector('#' + SVG_DIV));
            this.createGraph().render(this.div.querySelector('#' + SVG_DIV));
            this.createYHeaders().forEach(function (el) { return el.render(_this.div.querySelector('#' + SVG_DIV)); });
        };
        return XYChart;
    }());
    graphy.XYChart = XYChart;
    var LineChart = /** @class */ (function (_super) {
        __extends(LineChart, _super);
        function LineChart(div, data) {
            return _super.call(this, div, data) || this;
        }
        LineChart.prototype.addPoint = function (point, index) {
            throw new Error("Method not implemented.");
        };
        LineChart.prototype.removePoint = function (index) {
            throw new Error("Method not implemented.");
        };
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
    graphy.LineChart = LineChart;
    var StepLineChart = /** @class */ (function (_super) {
        __extends(StepLineChart, _super);
        function StepLineChart(div, data) {
            return _super.call(this, div, data) || this;
        }
        StepLineChart.prototype.addPoint = function (point, index) {
            if (index == null) {
                this._data.push(point);
                return;
            }
            this._data.splice(index, 0, point);
            //let graph = this.div.querySelector('#' + 'graph');
            //graph.setAttribute('d', graph.getAttribute('d') + this.components['graph'].);
        };
        StepLineChart.prototype.removePoint = function (index) {
            this._data.splice(index, 1);
        };
        StepLineChart.prototype.connectPoints = function (x, y, path) {
            var movingUp = y < path.currentPos[1];
            var halfStroke = this.graphProps.strokeWidth / 2;
            path
                .LineH(x)
                .moveTo(x - halfStroke, movingUp ? path.currentPos[1] + halfStroke : path.currentPos[1] - halfStroke)
                .LineV(movingUp ? y + halfStroke : y - halfStroke)
                .moveTo(path.currentPos[0] - halfStroke, path.currentPos[1]);
        };
        StepLineChart.prototype.createGraph = function () {
            var path = new Path('graph', this.graphProps);
            var scaleV = this.dimensions.height / 8;
            var scaleH = this.dimensions.width / 30;
            var dimensions = { width: this.dimensions.width - scaleH, height: this.dimensions.height - scaleV };
            var intervalX = (dimensions.width) / this._data.length;
            var bounds = this.boundsOfData(this._data);
            path.moveTo(scaleH, dimensions.height - this._data[0].value / bounds.max * dimensions.height + path.pathProperties.strokeWidth / 2 + scaleV / 2);
            for (var i = 1; i < this._data.length; i++) {
                this.connectPoints(intervalX * i + scaleH, dimensions.height - this._data[i].value / bounds.max * dimensions.height + scaleV / 2, path);
            }
            path.LineH(dimensions.width + path.pathProperties.strokeWidth / 2 + scaleH);
            this.components.put(path.id, path);
            return path;
        };
        return StepLineChart;
    }(XYChart));
    graphy.StepLineChart = StepLineChart;
})(graphy || (graphy = {})); // Namespace end
//# sourceMappingURL=index.js.map