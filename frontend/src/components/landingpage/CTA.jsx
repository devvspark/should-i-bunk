export default function CTA() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Card */}
        <div className="mx-auto max-w-4xl rounded-3xl bg-teal-600 px-6 sm:px-8 py-12 md:py-16 text-center shadow-lg overflow-hidden">
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Ready to take control of <br className="hidden sm:block" />
            your academic life?
          </h2>

          {/* Sub text */}
          <p className="mt-4 text-teal-100 max-w-2xl mx-auto">
            Join thousands of students who are making smarter choices with their time.
            Free to use, forever.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-gray-100 transition">
              Get Started Now
            </button>

            <button className="px-8 py-3 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition">
              Talk to Support
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
