LiveGraph = React.createClass({
    propTypes: {
        graphID: React.PropTypes.string.isRequired,
        trendDatas: React.PropTypes.array.isRequired, // [{class, data, colour}, {...}, ...]
        outerWidth: React.PropTypes.number.isRequired,
        outerHeight: React.PropTypes.number.isRequired,
        margin: React.PropTypes.object.isRequired,
        yMin: React.PropTypes.number.isRequired,
        yMax: React.PropTypes.number.isRequired
    },

    componentDidMount: function() {
        let p = this.props;
        let width = p.outerWidth - p.margin.left - p.margin.right;
        let height = p.outerHeight - p.margin.top - p.margin.bottom;

        let el = ReactDOM.findDOMNode(this);
        let svg = d3.select(el)
                    .append("svg")
                        .attr("id", p.graphID)
                        .attr("width", p.width)
                        .attr("height", p.height)
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr("viewBox", "0 0 " + p.outerWidth + " " + p.outerHeight)
                    .append("g")
                        .attr("transform", "translate(" + p.margin.left + ", " + p.margin.top + ")");

        svg.append("defs")
            .append("clipPath")
                .attr("id", "clip")
            .append("rect")
                .attr("width", width)
                .attr("height", height);

        //let realXMin = d3.min(d3.min(p.trendDatas, (trendData) => trendData.data), (d) => d.x);

        let realXMax = d3.max(d3.max(p.trendDatas, (trendData) => trendData.data), (d) => d.x);
        let realXMin = new Date(realXMax.valueOf()).setSeconds(realXMax.getSeconds() - 30);

        this.xScale = d3.time.scale()
                        .domain([realXMin, realXMax])
                        .range([0, width]);

        this.yScale = d3.scale.linear()
                        .domain([p.yMin, p.yMax])
                        .range([height, 0]);

        this.lines = p.trendDatas.map((trendData) => {
            return d3.svg.line()
                    .x((d, i) => this.xScale(d.x))
                    .y((d, i) => this.yScale(d.y))
                    .interpolate("cardinal");
        });

        this.xAxis = d3.svg.axis()
                        .scale(this.xScale)
                        .orient("bottom");

        this.yAxis = d3.svg.axis()
                        .scale(this.yScale)
                        .orient("left");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(this.xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);

        let viewport = svg.append("g")
                        .attr("clip-path", "url(#clip)");

        let paths = p.trendDatas.map((trendData, dataIndex) => {
            return viewport.append("path")
                    .datum(trendData.data)
                    .attr("class", "line " + trendData.name)
                    .attr("stroke", trendData.color)
                    .attr("d", this.lines[dataIndex]);
        });

        this.updateGraph(p);
    },

    componentWillUpdate(nextProps) {
        this.updateGraph(nextProps);
    },

    updateGraph(props) {
        let svg = d3.select("#" + props.graphID).transition();

        //let realXMin = d3.min(d3.min(props.trendDatas, (trendData) => trendData.data), (d) => d.x);

        let realXMax = d3.max(d3.max(props.trendDatas, (trendData) => trendData.data), (d) => d.x);
        let realXMin = new Date(realXMax.valueOf()).setSeconds(realXMax.getSeconds() - 30);

        this.xScale.domain([realXMin, realXMax]);
        this.yScale.domain([props.yMin, props.yMax]);

        props.trendDatas.map((trendData, dataIndex) => {
            svg.select(".line." + trendData.name)
                .duration(1000)
                .ease("linear")
                .attr("d", this.lines[dataIndex](trendData.data));
        });

        svg.select(".x.axis")
            .duration(1000)
            .ease("linear")
            .call(this.xAxis);

        svg.select(".y.axis")
            .duration(1000)
            .ease("linear")
            .call(this.yAxis);
    },

    render() {
        return <div className="live-graph"></div>;
    }
});
