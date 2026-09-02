import Header from '../components/Header.jsx'
import Hero from '../components/Hero.jsx'

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: 'Upload Your Space',
    desc: 'Share photos of your existing room. Swastik uses your actual space as the canvas for transformation.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'Add Inspiration',
    desc: 'Upload Pinterest saves, magazine clippings or any reference images that capture the look you want.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI Generates Concepts',
    desc: 'Swastik analyzes your space, references and requirements to create 3–4 personalized design concepts.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: 'Refine Until Perfect',
    desc: 'Select a concept and iterate — change the sofa, update wall colors, adjust lighting — until it matches your vision.',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Upload Your Room', desc: 'Photo of your existing space' },
  { step: '02', title: 'Add References', desc: 'Inspiration images you love' },
  { step: '03', title: 'Share Requirements', desc: 'Budget, style, materials' },
  { step: '04', title: 'AI Analysis', desc: 'Design brief is generated' },
  { step: '05', title: 'Visualization', desc: '3–4 AI concepts created' },
  { step: '06', title: 'Refine', desc: 'Iterate to perfection' },
]

export default function Home({ onStart }) {
  return (
    <div className="bg-stone-50">
      <Header onHome={() => {}} />

      {/* Hero section */}
      <Hero onStart={onStart} />

      {/* Features section */}
      <section className="py-24 px-6 lg:px-12 bg-white border-t border-stone-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-stone-200" />
              <span className="text-xs tracking-[0.25em] uppercase text-stone-400 font-medium">How Swastik Works</span>
              <div className="h-px w-12 bg-stone-200" />
            </div>
            <h2 className="font-display text-4xl font-medium text-stone-900 mb-4">
              From concept to<br />
              <span className="italic font-normal">visualization</span> in minutes
            </h2>
            <p className="text-stone-500 text-base max-w-lg mx-auto leading-relaxed">
              Swastik combines your actual space with AI-powered design intelligence
              to create personalized architectural concepts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="space-y-4">
                <div className="w-10 h-10 border border-stone-200 flex items-center justify-center text-stone-500">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — numbered flow */}
      <section className="py-24 px-6 lg:px-12 bg-stone-50 border-t border-stone-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-medium text-stone-900">
              The Design Process
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                {/* Connector line */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-stone-200" />
                )}
                <div className="w-10 h-10 bg-stone-900 text-stone-50 flex items-center justify-center text-xs font-semibold tracking-widest mb-3 relative z-10">
                  {item.step}
                </div>
                <p className="text-xs font-semibold text-stone-800 mb-1">{item.title}</p>
                <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 px-6 lg:px-12 bg-stone-900 border-t border-stone-800">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="w-10 h-10 bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto">
            <span className="text-stone-200 text-base font-serif">S</span>
          </div>
          <h2 className="font-display text-4xl font-medium text-white leading-tight">
            Ready to transform<br />
            <span className="italic font-normal text-stone-400">your space?</span>
          </h2>
          <p className="text-stone-400 leading-relaxed">
            Upload your room and references to get started. No account required.
          </p>
          <button onClick={onStart} className="btn-primary bg-white text-stone-900 hover:bg-stone-100 px-10 py-4">
            Start Designing
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 py-8 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-stone-700 flex items-center justify-center">
              <span className="text-stone-300 text-xs font-serif">S</span>
            </div>
            <span className="text-stone-500 text-xs tracking-[0.15em] uppercase">Swastik</span>
          </div>
          <p className="text-stone-600 text-xs text-center">
            AI Interior &amp; Architectural Visualizer — Demo Prototype
          </p>
        </div>
      </footer>
    </div>
  )
}
