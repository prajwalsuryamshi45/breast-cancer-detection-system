import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ScanUpload } from "./ScanUpload";
import { ScanList } from "./ScanList";
import { AnalysisResults } from "./AnalysisResults";
import { ArrowLeft, User, Calendar, Mail, Phone, FileText } from "lucide-react";

interface PatientDetailProps {
  patientId: Id<"patients">;
  onBack: () => void;
}

type TabType = "overview" | "scans" | "upload" | "analysis";

export function PatientDetail({ patientId, onBack }: PatientDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const patient = useQuery(api.patients.getPatient, { patientId });
  const scans = useQuery(api.scans.listScans, { patientId }) || [];
  const analyses = useQuery(api.analysis.listAnalyses, { patientId }) || [];

  if (!patient) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <PatientOverview patient={patient} scans={scans} analyses={analyses} />;
      case "scans":
        return <ScanList patientId={patientId} />;
      case "upload":
        return <ScanUpload patientId={patientId} onSuccess={() => setActiveTab("scans")} />;
      case "analysis":
        return <AnalysisResults patientId={patientId} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Patients</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-600">{patient.email}</p>
            <p className="text-sm text-gray-500">
              Patient ID: {patient._id.slice(-8)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "scans", label: "Medical Scans", icon: FileText },
              { id: "upload", label: "Upload Scan", icon: Calendar },
              { id: "analysis", label: "AI Analysis", icon: Mail },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

function PatientOverview({ patient, scans, analyses }: any) {
  const latestScan = scans[0];
  const latestAnalysis = analyses[0];

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{patient.firstName} {patient.lastName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{patient.dateOfBirth}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Medical Summary</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{scans.length}</p>
              <p className="text-sm text-blue-600">Total Scans</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analyses.length}</p>
              <p className="text-sm text-green-600">AI Analyses</p>
            </div>
          </div>

          {patient.medicalHistory && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Medical History</p>
              <p className="text-sm bg-gray-50 p-3 rounded-lg">{patient.medicalHistory}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        
        <div className="space-y-3">
          {latestScan && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Latest Scan</p>
                <p className="text-sm text-gray-600">
                  {latestScan.scanType} - {latestScan.scanDate}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                Recent
              </span>
            </div>
          )}
          
          {latestAnalysis && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Latest Analysis</p>
                <p className="text-sm text-gray-600">
                  Risk Level: {latestAnalysis.riskLevel} ({latestAnalysis.confidence}% confidence)
                </p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${
                latestAnalysis.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                latestAnalysis.riskLevel === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {latestAnalysis.riskLevel}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
