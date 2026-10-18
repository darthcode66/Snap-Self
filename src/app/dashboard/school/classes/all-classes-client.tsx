'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Users, Camera, Search } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Class, School } from '@prisma/client';

interface ClassWithDetails extends Class {
  school: School;
  _count: {
    students: number;
    sessions: number;
  };
}

interface AllClassesClientProps {
  classes: ClassWithDetails[];
}

export function AllClassesClient({ classes }: AllClassesClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter classes by search term
  const filteredClasses = classes.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.school.name.toLowerCase().includes(search) ||
      c.grade?.toLowerCase().includes(search) ||
      c.section?.toLowerCase().includes(search)
    );
  });

  // Group classes by school
  const classesBySchool = filteredClasses.reduce((acc, classItem) => {
    const schoolName = classItem.school.name;
    if (!acc[schoolName]) {
      acc[schoolName] = [];
    }
    acc[schoolName].push(classItem);
    return acc;
  }, {} as Record<string, ClassWithDetails[]>);

  const totalStudents = classes.reduce((sum, c) => sum + c._count.students, 0);
  const totalSessions = classes.reduce((sum, c) => sum + c._count.sessions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Todas as Turmas</h1>
        <p className="mt-2 text-gray-600">
          Visualize e gerencie todas as turmas cadastradas
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              Em {Object.keys(classesBySchool).length} escola(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Média de {Math.round(totalStudents / (classes.length || 1))} por turma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessões Fotográficas</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {classes.filter((c) => c._count.sessions > 0).length} turmas com sessões
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por turma, escola, série..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Classes List */}
      {classes.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <GraduationCap className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle>Nenhuma turma cadastrada</CardTitle>
            <CardDescription>
              Comece adicionando turmas às suas escolas
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/dashboard/school">Ir para Escolas</Link>
            </Button>
          </CardContent>
        </Card>
      ) : filteredClasses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              Nenhuma turma encontrada com "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(classesBySchool).map(([schoolName, schoolClasses]) => (
          <Card key={schoolName}>
            <CardHeader>
              <CardTitle>{schoolName}</CardTitle>
              <CardDescription>
                {schoolClasses.length} turma(s) •{' '}
                {schoolClasses.reduce((sum, c) => sum + c._count.students, 0)} aluno(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Turma</TableHead>
                      <TableHead>Série</TableHead>
                      <TableHead className="text-center">Alunos</TableHead>
                      <TableHead className="text-center">Sessões</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schoolClasses.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">
                          {classItem.name}
                        </TableCell>
                        <TableCell>
                          {classItem.grade} {classItem.section}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {classItem._count.students}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1">
                            <Camera className="h-3 w-3" />
                            {classItem._count.sessions}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/school/${classItem.schoolId}/classes/${classItem.id}`}
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
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
