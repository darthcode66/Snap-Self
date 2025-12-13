'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Users, BookOpen } from 'lucide-react';
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
import { School } from '@prisma/client';

type ClassWithCount = {
  id: string;
  name: string;
  grade: string;
  section: string;
  year: number;
  _count: {
    students: number;
    sessions: number;
  };
};

interface ClassesClientProps {
  school: School;
  classes: ClassWithCount[];
}

export function ClassesClient({ school, classes }: ClassesClientProps) {
  const totalClasses = classes.length;
  const totalStudents = classes.reduce(
    (acc, c) => acc + c._count.students,
    0
  );
  const totalSessions = classes.reduce(
    (acc, c) => acc + c._count.sessions,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/school">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
          <p className="mt-2 text-gray-600">
            Gerencie as turmas cadastradas nesta escola
          </p>
        </div>
        <Link href={`/dashboard/school/${school.id}/classes/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Turma
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Turmas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Em todas as turmas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">Realizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Turmas Cadastradas</CardTitle>
          <CardDescription>
            {totalClasses === 0
              ? 'Nenhuma turma cadastrada ainda'
              : totalClasses === 1
              ? '1 turma no sistema'
              : `${totalClasses} turmas no sistema`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalClasses === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold">
                Nenhuma turma cadastrada
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Comece cadastrando sua primeira turma nesta escola
              </p>
              <Link href={`/dashboard/school/${school.id}/classes/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeira Turma
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Turma</TableHead>
                    <TableHead>Série/Ano</TableHead>
                    <TableHead>Alunos</TableHead>
                    <TableHead>Sessões</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((classItem) => (
                    <TableRow
                      key={classItem.id}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/school/${school.id}/classes/${classItem.id}`}
                          className="hover:underline"
                        >
                          {classItem.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {classItem.grade} - {classItem.section}
                      </TableCell>
                      <TableCell>{classItem._count.students}</TableCell>
                      <TableCell>{classItem._count.sessions}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link
                            href={`/dashboard/school/${school.id}/classes/${classItem.id}`}
                          >
                            Ver
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
