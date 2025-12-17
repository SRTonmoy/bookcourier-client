import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tranId = params.get("tran_id");
    if (tranId) {
      // later verify payment from backend
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <h2 className="text-2xl font-bold text-success">
        ✅ Payment Successful
      </h2>
    </div>
  );
}
