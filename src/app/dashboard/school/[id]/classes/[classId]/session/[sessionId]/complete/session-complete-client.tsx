'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { School, Class, PhotoSession } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionCompleteClientProps {
  school: School;
  session: PhotoSession & {
    class: Class & {
      school: School;
    };
    photos: any[];
  };
  classData: Class & {
    school: School;
  };
}

export function SessionCompleteClient({
  school,
  session,
  classData,
}: SessionCompleteClientProps) {
  const completionPercentage = Math.round(
    ((session.photographed + session.absent) / session.totalStudents) * 100
  );

  const durationInMinutes = session.completedAt
    ? Math.round(
        (session.completedAt.getTime() - session.createdAt.getTime()) / 60000
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Sessão Concluída!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {classData.name} - {school.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fotografados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {session.photographed}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              de {session.totalStudents} alunos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ausentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {session.absent}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round((session.absent / session.totalStudents) * 100)}%
              {session.absent > 0 ? ' da turma' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {completionPercentage}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              da sessão processada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Sessão</CardTitle>
          <CardDescription>
            Detalhes da sessão fotográfica realizada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Turma</p>
              <p className="font-medium">{classData.name}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Escola</p>
              <p className="font-medium">{school.name}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Prefixo de Arquivo</p>
              <p className="font-medium font-mono">{session.photoPrefix}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Duração</p>
              <p className="font-medium">
                {durationInMinutes} minuto{durationInMinutes !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Total de Alunos</p>
              <p className="font-medium">{session.totalStudents}</p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Data/Hora</p>
              <p className="font-medium">
                {new Date(session.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Progresso Geral</p>
            <div className="flex gap-2 h-4 rounded-full overflow-hidden bg-gray-200">
              <div
                className="bg-green-500 transition-all"
                style={{
                  width: `${(session.photographed / session.totalStudents) * 100}%`,
                }}
              />
              <div
                className="bg-red-500 transition-all"
                style={{
                  width: `${(session.absent / session.totalStudents) * 100}%`,
                }}
              />
              <div
                className="bg-yellow-500 transition-all"
                style={{
                  width: `${(session.pending / session.totalStudents) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>✓ {session.photographed} fotografados</span>
              <span>⊘ {session.absent} ausentes</span>
              <span>⏳ {session.pending} pendentes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          variant="outline"
          asChild
        >
          <Link href={`/dashboard/school/${school.id}/classes/${classData.id}`}>
            Voltar para Turma
          </Link>
        </Button>
        <Button asChild>
          <Link
            href={`/dashboard/school/${school.id}/classes/${classData.id}/session/new`}
            className="gap-2"
          >
            Nova Sessão
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
