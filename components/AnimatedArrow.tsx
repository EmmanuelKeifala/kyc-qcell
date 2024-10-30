import { motion } from "framer-motion";
import Image from "next/image";

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, repeat: Infinity, repeatType: "mirror" },
  },
};

const AnimatedArrow = () => {
  return (
    <motion.div
      className="flex items-center justify-center"
      variants={itemVariants as any}
    >
      <Image
        src="/arrow-right.svg"
        width={10}
        height={10}
        alt="arrow right image"
        className="h-8 w-8 text-[#F78F1E]"
      />
    </motion.div>
  );
};

export default AnimatedArrow;
