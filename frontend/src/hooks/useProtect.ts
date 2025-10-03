import { protectService } from "@/services/protectService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProtect = () => {
  const protect = () => {
    return useQuery({
      queryFn: () => protectService.protectRoute(),
      queryKey: ["get-protect-route"],
      throwOnError: (error: Error) => {
        toast.error(error.message);
        return false;
      },
    });
  };

  return { protect };
};
