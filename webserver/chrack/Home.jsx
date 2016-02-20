Home = React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            currentUser: Meteor.user(),
            users: Meteor.users.find({"profile.chair_id": {$exists: true}}).fetch(),
            chairs: Chairs.find({}).fetch(),
        };
    },

    targetDataGetterGen(targetDataIndex) {
        return () => {
            return this.data.users.map((user) => {
                let userChair = this.data.chairs.find((chair) => chair._id._str === user.profile.chair_id);
                return {
                    name: user.username,
                    color: userChair.values[targetDataIndex].color,
                    data: userChair.values[targetDataIndex].data
                };
            });
        };
    },

    targetLegendGetterGen(targetDataIndex) {
        return () => {
            return this.data.users.map((user) => {
                let userChair = this.data.chairs.find((chair) => chair._id._str === user.profile.chair_id);
                let inlineStyle = {color: userChair.values[targetDataIndex].color};
                return (
                    <li key={user._id}>
                        {user.username + ": "}
                        <span style={inlineStyle}>{userChair.values[targetDataIndex].color}</span>
                    </li>
                );
            });
        };
    },

    render() {
        return (
            <div>
                <NavBar active="home" />
                {this.data.currentUser ?
                <div id="content">
                    <h1>Overview</h1>
                    <div className="panel panel-primary">
                        <div className="panel-heading">Movement</div>
                        <div className="panel-body>">
                            <LiveGraph
                                graphID="movementGraph"
                                trendDatas={this.targetDataGetterGen(0)()}
                                yMin={0.0}
                                yMax={1.0}
                                outerWidth={640}
                                outerHeight={160}
                                margin={{left:40, right:20, top:20, bottom:20}} />
                        </div>
                        <div className="panel-footer">
                            <ul className="list-inline">
                                {this.targetLegendGetterGen(0)()}
                            </ul>
                        </div>
                    </div>
                    <div className="panel panel-primary">
                        <div className="panel-heading">Spin</div>
                        <div className="panel-body>">
                            <LiveGraph
                                graphID="spinGraph"
                                trendDatas={this.targetDataGetterGen(1)()}
                                yMin={0.0}
                                yMax={1.0}
                                outerWidth={640}
                                outerHeight={160}
                                margin={{left:40, right:20, top:20, bottom:20}} />
                        </div>
                        <div className="panel-footer">
                            <ul className="list-inline">
                                {this.targetLegendGetterGen(1)()}
                            </ul>
                        </div>
                    </div>

                </div>
                : <h1 className="login-prompt">Please Log In</h1>
                }
            </div>
        );
    }
});

