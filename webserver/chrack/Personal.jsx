Personal = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        let currentUser = Meteor.user();
        let userChairObjectID = currentUser && new Meteor.Collection.ObjectID(currentUser.profile.chair_id) || {};

        return {
            currentUser: Meteor.user(),
            chairs: Chairs.find({}).fetch(),
            user_chair: Chairs.findOne(userChairObjectID)
        };
    },

    renderChairs() {
        if (this.data.chairs) {
            return this.data.chairs.map((chair) => {
                return <option key={chair._id} value={chair._id}>{ chair.name }</option>;
            });
        }
    },

    handleChairChange(event) {
        Meteor.users.update(this.data.currentUser._id, {
            $set: {
                "profile.chair_id": event.target.value
            }
        });
    },

    render() {
        return (
            <div>
                <NavBar active="personal" />
                {this.data.currentUser ? 
                    <div id="content">
                        <h1>Hi {this.data.currentUser.username}, you are sitting at:</h1>
                        <select
                            className="form-control"
                            value={this.data.currentUser && this.data.currentUser.profile.chair_id}
                            onChange={this.handleChairChange}>
                            <option>Select One</option>
                            {this.renderChairs()}
                        </select>
                    </div>
                    : <h1> Please Log In </h1>
                }
                {this.data.user_chair ?
                <div className="graphs">
                    <div className="panel panel-primary">
                        <div className="panel-heading">Movement</div>
                        <div className="panel-body>">
                            <LiveGraph
                                graphID="movementGraph"
                                trendDatas={this.data.user_chair.values}
                                yMin={0.0}
                                yMax={1.0}
                                outerWidth={640}
                                outerHeight={160}
                                margin={{left:40, right:20, top:20, bottom:20}} />
                        </div>
                    </div>
                    <div className="panel panel-primary">
                        <div className="panel-heading">Spin</div>
                        <div className="panel-body>">
                            <LiveGraph
                                graphID="spinGraph"
                                trendDatas={this.data.user_chair.values}
                                yMin={0.0}
                                yMax={1.0}
                                outerWidth={640}
                                outerHeight={160}
                                margin={{left:40, right:20, top:20, bottom:20}} />
                        </div>
                    </div>
                </div>
                : ""}
            </div>
        );
    }
});

