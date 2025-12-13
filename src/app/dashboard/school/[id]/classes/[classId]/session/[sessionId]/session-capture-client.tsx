'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Check,
  X,
  Pause,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
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
import { School, Class, Student, PhotoSession } from '@prisma/client';

interface SessionCaptureClientProps {
  school: School;
  session: PhotoSession & {
    class: Class & {
      students: Student[];
    };
    photos: any[];
  };
  classData: Class & {
    students: Student[];
  };
}

export function SessionCaptureClient({
  school,
  session,
  classData,
}: SessionCaptureClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Get students in session order
  const [students] = useState(() => {
    const ordered = [...classData.students];
    if (session.sortOrder === 'REGISTRATION_NUMBER') {
      return ordered.sort((a, b) =>
        (a.registrationNumber || '').localeCompare(b.registrationNumber || '')
      );
    }
    return ordered.sort((a, b) => a.sortName.localeCompare(b.sortName));
  });

  // Track photographed and absent students
  const [photographedIds, setPhotographedIds] = useState<Set<string>>(new Set());
  const [absentIds, setAbsentIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(
    session.currentStudentIndex ?? 0
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isPausing, setIsPausing] = useState(false);

  const currentStudent = students[currentIndex];
  const pendingStudents = students.filter(
    (s) => !photographedIds.has(s.id) && !absentIds.has(s.id)
  );

  const progress = {
    total: students.length,
    photographed: photographedIds.size,
    absent: absentIds.size,
    pending: pendingStudents.length,
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || !e.target.files[0] || !currentStudent) {
      return;
    }

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', currentStudent.id);

      const response = await fetch(
        `/api/sessions/${session.id}/photos`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha ao enviar foto');
      }

      // Mark as photographed
      setPhotographedIds((prev) => new Set(prev).add(currentStudent.id));

      toast({
        title: 'Foto capturada',
        description: `Foto de ${currentStudent.name} salva com sucesso`,
      });

      // Move to next pending student
      const nextPendingIndex = students.findIndex(
        (s, idx) =>
          idx > currentIndex &&
          !photographedIds.has(s.id) &&
          !absentIds.has(s.id)
      );

      if (nextPendingIndex !== -1) {
        setCurrentIndex(nextPendingIndex);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Erro ao enviar foto';
      toastMessages.genericError(
        'Erro ao enviar foto',
        errorMsg,
        toast
      );
    } finally {
      setIsUploading(false);
      // Reset file input
      if (e.target) e.target.value = '';
    }
  };

  const handleMarkPhotographed = async () => {
    if (!currentStudent) return;

    try {
      setPhotographedIds((prev) => new Set(prev).add(currentStudent.id));

      // Move to next pending student
      const nextPendingIndex = students.findIndex(
        (s, idx) =>
          idx > currentIndex &&
          !photographedIds.has(s.id) &&
          !absentIds.has(s.id)
      );

      if (nextPendingIndex !== -1) {
        setCurrentIndex(nextPendingIndex);
      }

      toast({
        title: 'Aluno marcado',
        description: `${currentStudent.name} marcado como fotografado`,
      });
    } catch (error) {
      console.error('Error marking student:', error);
    }
  };

  const handleMarkAbsent = async () => {
    if (!currentStudent) return;

    try {
      setAbsentIds((prev) => new Set(prev).add(currentStudent.id));

      // Move to next pending student
      const nextPendingIndex = students.findIndex(
        (s, idx) =>
          idx > currentIndex &&
          !photographedIds.has(s.id) &&
          !absentIds.has(s.id)
      );

      if (nextPendingIndex !== -1) {
        setCurrentIndex(nextPendingIndex);
      }

      toast({
        title: 'Aluno marcado como ausente',
        description: `${currentStudent.name} foi marcado como ausente`,
      });
    } catch (error) {
      console.error('Error marking absent:', error);
    }
  };

  const handleCompleteSession = async () => {
    setIsPausing(true);

    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'COMPLETED',
          photographed: photographedIds.size,
          absent: absentIds.size,
          pending: pendingStudents.length,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha ao completar sessão');
      }

      toastMessages.success(
        'Sessão concluída',
        `${photographedIds.size} alunos fotografados`,
        toast
      );

      router.push(
        `/dashboard/school/${school.id}/classes/${classData.id}/session/${session.id}/complete`
      );
    } catch (error) {
      console.error('Error completing session:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Erro desconhecido';
      toastMessages.genericError('Erro ao completar sessão', errorMsg, toast);
      setIsPausing(false);
    }
  };

  const handlePauseSession = async () => {
    setIsPausing(true);

    try {
      await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'PAUSED',
          currentStudentIndex: currentIndex,
          photographed: photographedIds.size,
          absent: absentIds.size,
          pending: pendingStudents.length,
        }),
      });

      toast({
        title: 'Sessão pausada',
        description: 'Você pode retomar a sessão depois',
      });

      router.push(`/dashboard/school/${school.id}/classes/${classData.id}`);
    } catch (error) {
      console.error('Error pausing session:', error);
      toastMessages.genericError(
        'Erro ao pausar sessão',
        'Não foi possível pausar a sessão',
        toast
      );
      setIsPausing(false);
    }
  };

  const handleNavigateStudent = (index: number) => {
    if (index >= 0 && index < students.length) {
      setCurrentIndex(index);
    }
  };

  if (!currentStudent) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Todos os alunos foram processados!</CardTitle>
            <CardDescription>
              Clique em "Completar Sessão" para finalizar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" onClick={handlePauseSession}>
              Voltar
            </Button>
            <Button onClick={handleCompleteSession}>Completar Sessão</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePauseSession}
            disabled={isPausing}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sessão Fotográfica</h1>
            <p className="mt-2 text-gray-600">
              {classData.name} - {school.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">Progresso</p>
          <p className="text-2xl font-bold text-blue-600">
            {progress.photographed}/{progress.total}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg bg-gray-200 h-3 overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all"
              style={{
                width: `${(progress.photographed / progress.total) * 100}%`,
              }}
            />
          </div>
          <div className="flex-1 rounded-lg bg-gray-200 h-3 overflow-hidden">
            <div
              className="bg-red-500 h-full transition-all"
              style={{
                width: `${(progress.absent / progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>✓ {progress.photographed} fotografados</span>
          <span>⊘ {progress.absent} ausentes</span>
          <span>⏳ {progress.pending} pendentes</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Capture Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Current Student Card */}
          <Card className="border-2 border-blue-500">
            <CardHeader className="bg-blue-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Aluno {currentIndex + 1} de {students.length}
                  </p>
                  <CardTitle className="text-3xl">
                    {currentStudent.name}
                  </CardTitle>
                </div>
                <div className="rounded-lg bg-blue-200 px-3 py-1 text-sm font-medium">
                  {session.photoPrefix}_
                  {String(session.startNumber + currentIndex).padStart(3, '0')}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Photo Preview Area */}
              <div className="aspect-square rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-4 text-gray-600">
                    Aguardando foto
                  </p>
                </div>
              </div>

              {/* Photo Upload Input */}
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="photo-input"
                />
                <label htmlFor="photo-input">
                  <Button
                    asChild
                    className="w-full"
                    disabled={isUploading}
                  >
                    <span>
                      {isUploading ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Tirar Foto
                        </>
                      )}
                    </span>
                  </Button>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleMarkPhotographed}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Fotografado
                </Button>
                <Button
                  onClick={handleMarkAbsent}
                  variant="outline"
                  className="border-red-300 text-red-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Ausente
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleNavigateStudent(currentIndex - 1)}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleNavigateStudent(currentIndex + 1)}
                  disabled={currentIndex === students.length - 1}
                  className="flex-1"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Pending Students */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Próximos ({pendingStudents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {pendingStudents.length > 0 ? (
                  pendingStudents.slice(0, 5).map((student, idx) => (
                    <div
                      key={student.id}
                      className="rounded-lg bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition"
                      onClick={() =>
                        handleNavigateStudent(students.indexOf(student))
                      }
                    >
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-gray-500">
                        {student.registrationNumber || '-'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Todos os alunos foram processados
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Controles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleCompleteSession}
                disabled={isPausing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Completar Sessão
              </Button>
              <Button
                onClick={handlePauseSession}
                variant="outline"
                disabled={isPausing}
                className="w-full"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pausar
              </Button>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fotografados:</span>
                <span className="font-medium text-green-600">
                  {progress.photographed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ausentes:</span>
                <span className="font-medium text-red-600">
                  {progress.absent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pendentes:</span>
                <span className="font-medium text-yellow-600">
                  {progress.pending}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
