import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/components/ui/input-group";
import { ComponentProps, forwardRef, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";

export const InputPassword = forwardRef<HTMLInputElement, ComponentProps<typeof InputGroupInput>>(
  ({ ...props }, ref) => {
    const [type, setType] = useState("password");

    const toggleType = () => {
      setType((prevType) => (prevType === "password" ? "text" : "password"));
    };

    return (
      <InputGroup>
        <InputGroupInput ref={ref} type={type} {...props} />
        <InputGroupAddon>
          <Lock />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Button size="icon-sm" variant="ghost" onClick={toggleType}>
            {type === "password" ? <Eye /> : <EyeOff />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    );
  },
);

InputPassword.displayName = "InputPassword";
