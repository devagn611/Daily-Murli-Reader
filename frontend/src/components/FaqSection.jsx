import { site } from '../content/site';

export default function FaqSection() {
  return (
    <section
      className="mt-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-colors duration-300"
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
