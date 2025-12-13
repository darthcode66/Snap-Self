/**
 * Mensagens de toast padronizadas para operações CRUD
 * Use essas funções para manter consistência nas notificações do sistema
 */

type ToastFunction = (props: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export const toastMessages = {
  // CREATE
  created: (entityName: string, itemName: string, toast: ToastFunction) => {
    toast({
      title: `${entityName} criado com sucesso!`,
      description: `${itemName} foi adicionado ao sistema.`,
    });
  },

  // UPDATE
  updated: (entityName: string, itemName: string, toast: ToastFunction) => {
    toast({
      title: `${entityName} atualizado com sucesso!`,
      description: `As alterações em ${itemName} foram salvas.`,
    });
  },

  // DELETE
  deleted: (entityName: string, itemName: string, toast: ToastFunction) => {
    toast({
      title: `${entityName} excluído com sucesso!`,
      description: `${itemName} foi removido do sistema.`,
    });
  },

  // ERRORS
  error: (
    operation: string,
    entityName: string,
    toast: ToastFunction,
    details?: string
  ) => {
    toast({
      title: `Erro ao ${operation} ${entityName}`,
      description:
        details || `Não foi possível ${operation} o ${entityName}. Tente novamente.`,
      variant: 'destructive',
    });
  },

  // LOADING (para uso com spinners)
  loading: (operation: string, entityName: string) => {
    return `${operation.charAt(0).toUpperCase() + operation.slice(1)} ${entityName}...`;
  },

  // GENERIC SUCCESS
  success: (title: string, description: string, toast: ToastFunction) => {
    toast({
      title,
      description,
    });
  },

  // GENERIC ERROR
  genericError: (title: string, description: string, toast: ToastFunction) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  },
};
