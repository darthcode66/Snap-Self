'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { toastMessages } from '@/lib/toast-messages';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { School, Class } from '@prisma/client';

interface StudentData {
  name: string;
  grade?: string;
  section?: string;
}

interface ImportStudentsClientProps {
  school: School;
  classData: Class;
}

export function ImportStudentsClient({
  school,
  classData,
}: ImportStudentsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<StudentData[]>([]);
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'importing'>(
    'upload'
  );
  const [nameColumn, setNameColumn] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [fileContent, setFileContent] = useState<string>('');
  const [detectedEncoding, setDetectedEncoding] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);

    try {
      const fileName = uploadedFile.name.toLowerCase();
      const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

      if (isExcel) {
        // Process Excel file directly
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as string[][];

        if (data.length > 0) {
          const cleanedColumns = (data[0] as string[]).map((col) =>
            String(col).trim().substring(0, 50)
          );
          setColumns(cleanedColumns);

          // Convert to CSV format for processing
          const csvContent = data.map(row => row.join(',')).join('\n');
          setFileContent(csvContent);
          setDetectedEncoding('UTF-8 (Excel)');

          toast({
            title: 'Arquivo Excel processado',
            description: `Detectadas ${cleanedColumns.length} colunas automaticamente`,
          });
        }
      } else {
        // Process CSV/TXT file with auto-detection
        const formData = new FormData();
        formData.append('file', uploadedFile);

        const response = await fetch('/api/students/detect-encoding', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Falha ao detectar encoding');
        }

        const result = await response.json();
        setFileContent(result.content);
        setDetectedEncoding(result.encoding.toUpperCase());

        // Parse CSV content
        Papa.parse(result.content, {
          header: false,
          skipEmptyLines: true,
          complete: (parseResults) => {
            const rawData = parseResults.data as string[][];
            if (rawData.length > 0) {
              const cleanedColumns = (rawData[0] as string[]).map((col) =>
                String(col).trim().substring(0, 50)
              );
              setColumns(cleanedColumns);

              toast({
                title: 'Encoding detectado automaticamente',
                description: `Arquivo lido com encoding ${result.encoding.toUpperCase()}`,
              });
            }
          },
        });
      }

      setStep('map');
    } catch (error) {
      console.error('Error processing file:', error);
      toastMessages.genericError(
        'Erro ao processar arquivo',
        error instanceof Error ? error.message : 'Não foi possível processar o arquivo',
        toast
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMappingComplete = () => {
    if (!nameColumn) {
      toast({
        title: 'Erro',
        description: 'Selecione a coluna com o nome dos alunos',
        variant: 'destructive',
      });
      return;
    }

    Papa.parse(fileContent, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as string[][];
        if (rawData.length > 1) {
          const nameColIndex = columns.indexOf(nameColumn);
          const mappedData: StudentData[] = rawData.slice(1).map((row) => ({
            name: String(row[nameColIndex] || '').trim(),
            grade: classData.grade,
            section: classData.section,
          }));

          const validData = mappedData.filter((s) => s.name.length > 0);
          setData(validData);
          setStep('preview');
        }
      },
    });
  };

  const handleImport = async () => {
    setIsImporting(true);
    setStep('importing');

    try {
      const response = await fetch('/api/students/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId: classData.id,
          students: data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Falha ao importar alunos');
      }

      const result = await response.json();

      toastMessages.success(
        'Importação realizada com sucesso!',
        `${result.count} alunos foram adicionados à turma.`,
        toast
      );

      router.push(`/dashboard/school/${school.id}/classes/${classData.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error importing students:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Erro desconhecido';
      toastMessages.genericError('Erro na importação', errorMsg, toast);
      setIsImporting(false);
      setStep('preview');
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
          <h1 className="text-3xl font-bold text-gray-900">
            Importar Alunos
          </h1>
          <p className="mt-2 text-gray-600">
            {classData.name} - {school.name}
          </p>
        </div>
      </div>

      {/* Steps Indicator */}
      <div className="flex gap-4">
        <div
          className={`flex-1 rounded-lg p-4 text-center ${
            ['upload', 'map', 'preview', 'importing'].indexOf(step) >= 0
              ? 'bg-blue-100'
              : 'bg-gray-100'
          }`}
        >
          <p className="text-sm font-medium">1. Upload</p>
        </div>
        <div
          className={`flex-1 rounded-lg p-4 text-center ${
            ['map', 'preview', 'importing'].indexOf(step) >= 0
              ? 'bg-blue-100'
              : 'bg-gray-100'
          }`}
        >
          <p className="text-sm font-medium">2. Mapear Colunas</p>
        </div>
        <div
          className={`flex-1 rounded-lg p-4 text-center ${
            ['preview', 'importing'].indexOf(step) >= 0
              ? 'bg-blue-100'
              : 'bg-gray-100'
          }`}
        >
          <p className="text-sm font-medium">3. Preview</p>
        </div>
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Arquivo</CardTitle>
            <CardDescription>
              Arraste um arquivo Excel ou CSV com os nomes dos alunos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-lg border-2 border-dashed p-12 text-center transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <FileUp className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg font-medium text-gray-900">
                Arraste seu arquivo aqui
              </p>
              <p className="mt-2 text-sm text-gray-600">
                ou clique para selecionar
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button className="mt-6" asChild disabled={isProcessing}>
                  <span>
                    {isProcessing ? 'Processando...' : 'Selecionar Arquivo'}
                  </span>
                </Button>
              </label>
            </div>

            {isProcessing && (
              <div className="mt-6 flex items-center justify-center gap-3 text-blue-600">
                <div className="animate-spin">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium">
                  Detectando encoding automaticamente...
                </p>
              </div>
            )}

            <p className="mt-6 text-xs text-gray-500">
              Formatos suportados: CSV, Excel (.xlsx, .xls), TXT
              <br />
              <span className="text-green-600">
                ✓ Encoding detectado automaticamente
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Mapping Step */}
      {step === 'map' && (
        <Card>
          <CardHeader>
            <CardTitle>Mapear Colunas</CardTitle>
            <CardDescription>
              Selecione qual coluna contém o nome dos alunos
              {detectedEncoding && (
                <span className="ml-2 text-green-600">
                  • Encoding: {detectedEncoding}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none">
                Coluna com Nome do Aluno *
              </label>
              <select
                value={nameColumn}
                onChange={(e) => setNameColumn(e.target.value)}
                className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Selecionar coluna</option>
                {columns.map((col, idx) => (
                  <option key={idx} value={col}>
                    {col || `(coluna vazia)`}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Colunas detectadas:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {columns.map((col, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-gray-200 px-3 py-1 text-sm"
                  >
                    {col || `(vazio)`}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('upload')}
              >
                Voltar
              </Button>
              <Button onClick={handleMappingComplete} disabled={!nameColumn}>
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Step */}
      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Preview dos Alunos</CardTitle>
            <CardDescription>
              Revise os {data.length} alunos que serão importados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-96 overflow-y-auto rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium">
                      Nome
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-medium">
                      Série/Turma
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((student, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">{student.name}</td>
                      <td className="px-4 py-2 text-sm">
                        {student.grade} {student.section}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('map')}
              >
                Voltar
              </Button>
              <Button onClick={handleImport} disabled={data.length === 0}>
                Importar {data.length} Alunos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Importing Step */}
      {step === 'importing' && (
        <Card>
          <CardHeader>
            <CardTitle>Importando Alunos</CardTitle>
            <CardDescription>
              Por favor, aguarde enquanto os alunos são importados...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin">
                <Upload className="h-12 w-12 text-blue-500" />
              </div>
              <p className="mt-4 text-lg font-medium text-gray-900">
                Processando {data.length} alunos...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
