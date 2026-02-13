import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PatientList } from "./PatientList";
import { PatientForm } from "./PatientForm";
import { PatientDetail } from "./PatientDetail";
import { AnalysisDashboard } from "./AnalysisDashboard";
import { Id } from "../../convex/_generated/dataModel";
import { LayoutDashboard, Users, Plus, BarChart3, Brain } from "lucide-react";

type View = "dashboard" | "patients" | "add-patient" | "patient-detail" | "analysis";

export function Dashboard() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<Id<"patients"> | null>(null);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const patients = useQuery(api.patients.listPatients) || [];

  const handlePatientSelect = (patientId: Id<"patients">) => {
    setSelectedPatientId(patientId);
    setCurrentView("patient-detail");
  };

  const renderContent = () => {
    switch (currentView) {
      case "patients":
        return (
          <PatientList 
            onPatientSelect={handlePatientSelect}
            onAddPatient={() => setCurrentView("add-patient")}
          />
        );
      case "add-patient":
        return (
          <PatientForm
            onSuccess={() => setCurrentView("patients")}
            onCancel={() => setCurrentView("patients")}
          />
        );
      case "patient-detail":
        return selectedPatientId ? (
          <PatientDetail
            patientId={selectedPatientId}
            onBack={() => setCurrentView("patients")}
          />
        ) : null;
      case "analysis":
        return <AnalysisDashboard />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-2">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentView === "dashboard"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView("patients")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentView === "patients" || currentView === "add-patient" || currentView === "patient-detail"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span>Patients</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView("add-patient")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentView === "add-patient"
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5" />
                  <span>Add Patient</span>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView("analysis")}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  currentView === "analysis"
                    ? "bg-purple-50 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5" />
                  <span>Analytics</span>
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  const patients = useQuery(api.patients.listPatients) || [];
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, Dr. {loggedInUser?.email?.split('@')[0]}
            </h2>
            <p className="text-blue-100 text-lg">
              Advanced AI-powered breast cancer detection and analysis platform
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">Active patients</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-600 text-sm font-medium">Awaiting review</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Analyses</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">Completed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
              <p className="text-3xl font-bold text-gray-900">94.2%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-purple-600 text-sm font-medium">AI Model</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Add New Patient</h4>
                <p className="text-sm text-gray-600">Register a new patient for analysis</p>
              </div>
            </div>
          </div>

          <div className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">AI Analysis</h4>
                <p className="text-sm text-gray-600">Upload scans for AI-powered detection</p>
              </div>
            </div>
          </div>

          <div className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">View Analytics</h4>
                <p className="text-sm text-gray-600">Comprehensive analysis dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Information */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Advanced Deep Learning Technology
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our breast cancer detection system leverages state-of-the-art convolutional neural networks 
              trained on extensive medical imaging datasets. The AI provides accurate risk assessments 
              with confidence scores to support medical professionals in early detection and diagnosis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/70 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">Model Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">94.2%</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">Training Images</p>
                <p className="text-2xl font-bold text-purple-600">50K+</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">Scan Types</p>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
              <div className="bg-white/70 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">Response Time</p>
                <p className="text-2xl font-bold text-purple-600">&lt;30s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
