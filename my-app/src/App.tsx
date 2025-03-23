import {BrowserRouter, Route, Routes} from 'react-router-dom';

import {Wrapper} from './components/Wrapper';
import {Contract} from './pages/Contract';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/contracts/:id"
                    element={
                        <Wrapper>
                            <Contract />
                        </Wrapper>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
