import { Routes, Route } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import HomePage from '@pages/HomePage';
import UploadPage from '@pages/UploadPage';
import ContractsPage from '@pages/ContractsPage';
import ContractDetailPage from '@pages/ContractDetailPage';
import FindingsPage from '@pages/FindingsPage';
import ClausesPage from '@pages/ClausesPage';
import NotFoundPage from '@pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="contract/:contractId" element={<ContractDetailPage />} />
        <Route path="contract/:contractId/findings" element={<FindingsPage />} />
        <Route path="contract/:contractId/clauses" element={<ClausesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
