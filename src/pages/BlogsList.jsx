import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import {
  Button,
  Card,
  Spinner,
  EmptyState,
  SearchInput,
  Select,
  ConfirmDialog,
  Checkbox,
} from "../components/ui";
import { BlogCard } from "../components/blog";
import { useBlogs, useDebounce } from "../hooks";
import toast from "react-hot-toast";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "popular", label: "Most Popular" },
];

const BlogsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get("q") || "",
    sortBy: searchParams.get("sortBy") || "newest",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const { blogs, loading, pagination, fetchBlogs, deleteBlog, bulkDelete } =
    useBlogs();

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch blogs when filters change
  useEffect(() => {
    const params = {
      page: filters.page,
      limit: 12,
      sortBy: filters.sortBy,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    fetchBlogs(params);

    // Update URL params
    const newParams = new URLSearchParams();
    if (debouncedSearch) newParams.set("q", debouncedSearch);
    if (filters.sortBy !== "newest") newParams.set("sortBy", filters.sortBy);
    if (filters.page > 1) newParams.set("page", filters.page.toString());
    setSearchParams(newParams);
  }, [debouncedSearch, filters.sortBy, filters.page]);

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
    if (selectedIds.length === blogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(blogs.map((b) => b._id));
    }
  };

  // Handle single delete
  const handleDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      await deleteBlog(deleteConfirm.id);
      toast.success("Blog deleted successfully");
      setSelectedIds((prev) => prev.filter((id) => id !== deleteConfirm.id));
    } catch (error) {
      toast.error("Failed to delete blog");
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      const result = await bulkDelete(selectedIds);
      toast.success(`Deleted ${result.successful} of ${result.total} blogs`);
      setSelectedIds([]);
    } catch (error) {
      toast.error("Failed to delete blogs");
    } finally {
      setBulkDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-400">
            {pagination.totalCount} blog{pagination.totalCount !== 1 ? "s" : ""}{" "}
            total
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              fetchBlogs({
                page: filters.page,
                limit: 12,
                sortBy: filters.sortBy,
              })
            }
            disabled={loading}
          >
            <HiOutlineArrowPath
              className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
          <Link to="/blogs/new">
            <Button variant="primary">
              <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
              Add Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search blogs..."
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              options={sortOptions}
            />
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
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedIds.length === blogs.length}
                    indeterminate={
                      selectedIds.length > 0 &&
                      selectedIds.length < blogs.length
                    }
                    onChange={handleSelectAll}
                    label={`${selectedIds.length} selected`}
                  />
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setBulkDeleteConfirm(true)}
                >
                  <HiOutlineTrash className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog list */}
      {loading && blogs.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No blogs found"
          description={
            filters.search
              ? `No results for "${filters.search}"`
              : "Get started by creating your first blog post"
          }
          action={
            !filters.search && (
              <Link to="/blogs/new">
                <Button variant="primary">
                  <HiOutlinePlusCircle className="w-5 h-5 mr-2" />
                  Add Blog
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                index={index}
                selected={selectedIds.includes(blog._id)}
                onSelect={handleSelect}
                onDelete={(id) => setDeleteConfirm({ open: true, id })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="ghost"
            size="sm"
            disabled={!pagination.hasPrevPage}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                const current = pagination.currentPage;
                return (
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - current) <= 1
                );
              })
              .map((page, idx, arr) => (
                <span key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-2 text-gray-500">...</span>
                  )}
                  <Button
                    variant={
                      page === pagination.currentPage ? "primary" : "ghost"
                    }
                    size="sm"
                    onClick={() => setFilters((prev) => ({ ...prev, page }))}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                </span>
              ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() =>
              setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Blog"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Bulk delete confirmation */}
      <ConfirmDialog
        isOpen={bulkDeleteConfirm}
        onClose={() => setBulkDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Blogs"
        message={`Are you sure you want to delete ${selectedIds.length} blog${
          selectedIds.length !== 1 ? "s" : ""
        }? This action cannot be undone.`}
        confirmText="Delete All"
        variant="danger"
      />
    </div>
  );
};

export default BlogsList;
