import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineSquares2X2,
  HiOutlineEye,
  HiOutlineCursorArrowRays,
  HiOutlinePlusCircle,
  HiOutlineArrowTrendingUp,
  HiOutlineTag,
} from 'react-icons/hi2';
import { Card, Button, Spinner, Badge } from '../components/ui';
import designService from '../services/design.service';
import { formatNumber } from '../utils/helpers';

const StatCard = ({ icon: Icon, label, value, trend, color }) => (
  <Card className="relative overflow-hidden">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-sm text-emerald-400">
            <HiOutlineArrowTrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {/* Decorative gradient */}
    <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full ${color} opacity-20 blur-2xl`} />
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentDesigns, setRecentDesigns] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch data in parallel
      const [designsRes, categoryRes] = await Promise.all([
        designService.getDesigns({ limit: 5, sortBy: 'newest' }),
        designService.getCategoryStats(),
      ]);

      setRecentDesigns(designsRes.designs || []);
      setCategoryStats(categoryRes.stats || []);

      // Calculate stats
      const totalViews = (designsRes.designs || []).reduce(
        (acc, d) => acc + (d.viewsCount || 0),
        0
      );
      const totalClicks = (designsRes.designs || []).reduce(
        (acc, d) => acc + (d.urlClicksCount || 0),
        0
      );

      setStats({
        totalDesigns: designsRes.pagination?.totalCount || 0,
        totalViews,
        totalClicks,
        categories: categoryRes.stats?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HiOutlineSquares2X2}
          label="Total Designs"
          value={formatNumber(stats?.totalDesigns || 0)}
          color="bg-violet-500"
        />
        <StatCard
          icon={HiOutlineEye}
          label="Total Views"
          value={formatNumber(stats?.totalViews || 0)}
          color="bg-blue-500"
        />
        <StatCard
          icon={HiOutlineCursorArrowRays}
          label="Total Clicks"
          value={formatNumber(stats?.totalClicks || 0)}
          color="bg-emerald-500"
        />
        <StatCard
          icon={HiOutlineTag}
          label="Categories"
          value={stats?.categories || 0}
          color="bg-amber-500"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent designs */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Designs</h2>
            <Link to="/designs">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentDesigns.length > 0 ? (
              recentDesigns.map((design, index) => (
                <motion.div
                  key={design._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    {design.thumbnail?.path && (
                      <img
                        src={designService.getImageUrl(design.thumbnail.path)}
                        alt={design.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {design.title}
                    </h3>
                    <p className="text-xs text-gray-500">{design.category}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <HiOutlineEye className="w-4 h-4" />
                      {formatNumber(design.viewsCount || 0)}
                    </span>
                    <Link to={`/designs/${design._id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No designs yet
              </div>
            )}
          </div>
        </Card>

        {/* Category stats */}
        <Card padding="none">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Categories</h2>
          </div>
          <div className="p-4 space-y-3">
            {categoryStats.length > 0 ? (
              categoryStats.map((cat, index) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500" />
                    <span className="text-sm text-white capitalize">
                      {cat._id?.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <Badge variant="primary">{cat.count}</Badge>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No categories
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <p className="text-sm text-gray-400">
              Get started with common tasks
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/designs/new">
              <Button variant="primary" icon={HiOutlinePlusCircle}>
                Add New Design
              </Button>
            </Link>
            <Link to="/designs">
              <Button variant="secondary" icon={HiOutlineSquares2X2}>
                Manage Designs
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
