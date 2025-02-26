/**
 * FormSucess.tsx
 * Form sucess message component.
 * @author: caogy
 */
import { CheckCircle2 } from "lucide-react";

export  const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-teal-400 text-secondary-foreground p-3 rounded-md">
      <CheckCircle2 className="h-4 w-4 mr-2 inline-block" />
      {message}
    </div>
  );
};
