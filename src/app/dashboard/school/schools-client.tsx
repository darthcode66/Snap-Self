'use client';

import Link from 'next/link';
import { School, Plus, Search, MoreVertical, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

type SchoolWithCount = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  createdAt: Date;
  _count: {
    classes: number;
  };
};

interface SchoolsClientProps {
  schools: SchoolWithCount[];
}

export function SchoolsClient({ schools }: SchoolsClientProps) {
  const totalSchools = schools.length;
  const totalClasses = schools.reduce((acc, s) => acc + s._count.classes, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Escolas</h1>
          <p className="mt-2 text-gray-600">
            Gerencie as escolas cadastradas no sistema
          </p>
        </div>
        <Link href="/dashboard/school/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Escola
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Escolas
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchools}</div>
            <p className="text-xs text-muted-foreground">Cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Em todas as escolas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ultima adicionada
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSchools > 0
                ? new Date(schools[0].createdAt).toLocaleDateString('pt-BR')
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Data de cadastro</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escolas Cadastradas</CardTitle>
          <CardDescription>
            {totalSchools === 0
              ? 'Nenhuma escola cadastrada ainda'
              : totalSchools === 1
              ? '1 escola no sistema'
              : `${totalSchools} escolas no sistema`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalSchools > 0 && (
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar escola..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline">Filtros</Button>
            </div>
          )}

          {totalSchools === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <School className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold">
                Nenhuma escola cadastrada
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Comece cadastrando sua primeira escola
              </p>
              <Link href="/dashboard/school/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeira Escola
                </Button>
              </Link>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escola</TableHead>
                    <TableHead>Localizacao</TableHead>
                    <TableHead>Turmas</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">
                        {school.name}
                      </TableCell>
                      <TableCell>
                        {school.city && school.state
                          ? `${school.city}, ${school.state}`
                          : '-'}
                      </TableCell>
                      <TableCell>{school._count.classes}</TableCell>
                      <TableCell>
                        {new Date(school.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
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
