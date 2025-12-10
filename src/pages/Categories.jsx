import { motion } from 'framer-motion';
import { Card, Badge } from '../components/ui';
import categories from '../data/data/categories.data';

const Categories = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-gray-400">View available design categories</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories
          .filter((_, index) => index !== 0)
          .map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="cursor-default">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                  <Badge variant="primary">{category.slug}</Badge>
                </div>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Categories;
