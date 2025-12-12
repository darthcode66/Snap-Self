import { Camera, Sparkles, Upload, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
          <Sparkles className="h-4 w-4" />
          Sistema Inteligente para Fotógrafos
        </div>

        <h1 className="mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Organize, Entregue e Receba com{' '}
          <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Inteligência Artificial
          </span>
        </h1>

        <p className="mb-12 max-w-2xl text-lg text-gray-600 md:text-xl">
          Plataforma all-in-one que economiza 10-15 horas por semana do seu
          tempo. Analise fotos automaticamente, crie galerias profissionais e
          receba pagamentos em segundos.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button className="rounded-lg bg-primary-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-primary-700">
            Começar Gratuitamente
          </button>
          <button className="rounded-lg border border-gray-300 px-8 py-4 font-semibold transition-colors hover:bg-gray-50">
            Ver Demo
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          14 dias grátis • Sem cartão de crédito • Cancele quando quiser
        </p>
      </section>

      {/* Features Section */}
      <section className="border-t bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Tudo que você precisa em um só lugar
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Upload className="h-8 w-8 text-primary-600" />}
              title="Upload Inteligente"
              description="Envie milhares de fotos e deixe a IA organizar automaticamente"
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8 text-primary-600" />}
              title="Análise com IA"
              description="Qualidade, categorização e tags geradas automaticamente"
            />
            <FeatureCard
              icon={<Camera className="h-8 w-8 text-primary-600" />}
              title="Galerias Profissionais"
              description="Crie galerias elegantes para seus clientes em minutos"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary-600" />}
              title="Pagamentos Rápidos"
              description="PIX, cartão e boleto. Receba seu dinheiro sem burocracia"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 Snap-Self. Todos os direitos reservados.</p>
          <p className="mt-2">
            Feito com ❤️ para fotógrafos profissionais brasileiros
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 transition-shadow hover:shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
