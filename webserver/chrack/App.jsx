const {Link} = ReactRouter;

NavBar = React.createClass({
    propTypes: {
        active: React.PropTypes.string
    },

    isActive(pageName) {
        if (this.props.active === pageName) {
            return "active";
        }
        else {
            return "";
        }
    },

    render() {
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-links">
                            <span className="sr-only">Toggle Navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Chrack</a>
                    </div>
                    <div className="collapse navbar-collapse" id="navbar-links">
                        <ul className="nav navbar-nav">
                            <li className={this.isActive("home")}><Link to="/home">Home</Link></li>
                            <li className={this.isActive("personal")}><Link to="/personal">Personal</Link></li>
                            <li className={this.isActive("leadership")}><Link to="/leadership">Leadership</Link></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><AccountsUIWrapper /></li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

App = React.createClass({
    render() {
        return (
            <div className="well page container">
                { this.props.children }
            </div>
        );
    }
});
