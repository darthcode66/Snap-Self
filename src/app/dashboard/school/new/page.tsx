'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { toastMessages } from '@/lib/toast-messages';

export default function NewSchoolPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    phone: '',
    email: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create school');
      }

      toastMessages.created('Escola', formData.name, toast);

      // Redirecionar para a listagem
      router.push('/dashboard/school');
      router.refresh();
    } catch (error) {
      console.error('Error creating school:', error);
      toastMessages.error('criar', 'escola', toast);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/school">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Escola</h1>
          <p className="mt-2 text-gray-600">
            Cadastre uma nova escola no sistema
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Dados principais da instituição de ensino
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none"
                >
                  Nome da Escola *
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Colégio Santa Maria"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="cnpj"
                  className="text-sm font-medium leading-none"
                >
                  CNPJ
                </label>
                <Input
                  id="cnpj"
                  name="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium leading-none"
                >
                  Telefone *
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none"
                >
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contato@escola.com.br"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Localização da escola</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="street"
                  className="text-sm font-medium leading-none"
                >
                  Rua/Avenida *
                </label>
                <Input
                  id="street"
                  name="street"
                  placeholder="Nome da rua"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="number"
                  className="text-sm font-medium leading-none"
                >
                  Número *
                </label>
                <Input
                  id="number"
                  name="number"
                  placeholder="123"
                  value={formData.number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="complement"
                  className="text-sm font-medium leading-none"
                >
                  Complemento
                </label>
                <Input
                  id="complement"
                  name="complement"
                  placeholder="Bloco, sala, etc."
                  value={formData.complement}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="neighborhood"
                  className="text-sm font-medium leading-none"
                >
                  Bairro *
                </label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  placeholder="Nome do bairro"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="text-sm font-medium leading-none"
                >
                  Cidade *
                </label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Nome da cidade"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="text-sm font-medium leading-none"
                >
                  Estado *
                </label>
                <Input
                  id="state"
                  name="state"
                  placeholder="SP"
                  maxLength={2}
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="zipCode"
                  className="text-sm font-medium leading-none"
                >
                  CEP *
                </label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard/school">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Escola
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
