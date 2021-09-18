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
import Displayblogs from './Components/Admin/Blog/Displayblogs';
import DisplaySingleBlog from './Components/Admin/Blog/DisplaySingleBlog';
import './App.css'
import EditdeleteList from './Components/Admin/crud/EditdeleteList';
import BlogUpdate from './Components/Admin/crud/BlogUpdate';
import BlogsbyCategory from './Components/Category/BlogsbyCategory';
import BlogsbyTags from './Components/Tags/BlogsbyTags';

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

      {/* Blog */}

      <Route path="/displayBlogs" component={Displayblogs} />
      <Route path="/blogs/:slug" component={DisplaySingleBlog} />
      <Route path="/categories/:slug" component={BlogsbyCategory} />
      <Route path="/tags/:slug" component={BlogsbyTags} />
      {/* Edit and delete blogs */}
      <PrivateRoute path="/editdeleteList" roles={["admin"]} component={EditdeleteList} />

      <PrivateRoute path="/blogsupdate/:slug" roles={["admin"]} component={BlogUpdate} />



    </Router>
  );
}

export default App;
