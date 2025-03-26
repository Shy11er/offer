import {BrowserRouter, Route, Routes} from 'react-router-dom';

import {Navbar} from './components/Navbar';
import {Wrapper} from './components/Wrapper';
import {Contract} from './pages/Contract';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import { Auth } from './pages/Auth';

const App = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route
                    path="/auth"
                    element={
                        <Wrapper>
                            <Auth />
                        </Wrapper>
                    }
                />

                <Route
                    path="/contracts/:id"
                    element={
                        <Wrapper>
                            <Contract />
                        </Wrapper>
                    }
                />

                <Route
                    path="/contracts/success"
                    element={
                        <Wrapper>
                            <SuccessPage />
                        </Wrapper>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
