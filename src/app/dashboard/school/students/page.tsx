import { Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Alunos</h1>
        <p className="mt-2 text-gray-600">
          Visualize e gerencie os alunos cadastrados
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Em desenvolvimento</CardTitle>
          <CardDescription>
            Esta funcionalidade será implementada em breve
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-gray-500">
          <p>
            Aqui você poderá visualizar todos os alunos importados das escolas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
