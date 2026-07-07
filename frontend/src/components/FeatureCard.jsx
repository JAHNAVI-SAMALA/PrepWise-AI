import { motion } from "framer-motion";

function FeatureCard({ icon, title, description }) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                {icon}
            </div>

            <h3 className="text-2xl font-bold text-gray-900">
                {title}
            </h3>

            <p className="text-gray-600 mt-4 leading-7">
                {description}
            </p>
        </motion.div>
    );
}

export default FeatureCard;