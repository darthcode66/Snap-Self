import { currentUser } from '@clerk/nextjs/server';
import { School, GraduationCap, Users, Camera } from 'lucide-react';

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo, {user?.firstName || 'Fotógrafo'}! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Gerencie suas escolas, turmas e sessões fotográficas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Escolas"
          value="0"
          icon={<School className="h-6 w-6 text-primary-600" />}
          description="Escolas cadastradas"
        />
        <StatsCard
          title="Turmas"
          value="0"
          icon={<GraduationCap className="h-6 w-6 text-green-600" />}
          description="Turmas ativas"
        />
        <StatsCard
          title="Alunos"
          value="0"
          icon={<Users className="h-6 w-6 text-blue-600" />}
          description="Alunos cadastrados"
        />
        <StatsCard
          title="Sessões"
          value="0"
          icon={<Camera className="h-6 w-6 text-purple-600" />}
          description="Sessões realizadas"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Ações Rápidas
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <QuickActionButton
            title="Nova Escola"
            description="Cadastrar escola"
            href="/dashboard/school/new"
            icon={<School className="h-5 w-5" />}
          />
          <QuickActionButton
            title="Importar Alunos"
            description="Importar do Excel"
            href="/dashboard/school/import"
            icon={<Users className="h-5 w-5" />}
          />
          <QuickActionButton
            title="Iniciar Sessão"
            description="Sessão fotográfica"
            href="/dashboard/school/sessions/new"
            icon={<Camera className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Getting Started */}
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-6">
        <h3 className="mb-2 font-semibold text-primary-900">
          🎓 Primeiros Passos
        </h3>
        <p className="mb-4 text-sm text-primary-800">
          Configure seu sistema para começar a fotografar:
        </p>
        <ol className="space-y-2 text-sm text-primary-900">
          <li className="flex items-start gap-2">
            <span className="font-semibold">1.</span>
            <span>Cadastre uma escola</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">2.</span>
            <span>Importe a lista de alunos via Excel</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold">3.</span>
            <span>Inicie uma sessão fotográfica assistida</span>
          </li>
        </ol>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="rounded-full bg-gray-100 p-3">{icon}</div>
      </div>
      <p className="mt-4 text-xs text-gray-500">{description}</p>
    </div>
  );
}

function QuickActionButton({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-start gap-4 rounded-lg border bg-gray-50 p-4 transition-all hover:border-primary-300 hover:bg-primary-50"
    >
      <div className="rounded-lg bg-white p-2 shadow-sm">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
}
