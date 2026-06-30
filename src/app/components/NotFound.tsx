import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'

const BG_IMAGE = 'https://images.unsplash.com/photo-1770375142184-4655d2bd2d4e?w=1920&h=1080&fit=crop&auto=format'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={BG_IMAGE}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
        <div className="text-[10rem] sm:text-[12rem] font-['Barlow_Condensed'] font-900 leading-none text-primary/20 select-none">
          404
        </div>

        <div className="-mt-8 sm:-mt-12 space-y-4">
          <h1 className="font-['Barlow_Condensed'] text-3xl sm:text-4xl font-900 uppercase text-foreground">
            Página no encontrada
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
            Esta ruta no existe o fue movida. Mejor volvé a la tienda antes de que te pierdas del todo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="border border-border text-foreground px-6 py-3 font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              VOLVER
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-6 py-3 font-['Barlow_Condensed'] text-sm font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Home size={16} />
              IR A LA TIENDA
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
