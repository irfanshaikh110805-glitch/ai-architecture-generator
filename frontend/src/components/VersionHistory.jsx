import { useState, useEffect } from 'react';
import { X, Clock, Trash2, GitCompare, Pencil, Check, ChevronRight, Cloud, HardDrive } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import { dbHelpers } from '../lib/supabase';
import toast from 'react-hot-toast';

function VersionHistory({ onClose, onLoad, onCompare }) {
  const { versions: localVersions, deleteVersion, renameVersion } = useAppStore();
  const { user, isAuthenticated } = useAuthStore();
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);
  const [supabaseVersions, setSupabaseVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allVersions, setAllVersions] = useState([]);

  // Fetch Supabase architectures on mount
  useEffect(() => {
    const fetchSupabaseArchitectures = async () => {
      if (!isAuthenticated || !user) {
        setAllVersions(localVersions);
        return;
      }

      setLoading(true);
      try {
        const architectures = await dbHelpers.getArchitectures(user.id);
        
        // Transform Supabase architectures to match version format
        const transformed = architectures.map(arch => ({
          id: `supabase-${arch.id}`,
          supabaseId: arch.id,
          idea: arch.idea,
          timestamp: arch.created_at,
          label: `Architecture #${arch.id}`,
          source: 'supabase',
          result: {
            architecture: {
              type: arch.architecture_type,
              tech_stack: {
                frontend: arch.tech_stack_frontend,
                backend: arch.tech_stack_backend,
                database: arch.tech_stack_database,
              },
            },
            features: arch.features?.map(f => ({
              name: f.name,
              priority: f.priority,
              description: f.description,
            })) || [],
            database: {
              tables: arch.database_tables?.map(t => ({
                name: t.table_name,
                fields: t.fields,
                relationships: t.relationships,
              })) || [],
            },
            apis: arch.apis?.map(a => ({
              method: a.method,
              endpoint: a.endpoint,
              description: a.description,
            })) || [],
            components: arch.components?.map(c => ({
              name: c.component_name,
              description: c.description,
            })) || [],
            roadmap: {
              phases: arch.roadmap_phases?.map(p => ({
                name: p.phase_name,
                tasks: p.tasks,
              })) || [],
            },
            diagrams: {
              er_diagram: arch.er_diagram,
              architecture_diagram: arch.architecture_diagram,
            },
            estimation: {
              hours: arch.estimation_hours,
              team_size: arch.estimation_team_size,
              cost: arch.estimation_cost,
            },
          },
        }));

        setSupabaseVersions(transformed);
        
        // Merge with localStorage versions (localStorage first, then Supabase)
        const merged = [...localVersions, ...transformed];
        setAllVersions(merged);
      } catch (error) {
        console.error('Error fetching Supabase architectures:', error);
        toast.error('Failed to load cloud history');
        setAllVersions(localVersions);
      } finally {
        setLoading(false);
      }
    };

    fetchSupabaseArchitectures();
  }, [user, isAuthenticated, localVersions]);

  const handleDelete = async (id, source) => {
    if (source === 'supabase') {
      try {
        const supabaseId = parseInt(id.replace('supabase-', ''));
        await dbHelpers.deleteArchitecture(supabaseId);
        setSupabaseVersions(prev => prev.filter(v => v.id !== id));
        setAllVersions(prev => prev.filter(v => v.id !== id));
        toast.success('Version deleted from cloud');
      } catch (error) {
        console.error('Error deleting from Supabase:', error);
        toast.error('Failed to delete from cloud');
      }
    } else {
      deleteVersion(id);
      setAllVersions(prev => prev.filter(v => v.id !== id));
      toast.success('Version deleted successfully');
    }
  };

  const handleRename = (id) => {
    if (!editLabel.trim()) return setEditingId(null);
    renameVersion(id, editLabel);
    setEditingId(null);
    toast.success('Version renamed');
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCompareClick = () => {
    if (compareA && compareB) {
      const a = allVersions.find(v => v.id === compareA);
      const b = allVersions.find(v => v.id === compareB);
      if (a && b) {
        onCompare(a, b);
        onClose();
      }
    } else {
      toast.error('Select 2 versions to compare');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-premium-lg w-full max-w-xl max-h-[85vh] flex flex-col border border-white/20 scale-in overflow-hidden relativeSt">
        {/* Header */}
        <div className="flex items-center justify-between p-7 border-b border-surface-100 relative">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
              <Clock size={22} className="opacity-80" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 leading-none">Version History</h2>
              <p className="text-sm text-gray-400 mt-1.5 font-medium">
                {allVersions.length} architectures saved
                {isAuthenticated && supabaseVersions.length > 0 && (
                  <span className="ml-2 text-blue-500">
                    ({supabaseVersions.length} in cloud)
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {compareA && compareB && (
              <button
                onClick={handleCompareClick}
                className="btn-primary flex items-center gap-2 py-2 px-4 text-xs font-bold uppercase tracking-wider"
              >
                <GitCompare size={14} /> Compare
              </button>
            )}
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center hover:bg-surface-100 text-gray-400 hover:text-gray-600 rounded-xl transition-all border border-transparent hover:border-surface-200 active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading history...</p>
          </div>
        ) : allVersions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400/50">
             <div className="w-20 h-20 bg-surface-50 rounded-full flex items-center justify-center mb-4 border border-surface-100 shadow-inner">
               <Clock size={32} />
             </div>
             <p className="font-semibold text-gray-400">No projects saved yet</p>
             <p className="text-xs mt-1">Generated architectures appear here automatically</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-50/50 border-b border-blue-100/50 px-7 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-600">
                Tip: Select up to 2 versions and tap Compare
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 stagger scrollbar-thin">
              {allVersions.map((v) => {
                const isA = compareA === v.id;
                const isB = compareB === v.id;
                const isSelected = isA || isB;
                const isSupabase = v.source === 'supabase';
                return (
                  <div
                    key={v.id}
                    className={`group relative rounded-2xl border-2 p-5 transition-all duration-300 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md transform -translate-y-0.5'
                        : 'border-surface-100 bg-white hover:border-brand-200 hover:bg-brand-50/20 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {editingId === v.id && !isSupabase ? (
                          <div className="flex gap-2">
                            <input
                              className="flex-1 px-3 py-1.5 text-sm bg-white border-2 border-brand-400 rounded-xl focus:outline-none shadow-inner"
                              value={editLabel}
                              onChange={e => setEditLabel(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleRename(v.id)}
                              autoFocus
                            />
                            <button
                              onClick={() => handleRename(v.id)}
                              className="w-8 h-8 flex items-center justify-center bg-brand-600 text-white rounded-lg shadow-sm hover:bg-brand-700 transition"
                            >
                              <Check size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{v.label}</h3>
                            {isSupabase ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-600 rounded-full">
                                <Cloud size={10} /> CLOUD
                              </span>
                            ) : (
                              <>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 rounded-full">
                                  <HardDrive size={10} /> LOCAL
                                </span>
                                <button
                                  onClick={() => { setEditingId(v.id); setEditLabel(v.label); }}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-brand-500 rounded-md transition-all scale-90 hover:scale-100"
                                >
                                  <Pencil size={12} />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2 font-medium line-clamp-1">{v.idea}</p>
                        <div className="flex items-center gap-3 mt-3">
                           <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{formatDate(v.timestamp)}</span>
                           <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                           <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{v.result.architecture?.type}</span>
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
                          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-xs transition-all duration-200 shadow-sm ${
                            isSelected
                              ? 'bg-brand-600 text-white shadow-brand-400/30 rotate-0'
                              : 'bg-white border border-surface-200 text-gray-400 hover:border-brand-300 hover:text-brand-600'
                          }`}
                        >
                          {isA ? 'A' : isB ? 'B' : <GitCompare size={14} />}
                        </button>
                        
                        <button
                          onClick={() => onLoad(v)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-surface-200 text-brand-600 hover:border-brand-400 hover:bg-brand-50 transition-all shadow-sm active:scale-90"
                          title="Open Version"
                        >
                          <ChevronRight size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(v.id, v.source)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Version"
                        >
                          <Trash2 size={13} />
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
