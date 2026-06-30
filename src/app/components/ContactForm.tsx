import { useState, type FormEvent } from 'react'
import { Send, Check, Loader2 } from 'lucide-react'
import { waLink } from '../../lib/whatsapp'

type FormState = 'idle' | 'sending' | 'sent'

export function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setFormState('sending')

    const body = [
      '📩 *Nuevo mensaje desde la web*',
      '',
      `*Nombre:* ${name.trim()}`,
      email.trim() ? `*Email:* ${email.trim()}` : '',
      '',
      `*Mensaje:*`,
      message.trim(),
    ]
      .filter(Boolean)
      .join('\n')

    window.open(waLink(body), '_blank')

    setName('')
    setEmail('')
    setMessage('')
    setFormState('sent')

    setTimeout(() => setFormState('idle'), 3000)
  }

  return (
    <section id="contacto" className="py-16 md:py-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="text-xs font-['Barlow_Condensed'] tracking-widest text-primary uppercase mb-2">
              — CONTACTO
            </div>
            <h2 className="font-['Barlow_Condensed'] text-4xl md:text-5xl font-900 uppercase leading-none text-foreground">
              ESCRIBINOS
            </h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-xs mx-auto">
              ¿Consultas, pedidos personalizados o lo que sea? Mandanos un mensaje.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-1.5">
                Nombre <span className="text-primary">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Tu nombre"
                className="w-full bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-['Barlow_Condensed'] tracking-widest uppercase text-muted-foreground mb-1.5">
                Mensaje <span className="text-primary">*</span>
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Contanos qué necesitás..."
                className="w-full bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={formState !== 'idle'}
              className="w-full bg-primary text-white px-6 py-3 font-['Barlow_Condensed'] text-base font-700 tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {formState === 'sent' ? (
                <>
                  <Check size={16} />
                  ENVIADO
                </>
              ) : formState === 'sending' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  ENVIANDO...
                </>
              ) : (
                <>
                  <Send size={16} />
                  ENVIAR POR WHATSAPP
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
