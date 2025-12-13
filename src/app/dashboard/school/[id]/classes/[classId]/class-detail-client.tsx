'use client';

import Link from 'next/link';
import { ArrowLeft, Users, Video } from 'lucide-react';
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
import { School, Class, Student } from '@prisma/client';

interface ClassDetailClientProps {
  school: School;
  classData: Class & {
    students: Student[];
    _count: {
      students: number;
      sessions: number;
    };
  };
}

export function ClassDetailClient({
  school,
  classData,
}: ClassDetailClientProps) {
  const totalStudents = classData._count.students;
  const totalSessions = classData._count.sessions;
  const authorize = classData.students.filter((s) => s.hasAuthorization).length;
  const paid = classData.students.filter((s) => s.hasPaid).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/school/${school.id}/classes`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {classData.name}
          </h1>
          <p className="mt-2 text-gray-600">{school.name}</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/school/${school.id}/classes/${classData.id}/session`}>
            <Video className="mr-2 h-4 w-4" />
            Nova Sessão
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autorizações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authorize}</div>
            <p className="text-xs text-muted-foreground">
              {totalStudents > 0
                ? `${Math.round((authorize / totalStudents) * 100)}%`
                : '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paid}</div>
            <p className="text-xs text-muted-foreground">
              {totalStudents > 0
                ? `${Math.round((paid / totalStudents) * 100)}%`
                : '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">Realizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alunos</CardTitle>
          <CardDescription>
            {totalStudents === 0
              ? 'Nenhum aluno cadastrado'
              : totalStudents === 1
              ? '1 aluno na turma'
              : `${totalStudents} alunos na turma`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalStudents === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold">
                Nenhum aluno cadastrado
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Importe uma lista de alunos para começar
              </p>
              <Button asChild>
                <Link href={`/dashboard/school/${school.id}/classes/${classData.id}/import`}>
                  Importar Alunos
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Autorização</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classData.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>
                        {student.registrationNumber || '-'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            student.hasAuthorization
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {student.hasAuthorization ? 'Sim' : 'Não'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            student.hasPaid
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {student.hasPaid ? 'Pago' : 'Pendente'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Editar
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
