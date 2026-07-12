import Title from './Title';
import { plansData } from '../assets/dummy-data';
import { CheckIcon } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import { motion } from 'framer-motion';

export default function Pricing() {
    return (
        <section id="pricing" className="py-20 bg-white/3 border-t border-white/6">
            <div className="max-w-6xl mx-auto px-4">
                <Title
                    title="Pricing"
                    heading="Pricing Plans"
                    description="Simple, transparent pricing. Choose the plan that suits your needs."
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plansData.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            className={`rounded-2xl p-6 border flex flex-col ${plan.popular ? 'bg-violet-900/20 border-violet-500/40' : 'bg-white/3 border-white/6'}`}
                        >
                            {plan.popular && (
                                <span className="text-xs text-violet-300 font-semibold bg-violet-500/20 rounded-full px-3 py-1 w-fit mb-4">Most Popular</span>
                            )}
                            <h3 className="text-xl font-semibold">{plan.name}</h3>
                            <p className="text-gray-400 text-sm mt-1 mb-4">{plan.desc}</p>
                            <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm text-gray-400 font-normal">/mo</span></p>
                            <ul className="space-y-2 mb-8 flex-1">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                                        <CheckIcon size={14} className="text-violet-400 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            {plan.popular
                                ? <PrimaryButton className="w-full py-2.5 rounded-xl">Get Started</PrimaryButton>
                                : <GhostButton className="w-full justify-center py-2.5 rounded-xl">Choose Plan</GhostButton>
                            }
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}