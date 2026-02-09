import { Route, Switch } from 'wouter';
import { Layout } from './components';
import { AdminProvider } from './context';
import {
  Home,
  About,
  NotFound,
  BlogList,
  BlogPost,
} from './pages';

function App() {
  return (
    <AdminProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/blog" component={BlogList} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </AdminProvider>
  );
}

export default App;
