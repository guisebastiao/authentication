import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/components/ui/input-group";
import { ComponentProps, forwardRef } from "react";
import { Mail } from "lucide-react";

export const InputEmail = forwardRef<HTMLInputElement, ComponentProps<typeof InputGroupInput>>(
  ({ ...props }, ref) => {
    return (
      <InputGroup>
        <InputGroupInput ref={ref} type="text" {...props} />
        <InputGroupAddon>
          <Mail />
        </InputGroupAddon>
      </InputGroup>
    );
  },
);

InputEmail.displayName = "InputEmail";
