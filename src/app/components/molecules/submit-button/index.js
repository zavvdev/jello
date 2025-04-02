"use client";

import { useFormStatus } from "react-dom";
import { Button } from "~/app/components/atoms/button";

export function SubmitButton({ children, pending }) {
  var status = useFormStatus();

  return (
    <Button type="submit" disabled={pending || status.pending}>
      {children}
    </Button>
  );
}
