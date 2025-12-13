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
import { Badge } from '@/components/ui/badge';

// Mock data - depois vamos buscar do banco
const mockSchools = [
  {
    id: '1',
    name: 'Colégio Santa Maria',
    city: 'São Paulo',
    state: 'SP',
    studentsCount: 450,
    classesCount: 15,
    status: 'active',
    lastSession: '2025-12-10',
  },
  {
    id: '2',
    name: 'Escola Municipal Dom Pedro II',
    city: 'Rio de Janeiro',
    state: 'RJ',
    studentsCount: 320,
    classesCount: 12,
    status: 'active',
    lastSession: '2025-12-08',
  },
  {
    id: '3',
    name: 'Colégio Objetivo',
    city: 'Campinas',
    state: 'SP',
    studentsCount: 680,
    classesCount: 22,
    status: 'inactive',
    lastSession: '2025-11-15',
  },
];

export default function SchoolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Escolas
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSchools.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockSchools.filter((s) => s.status === 'active').length} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSchools.reduce((acc, s) => acc + s.studentsCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Em todas as escolas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Turmas</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSchools.reduce((acc, s) => acc + s.classesCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Em todas as escolas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Escolas Cadastradas</CardTitle>
          <CardDescription>
            Lista de todas as escolas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
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

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Escola</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Alunos</TableHead>
                  <TableHead>Turmas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Sessão</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSchools.map((school) => (
                  <TableRow key={school.id}>
                    <TableCell className="font-medium">
                      {school.name}
                    </TableCell>
                    <TableCell>
                      {school.city}, {school.state}
                    </TableCell>
                    <TableCell>{school.studentsCount}</TableCell>
                    <TableCell>{school.classesCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          school.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {school.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(school.lastSession).toLocaleDateString('pt-BR')}
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
        </CardContent>
      </Card>
    </div>
  );
}
