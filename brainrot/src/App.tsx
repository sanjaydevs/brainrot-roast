import Header from '../pages/header'
import Hero from './components/Hero'
import Upload from './components/Upload'

import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="mx-auto flex min-h-[80vh] w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 py-12 md:flex-row md:gap-16">

        {/* Left: Hero text */}
        <section className="w-full md:w-1/2">
          <Hero />
        </section>

        {/* Right: Upload area */}
        <section className="w-full max-w-md md:w-1/2">
          <Upload />
        </section>

      </main>
    </div>
  )
}

export default App