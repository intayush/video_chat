import { Route, Switch, withRouter } from "react-router-dom";
import "./App.css";
import Welcome from "./components/Welcome";
import Meeting from "./components/Meeting";

function App() {
    return (
        <Switch>
            <Route exact={true} path="/" component={Welcome} />
            <Route exact={true} path="/meeting" component={Meeting} />
        </Switch>
    );
}

export default withRouter(App);
