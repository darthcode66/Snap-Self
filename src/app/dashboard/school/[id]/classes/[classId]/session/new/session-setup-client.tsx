'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { toastMessages } from '@/lib/toast-messages';
import { School, Class, Student } from '@prisma/client';

interface SessionSetupClientProps {
  school: School;
  classData: Class & {
    students: Student[];
  };
}

export function SessionSetupClient({
  school,
  classData,
}: SessionSetupClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [photoPrefix, setPhotoPrefix] = useState(
    `${school.name.toUpperCase().substring(0, 3)}_${classData.grade}_${classData.section}_${new Date().getFullYear()}`
  );
  const [startNumber, setStartNumber] = useState(1);
  const [sortOrder, setSortOrder] = useState<'ALPHABETICAL' | 'REGISTRATION_NUMBER'>('ALPHABETICAL');

  // Sort students based on selected order
  const sortedStudents = [...classData.students].sort((a, b) => {
    if (sortOrder === 'REGISTRATION_NUMBER') {
      return (a.registrationNumber || '').localeCompare(b.registrationNumber || '');
    }
    return a.sortName.localeCompare(b.sortName);
  });

  const handleCreateSession = async () => {
    if (!photoPrefix.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite um prefixo para o arquivo de foto',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: classData.id,
          photoPrefix: photoPrefix.trim(),
          startNumber: parseInt(String(startNumber)),
          sortOrder,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha ao criar sessão');
      }

      const session = await response.json();

      toastMessages.created(
        'Sessão criada',
        `Sessão iniciada para ${classData.name}`,
        toast
      );

      // Redirect to session capture page
      router.push(
        `/dashboard/school/${school.id}/classes/${classData.id}/session/${session.id}`
      );
    } catch (error) {
      console.error('Error creating session:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Erro desconhecido';
      toastMessages.genericError('Erro ao criar sessão', errorMsg, toast);
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/school/${school.id}/classes/${classData.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Sessão</h1>
          <p className="mt-2 text-gray-600">
            {classData.name} - {school.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Sessão</CardTitle>
            <CardDescription>
              Defina como deseja fotografar os alunos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none">
                Prefixo do Arquivo *
              </label>
              <input
                type="text"
                value={photoPrefix}
                onChange={(e) => setPhotoPrefix(e.target.value)}
                placeholder="Ex: SAO_JOAO_1A_2025"
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Usado no nome dos arquivos: {photoPrefix}_001.jpg
              </p>
            </div>

            <div>
              <label className="text-sm font-medium leading-none">
                Número Inicial
              </label>
              <input
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <p className="mt-1 text-xs text-gray-500">
                Primeira foto será numerada como: {String(startNumber).padStart(3, '0')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium leading-none">
                Ordem dos Alunos
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'ALPHABETICAL' | 'REGISTRATION_NUMBER')}
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="ALPHABETICAL">Alfabética</option>
                <option value="REGISTRATION_NUMBER">Matrícula</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Ordem que os alunos aparecerão na sessão
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">
                Total de alunos: {sortedStudents.length}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/school/${school.id}/classes/${classData.id}`)
                }
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateSession}
                disabled={isCreating || !photoPrefix.trim()}
                className="flex-1"
              >
                {isCreating ? (
                  <>Criando...</>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Iniciar Sessão
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Preview dos Alunos</CardTitle>
            <CardDescription>
              Assim aparecerão na sessão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="sticky top-0 bg-gray-50">
                    <TableHead className="w-12">Foto #</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Matrícula</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono font-medium text-blue-600">
                        {String(startNumber + index).padStart(3, '0')}
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {student.registrationNumber || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
