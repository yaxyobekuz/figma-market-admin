import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineLink,
  HiOutlineCursorArrowRays,
} from 'react-icons/hi2';
import { Badge, Checkbox } from '../ui';
import { formatDate, formatNumber, truncateText } from '../../utils/helpers';
import designService from '../../services/design.service';

const DesignCard = ({
  design,
  selected = false,
  onSelect,
  onDelete,
  index = 0,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const thumbnailUrl = design.thumbnail?.path
    ? designService.getImageUrl(design.thumbnail.path)
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
        ${selected ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-white/10 hover:border-white/20'}
      `}
    >
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <Checkbox
          checked={selected}
          onChange={() => onSelect(design._id)}
        />
      </div>

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" />
        )}
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt={design.title}
            onLoad={() => setImageLoaded(true)}
            className={`
              w-full h-full object-cover transition-all duration-500
              group-hover:scale-105
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/designs/${design._id}`}
            className="p-3 bg-white/20 hover:bg-violet-500 rounded-xl text-white transition-colors backdrop-blur-sm"
            title="Edit design"
          >
            <HiOutlinePencil className="w-5 h-5" />
          </Link>
          <button
            onClick={() => onDelete(design._id)}
            className="p-3 bg-white/20 hover:bg-red-500 rounded-xl text-white transition-colors backdrop-blur-sm"
            title="Delete design"
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
          {design.url && (
            <a
              href={design.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/20 hover:bg-blue-500 rounded-xl text-white transition-colors backdrop-blur-sm"
              title="Open Figma link"
            >
              <HiOutlineLink className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="primary" size="sm">
            {design.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
          {design.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2">
          {truncateText(design.description, 80)}
        </p>

        {/* Tags */}
        {design.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {design.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default" size="sm">
                {tag}
              </Badge>
            ))}
            {design.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{design.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <HiOutlineEye className="w-4 h-4" />
              {formatNumber(design.viewsCount || 0)}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineCursorArrowRays className="w-4 h-4" />
              {formatNumber(design.urlClicksCount || 0)}
            </span>
          </div>
          <span>{formatDate(design.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DesignCard;
