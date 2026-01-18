import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineClock,
} from "react-icons/hi2";
import { Badge, Checkbox } from "../ui";
import { formatDate, formatNumber, truncateText } from "../../utils/helpers";
import blogService from "../../services/blog.service";

const BlogCard = ({
  blog,
  selected = false,
  onSelect,
  onDelete,
  index = 0,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const thumbnailUrl = blog.thumbnail?.path
    ? blogService.getImageUrl(blog.thumbnail.path)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`
        group relative bg-white/5 backdrop-blur-sm border rounded-2xl overflow-hidden
        transition-all duration-300 hover:bg-white/10
        ${
          selected
            ? "border-violet-500 ring-2 ring-violet-500/20"
            : "border-white/10 hover:border-white/20"
        }
      `}
    >
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <Checkbox checked={selected} onChange={() => onSelect(blog._id)} />
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-900">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={blog.title}
            onLoad={() => setImageLoaded(true)}
            className={`
              w-full h-full object-cover transition-all duration-500
              group-hover:scale-105
              ${imageLoaded ? "opacity-100" : "opacity-0"}
            `}
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/blogs/${blog._id}`}
            className="p-3 bg-white/20 hover:bg-violet-500 rounded-xl text-white transition-colors backdrop-blur-sm"
            title="Edit blog"
          >
            <HiOutlinePencil className="w-5 h-5" />
          </Link>
          <button
            onClick={() => onDelete(blog._id)}
            className="p-3 bg-white/20 hover:bg-red-500 rounded-xl text-white transition-colors backdrop-blur-sm"
            title="Delete blog"
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        </div>

        {/* Reading time badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" size="sm">
            <HiOutlineClock className="w-3.5 h-3.5 mr-1" />
            {blog.readingTime} min
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
          {blog.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2">
          {truncateText(blog.description, 80)}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {/* Views */}
            <span className="flex items-center gap-1">
              <HiOutlineEye className="w-4 h-4" />
              {formatNumber(blog.viewsCount || 0)}
            </span>
          </div>

          {/* Date */}
          <span className="text-xs text-gray-500">
            {formatDate(blog.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
