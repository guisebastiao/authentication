import { useContextAuth } from "@/context/AuthContext";
import { useProtect } from "@/hooks/useProtect";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export const Home = () => {
  const { setAuthenticated } = useContextAuth();
  const { protect } = useProtect();
  const { logout } = useAuth();

  const { data, isLoading } = protect();
  const { mutate, isPending } = logout();

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => {
        setAuthenticated(false);
      },
    });
  };

  return (
    <section className="mx-auto self-center space-y-1 flex justify-center items-center flex-col">
      <h1 className="text-2xl text-center leading-relaxed font-medium">{data?.message}</h1>
      {isLoading ? <Spinner spinnerSize="md" /> : <p className="text-sm text-muted-foreground text-center">{data?.data}</p>}
      <Button variant="destructive" className="w-full mt-2" onClick={handleLogout} disabled={isPending}>
        {isPending ? <Spinner spinnerSize="sm" /> : <LogOut />}
        <span>{isPending ? "Saindo" : "Sair"}</span>
      </Button>
    </section>
  );
};
