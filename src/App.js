import { Routes, Route } from 'react-router-dom';
// Layouts
import Layout from './components/Layouts/Layout';

// Models CRUD
import Models from './features/models/Models';
import AddModel from './features/models/AddModel';
import AddRecepies from './features/recepies/AddRecepies';
import ReadModel from './features/models/ReadModel';
import AddUser from './features/users/AddUser';

import Example from './features/recepies/AddRecepies';

import Missing from './components/Missing';

function App() {
  return (
    <>
    <Example/>
    </>
    // <Routes>
    //   <Route index element={AddRecepies} />
    //   <Route path="/" element={<Layout />}>
    //         <Route path="recepies" >
    //           <Route index element={AddRecepies} />
              
    //           <Route path="1" element={<Missing />} />
    //           <Route path="2" element={<Missing />} />
    //         </Route>

    //     {/* catch all */}
    //     <Route path="*" element={<Missing />} />
    //   </Route>
    // </Routes>
  );
}

export default App;
