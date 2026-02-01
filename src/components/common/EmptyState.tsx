import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-ocean-50 flex items-center justify-center mx-auto mb-5">
        <svg className="w-8 h-8 text-ocean-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h3 className="font-heading font-bold text-xl text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">{description}</p>
    </motion.div>
  );
}

export default EmptyState;
