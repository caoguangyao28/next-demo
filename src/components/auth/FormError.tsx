/**
 * FormError.tsx
 * Form error component.
 * @author: caogy
 */
import {AlertCircle} from "lucide-react";

export  const FormError = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <div className="bg-destructive text-secondary-foreground p-3 rounded-md">
      <AlertCircle className="h-4 w-4 mr-2 inline-block" />
      {error}
    </div>
  );
};
