"use client";

import { useFormStatus } from "react-dom";
import { Button } from "~/app/components/atoms/button";

export function SubmitButton({ children }) {
  var { pending } = useFormStatus();
  return <Button disabled={pending}>{children}</Button>;
}
