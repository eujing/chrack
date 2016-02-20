const {Router, Route, IndexRoute,  browserHistory} = ReactRouter;

if (Meteor.isClient) {
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Meteor.startup(() => {
        ReactDOM.render((
            <Router history={browserHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Home} />
                    <Route path="home" component={Home} />
                    <Route path="personal" component={Personal} />
                    <Route path="leadership" component={Leadership} />
                </Route>
            </Router>
        ), document.getElementById("render-target"));
    });
}
