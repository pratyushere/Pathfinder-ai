import { useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import QuizPage from "./pages/QuizPage";
import CareersPage from "./pages/CareersPage";
import SimulatorPage from "./pages/SimulatorPage";
import RoadmapPage from "./pages/RoadmapPage";
import DashboardPage from "./pages/DashboardPage";

function PageRouter() {
  const { currentStep } = useApp();

  switch (currentStep) {
    case "landing":
      return <LandingPage />;
    case "profile":
      return <ProfilePage />;
    case "quiz":
      return <QuizPage />;
    case "careers":
      return <CareersPage />;
    case "simulator":
      return <SimulatorPage />;
    case "roadmap":
      return <RoadmapPage />;
    case "dashboard":
      return <DashboardPage />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <PageRouter />
    </div>
  );
}
