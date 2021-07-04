import React from 'react';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Home from './Components/Home';
import Todos from './Components/Todos';
import Register from './Components/Register';
import Admin from './Components/Admin';
import PrivateRoute from './hocs/PrivateRoute';
import UnPrivateRoute from './hocs/UnPrivateRoute';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Adminindex from './Components/Admin/Adminindex';
import tagsindex from './Components/Admin/TagsCategoris/tagsindex';
import blog from './Components/Admin/Blog/createblog';


function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />
      <UnPrivateRoute path="/login" component={Login} />
      <UnPrivateRoute path="/register" component={Register} />
      <PrivateRoute path="/todos" roles={["user", "admin"]} component={Todos} />
      <PrivateRoute path="/admin" roles={["admin"]} component={Admin} />
      <PrivateRoute path="/admindashboard" roles={["admin"]} component={Adminindex} />
      {/* Admin Routes createblog */}
      <PrivateRoute path="/tagsandcategories" roles={["admin"]} component={tagsindex} />
      <PrivateRoute path="/createblog" roles={["admin"]} component={blog} />     
    </Router>
  );
}

export default App;
