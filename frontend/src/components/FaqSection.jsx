import { site } from '../content/site';

export default function FaqSection() {
  return (
    <section
      className="mt-8 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-sm shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-[20px] border border-black/[0.05] dark:border-white/[0.08] overflow-hidden transition-colors duration-300"
      aria-labelledby="faq-heading"
    >
      <div className="p-4 sm:p-6">
        <h2
          id="faq-heading"
          className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Frequently asked questions
        </h2>
        <dl className="space-y-6">
          {site.faq.map((item) => (
            <div key={item.question}>
              <dt className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.question}
              </dt>
              <dd className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
