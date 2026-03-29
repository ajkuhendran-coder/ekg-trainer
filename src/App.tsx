import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import LearningModule from './pages/LearningModule.tsx';
import LessonView from './pages/LessonView.tsx';
import CasesModule from './pages/CasesModule.tsx';
import CaseView from './pages/CaseView.tsx';
import ExamModule from './pages/ExamModule.tsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lernen" element={<LearningModule />} />
        <Route path="/lernen/:levelId/:lessonId" element={<LessonView />} />
        <Route path="/faelle" element={<CasesModule />} />
        <Route path="/faelle/:caseId" element={<CaseView />} />
        <Route path="/pruefung" element={<ExamModule />} />
      </Routes>
    </Layout>
  );
}
