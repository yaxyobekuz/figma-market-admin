import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineFunnel,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineArrowPath,
} from 'react-icons/hi2';
import {
  Button,
  Card,
  Spinner,
  EmptyState,
  SearchInput,
  Select,
  ConfirmDialog,
  Checkbox,
  Badge,
} from '../components/ui';
import { DesignCard } from '../components/design';
import { useDesigns, useDebounce } from '../hooks';
import categories from '../data/data/categories.data';
import toast from 'react-hot-toast';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'title', label: 'Title (A-Z)' },
];

const DesignsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const {
    designs,
    loading,
    pagination,
    fetchDesigns,
    deleteDesign,
    bulkDelete,
  } = useDesigns();

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch designs when filters change
  useEffect(() => {
    const params = {
      page: filters.page,
      limit: 12,
      sortBy: filters.sortBy,
    };

    if (debouncedSearch) {
      params.q = debouncedSearch;
    }

    if (filters.category && filters.category !== 'all') {
      params.category = filters.category;
    }

    fetchDesigns(params);

    // Update URL params
    const newParams = new URLSearchParams();
    if (debouncedSearch) newParams.set('q', debouncedSearch);
    if (filters.category) newParams.set('category', filters.category);
    if (filters.sortBy !== 'newest') newParams.set('sortBy', filters.sortBy);
    if (filters.page > 1) newParams.set('page', filters.page.toString());
    setSearchParams(newParams);
  }, [debouncedSearch, filters.category, filters.sortBy, filters.page]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    setSelectedIds([]);
  };

  // Handle selection
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Select all
  const handleSelectAll = () => {
    if (selectedIds.length === designs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(designs.map((d) => d._id));
    }
  };

  // Handle single delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      await deleteDesign(deleteConfirm.id);
      toast.success('Design deleted successfully');
      setSelectedIds((prev) => prev.filter((id) => id !== deleteConfirm.id));
    } catch (error) {
      toast.error('Failed to delete design');
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const result = await bulkDelete(selectedIds);
      toast.success(`Deleted ${result.successful} of ${result.total} designs`);
      setSelectedIds([]);
    } catch (error) {
      toast.error('Failed to delete designs');
    } finally {
      setBulkDeleteConfirm(false);
    }
  };

  // Category options
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories
      .filter((_, i) => i !== 0)
      .map((cat) => ({ value: cat.slug, label: cat.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Designs</h1>
          <p className="text-gray-400">
            {pagination.totalCount} designs found
          </p>
        </div>
        <Link to="/designs/new">
          <Button variant="primary" icon={HiOutlinePlusCircle}>
            Add New Design
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card padding="md">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <SearchInput
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onClear={() => handleFilterChange('search', '')}
              placeholder="Search designs..."
            />
          </div>

          {/* Category filter */}
          <div className="w-full lg:w-48">
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              options={categoryOptions}
            />
          </div>

          {/* Sort */}
          <div className="w-full lg:w-48">
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={sortOptions}
            />
          </div>

          {/* View mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-colors ${
                viewMode === 'grid'
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <HiOutlineSquares2X2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-colors ${
                viewMode === 'list'
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <HiOutlineListBullet className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Bulk actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card padding="sm" className="bg-violet-500/10 border-violet-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedIds.length === designs.length}
                    indeterminate={
                      selectedIds.length > 0 && selectedIds.length < designs.length
                    }
                    onChange={handleSelectAll}
                  />
                  <span className="text-white">
                    {selectedIds.length} selected
                  </span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  icon={HiOutlineTrash}
                  onClick={() => setBulkDeleteConfirm(true)}
                >
                  Delete Selected
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : designs.length === 0 ? (
        <EmptyState
          icon={HiOutlineSquares2X2}
          title="No designs found"
          description={
            filters.search
              ? `No designs match "${filters.search}"`
              : 'Start by adding your first design'
          }
          action={
            <Link to="/designs/new">
              <Button variant="primary" icon={HiOutlinePlusCircle}>
                Add Design
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Grid view */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {designs.map((design, index) => (
                  <DesignCard
                    key={design._id}
                    design={design}
                    index={index}
                    selected={selectedIds.includes(design._id)}
                    onSelect={handleSelect}
                    onDelete={(id) => setDeleteConfirm({ open: true, id })}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <Card padding="none">
              <div className="divide-y divide-white/5">
                {designs.map((design, index) => (
                  <motion.div
                    key={design._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      flex items-center gap-4 p-4 hover:bg-white/5 transition-colors
                      ${selectedIds.includes(design._id) ? 'bg-violet-500/10' : ''}
                    `}
                  >
                    <Checkbox
                      checked={selectedIds.includes(design._id)}
                      onChange={() => handleSelect(design._id)}
                    />
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      {design.thumbnail?.path && (
                        <img
                          src={`http://localhost:8080${design.thumbnail.path}`}
                          alt={design.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">
                        {design.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="primary" size="sm">
                          {design.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {design.viewsCount || 0} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/designs/${design._id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteConfirm({ open: true, id: design._id })
                        }
                      >
                        <HiOutlineTrash className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                disabled={filters.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (filters.page <= 3) {
                    pageNum = i + 1;
                  } else if (filters.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = filters.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page: pageNum }))
                      }
                      className={`w-10 h-10 rounded-xl transition-colors ${
                        filters.page === pageNum
                          ? 'bg-violet-500 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                disabled={filters.page >= pagination.totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Design"
        message="Are you sure you want to delete this design? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />

      {/* Bulk delete confirmation */}
      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Designs"
        message={`Are you sure you want to delete ${selectedIds.length} designs? This action cannot be undone.`}
        confirmText={`Delete ${selectedIds.length} Designs`}
        variant="danger"
        loading={loading}
      />
    </div>
  );
};

export default DesignsList;
