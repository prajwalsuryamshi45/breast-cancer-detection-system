import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Brain, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface AnalysisResultsProps {
  patientId: Id<"patients">;
}

export function AnalysisResults({ patientId }: AnalysisResultsProps) {
  const analyses = useQuery(api.analysis.listAnalyses, { patientId }) || [];

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <Brain className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analyses available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload and analyze medical scans to see AI-powered results here.
        </p>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      case "moderate":
        return <Clock className="w-5 h-5" />;
      case "low":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">AI Analysis Results</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>{analyses.length} analysis(es) completed</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["low", "moderate", "high"].map((risk) => {
          const count = analyses.filter(a => a.riskLevel === risk).length;
          return (
            <div key={risk} className={`p-4 rounded-lg border ${getRiskColor(risk)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm font-medium capitalize">{risk} Risk</p>
                </div>
                {getRiskIcon(risk)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Analysis List */}
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <div key={analysis._id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getRiskColor(analysis.riskLevel)}`}>
                  {getRiskIcon(analysis.riskLevel)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Analysis #{analysis._id.slice(-8)}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(analysis._creationTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(analysis.status)}`}>
                  {analysis.status}
                </span>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Confidence</p>
                  <p className="font-semibold text-gray-900">{analysis.confidence}%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Risk Assessment</h5>
                <div className={`p-3 rounded-lg ${getRiskColor(analysis.riskLevel)}`}>
                  <p className="font-medium capitalize">{analysis.riskLevel} Risk Level</p>
                  <p className="text-sm mt-1">Confidence: {analysis.confidence}%</p>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {analysis.recommendations}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">Detailed Findings</h5>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {analysis.findings}
                </p>
              </div>
            </div>

            {analysis.reviewedBy && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Reviewed on {analysis.reviewDate} by medical professional
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
