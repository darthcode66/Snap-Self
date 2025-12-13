'use client';

import Link from 'next/link';
import { Camera, Play, Pause, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PhotoSession, Class, School } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionsListClientProps {
  sessions: (PhotoSession & {
    class: Class & {
      school: School;
    };
  })[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
          <CheckCircle className="mr-1 h-3 w-3" />
          Concluída
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
          <Play className="mr-1 h-3 w-3" />
          Em Progresso
        </span>
      );
    case 'PAUSED':
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
          <Pause className="mr-1 h-3 w-3" />
          Pausada
        </span>
      );
    case 'SCHEDULED':
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
          <Clock className="mr-1 h-3 w-3" />
          Agendada
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
          {status}
        </span>
      );
  }
};

export function SessionsListClient({
  sessions,
}: SessionsListClientProps) {
  const completedSessions = sessions.filter((s) => s.status === 'COMPLETED');
  const activeSessions = sessions.filter((s) =>
    ['IN_PROGRESS', 'PAUSED'].includes(s.status)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Sessões Fotográficas
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie as sessões fotográficas realizadas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedSessions.length} concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Play className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando conclusão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fotografado</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((acc, s) => acc + s.photographed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              alunos em todas as sessões
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Sessões</CardTitle>
          <CardDescription>
            {sessions.length === 0
              ? 'Nenhuma sessão registrada'
              : `${sessions.length} sessão${sessions.length !== 1 ? 's' : ''} no total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Camera className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold">
                Nenhuma sessão criada
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Inicie uma sessão fotográfica para começar
              </p>
              <Button asChild>
                <Link href="/dashboard/school">
                  Ir para Turmas
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Escola</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Fotografados</TableHead>
                    <TableHead className="text-right">Ausentes</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">
                        {session.class.name}
                      </TableCell>
                      <TableCell>{session.class.school.name}</TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium text-green-600">
                          {session.photographed}
                        </span>
                        <span className="text-xs text-gray-500">
                          /{session.totalStudents}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium text-red-600">
                          {session.absent}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link
                            href={
                              session.status === 'COMPLETED'
                                ? `/dashboard/school/${session.class.school.id}/classes/${session.class.id}/session/${session.id}/complete`
                                : `/dashboard/school/${session.class.school.id}/classes/${session.class.id}/session/${session.id}`
                            }
                          >
                            {session.status === 'COMPLETED' ? 'Ver' : 'Continuar'}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
