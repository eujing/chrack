AccountsUIWrapper = React.createClass({
    componentDidMount() {
        this.view = Blaze.render(Template._loginButtons, ReactDOM.findDOMNode(this.refs.accounts_container));
    },

    componentWillUnmount() {
        Blaze.remove(this.view);
    },

    render() {
        return <span ref="accounts_container" />;
    }
});
