import { Camera } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sessões Fotográficas</h1>
        <p className="mt-2 text-gray-600">
          Gerencie as sessões fotográficas realizadas
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
            <Camera className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle>Em desenvolvimento</CardTitle>
          <CardDescription>
            Esta funcionalidade será implementada em breve
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-gray-500">
          <p>
            Aqui você poderá iniciar e gerenciar sessões fotográficas assistidas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
