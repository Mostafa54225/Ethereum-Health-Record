import {HashRouter,Switch,Route} from 'react-router-dom'
import Home from './Routes/Home'
import Admin from './Routes/Admin';
import Signup from './Routes/Signup';
import Hospital from './Routes/Hospital';
import Patient from './Routes/Patient';
import Embed from './Routes/embed';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route path="/"exact>
            <Home />
          </Route>
          <Route path="/admin" exact>
            <Admin />
          </Route>
          <Route path="/signup" exact>
            <Signup />
          </Route>
          <Route path="/hospital" exact component={Hospital}></Route>
          <Route path="/patient" exact component={Patient}></Route>
          <Route path="/embed/:id" exact render={(props) => <Embed {...props}/>}></Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
