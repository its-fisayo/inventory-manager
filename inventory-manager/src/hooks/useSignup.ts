import { useMutation } from "@tanstack/react-query";
import { signup } from "../services/endpoints/auth.service";

export const useSignup = () => {
    return useMutation({
        mutationFn: ({ fullName, email, staffId, password }: { fullName: string; email: string; staffId: string; password: string;}) =>
            signup(fullName, email, staffId, password)
    });
};