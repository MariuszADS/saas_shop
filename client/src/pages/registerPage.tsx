import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "@/services/auth.services";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");
      setMessage("");

      await registerUser({
        email,
        password,
      });

      setMessage("Account created successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 700);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating account..."
            : "Register"}
        </button>

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}
      </form>
    </main>
  );
}