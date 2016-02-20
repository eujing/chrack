Personal = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData() {
        return {
            currentUser: Meteor.user(),
            chairs: Chairs.find({}).fetch()
        };
    },

    renderChairs() {
        return this.data.chairs.map((chair) => {
            return <option key={chair._id} value={chair._id}>{ chair.name }</option>;
        });
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
                            value={this.data.currentUser.profile.chair_id}
                            onChange={this.handleChairChange}>
                            <option>Select One</option>
                            {this.renderChairs()}
                        </select>
                    </div>
                    : <h1> Please Log In </h1>
                }
            </div>
        );
    }
});

