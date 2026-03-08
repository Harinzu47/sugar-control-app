import Blogs from '../views/pages/blogs';
import Home from '../views/pages/home';
import DIABETESDISH from '../views/pages/diabetesdish';
import Detail from '../views/pages/detail';
import ProfilePage from '../views/pages/profilePage';

const routes = {
    '/': Home, // default page
    '/home': Home,
    '/diabetesdish': DIABETESDISH,
    '/food/:id': Detail,
    '/blogs': Blogs,
    '/profile': ProfilePage,
};

export default routes;