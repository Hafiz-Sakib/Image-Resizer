import { MotionConfig } from 'framer-motion';
import Home from './pages/Home.jsx';
import Developer from './pages/Developer.jsx';
import ImportantLinks from './pages/ImportantLinks.jsx';
import NotFound from './pages/NotFound.jsx';
import { PATHS, usePath } from './utils/router.js';

export default function App() {
  const path = usePath();
  return (
    <MotionConfig reducedMotion="user">
      {path === PATHS.developer ? <Developer /> : path === PATHS.importantLinks ? <ImportantLinks /> : path === PATHS.notFound ? <NotFound /> : <Home />}
    </MotionConfig>
  );
}
