import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface StepCardProps {
  title: string;
  description: string;
}

const StepCard = ({ title, description }: StepCardProps) => {
  return (
    <motion.div
      className="bg-white border rounded-lg shadow-md p-6 w-64 h-48 flex flex-col items-center justify-between"
      variants={itemVariants}
    >
      <h3 className="text-xl font-semibold mb-2 text-center text-[#F78F1E]">
        {title}
      </h3>
      <p className="text-gray-600 text-center flex-grow">{description}</p>
    </motion.div>
  );
};

export default StepCard;
