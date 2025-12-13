import { GraduationCap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
        <p className="mt-2 text-gray-600">
          Gerencie as turmas das escolas cadastradas
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <GraduationCap className="h-8 w-8 text-primary-600" />
          </div>
          <CardTitle>Em desenvolvimento</CardTitle>
          <CardDescription>
            Esta funcionalidade será implementada em breve
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-gray-500">
          <p>
            Aqui você poderá visualizar e gerenciar todas as turmas das escolas
            cadastradas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
