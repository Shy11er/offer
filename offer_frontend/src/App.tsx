import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

import {BottomNavbar} from './components/BottomNavbar';
import {Navbar} from './components/Navbar';
import {Wrapper} from './components/Wrapper';
import {Auth} from './pages/Auth';
import {Contract} from './pages/Contract';
import {ContractPreview} from './pages/ContractPreview';
import {CreateObject} from './pages/CreateObject';
import {Object} from './pages/Object';
import {Profile} from './pages/Profile';
import SuccessPage from './pages/SuccessPage/SuccessPage';
import {UserCreate} from './pages/UserCreate';

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
                    path="/"
                    element={
                        <Wrapper>
                            <Object />
                            <BottomNavbar />
                        </Wrapper>
                    }
                />

                <Route
                    path="/objects/new"
                    element={
                        <Wrapper>
                            <CreateObject />
                            <BottomNavbar />
                        </Wrapper>
                    }
                />

                <Route
                    path="/objects/:id/edit"
                    element={
                        <Wrapper>
                            <CreateObject />
                            <BottomNavbar />
                        </Wrapper>
                    }
                />

                <Route
                    path="/objects/preview"
                    element={
                        <Wrapper>
                            <ContractPreview />
                            <BottomNavbar />
                        </Wrapper>
                    }
                />

                <Route
                    path="/objects/preview/:id"
                    element={
                        <Wrapper>
                            <ContractPreview />
                            <BottomNavbar />
                        </Wrapper>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <Wrapper>
                            <Profile />
                            <BottomNavbar />
                        </Wrapper>
                    }
                />

                <Route
                    path="/profile/add"
                    element={
                        <Wrapper>
                            <UserCreate />
                            <BottomNavbar />
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

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
