import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useContextAuth } from "@/context/AuthContext";

export const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthenticated } = useContextAuth();

  useEffect(() => {
    const successParam = searchParams.get("success");
    if (!successParam) return;

    const success = successParam === "true";

    if (success) {
      setAuthenticated(true);
      navigate("/");
    } else {
      setAuthenticated(false);
      navigate("/login");
    }
  }, [searchParams, navigate, setAuthenticated]);

  return null;
};
