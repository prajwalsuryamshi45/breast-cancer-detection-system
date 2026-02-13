import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Brain, TrendingUp, Users, FileText, AlertTriangle } from "lucide-react";

export function AnalysisDashboard() {
  const patients = useQuery(api.patients.listPatients) || [];
  
  // Get all analyses for all patients (simplified for demo)
  const allAnalyses = patients.flatMap(patient => {
    // This is a simplified approach - in a real app, you'd have a dedicated query
    return []; // We'll use mock data for the dashboard
  });

  // Mock data for demonstration
  const mockAnalyses = [
    { riskLevel: "low", confidence: 85, date: "2024-01-15" },
    { riskLevel: "moderate", confidence: 72, date: "2024-01-14" },
    { riskLevel: "high", confidence: 91, date: "2024-01-13" },
    { riskLevel: "low", confidence: 88, date: "2024-01-12" },
    { riskLevel: "moderate", confidence: 76, date: "2024-01-11" },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: mockAnalyses.filter(a => a.riskLevel === "low").length, color: "#10B981" },
    { name: "Moderate Risk", value: mockAnalyses.filter(a => a.riskLevel === "moderate").length, color: "#F59E0B" },
    { name: "High Risk", value: mockAnalyses.filter(a => a.riskLevel === "high").length, color: "#EF4444" },
  ];

  const confidenceData = mockAnalyses.map((analysis, index) => ({
    name: `Analysis ${index + 1}`,
    confidence: analysis.confidence,
    risk: analysis.riskLevel,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Analysis Dashboard</h2>
            <p className="text-gray-600">Comprehensive overview of breast cancer detection analytics</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
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
            <span className="text-green-600 text-sm font-medium">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Analyses</p>
              <p className="text-3xl font-bold text-gray-900">{mockAnalyses.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+8% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(mockAnalyses.reduce((acc, a) => acc + a.confidence, 0) / mockAnalyses.length)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">High accuracy</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk Cases</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockAnalyses.filter(a => a.riskLevel === "high").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-600 text-sm font-medium">Requires attention</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Risk Level Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Levels */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Analysis Confidence Levels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="confidence" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Analysis Activity</h3>
        <div className="space-y-4">
          {mockAnalyses.slice(0, 5).map((analysis, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  analysis.riskLevel === "high" ? "bg-red-100" :
                  analysis.riskLevel === "moderate" ? "bg-yellow-100" : "bg-green-100"
                }`}>
                  <Brain className={`w-5 h-5 ${
                    analysis.riskLevel === "high" ? "text-red-600" :
                    analysis.riskLevel === "moderate" ? "text-yellow-600" : "text-green-600"
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Analysis #{index + 1}</p>
                  <p className="text-sm text-gray-500">{analysis.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium capitalize ${
                  analysis.riskLevel === "high" ? "text-red-600" :
                  analysis.riskLevel === "moderate" ? "text-yellow-600" : "text-green-600"
                }`}>
                  {analysis.riskLevel} Risk
                </p>
                <p className="text-sm text-gray-500">{analysis.confidence}% confidence</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Model Information */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Model Information</h3>
            <p className="text-gray-600 mb-4">
              Our breast cancer detection system uses advanced deep learning models trained on thousands of medical images.
              The AI provides risk assessments with confidence scores to assist medical professionals in diagnosis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">Model Accuracy</p>
                <p className="text-purple-600">94.2%</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">Training Dataset</p>
                <p className="text-purple-600">50,000+ images</p>
              </div>
              <div className="bg-white/50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">Last Updated</p>
                <p className="text-purple-600">January 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
