'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Camera, School, GraduationCap, Search, Image } from 'lucide-react';
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
import { Student, Class, School as SchoolType } from '@prisma/client';

interface StudentWithDetails extends Student {
  class: Class & {
    school: SchoolType;
  };
  _count: {
    photos: number;
  };
}

interface AllStudentsClientProps {
  students: StudentWithDetails[];
}

export function AllStudentsClient({ students }: AllStudentsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Get unique schools and classes for filters
  const schools = Array.from(
    new Set(students.map((s) => s.class.school.name))
  ).sort();
  const classes = Array.from(
    new Set(students.map((s) => s.class.name))
  ).sort();

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSchool =
      filterSchool === 'all' || student.class.school.name === filterSchool;
    const matchesClass =
      filterClass === 'all' || student.class.name === filterClass;

    return matchesSearch && matchesSchool && matchesClass;
  });

  // Group students by school and class
  const groupedStudents = filteredStudents.reduce((acc, student) => {
    const schoolName = student.class.school.name;
    const className = student.class.name;
    const key = `${schoolName} - ${className}`;

    if (!acc[key]) {
      acc[key] = {
        school: schoolName,
        class: className,
        classId: student.classId,
        schoolId: student.class.schoolId,
        students: [],
      };
    }

    acc[key].students.push(student);
    return acc;
  }, {} as Record<string, { school: string; class: string; classId: string; schoolId: string; students: StudentWithDetails[] }>);

  const totalPhotos = students.reduce((sum, s) => sum + s._count.photos, 0);
  const studentsWithPhotos = students.filter((s) => s._count.photos > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Todos os Alunos</h1>
        <p className="mt-2 text-gray-600">
          Visualize e gerencie todos os alunos cadastrados
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Em {schools.length} escola(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              Média de {Math.round(students.length / (classes.length || 1))} alunos/turma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fotos Capturadas</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPhotos}</div>
            <p className="text-xs text-muted-foreground">
              {studentsWithPhotos} alunos fotografados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0
                ? Math.round((studentsWithPhotos / students.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              Alunos com fotos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Todas as Escolas</option>
          {schools.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>

        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Todas as Turmas</option>
          {classes.map((className) => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>
      </div>

      {/* Students List */}
      {students.length === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle>Nenhum aluno cadastrado</CardTitle>
            <CardDescription>
              Importe alunos para começar
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/dashboard/school">Ir para Escolas</Link>
            </Button>
          </CardContent>
        </Card>
      ) : filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              Nenhum aluno encontrado com os filtros selecionados
            </p>
          </CardContent>
        </Card>
      ) : (
        Object.values(groupedStudents).map((group) => (
          <Card key={`${group.schoolId}-${group.classId}`}>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-gray-500" />
                  {group.school}
                </div>
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  {group.class} • {group.students.length} aluno(s)
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Número de Matrícula</TableHead>
                      <TableHead className="text-center">Fotos</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {student.registrationNumber || '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              student._count.photos > 0
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }`}
                          >
                            <Camera className="h-3 w-3" />
                            {student._count.photos}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/school/${group.schoolId}/classes/${group.classId}`}
                            >
                              Ver Turma
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
