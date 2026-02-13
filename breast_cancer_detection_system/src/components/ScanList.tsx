import { useState } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Eye, Brain, Calendar, FileText, Loader2 } from "lucide-react";

interface ScanListProps {
  patientId: Id<"patients">;
}

export function ScanList({ patientId }: ScanListProps) {
  const [selectedScan, setSelectedScan] = useState<string | null>(null);
  const [analyzingScans, setAnalyzingScans] = useState<Set<string>>(new Set());
  
  const scans = useQuery(api.scans.listScans, { patientId }) || [];
  const analyzeImage = useAction(api.analysis.analyzeImage);

  const handleAnalyze = async (scanId: Id<"scans">) => {
    setAnalyzingScans(prev => new Set(prev).add(scanId));
    
    try {
      await analyzeImage({ scanId });
      toast.success("AI analysis completed successfully");
    } catch (error) {
      toast.error("Failed to analyze scan");
      console.error(error);
    } finally {
      setAnalyzingScans(prev => {
        const newSet = new Set(prev);
        newSet.delete(scanId);
        return newSet;
      });
    }
  };

  if (scans.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No scans uploaded</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload medical scans to get started with AI analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Medical Scans</h3>
        <p className="text-sm text-gray-500">{scans.length} scan(s) uploaded</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scans.map((scan) => (
          <div key={scan._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
            {/* Image Preview */}
            <div className="aspect-square bg-gray-100 relative">
              {scan.imageUrl ? (
                <img
                  src={scan.imageUrl}
                  alt={`${scan.scanType} scan`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
              )}
              
              {/* Scan Type Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                  {scan.scanType.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Scan Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{scan.scanDate}</span>
              </div>

              {scan.notes && (
                <p className="text-sm text-gray-600 line-clamp-2">{scan.notes}</p>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedScan(selectedScan === scan._id ? null : scan._id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </button>
                
                <button
                  onClick={() => handleAnalyze(scan._id)}
                  disabled={analyzingScans.has(scan._id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {analyzingScans.has(scan._id) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  <span className="text-sm">
                    {analyzingScans.has(scan._id) ? "Analyzing..." : "Analyze"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expanded View Modal */}
      {selectedScan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Scan Details</h3>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {(() => {
                const scan = scans.find(s => s._id === selectedScan);
                return scan ? (
                  <div className="space-y-4">
                    <img
                      src={scan.imageUrl || ""}
                      alt={`${scan.scanType} scan`}
                      className="w-full max-h-96 object-contain rounded-lg"
                    />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {scan.scanType}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {scan.scanDate}
                      </div>
                      {scan.notes && (
                        <div className="col-span-2">
                          <span className="font-medium">Notes:</span> {scan.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
