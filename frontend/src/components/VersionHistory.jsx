import { useState, useEffect } from 'react';
import { X, Clock, Trash2, GitCompare, Pencil, Check, ChevronRight, Cloud, HardDrive } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import { dbHelpers } from '../lib/supabase';
import toast from 'react-hot-toast';

function VersionHistory({ onClose, onLoad, onRestore, onCompare }) {
  const { versions: localVersions, deleteVersion, renameVersion } = useAppStore();
  const { user, isAuthenticated } = useAuthStore();
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [supabaseVersions, setSupabaseVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allVersions, setAllVersions] = useState([]);

  // Safe handler to open/restore version
  const handleOpenVersion = (version) => {
    if (typeof onLoad === 'function') {
      onLoad(version);
    } else if (typeof onRestore === 'function') {
      onRestore(version.result, version.idea);
    }
  };

  // Fetch Supabase architectures on mount
  useEffect(() => {
    const fetchSupabaseArchitectures = async () => {
      if (!isAuthenticated || !user) {
        setAllVersions(localVersions || []);
        return;
      }

      setLoading(true);
      try {
        const architectures = await dbHelpers.getArchitectures(user.id);
        
        const transformed = architectures.map(arch => ({
          id: `supabase-${arch.id}`,
          supabaseId: arch.id,
          idea: arch.idea,
          timestamp: arch.created_at,
          label: `Architecture #${arch.id}`,
          source: 'supabase',
          result: {
            architecture: {
              type: arch.architecture_type || 'Microservices',
              tech_stack: {
                frontend: arch.tech_stack_frontend || 'React + Vite',
                backend: arch.tech_stack_backend || 'Node.js + Express',
                database: arch.tech_stack_database || 'PostgreSQL',
              },
              components: arch.components?.map(c => c.component_name || c.name || String(c)) || [
                'API Gateway',
                'Auth Service',
                'Core Engine'
              ],
            },
            features: arch.features?.map(f => ({
              name: f.name || f.feature_name,
              priority: f.priority || 'Must',
              description: f.description || '',
            })) || [],
            database: arch.database_tables?.map(t => ({
              table: t.table_name || t.table || t.name,
              fields: Array.isArray(t.fields) ? t.fields : (typeof t.fields === 'string' ? t.fields.split(',').map(s => s.trim()) : ['id', 'created_at']),
              relationships: Array.isArray(t.relationships) ? t.relationships : [],
            })) || [],
            apis: arch.apis?.map(a => ({
              method: a.method || 'GET',
              endpoint: a.endpoint || '/api/resource',
              description: a.description || 'API Endpoint',
            })) || [],
            roadmap: arch.roadmap_phases?.map(p => ({
              phase: p.phase_name || p.phase || 'Phase 1: MVP',
              tasks: Array.isArray(p.tasks) ? p.tasks : ['Architecture Setup', 'Initial Deployment'],
            })) || [
              { phase: 'Phase 1: Foundation', tasks: ['Setup Core Stack', 'Database Schema'] }
            ],
            erDiagram: arch.er_diagram || 'erDiagram\n    USERS ||--o{ POSTS : creates',
            architectureDiagram: arch.architecture_diagram || 'graph TD\n    A[Client] --> B[API Gateway]\n    B --> C[Service]',
            estimation: {
              hours: arch.estimation_hours || arch.dev_hours || '120-180 hrs',
              team_size: arch.estimation_team_size || arch.team_size || '3-5 developers',
              cost: arch.estimation_cost || arch.estimated_cost || '$15,000 - $25,000',
            },
          },
        }));

        setSupabaseVersions(transformed);
        const merged = [...(localVersions || []), ...transformed];
        setAllVersions(merged);
      } catch (error) {
        console.error('Error fetching Supabase architectures:', error);
        setAllVersions(localVersions || []);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseArchitectures();
  }, [isAuthenticated, user, localVersions]);

  const handleDelete = async (id, source) => {
    if (source === 'supabase') {
      const arch = supabaseVersions.find(v => v.id === id);
      if (arch && arch.supabaseId) {
        try {
          await dbHelpers.deleteArchitecture(arch.supabaseId);
          setSupabaseVersions(prev => prev.filter(v => v.id !== id));
          setAllVersions(prev => prev.filter(v => v.id !== id));
          toast.success('Architecture deleted from cloud');
        } catch (error) {
          console.error('Failed to delete from Supabase:', error);
          toast.error('Failed to delete from cloud');
        }
      }
    } else {
      deleteVersion(id);
      setAllVersions(prev => prev.filter(v => v.id !== id));
      toast.success('Local architecture removed');
    }
  };

  const handleRename = (id) => {
    if (!editLabel.trim()) return;
    renameVersion(id, editLabel.trim());
    setEditingId(null);
  };

  const handleCompareClick = () => {
    const vA = allVersions.find(v => v.id === compareA);
    const vB = allVersions.find(v => v.id === compareB);
    if (vA && vB && onCompare) {
      onCompare(vA, vB);
    }
  };

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 selection:bg-[#00FF00] selection:text-black">
      <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000000] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#FFE600] border-b-3 border-black text-black">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-[#FFE600] flex items-center justify-center border-2 border-black">
              <Clock size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg uppercase">
                VERSION ARCHIVE
              </h2>
              <p className="font-mono text-xs font-bold text-gray-800">
                {allVersions.length} REVISIONS PERSISTED {isAuthenticated && <span className="bg-[#00FFFF] text-black px-1.5 py-0.2 border border-black text-[10px]">CLOUD ({supabaseVersions.length})</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {compareA && compareB && (
              <button
                onClick={handleCompareClick}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00FF00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FF00FF] hover:text-white active:translate-x-[1px] active:translate-y-[1px] transition-all font-mono text-xs font-black uppercase"
              >
                <GitCompare size={14} className="stroke-[3]" /> COMPARE
              </button>
            )}
            <button 
              onClick={onClose} 
              className="p-1 bg-white border-2 border-black hover:bg-[#FF5500] hover:text-white transition-colors"
            >
              <X size={18} className="stroke-[3]" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 bg-[#FDF6E3]">
            <div className="w-10 h-10 border-3 border-black border-t-transparent animate-spin mb-3"></div>
            <p className="font-mono text-xs font-bold uppercase text-black">LOADING REVISION HISTORY...</p>
          </div>
        ) : allVersions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 bg-[#FDF6E3]">
            <div className="w-14 h-14 bg-white border-2 border-black flex items-center justify-center mb-3 shadow-[3px_3px_0px_0px_#000000]">
              <Clock size={24} className="stroke-[2.5]" />
            </div>
            <p className="font-mono text-xs font-bold uppercase text-black">NO SAVED ARCHITECTURES YET</p>
            <p className="font-mono text-[10px] text-gray-600 mt-1">Generated specifications save automatically</p>
          </div>
        ) : (
          <>
            <div className="bg-[#F4ECC8] border-b-2 border-black px-5 py-2">
              <p className="font-mono text-[11px] font-black uppercase text-black">
                [ TIP: SELECT 2 VERSIONS TO DIFF STRUCTURAL DELTAS ]
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FDF6E3]">
              {allVersions.map((v) => {
                const isA = compareA === v.id;
                const isB = compareB === v.id;
                const isSelected = isA || isB;
                const isSupabase = v.source === 'supabase';
                return (
                  <div
                    key={v.id}
                    className={`border-2 border-black p-4 transition-all ${
                      isSelected
                        ? 'bg-[#00FFFF] shadow-[4px_4px_0px_0px_#000000] transform -translate-y-0.5'
                        : 'bg-white shadow-[3px_3px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleOpenVersion(v)}
                      >
                        {editingId === v.id && !isSupabase ? (
                          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                            <input
                              className="flex-1 px-2 py-1 font-mono text-xs font-bold bg-[#FDF6E3] border-2 border-black focus:outline-none"
                              value={editLabel}
                              onChange={e => setEditLabel(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleRename(v.id)}
                              autoFocus
                            />
                            <button
                              onClick={() => handleRename(v.id)}
                              className="px-2 py-1 bg-[#00FF00] text-black border-2 border-black shadow-[1px_1px_0px_0px_#000000]"
                            >
                              <Check size={14} className="stroke-[3]" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 className="font-mono font-black text-xs sm:text-sm text-black truncate uppercase hover:underline">{v.label}</h3>
                            {isSupabase ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 font-mono text-[9px] font-black bg-[#FF00FF] text-white border border-black">
                                <Cloud size={9} /> CLOUD
                              </span>
                            ) : (
                              <>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 font-mono text-[9px] font-black bg-[#FFE600] text-black border border-black">
                                  <HardDrive size={9} /> LOCAL
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingId(v.id); setEditLabel(v.label); }}
                                  className="p-0.5 text-black hover:text-[#FF00FF]"
                                >
                                  <Pencil size={11} className="stroke-[2.5]" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                        <p className="font-mono text-xs text-gray-700 mt-1 font-medium line-clamp-1">{v.idea}</p>
                        <div className="flex items-center gap-2 mt-2 font-mono text-[10px] font-bold text-gray-600">
                          <span>{formatDate(v.timestamp)}</span>
                          <span>•</span>
                          <span className="uppercase text-black font-black">{v.result?.architecture?.type || 'SYSTEM SPEC'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-center">
                        <button
                          onClick={() => {
                            if (!compareA || isA) {
                              setCompareA(isA ? null : v.id);
                            } else if (!compareB || isB) {
                              setCompareB(isB ? null : v.id);
                            }
                          }}
                          className={`w-8 h-8 border-2 border-black flex items-center justify-center font-mono font-black text-xs transition-all ${
                            isA
                              ? 'bg-[#FF00FF] text-white shadow-[2px_2px_0px_0px_#000000]'
                              : isB
                              ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_0px_#000000]'
                              : 'bg-white text-black hover:bg-[#FFE600]'
                          }`}
                          title="Select for Diff"
                        >
                          {isA ? 'A' : isB ? 'B' : <GitCompare size={13} className="stroke-[2.5]" />}
                        </button>
                        
                        <button
                          onClick={() => handleOpenVersion(v)}
                          className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#00FF00] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                          title="Open Architecture"
                        >
                          <ChevronRight size={16} className="stroke-[3]" />
                        </button>

                        <button
                          onClick={() => handleDelete(v.id, v.source)}
                          className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FF5500] hover:text-white transition-all"
                          title="Delete Architecture"
                        >
                          <Trash2 size={13} className="stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VersionHistory;
